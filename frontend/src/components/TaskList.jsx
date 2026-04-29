import TaskItem from './TaskItem';

export default function TaskList({ tasks, filter, onFilterChange, onToggleDone, onDelete, statusMessage }) {
  const filtered = tasks.filter((task) => {
    if (filter === 'active') return !task.done;
    if (filter === 'done') return task.done;
    return true;
  });

  return (
    <section className="card" id="tasks">
      <h2>Список задач</h2>
      <div className="filters" role="group" aria-label="Фильтры задач">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => onFilterChange('all')}>
          Все
        </button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => onFilterChange('active')}>
          Активные
        </button>
        <button className={filter === 'done' ? 'active' : ''} onClick={() => onFilterChange('done')}>
          Выполненные
        </button>
      </div>

      <p aria-live="polite" className="live-status">
        {statusMessage}
      </p>

      {filtered.length === 0 ? (
        <p className="empty-state">Нет задач для выбранного фильтра. Добавьте новую задачу выше.</p>
      ) : (
        <ul className="task-list">
          {filtered.map((task) => (
            <TaskItem key={task.id} task={task} onToggleDone={onToggleDone} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  );
}
