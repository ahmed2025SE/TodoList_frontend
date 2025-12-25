export interface Task {
  id: number;
  title: string;
  priority: string;
  due_date: string | null;
  is_completed: boolean;
  todo_list_id: number;
}