import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ChatBot from './components/ChatBot';

const navItems = [
  { label: 'Панель', href: '#dashboard' },
  { label: 'Задачи', href: '#tasks' },
  { label: 'AI-помощник', href: '#assistant' },
  { label: 'Дедлайны', href: '#deadlines' },
  { label: 'Аналитика', href: '#analytics' },
  { label: 'Профиль и настройки', href: '#settings' },
];

function formatToday() {
  return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'full' }).format(new Date());
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .getTasks()
      .then(setTasks)
      .catch((e) => setTaskStatus(e.message || 'Не удалось загрузить задачи.'));
  }, []);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const statusOk = filterStatus === 'all' || (filterStatus === 'done' ? task.done : !task.done);
      const priorityOk = filterPriority === 'all' || task.priority === filterPriority;
      const searchOk =
        !query ||
        [task.title, task.subject, task.note || '']
          .join(' ')
          .toLowerCase()
          .includes(query);

      return statusOk && priorityOk && searchOk;
    });
  }, [tasks, filterStatus, filterPriority, search]);

  const addTask = async (payload) => {
    const created = await api.createTask(payload);
    setTasks((prev) => [created, ...prev]);
    setTaskStatus('Задача успешно добавлена.');
  };

  const toggleDone = async (task) => {
    const updated = await api.updateTask(task.id, { done: !task.done });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    setTaskStatus('Статус задачи обновлён.');
  };

  const removeTask = async (task) => {
    if (!window.confirm(`Удалить задачу «${task.title}»?`)) return;
    await api.deleteTask(task.id);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    setTaskStatus('Задача удалена.');
  };

  const upcoming = tasks
    .filter((t) => !t.done)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5);

  const overdueCount = tasks.filter((t) => !t.done && t.deadline < new Date().toISOString().slice(0, 10)).length;

  const stats = {
    active: tasks.filter((t) => !t.done).length,
    completed: tasks.filter((t) => t.done).length,
    upcoming: upcoming.length,
    focus: tasks.length ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) : 0,
    highPriority: tasks.length ? Math.round((tasks.filter((t) => t.priority === 'high').length / tasks.length) * 100) : 0,
    overdue: tasks.length ? Math.round((overdueCount / tasks.length) * 100) : 0,
  };

  return (
    <div className="layout">
      <aside className="sidebar" aria-label="Основная навигация">
        <h1>StudyFlow AI</h1>
        <p>Умный планировщик учебной нагрузки.</p>
        <nav>
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="main">
        <Header today={formatToday()} search={search} onSearchChange={setSearch} />
        <main>
          <Dashboard stats={stats} upcoming={upcoming} />

          <section id="tasks" className="panel">
            <div className="panel-head">
              <h2>Задачи</h2>
            </div>
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

          <section id="assistant" className="panel">
            <h2>AI-помощник</h2>
            <ChatBot tasks={tasks} onSend={api.sendChat} />
          </section>

          <section id="deadlines" className="panel">
            <h2>Дедлайны</h2>
            <ul className="deadline-list">
              {upcoming.length ? (
                upcoming.map((t) => (
                  <li key={t.id}>
                    <strong>{t.deadline}</strong> — {t.title}
                  </li>
                ))
              ) : (
                <li>Ближайших дедлайнов пока нет.</li>
              )}
            </ul>
          </section>

          <section id="analytics" className="panel">
            <h2>Аналитика</h2>
            <div className="metric">
              <span>Процент выполнения</span>
              <div>
                <i style={{ width: `${stats.focus}%` }} />
              </div>
            </div>
            <div className="metric">
              <span>Задачи с высоким приоритетом</span>
              <div>
                <i style={{ width: `${stats.highPriority}%` }} />
              </div>
            </div>
            <div className="metric">
              <span>Просроченные задачи</span>
              <div>
                <i style={{ width: `${stats.overdue}%` }} />
              </div>
            </div>
          </section>

          <section id="settings" className="panel">
            <h2>Профиль и настройки</h2>
            <ul>
              <li>Настройки уведомлений</li>
              <li>Учебные цели</li>
              <li>Тема оформления</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
