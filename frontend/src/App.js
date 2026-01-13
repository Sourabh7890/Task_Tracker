import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API}/tasks`);
      setTasks(response.data);
    } catch (e) {
      console.error("Error fetching tasks:", e);
      setError("Failed to load tasks");
    }
  };

  // Add new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post(`${API}/tasks`, {
        title: taskInput
      });
      setTasks([response.data, ...tasks]);
      setTaskInput("");
    } catch (e) {
      console.error("Error adding task:", e);
      setError("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  // Mark task as completed
  const markAsCompleted = async (taskId) => {
    try {
      const response = await axios.put(`${API}/tasks/${taskId}`, {
        status: "completed"
      });
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data : task
      ));
    } catch (e) {
      console.error("Error updating task:", e);
      setError("Failed to update task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2" data-testid="app-title">
            Task Tracker
          </h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Task Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={addTask} className="flex gap-3" data-testid="task-form">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Enter a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="task-input"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !taskInput.trim()}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              data-testid="add-task-button"
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </form>
          {error && (
            <p className="text-red-500 text-sm mt-2" data-testid="error-message">{error}</p>
          )}
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4" data-testid="task-list-title">
            Tasks ({tasks.length})
          </h2>
          
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8" data-testid="empty-state">
              No tasks yet. Add your first task above!
            </p>
          ) : (
            <div className="space-y-3" data-testid="task-list">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  data-testid={`task-item-${task.id}`}
                >
                  <div className="flex-1">
                    <p
                      className={`text-gray-800 ${
                        task.status === "completed" ? "line-through text-gray-500" : ""
                      }`}
                      data-testid={`task-title-${task.id}`}
                    >
                      {task.title}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                      data-testid={`task-status-${task.id}`}
                    >
                      {task.status === "completed" ? "Completed" : "Pending"}
                    </span>
                    
                    {task.status === "pending" && (
                      <button
                        onClick={() => markAsCompleted(task.id)}
                        className="px-4 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        data-testid={`complete-task-button-${task.id}`}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
