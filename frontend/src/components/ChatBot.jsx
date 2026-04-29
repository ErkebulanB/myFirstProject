import { useState } from 'react';

const prompts = ['Спланировать день', 'Что сделать первым?', 'Суммировать дедлайны'];

export default function ChatBot({ tasks, onSend }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{ role: 'assistant', text: 'Привет! Я помогу распределить учебную нагрузку и дедлайны.' }]);

  const send = async (text) => {
    if (!text.trim()) return;
    setItems((p) => [...p, { role: 'user', text }]);
    setLoading(true);
    setMessage('');
    try {
      const res = await onSend({ message: text, tasks });
      setItems((p) => [...p, { role: 'assistant', text: res.reply }]);
    } catch {
      setItems((p) => [...p, { role: 'assistant', text: 'Сервис временно недоступен. Попробуйте позже.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat">
      <div className="prompt-row">
        {prompts.map((p) => (
          <button key={p} className="ghost" onClick={() => send(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className="chat-box" aria-live="polite">
        {items.map((m, i) => (
          <p key={i} className={`msg ${m.role}`}>
            {m.text}
          </p>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(message); }} className="chat-form">
        <label htmlFor="chat">Сообщение</label>
        <input id="chat" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Спросите StudyFlow AI..." />
        <button type="submit" disabled={loading}>{loading ? 'Бот думает...' : 'Отправить'}</button>
      </form>
    </div>
  );
}
