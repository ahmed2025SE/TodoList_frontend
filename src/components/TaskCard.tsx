import { useState } from "react";
import type { Task } from "../types/task";

type Props = {
  task: Task;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Task>) => void;
};

export default function TaskCard({ task, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority ?? "Medium");
  const [dueDate, setDueDate] = useState(task.due_date ?? "");

  const save = () => {
    onUpdate(task.id, {
      title,
      priority,
      due_date: dueDate || null,
    });
    setEditing(false);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      {editing ? (
        <>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <input
            type="date"
            value={dueDate ?? ""}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button onClick={save}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{task.title}</h4>
          <small>
            List: {task.todo_list?.name ?? "—"}
          </small>
          <br />
         
         

          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>

          <label style={{ marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={task.is_completed}
              onChange={() =>
                onUpdate(task.id, {
                  is_completed: !task.is_completed,
                })
              }
            />
            Completed
          </label>
        </>
      )}
    </div>
  );
}