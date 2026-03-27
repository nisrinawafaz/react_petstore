import type { GeneralResponse } from "../core/models/general.model";
import type { LoginRequest } from "../core/models/user.model";
import { api } from "../lib/axios";

export const authService = {
  async login(credentials: LoginRequest): Promise<GeneralResponse> {
    const res = await api.get<GeneralResponse>("/user/login", {
      params: credentials,
    });
    const token = res.data.message.split(":")[1];
    localStorage.setItem("session_token", token);
    localStorage.setItem("username", credentials.username);
    return res.data;
  },

  async logout(): Promise<void> {
    await api.get("/user/logout");
    localStorage.removeItem("session_token");
    localStorage.removeItem("username");
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem("session_token");
  },

  getUsername(): string | null {
    return localStorage.getItem("username");
  },

  getToken(): string | null {
    return localStorage.getItem("session_token");
  },
};
