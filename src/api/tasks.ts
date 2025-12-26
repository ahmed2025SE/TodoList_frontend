import api from "./apiClient";
import type { ApiResponse } from "../types/api";
import type { Task } from "../types/task";

/* =========================
   GET /api/tasks
   (All tasks + search + list filter)
========================= */
export const getTasks = async (params?: {
  search?: string;
  list?: string;
}): Promise<ApiResponse<Task[]>> => {
  const res = await api.get("/tasks", { params });
  return res.data;
};

/* =========================
   POST /api/tasks
   (Create task)
========================= */
export const createTask = async (data: {
  todo_list_id: number;
  title: string;
  priority?: string;
  due_date?: string | null;
}): Promise<ApiResponse<Task>> => {
  const res = await api.post("/tasks", data);
  return res.data;
};

/* =========================
   PUT /api/tasks/{id}
   (Update task)
========================= */
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

/* =========================
   DELETE /api/tasks/{id}
========================= */
export const deleteTask = async (
  id: number
): Promise<ApiResponse<null>> => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};

/* =========================
   GET /api/tasks-completed
========================= */
export const getCompletedTasks = async (): Promise<
  ApiResponse<Task[]>
> => {
  const res = await api.get("/tasks-completed");
  return res.data;
};

/* =========================
   GET /api/tasks-upcoming
========================= */
export const getUpcomingTasks = async (): Promise<
  ApiResponse<Task[]>
> => {
  const res = await api.get("/tasks-upcoming");
  return res.data;
};