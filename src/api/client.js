import ky from "ky";

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TEMP_AUTH_TOKEN}`,
  },
});

export { api };
