const priorityLabel = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export default function TaskItem({ task, onToggleDone, onDelete }) {
  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      <div className="task-main">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => onToggleDone(task)}
            aria-label={`Отметить задачу ${task.title} как выполненную`}
          />
          <span>{task.title}</span>
        </label>
        <p>
          Предмет: <strong>{task.subject}</strong> · Дедлайн: <strong>{task.deadline}</strong>
        </p>
        {task.note ? <p className="note">Комментарий: {task.note}</p> : null}
      </div>

      <div className="task-actions">
        <span className={`priority priority-${task.priority}`}>{priorityLabel[task.priority]}</span>
        <button onClick={() => onDelete(task)} className="danger-btn" aria-label={`Удалить задачу ${task.title}`}>
          Удалить
        </button>
      </div>
    </li>
  );
}
