import { vi, describe, it, expect, beforeEach } from "vitest";
import { TOKEN_PREFIX, ERROR_CODE } from "../constants/index.js";

vi.mock("ky", () => {
  const mockKyInstance = {
    get: vi.fn(),
    post: vi.fn(),
    extend: vi.fn(),
  };

  const ky = vi.fn();
  ky.create = vi.fn(() => mockKyInstance);

  return { default: ky };
});

vi.mock("./supabase", () => ({
  supabase: {
    auth: {
      refreshSession: vi.fn(),
    },
  },
}));

let mockApi;
let getAuthHeader;
let fetchGuestToken;
let fetchRateLimit;
let refreshUserToken;
let beforeRequestHook;
let afterResponseHook;

describe("client.js — API 클라이언트", () => {
  beforeEach(async () => {
    vi.resetModules();

    const client = await import("./client.js");
    getAuthHeader = client.getAuthHeader;
    fetchGuestToken = client.fetchGuestToken;
    fetchRateLimit = client.fetchRateLimit;
    refreshUserToken = client.refreshUserToken;

    const ky = (await import("ky")).default;
    const lastCallIndex = ky.create.mock.calls.length - 1;
    mockApi = ky.create.mock.results[lastCallIndex].value;

    const createConfig = ky.create.mock.calls[lastCallIndex][0];
    beforeRequestHook = createConfig.hooks.beforeRequest[0];
    afterResponseHook = createConfig.hooks.afterResponse[0];
  });

  describe("getAuthHeader", () => {
    it("userToken이 있으면 User 인증 헤더를 반환한다", async () => {
      chrome.storage.local.get.mockResolvedValue({
        userToken: "abc123",
        guestToken: null,
      });

      const header = await getAuthHeader();

      expect(header).toBe(`Bearer ${TOKEN_PREFIX.USER}abc123`);
    });

    it("guestToken만 있으면 Guest 인증 헤더를 반환한다", async () => {
      chrome.storage.local.get.mockResolvedValue({
        userToken: null,
        guestToken: "guest456",
      });

      const header = await getAuthHeader();

      expect(header).toBe(`Bearer ${TOKEN_PREFIX.GUEST}guest456`);
    });

    it("토큰이 없으면 게스트 토큰을 발급받아 반환한다", async () => {
      chrome.storage.local.get.mockResolvedValue({
        userToken: null,
        guestToken: null,
      });

      mockApi.post.mockReturnValue({
        json: vi.fn().mockResolvedValue({
          data: {
            token: "guest_newtoken789",
            rateLimit: { remaining: 5 },
          },
        }),
      });

      chrome.storage.local.set.mockResolvedValue();

      const header = await getAuthHeader();

      expect(header).toBe(`Bearer ${TOKEN_PREFIX.GUEST}newtoken789`);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        guestToken: "newtoken789",
        remainingCount: 5,
      });
    });
  });

  describe("request hooks", () => {
    it("beforeRequest: guest token 발급 요청에는 Authorization 헤더를 주입하지 않는다", async () => {
      const request = {
        url: "https://example.com/auth/guest",
        headers: { set: vi.fn() },
      };

      await beforeRequestHook(request);

      expect(request.headers.set).not.toHaveBeenCalled();
    });

    it("beforeRequest: 일반 요청에는 Authorization 헤더를 주입한다", async () => {
      chrome.storage.local.get.mockResolvedValue({ userToken: "user-token", guestToken: null });
      const request = {
        url: "https://example.com/history",
        headers: { set: vi.fn() },
      };

      await beforeRequestHook(request);

      expect(request.headers.set).toHaveBeenCalledWith(
        "Authorization",
        `Bearer ${TOKEN_PREFIX.USER}user-token`,
      );
    });

    it("afterResponse: 429 응답이면 남은 횟수를 0으로 저장한다", async () => {
      chrome.storage.local.set.mockResolvedValue();
      const response = { status: 429, ok: true };

      const result = await afterResponseHook("request", {}, response);

      expect(chrome.storage.local.set).toHaveBeenCalledWith({ remainingCount: 0 });
      expect(result).toBe(response);
    });

    it("afterResponse: 게스트 토큰 만료 에러면 guest 토큰 재발급 후 재시도한다", async () => {
      const ky = (await import("ky")).default;
      ky.mockResolvedValue("retried-response");
      chrome.storage.local.remove.mockResolvedValue();
      chrome.storage.local.set.mockResolvedValue();
      mockApi.post.mockReturnValue({
        json: vi.fn().mockResolvedValue({
          data: { token: "guest_new-token", rateLimit: { remaining: 7 } },
        }),
      });

      const response = {
        status: 401,
        ok: false,
        clone: () => ({
          json: () =>
            Promise.resolve({
              error: { code: ERROR_CODE.AUTH_GUEST_TOKEN_EXPIRED },
            }),
        }),
      };
      const result = await afterResponseHook("request", { headers: { "x-test": "1" } }, response);

      expect(chrome.storage.local.remove).toHaveBeenCalledWith("guestToken");
      expect(ky).toHaveBeenCalledWith("request", {
        _retried: true,
        headers: {
          "x-test": "1",
          Authorization: `Bearer ${TOKEN_PREFIX.GUEST}new-token`,
        },
      });
      expect(result).toBe("retried-response");
    });

    it("afterResponse: 사용자 토큰 만료 + refresh 성공 시 user 토큰으로 재시도한다", async () => {
      const ky = (await import("ky")).default;
      const { supabase } = await import("./supabase");
      ky.mockResolvedValue("retried-with-user");
      supabase.auth.refreshSession.mockResolvedValue({
        data: { session: { access_token: "refreshed-user-token" } },
        error: null,
      });
      chrome.storage.local.set.mockResolvedValue();

      const response = {
        status: 401,
        ok: false,
        clone: () => ({
          json: () =>
            Promise.resolve({
              error: { code: ERROR_CODE.AUTH_USER_TOKEN_EXPIRED },
            }),
        }),
      };

      const result = await afterResponseHook("request", {}, response);

      expect(chrome.storage.local.set).toHaveBeenCalledWith({ userToken: "refreshed-user-token" });
      expect(ky).toHaveBeenCalledWith("request", {
        _retried: true,
        headers: {
          Authorization: `Bearer ${TOKEN_PREFIX.USER}refreshed-user-token`,
        },
      });
      expect(result).toBe("retried-with-user");
    });

    it("afterResponse: 사용자 토큰 만료 + refresh 실패 시 세션 정리 후 원본 응답을 반환한다", async () => {
      const ky = (await import("ky")).default;
      const { supabase } = await import("./supabase");
      supabase.auth.refreshSession.mockResolvedValue({
        data: { session: null },
        error: { message: "expired" },
      });
      chrome.storage.local.remove.mockResolvedValue();

      const response = {
        status: 401,
        ok: false,
        clone: () => ({
          json: () =>
            Promise.resolve({
              error: { code: ERROR_CODE.AUTH_USER_TOKEN_EXPIRED },
            }),
        }),
      };

      const result = await afterResponseHook("request", {}, response);

      expect(chrome.storage.local.remove).toHaveBeenCalledWith("userToken");
      expect(ky).not.toHaveBeenCalled();
      expect(result).toBe(response);
    });

    it("afterResponse: 사용자 토큰 무효 에러면 토큰 정리 + guest 토큰으로 재시도한다", async () => {
      const ky = (await import("ky")).default;
      ky.mockResolvedValue("retried-with-guest");
      chrome.storage.local.remove.mockResolvedValue();
      chrome.storage.local.set.mockResolvedValue();
      mockApi.post.mockReturnValue({
        json: vi.fn().mockResolvedValue({
          data: { token: "guest_reissued-token", rateLimit: { remaining: 4 } },
        }),
      });

      const response = {
        status: 401,
        ok: false,
        clone: () => ({
          json: () =>
            Promise.resolve({
              error: { code: ERROR_CODE.AUTH_USER_TOKEN_INVALID },
            }),
        }),
      };

      const result = await afterResponseHook("request", {}, response);

      expect(chrome.storage.local.remove).toHaveBeenCalledWith(["userToken", "guestToken"]);
      expect(chrome.storage.local.remove).toHaveBeenCalledWith("userToken");
      expect(ky).toHaveBeenCalledWith("request", {
        _retried: true,
        headers: {
          Authorization: `Bearer ${TOKEN_PREFIX.GUEST}reissued-token`,
        },
      });
      expect(result).toBe("retried-with-guest");
    });

    it("afterResponse: RATE_LIMIT_EXCEEDED면 재시도하지 않고 원본 응답을 반환한다", async () => {
      const ky = (await import("ky")).default;
      const response = {
        status: 429,
        ok: false,
        clone: () => ({
          json: () =>
            Promise.resolve({
              error: { code: ERROR_CODE.RATE_LIMIT_EXCEEDED },
            }),
        }),
      };

      const result = await afterResponseHook("request", {}, response);

      expect(ky).not.toHaveBeenCalled();
      expect(result).toBe(response);
    });
  });

  describe("fetchGuestToken", () => {
    it("게스트 토큰을 발급받고 storage에 저장한다", async () => {
      mockApi.post.mockReturnValue({
        json: vi.fn().mockResolvedValue({
          data: {
            token: "guest_tokenABC",
            rateLimit: { remaining: 10 },
          },
        }),
      });

      chrome.storage.local.set.mockResolvedValue();

      const token = await fetchGuestToken();

      expect(token).toBe("tokenABC");
      expect(mockApi.post).toHaveBeenCalledWith("auth/guest");
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        guestToken: "tokenABC",
        remainingCount: 10,
      });
    });
  });

  describe("refreshUserToken", () => {
    it("세션 갱신에 성공하면 새 토큰을 반환하고 storage에 저장한다", async () => {
      const { supabase } = await import("./supabase");

      supabase.auth.refreshSession.mockResolvedValue({
        data: { session: { access_token: "refreshed_token" } },
        error: null,
      });

      chrome.storage.local.set.mockResolvedValue();

      const token = await refreshUserToken();

      expect(token).toBe("refreshed_token");
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        userToken: "refreshed_token",
      });
    });

    it("세션 갱신에 실패하면 null을 반환한다", async () => {
      const { supabase } = await import("./supabase");

      supabase.auth.refreshSession.mockResolvedValue({
        data: { session: null },
        error: { message: "Invalid refresh token" },
      });

      const token = await refreshUserToken();

      expect(token).toBeNull();
    });

    it("예외가 발생하면 null을 반환한다", async () => {
      const { supabase } = await import("./supabase");

      supabase.auth.refreshSession.mockRejectedValue(new Error("Network error"));

      const token = await refreshUserToken();

      expect(token).toBeNull();
    });
  });

  describe("fetchRateLimit", () => {
    it("사용량 정보를 가져와 storage에 저장한다", async () => {
      mockApi.get.mockReturnValue({
        json: vi.fn().mockResolvedValue({
          data: { remaining: 3 },
        }),
      });

      chrome.storage.local.set.mockResolvedValue();

      const result = await fetchRateLimit();

      expect(result).toEqual({ remaining: 3 });
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        remainingCount: 3,
      });
    });

    it("요청 실패 시 null을 반환한다", async () => {
      mockApi.get.mockReturnValue({
        json: vi.fn().mockRejectedValue(new Error("Network error")),
      });

      const result = await fetchRateLimit();

      expect(result).toBeNull();
    });
  });
});
