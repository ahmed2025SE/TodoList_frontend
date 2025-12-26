import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import { getUpcomingTasks, updateTask, deleteTask } from "../api/tasks";
import type { Task } from "../types/task";

export default function Upcoming() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const res = await getUpcomingTasks();
    setTasks(res.data ?? []);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Layout>
      <h2>⏳ Upcoming Tasks</h2>

      {tasks.length === 0 ? (
        <p>No upcoming tasks</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={async (id) => {
              await deleteTask(id);
              loadTasks();
            }}
            onUpdate={async (id, data) => {
              await updateTask(id, data);
              loadTasks(); 
            }}
          />
        ))
      )}
    </Layout>
  );
}