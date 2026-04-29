import { useState } from 'react';

export default function ChatBot({ tasks, onSend }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Привет! Я помогу распланировать учебные задачи.' },
  ]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    const text = message.trim();
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setMessage('');
    setLoading(true);
    setStatus('Бот думает...');

    try {
      const reply = await onSend({ message: text, tasks });
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setStatus('Ответ получен.');
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Не удалось связаться с сервером. Попробуйте позже.' },
      ]);
      setStatus(error.message || 'Ошибка чата.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card" id="chat">
      <h2>LLM-чатбот</h2>

      <div className="chat-box" aria-live="polite">
        {messages.map((item, index) => (
          <p key={`${item.role}-${index}`} className={`bubble ${item.role}`}>
            <strong>{item.role === 'user' ? 'Вы' : 'Бот'}:</strong> {item.text}
          </p>
        ))}
      </div>

      <form onSubmit={submit} className="chat-form">
        <label htmlFor="chat-input">Сообщение</label>
        <input
          id="chat-input"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Например: помоги составить план на сегодня"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Бот думает...' : 'Отправить'}
        </button>
      </form>

      <p aria-live="polite" className="live-status">
        {status}
      </p>
    </section>
  );
}
