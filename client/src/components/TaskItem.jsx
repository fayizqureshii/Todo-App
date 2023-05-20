import { useState } from "react";

export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editError, setEditError] = useState("");

  async function handleSave() {
    const trimmed = editText.trim();

    if (!trimmed) {
      setEditError("Task cannot be empty");

      return;
    }

    if (trimmed === task.text) {
      setIsEditing(false);

      setEditError("");

      return;
    }

    try {
      await onUpdate(task._id, {
        text: trimmed,
      });

      setIsEditing(false);

      setEditError("");
    } catch {
      // parent sets global error
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSave();
    }

    if (e.key === "Escape") {
      setEditText(task.text);

      setIsEditing(false);

      setEditError("");
    }
  }

  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => {
          onToggle(task._id, !task.completed);
        }}
        aria-label={`Mark "${task.text}" as ${task.completed ? "incomplete" : "complete"}`}
      />

      {isEditing ? (
        <div className="edit-wrap">
          <input
            type="text"
            className="edit-input"
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value);

              setEditError("");
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
          />

          {editError && <span className="field-error">{editError}</span>}
        </div>
      ) : (
        <span
          className="task-text"
          onDoubleClick={() => {
            setEditText(task.text);

            setIsEditing(true);
          }}
          title="Double-click to edit"
        >
          {task.text}
        </span>
      )}

      <button
        type="button"
        className="btn-delete"
        onClick={() => {
          onDelete(task._id);
        }}
        aria-label={`Delete "${task.text}"`}
      >
        Delete
      </button>
    </li>
  );
}
