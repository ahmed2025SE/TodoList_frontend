import api from "./apiClient";
import type { ApiResponse } from "../types/api";
import type { List } from "../types/list";

// GET /lists
export const getLists = async (): Promise<ApiResponse<List[]>> => {
  const res = await api.get("/lists");
  return res.data;
};

// POST /lists
export const createList = async (name: string): Promise<ApiResponse<List>> => {
  const res = await api.post("/lists", { name });
  return res.data;
};

// PUT /lists/{id}
export const updateList = async (
  id: number,
  name: string
): Promise<ApiResponse<List>> => {
  const res = await api.put(`/lists/${id}`, { name });
  return res.data;
};

// DELETE /lists/{id}
export const deleteList = async (
  id: number
): Promise<ApiResponse<null>> => {
  const res = await api.delete(`/lists/${id}`);
  return res.data;
};

// GET /lists/{id}
export const getListById = async (
  id: number
): Promise<ApiResponse<List>> => {
  const res = await api.get(`/lists/${id}`);
  return res.data;
};