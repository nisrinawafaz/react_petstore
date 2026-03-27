import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  setLoggedIn: (username: string) => void;
  setLoggedOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!localStorage.getItem("session_token"),
  username: localStorage.getItem("username"),

  setLoggedIn: (username) => set({ isLoggedIn: true, username }),
  setLoggedOut: () => set({ isLoggedIn: false, username: null }),
}));
