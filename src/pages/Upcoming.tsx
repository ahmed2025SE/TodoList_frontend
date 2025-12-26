import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiPlus, FiSearch } from "react-icons/fi";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import SearchBar from "../components/SearchBar";
import { getTasks, updateTask, deleteTask } from "../api/tasks";
import type { Task } from "../types/task";

type TimeFrame = 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'future';

export default function Upcoming() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('this-week');

  // Load tasks
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const res = await getTasks();
      setTasks(res.data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tasks based on search and time frame
  useEffect(() => {
    let result = [...tasks].filter(task => {
      // Filter by completion status
      if (task.is_completed) return false;

      // Filter by time frame
      if (!task.due_date) return false;
      
      const dueDate = new Date(task.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + 7 - today.getDay());
      
      const nextWeekStart = new Date(endOfWeek);
      const nextWeekEnd = new Date(endOfWeek);
      nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);

      switch (timeFrame) {
        case 'today':
          return dueDate.toDateString() === today.toDateString();
        case 'tomorrow':
          return dueDate.toDateString() === tomorrow.toDateString();
        case 'this-week':
          return dueDate >= today && dueDate < endOfWeek;
        case 'next-week':
          return dueDate >= nextWeekStart && dueDate < nextWeekEnd;
        case 'future':
          return dueDate >= (timeFrame === 'future' ? today : nextWeekEnd);
        default:
          return true;
      }
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) ||
        (task.todo_list?.name || '').toLowerCase().includes(query)
      );
    }

    setFilteredTasks(result);
  }, [tasks, searchQuery, timeFrame]);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Handle task updates
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

  // Get time frame label
  const getTimeFrameLabel = (frame: TimeFrame) => {
    switch (frame) {
      case 'today': return 'Today';
      case 'tomorrow': return 'Tomorrow';
      case 'this-week': return 'This Week';
      case 'next-week': return 'Next Week';
      case 'future': return 'Future';
      default: return '';
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Upcoming Tasks</h1>
              <p className="text-gray-500">Manage your upcoming tasks and deadlines</p>
            </div>
          </div>

          {/* Time Frame Filters */}
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            {(['today', 'tomorrow', 'this-week', 'next-week', 'future'] as TimeFrame[]).map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeFrame(frame)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeFrame === frame
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {getTimeFrameLabel(frame)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search upcoming tasks..."
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
                <FiCalendar className="text-purple-500" size={28} />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No upcoming tasks</h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "No tasks match your search criteria."
                  : `You don't have any tasks due ${timeFrame === 'this-week' ? 'this week' : timeFrame}.`}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {getTimeFrameLabel(timeFrame)} Tasks
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