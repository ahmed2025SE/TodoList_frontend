import { useEffect, useState } from "react";
import { FiPlus, FiCalendar, FiList, FiCheckCircle, FiClock } from "react-icons/fi";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import SearchBar from "../components/SearchBar";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { getLists } from "../api/lists";
import type { Task } from "../types/task";
import type { List } from "../types/list";

type FilterType = 'all' | 'today' | 'upcoming' | 'completed';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "Medium" as const,
    due_date: "",
  });
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [isLoadingLists, setIsLoadingLists] = useState(true);

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

  // Apply filters and search
  useEffect(() => {
    let result = [...tasks];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.todo_list?.name.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    const today = new Date().toISOString().split('T')[0];
    
    switch (activeFilter) {
      case 'today':
        result = result.filter(task => task.due_date === today);
        break;
      case 'upcoming':
        result = result.filter(task => 
          task.due_date && task.due_date > today && !task.is_completed
        );
        break;
      case 'completed':
        result = result.filter(task => task.is_completed);
        break;
      default:
        // 'all' filter - no additional filtering needed
        break;
    }
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, activeFilter]);
  
  // Load tasks and lists on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingLists(true);
      try {
        // Load lists first
        const listsResponse = await getLists();
        setLists(listsResponse.data || []);
        if (listsResponse.data?.length > 0) {
          setSelectedListId(listsResponse.data[0].id);
        }
        
        // Then load tasks
        await loadTasks();
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoadingLists(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Handle task creation
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !selectedListId) {
      alert("Please fill in all required fields");
      return;
    }
    
    try {
      const taskData = {
        title: newTask.title.trim(),
        priority: newTask.priority,
        due_date: newTask.due_date || null,
        todo_list_id: selectedListId
      };
      
      await createTask(taskData);
      
      // Reset form and refresh tasks
      setNewTask({ title: "", priority: "Medium", due_date: "" });
      setShowTaskForm(false);
      await loadTasks();
      
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };
  
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
  
  // Task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.is_completed).length,
    today: tasks.filter(t => t.due_date === new Date().toISOString().split('T')[0]).length,
    upcoming: tasks.filter(t => 
      t.due_date && 
      t.due_date > new Date().toISOString().split('T')[0] && 
      !t.is_completed
    ).length,
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome back! Here's what's happening with your tasks.</p>
          </div>
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="mt-4 md:mt-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            <FiPlus size={18} />
            <span>Add Task</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-800">{taskStats.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                <FiList size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <FiCheckCircle size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Due Today</p>
                <p className="text-2xl font-bold text-blue-600">{taskStats.today}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <FiCalendar size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-yellow-600">{taskStats.upcoming}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                <FiClock size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tasks or lists..."
                className="w-full"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${
                  activeFilter === 'all' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setActiveFilter('today')}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap flex items-center gap-1 ${
                  activeFilter === 'today' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiCalendar size={16} />
                Today
              </button>
              <button
                onClick={() => setActiveFilter('upcoming')}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap flex items-center gap-1 ${
                  activeFilter === 'upcoming' 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiClock size={16} />
                Upcoming
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap flex items-center gap-1 ${
                  activeFilter === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiCheckCircle size={16} />
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        {showTaskForm && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="What needs to be done?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">List <span className="text-red-500">*</span></label>
                  {isLoadingLists ? (
                    <div className="animate-pulse h-10 bg-gray-100 rounded-lg"></div>
                  ) : (
                    <select
                      value={selectedListId || ""}
                      onChange={(e) => setSelectedListId(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                      disabled={isLoadingLists}
                    >
                      <option value="">Select a list</option>
                      {lists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {lists.length === 0 && !isLoadingLists && (
                    <p className="mt-1 text-sm text-red-600">
                      No lists available. Please create a list first.
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <FiList className="text-purple-500" size={28} />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No tasks found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? "No tasks match your search criteria." 
                  : activeFilter === 'completed' 
                    ? "You haven't completed any tasks yet."
                    : activeFilter === 'today'
                      ? "No tasks due today."
                      : activeFilter === 'upcoming'
                        ? "No upcoming tasks."
                        : "Get started by adding your first task!"}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter('all');
                  setShowTaskForm(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FiPlus size={16} />
                Add Your First Task
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {activeFilter === 'all' && 'All Tasks'}
                  {activeFilter === 'today' && 'Due Today'}
                  {activeFilter === 'upcoming' && 'Upcoming'}
                  {activeFilter === 'completed' && 'Completed Tasks'}
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
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
