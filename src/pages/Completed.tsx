import { useEffect, useState } from "react";
import { FiCheckCircle, FiList, FiSearch } from "react-icons/fi";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import SearchBar from "../components/SearchBar";
import { getCompletedTasks, updateTask, deleteTask } from "../api/tasks";
import type { Task } from "../types/task";

export default function Completed() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Load completed tasks
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const res = await getCompletedTasks();
      setTasks(res.data || []);
    } catch (error) {
      console.error("Error loading completed tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.todo_list?.name.toLowerCase().includes(query)
    );
    setFilteredTasks(filtered);
  }, [tasks, searchQuery]);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Handle task update
  const handleUpdateTask = async (id: number, data: Partial<Task>) => {
    try {
      await updateTask(id, data);
      await loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        await loadTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  // Calculate completion stats
  const completedStats = {
    total: tasks.length,
    completedThisWeek: tasks.filter((task) => {
      // const completedDate = new Date(task.updated_at || '');
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      // return completedDate >= oneWeekAgo;
    }).length,
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Completed Tasks</h1>
              <p className="text-gray-500">View and manage your completed tasks</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Completed</p>
                  <p className="text-2xl font-bold text-purple-600">{completedStats.total}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <FiCheckCircle size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed This Week</p>
                  <p className="text-2xl font-bold text-green-600">{completedStats.completedThisWeek}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                  <FiList size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search completed tasks..."
            />
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <FiCheckCircle className="text-purple-500" size={28} />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No completed tasks found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "No completed tasks match your search criteria."
                  : "You haven't completed any tasks yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Completed Tasks
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'})
                  </span>
                </h2>
              </div>

              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    showListName={true}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}