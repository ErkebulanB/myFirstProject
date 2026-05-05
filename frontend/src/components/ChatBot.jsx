import { useState } from 'react';

const prompts = ['Спланировать день', 'Что сделать первым?', 'Суммировать дедлайны'];

export default function ChatBot({ tasks, onSend }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([
    { role: 'assistant', text: 'Привет! Я помогу распределить учебные задачи, выбрать приоритет и составить план.' },
  ]);

  const send = async (text) => {
    if (!text.trim()) return;

    setItems((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);
    setMessage('');

    try {
      const res = await onSend({ message: text, tasks });
      setItems((prev) => [...prev, { role: 'assistant', text: res.reply }]);
    } catch {
      setItems((prev) => [...prev, { role: 'assistant', text: 'Сервис временно недоступен. Попробуйте позже.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat">
      <div className="prompt-row" aria-label="Быстрые запросы">
        {prompts.map((prompt) => (
          <button key={prompt} className="ghost" type="button" onClick={() => send(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <div className="chat-box" aria-live="polite">
        {items.map((item, index) => (
          <div key={`${item.role}-${index}`} className={`msg ${item.role}`}>
            <span>{item.text}</span>
          </div>
        ))}
        {loading && <div className="msg assistant"><span>Бот думает...</span></div>}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(message);
        }}
        className="chat-form"
      >
        <label htmlFor="chat">Сообщение</label>
        <div className="chat-input-row">
          <input
            id="chat"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Спросите StudyFlow AI..."
          />
          <button type="submit" disabled={loading}>{loading ? 'Ожидание...' : 'Отправить'}</button>
        </div>
      </form>
    </div>
  );
}
