export default function Dashboard({ stats, upcoming }) {
  return (
    <section id="dashboard" className="panel">
      <h2>Dashboard</h2>
      <div className="cards">
        <article><p>Active tasks</p><strong>{stats.active}</strong></article>
        <article><p>Completed</p><strong>{stats.completed}</strong></article>
        <article><p>Upcoming deadlines</p><strong>{stats.upcoming}</strong></article>
        <article><p>Focus score</p><strong>{stats.focus}%</strong></article>
      </div>
      <div className="split">
        <div className="subpanel">
          <h3>Today's Focus</h3>
          <p>Pick 1 high-priority task and finish it before noon. Then move to medium-priority tasks.</p>
        </div>
        <div className="subpanel">
          <h3>Upcoming deadlines</h3>
          <ul className="deadline-list">
            {upcoming.length ? upcoming.map((task) => <li key={task.id}><strong>{task.deadline}</strong> — {task.title}</li>) : <li>No upcoming deadlines.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}
