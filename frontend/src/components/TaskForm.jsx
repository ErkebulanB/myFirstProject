import { useState } from 'react';

const initial = { title: '', subject: '', priority: 'medium', deadline: '', note: '' };

export default function TaskForm({ onSubmit }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.deadline) return setStatus('Please fill all required fields.');
    try {
      await onSubmit(form);
      setForm(initial);
      setStatus('Task added.');
    } catch (err) {
      setStatus(err.message || 'Could not add task.');
    }
  };

  return (
    <form onSubmit={submit} className="task-form panel-soft">
      <h3>Create task</h3>
      <label>Task title<input name="title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} /></label>
      <label>Subject<input name="subject" value={form.subject} onChange={(e)=>setForm({...form,subject:e.target.value})} /></label>
      <label>Priority<select value={form.priority} onChange={(e)=>setForm({...form,priority:e.target.value})}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
      <label>Deadline<input type="date" value={form.deadline} onChange={(e)=>setForm({...form,deadline:e.target.value})} /></label>
      <label>Notes<textarea value={form.note} onChange={(e)=>setForm({...form,note:e.target.value})} rows="3" /></label>
      <button type="submit">Add task</button>
      <p aria-live="polite">{status}</p>
    </form>
  );
}
