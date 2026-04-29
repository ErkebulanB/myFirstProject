import { useState } from 'react';

const initial = { title: '', subject: '', priority: 'medium', deadline: '', note: '' };

export default function TaskForm({ onSubmit }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.deadline) return setStatus('Заполните обязательные поля.');
    try {
      await onSubmit(form);
      setForm(initial);
      setStatus('Задача добавлена.');
    } catch (err) {
      setStatus(err.message || 'Не удалось добавить задачу.');
    }
  };

  return (
    <form onSubmit={submit} className="task-form panel-soft">
      <h3>Новая задача</h3>
      <label>
        Название задачи
        <input name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </label>
      <label>
        Предмет
        <input name="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      </label>
      <label>
        Приоритет
        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
      </label>
      <label>
        Дедлайн
        <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
      </label>
      <label>
        Заметка
        <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows="3" />
      </label>
      <button type="submit">Добавить задачу</button>
      <p aria-live="polite">{status}</p>
    </form>
  );
}
