import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import { getCompletedTasks, updateTask, deleteTask } from "../api/tasks";
import type { Task } from "../types/task";

export default function Completed() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const res = await getCompletedTasks();
    setTasks(res.data ?? []);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Layout>
      <h2>✅ Completed Tasks</h2>

      {tasks.length === 0 ? (
        <p>No completed tasks</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}

            // ✅ هنا الحل
            onDelete={async (id) => {
              await deleteTask(id);
              loadTasks(); // تحديث القائمة بعد الحذف
            }}

            onUpdate={async (id, data) => {
              await updateTask(id, data);
              loadTasks(); // لو ألغيت completed تختفي
            }}
          />
        ))
      )}
    </Layout>
  );
}