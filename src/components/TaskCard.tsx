import { useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiCalendar, FiList } from "react-icons/fi";
import type { Task } from "../types/task";

type Priority = "Low" | "Medium" | "High";

const priorityColors = {
  Low: "bg-blue-100 text-blue-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

type Props = {
  task: Task;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Task>) => void;
  showListName?: boolean;
};

export default function TaskCard({ task, onDelete, onUpdate, showListName = true }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<Priority>((task.priority as Priority) || "Medium");
  const [dueDate, setDueDate] = useState(task.due_date?.split('T')[0] || "");

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(task.id, {
        title: title.trim(),
        priority,
        due_date: dueDate || null,
      });
      setEditing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.is_completed;

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border ${
      task.is_completed 
        ? 'border-green-100 bg-green-50' 
        : isOverdue 
          ? 'border-red-100' 
          : 'border-gray-100'
    }`}>
      <div className="p-4">
        {editing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Task title"
              autoFocus
            />
            
            <div className="flex gap-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>

              <input
                type="date"
                value={dueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setTitle(task.title);
                  setPriority((task.priority as Priority) || "Medium");
                  setDueDate(task.due_date?.split('T')[0] || "");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onUpdate(task.id, { is_completed: !task.is_completed })}
                  className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.is_completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-purple-500 text-transparent'
                  }`}
                  aria-label={task.is_completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  <FiCheck size={12} />
                </button>
                
                <div>
                  <h3 className={`font-medium ${
                    task.is_completed 
                      ? 'text-gray-500 line-through' 
                      : 'text-gray-800'
                  }`}>
                    {task.title}
                  </h3>
                  
                  {(showListName && task.todo_list) && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <FiList className="mr-1.5" size={14} />
                      {task.todo_list.name}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                  aria-label="Edit task"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Delete task"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {priority && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityColors[priority]}`}>
                  {priority} Priority
                </span>
              )}
              
              {task.due_date && (
                <div className={`flex items-center text-sm ${
                  isOverdue ? 'text-red-600' : 'text-gray-500'
                }`}>
                  <FiCalendar className="mr-1.5" size={14} />
                  {formatDate(task.due_date)}
                  {isOverdue && <span className="ml-1.5 text-xs font-medium">• Overdue</span>}
                </div>
              )}
              
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}