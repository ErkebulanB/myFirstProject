const statCards = [
  { key: 'active', label: 'Активные задачи' },
  { key: 'completed', label: 'Выполнено' },
  { key: 'upcoming', label: 'Ближайшие дедлайны' },
  { key: 'focus', label: 'Фокус-скор', suffix: '%' },
];

export default function Dashboard({ stats, upcoming }) {
  return (
    <section id="dashboard" className="hero-panel">
      <div className="hero-copy">
        <p className="eyebrow">Dashboard</p>
        <h2>Панель студента</h2>
        <p>
          Единое пространство для задач, дедлайнов и AI-планирования. Интерфейс помогает быстрее понять,
          что важно сделать сегодня.
        </p>
      </div>

      <div className="cards">
        {statCards.map((card) => (
          <article key={card.key}>
            <p>{card.label}</p>
            <strong>{stats[card.key]}{card.suffix || ''}</strong>
          </article>
        ))}
      </div>

      <div className="split">
        <div className="subpanel highlight-panel">
          <h3>Фокус на сегодня</h3>
          <p>
            Начните с одной задачи высокого приоритета. После этого переходите к задачам со средним
            приоритетом и близким дедлайном.
          </p>
        </div>
        <div className="subpanel">
          <h3>Скоро истекают</h3>
          <ul className="deadline-list">
            {upcoming.length ? (
              upcoming.slice(0, 3).map((task) => (
                <li key={task.id}>
                  <strong>{task.deadline}</strong> — {task.title}
                </li>
              ))
            ) : (
              <li>Нет задач с близким дедлайном.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
