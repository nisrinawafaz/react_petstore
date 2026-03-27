import type { GeneralResponse } from "../core/models/general.model";
import type { User } from "../core/models/user.model";
import { api } from "../lib/axios";

const DUMMY_USERS: User[] = [
  {
    id: 1,
    username: "nisrinawafaz",
    firstName: "nisrina",
    lastName: "wafa",
    email: "nisrina@gmail.com",
    password: "admin123",
    phone: "0897652678992",
    userStatus: 1,
  },
  {
    id: 2,
    username: "user1",
    firstName: "Test",
    lastName: "User",
    email: "user1@email.com",
    password: "password123",
    phone: "1234567890",
    userStatus: 1,
  },
];

export const userService = {
  async getUsers(): Promise<User[]> {
    return DUMMY_USERS;
  },

  async getUserByUsername(username: string): Promise<User> {
    const res = await api.get<User>(`/user/${username}`);
    return res.data;
  },

  async createUser(user: User): Promise<GeneralResponse> {
    const res = await api.post<GeneralResponse>("/user", user);
    return res.data;
  },

  async updateUser(username: string, user: User): Promise<GeneralResponse> {
    const res = await api.put<GeneralResponse>(`/user/${username}`, user);
    return res.data;
  },

  async deleteUser(username: string): Promise<GeneralResponse> {
    const res = await api.delete<GeneralResponse>(`/user/${username}`);
    return res.data;
  },
};
