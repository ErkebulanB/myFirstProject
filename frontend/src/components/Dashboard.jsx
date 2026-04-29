export default function Dashboard({ stats, upcoming }) {
  return (
    <section id="dashboard" className="panel">
      <h2>Панель</h2>
      <div className="cards">
        <article>
          <p>Активные задачи</p>
          <strong>{stats.active}</strong>
        </article>
        <article>
          <p>Выполнено</p>
          <strong>{stats.completed}</strong>
        </article>
        <article>
          <p>Ближайшие дедлайны</p>
          <strong>{stats.upcoming}</strong>
        </article>
        <article>
          <p>Фокус-скор</p>
          <strong>{stats.focus}%</strong>
        </article>
      </div>
      <div className="split">
        <div className="subpanel">
          <h3>Фокус на сегодня</h3>
          <p>Сначала закройте одну задачу с высоким приоритетом, затем переходите к средним.</p>
        </div>
        <div className="subpanel">
          <h3>Скоро истекают</h3>
          <ul className="deadline-list">
            {upcoming.length ? upcoming.map((task) => <li key={task.id}><strong>{task.deadline}</strong> — {task.title}</li>) : <li>Нет задач с близким дедлайном.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}
