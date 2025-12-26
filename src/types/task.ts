export interface Task {
  id: number;
  title: string;
  todo_list_id: number;
  priority: string;
  due_date: string | null;
  is_completed: boolean;
   todo_list?: {
    id: number;
    name: string;
  };
}