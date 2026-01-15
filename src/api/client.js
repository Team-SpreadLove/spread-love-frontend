import ky from "ky";

const getOrCreateGuestId = async () => {
  const result = await chrome.storage.local.get("guestId");

  if (result.guestId) {
    return result.guestId;
  }

  const guestId = crypto.randomUUID();
  await chrome.storage.local.set({ guestId });
  return guestId;
};

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
          } else {
            const guestId = await getOrCreateGuestId();
            request.headers.set("Guest-Id", guestId);
          }
        } catch (error) {
          console.error("헤더 설정 실패:", error);
        }
      },
    ],
  },
});

export { api };
