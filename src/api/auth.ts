import api from "./apiClient";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/auth";
import type { ApiResponse } from "../types/api";



export async function login(
  payload: LoginRequest
): Promise<ApiResponse<LoginResponse>> {
  const response = await api.post("/login", payload);
  return response.data;
}




export async function signup(
  payload: RegisterRequest
): Promise<ApiResponse<null>> {
  const response = await api.post("/signup", payload);
  return response.data;
}