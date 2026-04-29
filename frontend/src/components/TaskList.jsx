import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggleDone, onDelete, statusMessage, filterStatus, filterPriority, setFilterStatus, setFilterPriority }) {
  return (
    <section>
      <div className="filters">
        <label>
          Статус
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Все</option>
            <option value="active">Активные</option>
            <option value="done">Выполненные</option>
          </select>
        </label>
        <label>
          Приоритет
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="all">Все</option>
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </label>
      </div>
      <p aria-live="polite">{statusMessage}</p>
      {tasks.length === 0 ? (
        <div className="empty">Задачи не найдены. Добавьте первую задачу, чтобы начать планирование.</div>
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
