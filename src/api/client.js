import ky from "ky";
import { supabase } from "./supabase";
import { TOKEN_PREFIX, ERROR_CODE } from "../constants/index.js";

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  hooks: {
    beforeRequest: [
      async (request) => {
        if (request.url.includes("/auth/guest")) {
          return;
        }

        const authHeader = await getAuthHeader();
        if (authHeader) {
          request.headers.set("Authorization", authHeader);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 429) {
          await chrome.storage.local.set({ remainingCount: 0 });
        }

        if (!response.ok && !options._retried) {
          const errorData = await response
            .clone()
            .json()
            .catch(() => ({}));
          const errorCode = errorData.errorCode;

          const retryResult = await handleErrorCode(errorCode, request, options);
          if (retryResult) return retryResult;
        }

        return response;
      },
    ],
  },
});

const retryWithToken = (request, options, authHeader) => {
  return ky(request, {
    ...options,
    _retried: true,
    headers: {
      ...options.headers,
      Authorization: authHeader,
    },
  });
};

const handleErrorCode = async (errorCode, request, options) => {
  switch (errorCode) {
    case ERROR_CODE.GUEST_TOKEN_EXPIRED:
    case ERROR_CODE.INVALID_GUEST_TOKEN:
    case ERROR_CODE.TOKEN_REQUIRED: {
      await chrome.storage.local.remove("guestToken");
      const newToken = await fetchGuestToken();
      return retryWithToken(request, options, `Bearer ${TOKEN_PREFIX.GUEST}${newToken}`);
    }

    case ERROR_CODE.USER_TOKEN_EXPIRED: {
      const refreshedToken = await refreshUserToken();

      if (!refreshedToken) {
        await handleSessionExpired();
        return null;
      }

      return retryWithToken(request, options, `Bearer ${TOKEN_PREFIX.USER}${refreshedToken}`);
    }

    case ERROR_CODE.INVALID_USER_TOKEN:
    case ERROR_CODE.UNKNOWN_TOKEN_TYPE: {
      await chrome.storage.local.remove(["userToken", "guestToken"]);
      await handleSessionExpired();
      const newToken = await fetchGuestToken();
      return retryWithToken(request, options, `Bearer ${TOKEN_PREFIX.GUEST}${newToken}`);
    }

    case ERROR_CODE.RATE_LIMIT_EXCEEDED:
      return null;

    default:
      return null;
  }
};

const refreshUserToken = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error || !data.session) {
      return null;
    }

    const newToken = data.session.access_token;
    await chrome.storage.local.set({ userToken: newToken });
    return newToken;
  } catch {
    return null;
  }
};

const handleSessionExpired = async () => {
  await chrome.storage.local.remove("userToken");
};

const fetchGuestToken = async () => {
  const response = await api.post("auth/guest").json();
  const rawToken = response.data.token.replace("guest_", "");
  const rateLimit = response.data.rateLimit;

  await chrome.storage.local.set({
    guestToken: rawToken,
    remainingCount: rateLimit.remaining,
  });

  return rawToken;
};

const getAuthHeader = async () => {
  const { userToken, guestToken } = await chrome.storage.local.get(["userToken", "guestToken"]);

  if (userToken) {
    return `Bearer ${TOKEN_PREFIX.USER}${userToken}`;
  }

  if (guestToken) {
    return `Bearer ${TOKEN_PREFIX.GUEST}${guestToken}`;
  }

  const newToken = await fetchGuestToken();
  return `Bearer ${TOKEN_PREFIX.GUEST}${newToken}`;
};

const fetchRateLimit = async () => {
  try {
    const response = await api.get("auth/rate-limit").json();
    const { remaining } = response.data;

    await chrome.storage.local.set({ remainingCount: remaining });

    return { remaining };
  } catch {
    return null;
  }
};

export { api, fetchGuestToken, getAuthHeader, fetchRateLimit, refreshUserToken };
