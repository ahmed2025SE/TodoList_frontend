import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import SearchBar from "../components/SearchBar";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/tasks";

import { getLists, createList } from "../api/lists";
import type { Task } from "../types/task";
import type { List } from "../types/list";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  
  const [search, setSearch] = useState("");

  
  const [title, setTitle] = useState("");
  const [listName, setListName] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [dueDate, setDueDate] = useState("");

const loadTasks = async () => {

  if (!search.trim()) {
    const res = await getTasks();
    setTasks(res.data);
    return;
  }


  const [byTitle, byList] = await Promise.all([
    getTasks({ search }),
    getTasks({ list: search }),
  ]);


  const map = new Map<number, any>();
  [...byTitle.data, ...byList.data].forEach((t) => map.set(t.id, t));

  setTasks(Array.from(map.values()));
};

  useEffect(() => {
    loadTasks();
  }, []);


  const handleAddTask = async () => {
    if (!title || !listName) return;

  
    const listsRes = await getLists();
    const lists: List[] = listsRes.data;

   
    let list = lists.find(
      (l) => l.name.toLowerCase() === listName.toLowerCase()
    );

  
    if (!list) {
      const createRes = await createList(listName);
      list = createRes.data;
    }


    await createTask({
      title,
      todo_list_id: list.id,
      priority,
      due_date: dueDate || null,
    });

  
    setTitle("");
    setListName("");
    setPriority("Medium");
    setDueDate("");
    loadTasks();
  };

  return (
    <Layout>
      <h2>Home</h2>

  
      <SearchBar
        value={search}
        onChange={setSearch}
        onSearch={loadTasks}
        placeholder="Search tasks..."
      />

      <hr />

     
      <h3>Add Task</h3>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="List name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "Low" | "Medium" | "High")
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button onClick={handleAddTask}>Add</button>
      </div>

      <hr />

     
      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
       tasks
        .filter((t) => !t.is_completed)
        .map((task) => (
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


