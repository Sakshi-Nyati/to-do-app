import React, { useEffect, useState } from "react";
import "./App.css";

const STORAGE_KEY = "todo-manager-tasks";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskTitle, setTaskTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();

    const title = taskTitle.trim();
    if (!title) return;

    const newTask = {
      id: crypto.randomUUID(),
      title,
      completed: false
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setTaskTitle("");
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
    if (editingId === taskId) cancelEditing();
  }

  function startEditing(task) {
    setEditingId(task.id);
    setEditingTitle(task.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingTitle("");
  }

  function saveEdit(event) {
    event.preventDefault();

    const title = editingTitle.trim();
    if (!title) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === editingId ? { ...task, title } : task
      )
    );
    cancelEditing();
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="app-container">
      <header className="page-header">
        <p className="eyebrow">PERSONAL PRODUCTIVITY</p>
        <h1>To-Do Manager</h1>
        <p className="subtitle">Keep track of the things you need to do.</p>
      </header>

      <section className="task-card">
        <form className="add-task-form" onSubmit={addTask}>
          <input
            type="text"
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            placeholder="What do you need to do?"
            aria-label="New task"
          />
          <button type="submit">Add task</button>
        </form>

        <div className="task-summary">
          <span>{tasks.length} total tasks</span>
          <span>{completedCount} completed</span>
        </div>

        <nav className="filters" aria-label="Filter tasks">
          {["all", "pending", "completed"].map((filterName) => (
            <button
              key={filterName}
              type="button"
              className={filter === filterName ? "filter active" : "filter"}
              onClick={() => setFilter(filterName)}
            >
              {filterName.charAt(0).toUpperCase() + filterName.slice(1)}
            </button>
          ))}
        </nav>

        <ul className="task-list">
          {visibleTasks.length === 0 ? (
            <li className="empty-state">No tasks to display.</li>
          ) : (
            visibleTasks.map((task) =>
              editingId === task.id ? (
                <li className="task-item" key={task.id}>
                  <form className="edit-task-form" onSubmit={saveEdit}>
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(event) => setEditingTitle(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") cancelEditing();
                      }}
                      aria-label={`Edit title of ${task.title}`}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="save-button"
                      disabled={!editingTitle.trim()}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </form>
                </li>
              ) : (
                <li className="task-item" key={task.id}>
                  <label className="task-label">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span className={task.completed ? "completed" : ""}>
                      {task.title}
                    </span>
                  </label>
                  <div className="task-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => startEditing(task)}
                      aria-label={`Edit ${task.title}`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete ${task.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            )
          )}
        </ul>
      </section>

      <footer className="page-footer">
        Tasks are saved in this browser on this device.
      </footer>
    </main>
  );
}

export default App;
