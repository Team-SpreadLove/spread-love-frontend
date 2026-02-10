import { create } from "zustand";

const useAuthStore = create((set) => ({
  isLoggedIn: false,

  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
}));

export default useAuthStore;
