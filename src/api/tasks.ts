import api from "./apiClient";
import type { ApiResponse } from "../types/api";
import type { Task } from "../types/task";


export const getTasks = async (params?: {
  search?: string;
  list?: string;
}): Promise<ApiResponse<Task[]>> => {
  const res = await api.get("/tasks", { params });
  return res.data;
};


export const createTask = async (data: {
  todo_list_id: number;
  title: string;
  priority?: string;
  due_date?: string | null;
}): Promise<ApiResponse<Task>> => {
  const res = await api.post("/tasks", data);
  return res.data;
};


export const updateTask = async (
  id: number,
  data: Partial<{
    title: string;
    priority: string;
    due_date: string | null;
    is_completed: boolean;
  }>
): Promise<ApiResponse<Task>> => {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data;
};


export const deleteTask = async (
  id: number
): Promise<ApiResponse<null>> => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};


export const getCompletedTasks = async (): Promise<
  ApiResponse<Task[]>
> => {
  const res = await api.get("/tasks-completed");
  return res.data;
};


export const getUpcomingTasks = async (): Promise<
  ApiResponse<Task[]>
> => {
  const res = await api.get("/tasks-upcoming");
  return res.data;
};