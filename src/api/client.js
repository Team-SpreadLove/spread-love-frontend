import ky from "ky";

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  hooks: {
    beforeRequest: [
      async (request) => {
        try {
          const result = await chrome.storage.local.get("token");
          const token = result.token;
          if (token) {
            request.headers.set("Authorization", `Bearer ${token}`);
          }
        } catch (error) {
          console.error("토큰 로드 실패:", error);
        }
      },
    ],
  },
});

export { api };
