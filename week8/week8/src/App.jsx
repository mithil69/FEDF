import { useState, useEffect, useCallback } from "react";
import tasksData from "./task.json";
import "./App.css";

function App() {
  // State management for tasks, new task input, and filter
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'

  // Initialize tasks from localStorage or default data
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    try {
      const parsedTasks = storedTasks ? JSON.parse(storedTasks) : tasksData;
      setTasks(parsedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setTasks(tasksData);
    }
  }, []);

  // Sync tasks with localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Task operations
  const addTask = useCallback((e) => {
    e.preventDefault();
    const trimmedTask = newTask.trim();
    if (!trimmedTask) return;

    const newTaskObj = {
      id: Date.now(),
      title: trimmedTask,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks(prevTasks => [...prevTasks, newTaskObj]);
    setNewTask("");
  }, [newTask]);

  const toggleTask = useCallback((id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const updateTaskTitle = useCallback((id, newTitle) => {
    if (!newTitle.trim()) return;
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, title: newTitle.trim() } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all tasks?')) {
      setTasks([]);
      localStorage.removeItem("tasks");
    }
  }, []);

  // Filter tasks
  const filteredTasks = useCallback(() => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  return (
    <div className="app">
      <h1>📝 Task Manager</h1>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="task-input"
        />
        <button type="submit" className="add-button">Add Task</button>
      </form>

      {/* Filter Buttons */}
      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="empty-message">No tasks available. Add one!</p>
      ) : (
        <>
          <ul className="task-list">
            {filteredTasks().map((task) => (
              <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="task-checkbox"
                />
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => updateTaskTitle(task.id, e.target.value)}
                  className="task-title"
                />
                <button
                  onClick={() => deleteTask(task.id)}
                  className="delete-btn"
                  aria-label="Delete task"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          {tasks.length > 0 && (
            <button onClick={clearAll} className="clear-btn">
              Clear All Tasks
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default App;