const priorityLabels = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export default function TaskItem({ task, onToggleDone, onDelete }) {
  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggleDone(task)}
          aria-label={`Отметить задачу «${task.title}» выполненной`}
        />
        <span className="task-title">{task.title}</span>
      </label>

      <div className="task-meta">
        <span>{task.subject}</span>
        <span>{task.deadline}</span>
      </div>

      <span className={`badge ${task.priority}`}>{priorityLabels[task.priority] || task.priority}</span>

      <button className="ghost danger" onClick={() => onDelete(task)} aria-label={`Удалить задачу «${task.title}»`}>
        Удалить
      </button>
    </li>
  );
}
