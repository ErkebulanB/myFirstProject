import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ChatBot from './components/ChatBot';

const navItems = ['Dashboard', 'Tasks', 'AI Assistant', 'Calendar', 'Analytics', 'Settings'];

function formatToday() {
  return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'full' }).format(new Date());
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    api.getTasks().then(setTasks).catch((e) => setTaskStatus(e.message));
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusOk = filterStatus === 'all' || (filterStatus === 'done' ? task.done : !task.done);
      const priorityOk = filterPriority === 'all' || task.priority === filterPriority;
      return statusOk && priorityOk;
    });
  }, [tasks, filterStatus, filterPriority]);

  const addTask = async (payload) => {
    const created = await api.createTask(payload);
    setTasks((prev) => [created, ...prev]);
    setTaskStatus('Task created successfully.');
  };

  const toggleDone = async (task) => {
    const updated = await api.updateTask(task.id, { done: !task.done });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    setTaskStatus('Task updated.');
  };

  const removeTask = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    await api.deleteTask(task.id);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    setTaskStatus('Task removed.');
  };

  const upcoming = tasks
    .filter((t) => !t.done)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5);

  const stats = {
    active: tasks.filter((t) => !t.done).length,
    completed: tasks.filter((t) => t.done).length,
    upcoming: upcoming.length,
    focus: tasks.length ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) : 0,
  };

  return (
    <div className="layout">
      <aside className="sidebar" aria-label="Main navigation">
        <h1>StudyFlow AI</h1>
        <p>Smart academic task management platform.</p>
        <nav>
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>
              {item}
            </a>
          ))}
        </nav>
      </aside>

      <div className="main">
        <Header today={formatToday()} />
        <main>
          <Dashboard tasks={tasks} stats={stats} upcoming={upcoming} />

          <section id="tasks" className="panel">
            <div className="panel-head"><h2>Tasks</h2></div>
            <TaskForm onSubmit={addTask} />
            <TaskList
              tasks={filteredTasks}
              statusMessage={taskStatus}
              onToggleDone={toggleDone}
              onDelete={removeTask}
              filterStatus={filterStatus}
              filterPriority={filterPriority}
              setFilterStatus={setFilterStatus}
              setFilterPriority={setFilterPriority}
            />
          </section>

          <section id="ai-assistant" className="panel">
            <h2>AI Assistant</h2>
            <ChatBot tasks={tasks} onSend={api.sendChat} />
          </section>

          <section id="calendar" className="panel"><h2>Calendar</h2>
            <ul className="deadline-list">{upcoming.length ? upcoming.map(t => <li key={t.id}><strong>{t.deadline}</strong> — {t.title}</li>) : <li>No upcoming deadlines.</li>}</ul>
          </section>

          <section id="analytics" className="panel"><h2>Analytics</h2>
            <div className="metric"><span>Completion rate</span><div><i style={{width:`${stats.focus}%`}} /></div></div>
            <div className="metric"><span>High priority tasks</span><div><i style={{width:`${tasks.length ? Math.round((tasks.filter(t=>t.priority==='high').length/tasks.length)*100):0}%`}} /></div></div>
            <div className="metric"><span>Overdue tasks</span><div><i style={{width:`${tasks.length ? Math.round((tasks.filter(t=>!t.done && t.deadline < new Date().toISOString().slice(0,10)).length/tasks.length)*100):0}%`}} /></div></div>
          </section>

          <section id="settings" className="panel"><h2>Settings</h2><ul><li>Notification preferences</li><li>Study goals</li><li>Theme</li></ul></section>
        </main>
      </div>
    </div>
  );
}
