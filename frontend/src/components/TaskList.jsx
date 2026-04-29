import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggleDone, onDelete, statusMessage, filterStatus, filterPriority, setFilterStatus, setFilterPriority }) {
  return (
    <section>
      <div className="filters">
        <label>Status<select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}><option value="all">All</option><option value="active">Active</option><option value="done">Completed</option></select></label>
        <label>Priority<select value={filterPriority} onChange={(e)=>setFilterPriority(e.target.value)}><option value="all">All</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
      </div>
      <p aria-live="polite">{statusMessage}</p>
      {tasks.length === 0 ? <div className="empty">No tasks found. Create your first task to get started.</div> : <ul className="task-list">{tasks.map((task)=><TaskItem key={task.id} task={task} onToggleDone={onToggleDone} onDelete={onDelete} />)}</ul>}
    </section>
  );
}
