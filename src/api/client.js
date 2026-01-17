import ky from "ky";

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  hooks: {
    beforeRequest: [
      async (request) => {
        if (request.url.includes("/auth/guest")) {
          return;
        }

        const token = await getAuthToken();
        request.headers.set("Authorization", `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        const rateLimitRemaining = response.headers.get("RateLimit-Remaining");
        if (rateLimitRemaining) {
          await chrome.storage.local.set({ remainingCount: rateLimitRemaining });
        }

        if (response.status === 429) {
          await chrome.storage.local.set({ rateLimitExceeded: true });
        }

        if (response.status === 401 && options._retried) {
          return response;
        }

        if (response.status === 401 && !options._retried) {
          const newToken = await fetchGuestToken();
          return ky(request, {
            ...options,
            _retried: true,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        }
      },
    ],
  },
});

const fetchGuestToken = async () => {
  const response = await api.post("auth/guest").json();
  const token = response.data.token;
  await chrome.storage.local.set({ guestToken: token });
  return token;
};

const getAuthToken = async () => {
  const { userToken, guestToken } = await chrome.storage.local.get(["userToken", "guestToken"]);

  if (userToken) return userToken;
  if (guestToken) return guestToken;

  return await fetchGuestToken();
};

export { api, fetchGuestToken, getAuthToken };
