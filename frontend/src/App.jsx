import { useEffect, useRef, useState } from 'react';
import { api } from './api';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import AccessibilitySection from './components/AccessibilitySection';
import FittsSection from './components/FittsSection';
import GomsSection from './components/GomsSection';
import UsabilityTimer from './components/UsabilityTimer';
import ChatBot from './components/ChatBot';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tasksStatus, setTasksStatus] = useState('');
  const [filter, setFilter] = useState('all');
  const titleInputRef = useRef(null);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
      setTasksStatus('Задачи загружены.');
    } catch (error) {
      setTasksStatus(error.message || 'Ошибка загрузки задач. Проверьте backend.');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (payload) => {
    setLoading(true);
    try {
      const created = await api.createTask(payload);
      setTasks((prev) => [created, ...prev]);
      setTasksStatus('Задача добавлена.');
      return created;
    } catch (error) {
      setTasksStatus(error.message || 'Не удалось добавить задачу.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDone = async (task) => {
    try {
      const updated = await api.updateTask(task.id, { done: !task.done });
      setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setTasksStatus(`Статус задачи «${task.title}» обновлён.`);
    } catch (error) {
      setTasksStatus(error.message || 'Не удалось обновить задачу.');
    }
  };

  const handleDelete = async (task) => {
    const confirmed = window.confirm(`Удалить задачу «${task.title}»?`);
    if (!confirmed) return;

    try {
      await api.deleteTask(task.id);
      setTasks((prev) => prev.filter((item) => item.id !== task.id));
      setTasksStatus(`Задача «${task.title}» удалена.`);
    } catch (error) {
      setTasksStatus(error.message || 'Не удалось удалить задачу.');
    }
  };

  const handleChatSend = async ({ message, tasks: allTasks }) => {
    const data = await api.sendChat({ message, tasks: allTasks });
    return data.reply;
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти к основному содержимому
      </a>
      <Header />
      <main id="main-content" className="container">
        <Dashboard tasks={tasks} />
        <TaskForm onSubmit={handleCreateTask} loading={loading} titleInputRef={titleInputRef} />
        <TaskList
          tasks={tasks}
          filter={filter}
          onFilterChange={setFilter}
          onToggleDone={handleToggleDone}
          onDelete={handleDelete}
          statusMessage={tasksStatus}
        />
        <AccessibilitySection />
        <FittsSection />
        <ChatBot tasks={tasks} onSend={handleChatSend} />
        <UsabilityTimer onStart={() => titleInputRef.current?.focus()} />
        <GomsSection />
      </main>
    </>
  );
}
