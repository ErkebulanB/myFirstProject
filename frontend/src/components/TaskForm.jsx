import { useState } from 'react';

const initialState = {
  title: '',
  subject: '',
  priority: 'medium',
  deadline: '',
  note: '',
};

export default function TaskForm({ onSubmit, loading, titleInputRef }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');

    if (!form.title || !form.subject || !form.priority || !form.deadline) {
      setStatus('Заполните обязательные поля.');
      return;
    }

    try {
      await onSubmit(form);
      setForm(initialState);
      setStatus('Задача успешно добавлена.');
    } catch (error) {
      setStatus(error.message || 'Не удалось добавить задачу.');
    }
  };

  return (
    <section className="card">
      <h2>Добавить задачу</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <label htmlFor="title">Название задачи</label>
        <input id="title" name="title" ref={titleInputRef} value={form.title} onChange={handleChange} />

        <label htmlFor="subject">Предмет</label>
        <input id="subject" name="subject" value={form.subject} onChange={handleChange} />

        <label htmlFor="priority">Приоритет</label>
        <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>

        <label htmlFor="deadline">Дедлайн</label>
        <input id="deadline" name="deadline" type="date" value={form.deadline} onChange={handleChange} />

        <label htmlFor="note">Комментарий</label>
        <textarea id="note" name="note" value={form.note} onChange={handleChange} rows="3" />

        <button type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : 'Добавить задачу'}
        </button>
        <p aria-live="polite" className="live-status">
          {status}
        </p>
      </form>
    </section>
  );
}
