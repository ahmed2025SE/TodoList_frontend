import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiFolder, FiChevronRight } from "react-icons/fi";
import type { List } from "../types/list";

type Props = {
  list: List;
  onDelete: (id: number) => void;
  onUpdate: (id: number, name: string) => void;
};

export default function ListCard({ list, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(list.name);
  const navigate = useNavigate();

  const handleSave = () => {
    if (name.trim()) {
      onUpdate(list.id, name.trim());
      setEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
      <div className="p-5">
        {editing ? (
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setName(list.name);
              }}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                <FiFolder size={20} />
              </div>
              <h3 className="font-medium text-gray-800">{list.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                aria-label="Edit list"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(list.id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Delete list"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">
           
          </span>
          <button
            onClick={() => navigate(`/lists/${list.id}`)}
            className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 group transition-colors"
          >
            View Tasks
            <FiChevronRight className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}