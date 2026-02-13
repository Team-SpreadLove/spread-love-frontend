import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";

const { mockGetSession, mockSignInWithOAuth } = vi.hoisted(() => {
  return {
    mockGetSession: vi.fn(),
    mockSignInWithOAuth: vi.fn(),
  };
});

vi.mock("../shared/api/supabase", () => {
  return {
    supabase: {
      auth: {
        getSession: mockGetSession,
        signInWithOAuth: mockSignInWithOAuth,
      },
    },
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockSignInWithOAuth.mockResolvedValue({ error: null });
    window.location.hash = "";
    chrome.runtime.getURL.mockReturnValue("chrome-extension://test/src/login/index.html");
  });

  it("Google 로그인 버튼을 렌더링한다", () => {
    render(<LoginPage />);

    expect(screen.getByRole("button", { name: "Google 계정으로 로그인" })).toBeInTheDocument();
  });

  it("로그인 버튼 클릭 시 OAuth 로그인을 요청한다", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "Google 계정으로 로그인" }));

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: "chrome-extension://test/src/login/index.html" },
    });
    expect(chrome.runtime.getURL).toHaveBeenCalledWith("src/login/index.html");
  });

  it("OAuth 에러가 발생하면 에러 메시지를 표시한다", async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSignInWithOAuth.mockResolvedValue({ error: { message: "oauth failed" } });

    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "Google 계정으로 로그인" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "로그인에 실패했습니다. 다시 시도해주세요.",
    );
    consoleErrorSpy.mockRestore();
  });

  it("access_token 해시가 있고 세션이 있으면 토큰 저장 후 탭을 닫는다", async () => {
    window.location.hash = "#access_token=test";
    mockGetSession.mockResolvedValue({
      data: {
        session: { access_token: "user-token" },
      },
    });
    chrome.storage.local.set.mockImplementation((_, callback) => callback());
    chrome.tabs.getCurrent.mockImplementation((callback) => callback({ id: 99 }));

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalled();
    });
    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      { userToken: "user-token" },
      expect.any(Function),
    );
    expect(chrome.tabs.getCurrent).toHaveBeenCalledWith(expect.any(Function));
    expect(chrome.tabs.remove).toHaveBeenCalledWith(99);
  });
});
