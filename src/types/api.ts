export interface ApiResponse<T> {
  data: T;
  message: string | null;
  errors: any | null;
}