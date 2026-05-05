import { useState } from 'react';

const initial = { title: '', subject: '', priority: 'medium', deadline: '', note: '' };

export default function TaskForm({ onSubmit }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('');

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.title || !form.subject || !form.deadline) {
      setStatus('Заполните название, предмет и дедлайн.');
      return;
    }

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
      <div className="form-head">
        <h3>Новая задача</h3>
        <p>Добавьте задачу за несколько секунд.</p>
      </div>

      <label className="field full">
        <span>Название задачи</span>
        <input
          name="title"
          value={form.title}
          onChange={(event) => updateField('title', event.target.value)}
          placeholder="Например: подготовить презентацию"
        />
      </label>

      <div className="form-grid">
        <label className="field">
          <span>Предмет</span>
          <input
            name="subject"
            value={form.subject}
            onChange={(event) => updateField('subject', event.target.value)}
            placeholder="HCI"
          />
        </label>

        <label className="field">
          <span>Приоритет</span>
          <select value={form.priority} onChange={(event) => updateField('priority', event.target.value)}>
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </label>

        <label className="field full">
          <span>Дедлайн</span>
          <input type="date" value={form.deadline} onChange={(event) => updateField('deadline', event.target.value)} />
        </label>
      </div>

      <label className="field full">
        <span>Заметка</span>
        <textarea
          value={form.note}
          onChange={(event) => updateField('note', event.target.value)}
          rows="4"
          placeholder="Коротко опишите, что нужно сделать"
        />
      </label>

      <div className="form-actions">
        <button type="submit">Добавить задачу</button>
        <p aria-live="polite">{status}</p>
      </div>
    </form>
  );
}
