const priorityLabel = { low: 'Низкий', medium: 'Средний', high: 'Высокий' };

export default function TaskItem({ task, onToggleDone, onDelete }) {
  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      <label className="checkbox-row">
        <input type="checkbox" checked={task.done} onChange={() => onToggleDone(task)} aria-label={`Отметить задачу ${task.title} выполненной`} />
        <span>{task.title}</span>
      </label>
      <small>{task.subject} · {task.deadline}</small>
      <span className={`badge ${task.priority}`}>{priorityLabel[task.priority]}</span>
      <button className="ghost danger" onClick={() => onDelete(task)} aria-label={`Удалить задачу ${task.title}`}>Удалить</button>
    </li>
  );
}
