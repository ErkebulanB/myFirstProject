import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  onToggleDone,
  onDelete,
  statusMessage,
  filterStatus,
  filterPriority,
  setFilterStatus,
  setFilterPriority,
}) {
  return (
    <section className="task-board" aria-labelledby="task-list-title">
      <div className="task-board-head">
        <div>
          <h3 id="task-list-title">Список задач</h3>
          <p>Фильтруйте задачи по статусу и приоритету.</p>
        </div>
      </div>

      <div className="filters">
        <label>
          <span>Статус</span>
          <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
            <option value="all">Все</option>
            <option value="active">Активные</option>
            <option value="done">Выполненные</option>
          </select>
        </label>
        <label>
          <span>Приоритет</span>
          <select value={filterPriority} onChange={(event) => setFilterPriority(event.target.value)}>
            <option value="all">Все</option>
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </label>
      </div>

      <p className="status-line" aria-live="polite">{statusMessage}</p>

      {tasks.length === 0 ? (
        <div className="empty">Задачи не найдены. Добавьте новую задачу или измените фильтры.</div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggleDone={onToggleDone} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  );
}
