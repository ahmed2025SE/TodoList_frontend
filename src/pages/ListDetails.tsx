import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiCircle } from "react-icons/fi";
import { getListById } from "../api/lists";
import Layout from "../components/Layout";
import type { List } from "../types/list";

export default function ListDetails() {
  const { id } = useParams();
  const [list, setList] = useState<List | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getListById(Number(id)).then((res) => {
        setList(res.data);
      });
    }
  }, [id]);

  if (!list) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4 sm:px-6 lg:px-8">
        {/* Back button and title */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/mylists")}
            className="flex items-center text-purple-600 hover:text-purple-800 mb-4 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to My Lists
          </button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{list.name}</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {list.tasks.length} {list.tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
        </div>

        {/* Tasks list */}
        {list.tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
            <div className="text-gray-400 mb-2">
              <FiCheckCircle size={48} className="mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">No tasks in this list</h3>
            <p className="text-gray-500 mt-1">Add tasks to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {list.tasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="mr-3 text-gray-300">
                    {task.is_completed ? (
                      <FiCheckCircle className="text-green-500" size={20} />
                    ) : (
                      <FiCircle size={20} />
                    )}
                  </div>
                  <span className={`${task.is_completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}