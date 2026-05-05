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
  { label: 'AI-помощник', href: '#ai-assistant' },
  { label: 'Дедлайны', href: '#deadlines' },
  { label: 'Аналитика', href: '#analytics' },
  { label: 'Настройки', href: '#settings' },
];

function formatToday() {
  return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'full' }).format(new Date());
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
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

  const upcoming = useMemo(
    () =>
      tasks
        .filter((task) => !task.done)
        .sort((a, b) => a.deadline.localeCompare(b.deadline))
        .slice(0, 5),
    [tasks]
  );

  const completedCount = tasks.filter((task) => task.done).length;
  const activeCount = tasks.filter((task) => !task.done).length;
  const overdueCount = tasks.filter((task) => !task.done && task.deadline < todayISO()).length;
  const highPriorityCount = tasks.filter((task) => task.priority === 'high').length;

  const stats = {
    total: tasks.length,
    active: activeCount,
    completed: completedCount,
    upcoming: upcoming.length,
    focus: tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0,
    highPriority: tasks.length ? Math.round((highPriorityCount / tasks.length) * 100) : 0,
    overdue: tasks.length ? Math.round((overdueCount / tasks.length) * 100) : 0,
    overdueCount,
  };

  const addTask = async (payload) => {
    const created = await api.createTask(payload);
    setTasks((prev) => [created, ...prev]);
    setTaskStatus('Задача успешно добавлена.');
  };

  const toggleDone = async (task) => {
    const updated = await api.updateTask(task.id, { done: !task.done });
    setTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)));
    setTaskStatus(task.done ? 'Задача возвращена в активные.' : 'Задача отмечена выполненной.');
  };

  const removeTask = async (task) => {
    if (!window.confirm(`Удалить задачу «${task.title}»?`)) return;
    await api.deleteTask(task.id);
    setTasks((prev) => prev.filter((item) => item.id !== task.id));
    setTaskStatus('Задача удалена.');
  };

  return (
    <div className="layout">
      <aside className="sidebar" aria-label="Основная навигация">
        <a className="skip-link" href="#tasks">
          Перейти к задачам
        </a>
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            SF
          </div>
          <div>
            <h1>StudyFlow AI</h1>
            <p>Планировщик учебной нагрузки</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-card">
          <span>Сегодня в фокусе</span>
          <strong>{upcoming[0]?.title || 'Добавьте первую задачу'}</strong>
        </div>
      </aside>

      <div className="main">
        <Header today={formatToday()} search={search} onSearchChange={setSearch} />

        <main className="content">
          <Dashboard stats={stats} upcoming={upcoming} />

          <section id="tasks" className="panel panel-large">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Рабочая область</p>
                <h2>Задачи</h2>
              </div>
              <p className="panel-note">Создавайте задачи, отмечайте прогресс и держите дедлайны под контролем.</p>
            </div>

            <div className="tasks-grid">
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
            </div>
          </section>

          <section id="ai-assistant" className="panel">
            <div className="panel-head compact">
              <div>
                <p className="eyebrow">AI Assistant</p>
                <h2>AI-помощник</h2>
              </div>
              <p className="panel-note">Помогает определить приоритет и составить реалистичный план.</p>
            </div>
            <ChatBot tasks={tasks} onSend={api.sendChat} />
          </section>

          <div className="bottom-grid">
            <section id="deadlines" className="panel">
              <div className="panel-head compact">
                <div>
                  <p className="eyebrow">Календарь</p>
                  <h2>Дедлайны</h2>
                </div>
              </div>
              <ul className="deadline-list clean-list">
                {upcoming.length ? (
                  upcoming.map((task) => (
                    <li key={task.id}>
                      <span className="date-pill">{task.deadline}</span>
                      <span>{task.title}</span>
                    </li>
                  ))
                ) : (
                  <li className="empty-line">Ближайших дедлайнов пока нет.</li>
                )}
              </ul>
            </section>

            <section id="analytics" className="panel">
              <div className="panel-head compact">
                <div>
                  <p className="eyebrow">Прогресс</p>
                  <h2>Аналитика</h2>
                </div>
              </div>
              <div className="metrics">
                <div className="metric">
                  <div className="metric-row">
                    <span>Выполнение</span>
                    <strong>{stats.focus}%</strong>
                  </div>
                  <div className="progress"><i style={{ width: `${stats.focus}%` }} /></div>
                </div>
                <div className="metric">
                  <div className="metric-row">
                    <span>Высокий приоритет</span>
                    <strong>{stats.highPriority}%</strong>
                  </div>
                  <div className="progress"><i style={{ width: `${stats.highPriority}%` }} /></div>
                </div>
                <div className="metric">
                  <div className="metric-row">
                    <span>Просрочено</span>
                    <strong>{stats.overdueCount} задач</strong>
                  </div>
                  <div className="progress"><i className="danger-fill" style={{ width: `${stats.overdue}%` }} /></div>
                </div>
              </div>
            </section>
          </div>

          <section id="settings" className="panel settings-panel">
            <div>
              <p className="eyebrow">Аккаунт</p>
              <h2>Профиль и настройки</h2>
            </div>
            <div className="settings-grid">
              <div><strong>Уведомления</strong><span>Напоминания о дедлайнах</span></div>
              <div><strong>Учебные цели</strong><span>Фокус на продуктивности</span></div>
              <div><strong>Тема</strong><span>Тёмный режим</span></div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
