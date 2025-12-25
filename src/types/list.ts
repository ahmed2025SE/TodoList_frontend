import type { Task } from "./task";

export interface List {
  id: number;
  name: string;
  tasks: Task[];
}