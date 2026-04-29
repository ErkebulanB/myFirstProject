export default function Dashboard({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  const active = total - done;

  return (
    <section className="card dashboard" aria-label="Статистика задач">
      <h2>Панель задач</h2>
      <div className="stats-grid">
        <article>
          <p>Всего задач</p>
          <strong>{total}</strong>
        </article>
        <article>
          <p>Выполнено</p>
          <strong>{done}</strong>
        </article>
        <article>
          <p>Активно</p>
          <strong>{active}</strong>
        </article>
      </div>
    </section>
  );
}
