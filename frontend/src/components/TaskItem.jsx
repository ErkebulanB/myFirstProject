export default function TaskItem({ task, onToggleDone, onDelete }) {
  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      <label className="checkbox-row">
        <input type="checkbox" checked={task.done} onChange={() => onToggleDone(task)} aria-label={`Mark ${task.title} done`} />
        <span>{task.title}</span>
      </label>
      <small>{task.subject} · {task.deadline}</small>
      <span className={`badge ${task.priority}`}>{task.priority}</span>
      <button className="ghost danger" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}>Delete</button>
    </li>
  );
}
