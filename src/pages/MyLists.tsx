import { useEffect, useState } from "react";
import { FiPlus, FiFolderPlus, FiLoader } from "react-icons/fi";
import {
  getLists,
  createList,
  deleteList,
  updateList,
} from "../api/lists";
import ListCard from "../components/ListCard";
import Layout from "../components/Layout";
import type { List } from "../types/list";

export default function MyLists() {
  const [lists, setLists] = useState<List[]>([]);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLists = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getLists();
      setLists(res.data || []);
    } catch (err) {
      console.error("Error loading lists:", err);
      setError("Failed to load lists. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setIsCreating(true);
      setError(null);
      await createList(newName);
      setNewName("");
      await loadLists();
    } catch (err) {
      console.error("Error creating list:", err);
      setError("Failed to create list. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateList = async (id: number, name: string) => {
    try {
      setError(null);
      await updateList(id, name);
      await loadLists();
    } catch (err) {
      console.error("Error updating list:", err);
      setError("Failed to update list. Please try again.");
    }
  };

  const handleDeleteList = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this list? All tasks in this list will also be deleted.")) {
      try {
        setError(null);
        await deleteList(id);
        await loadLists();
      } catch (err) {
        console.error("Error deleting list:", err);
        setError("Failed to delete list. Please try again.");
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Lists</h1>
          <p className="text-gray-500">Organize your tasks into lists</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateList} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="flex-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter list name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                disabled={isCreating}
              />
            </div>
            <button
              type="submit"
              disabled={isCreating || !newName.trim()}
              className="flex-shrink-0 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiPlus size={18} />
              )}
              <span className="whitespace-nowrap">
                {isCreating ? 'Creating...' : 'Create List'}
              </span>
            </button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : lists.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <FiFolderPlus className="text-purple-500" size={28} />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">No lists yet</h3>
            <p className="text-gray-500">Create your first list to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                onUpdate={handleUpdateList}
                onDelete={handleDeleteList}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}