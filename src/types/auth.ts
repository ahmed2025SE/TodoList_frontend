import type { User } from "./user";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}


export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}