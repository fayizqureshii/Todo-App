import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import TaskItem from "../components/TaskItem.jsx";
import "../App.css";
export default function TasksPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const loadTasks = useCallback(async () => {
    setError("");
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      if (err.message.toLowerCase().includes("authentication")) {
        logout();
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);
  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      setFormError("Please enter a task");
      return;
    }
    setFormError("");
    setError("");
    try {
      const task = await createTask(trimmed);
      setTasks((prev) => [task, ...prev]);
      setInput("");
    } catch (err) {
      setError(err.message);
    }
  }
  async function handleToggle(id, completed) {
    setError("");
    try {
      const updated = await updateTask(id, { completed });
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }
  async function handleUpdate(id, updates) {
    setError("");
    try {
      const updated = await updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }
  async function handleDelete(id) {
    setError("");
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }
  const activeCount = tasks.filter((t) => !t.completed).length;
  return (
    <div className="app">
      <header className="header">
        <div className="header-row">
          <div>
            <h1>Smart To-Do</h1>
            <p className="subtitle">Signed in as {user?.email}</p>
          </div>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>
      <main className="main">
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="task-input"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setFormError("");
            }}
            aria-label="New task"
          />
          <button type="submit" className="btn-add">
            Add Task
          </button>
        </form>
        {formError && <p className="message error">{formError}</p>}
        {error && <p className="message error">{error}</p>}
        {loading ? (
          <p className="message">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="message empty">No tasks yet. Add one above!</p>
        ) : (
          <>
            <p className="stats">
              {activeCount} {activeCount === 1 ? "task" : "tasks"} remaining
            </p>
            <ul className="task-list">
              {tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={handleToggle}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
