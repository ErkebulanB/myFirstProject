import { useState } from 'react';

const prompts = ['Plan my study day', 'What should I do first?', 'Summarize my deadlines'];

export default function ChatBot({ tasks, onSend }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{ role: 'assistant', text: 'Hi! I can help plan your study workload.' }]);

  const send = async (text) => {
    if (!text.trim()) return;
    setItems((p) => [...p, { role: 'user', text }]);
    setLoading(true);
    setMessage('');
    try {
      const res = await onSend({ message: text, tasks });
      setItems((p) => [...p, { role: 'assistant', text: res.reply }]);
    } catch {
      setItems((p) => [...p, { role: 'assistant', text: 'Service unavailable. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat">
      <div className="prompt-row">{prompts.map((p)=><button key={p} className="ghost" onClick={()=>send(p)}>{p}</button>)}</div>
      <div className="chat-box" aria-live="polite">{items.map((m,i)=><p key={i} className={`msg ${m.role}`}>{m.text}</p>)}</div>
      <form onSubmit={(e)=>{e.preventDefault();send(message);}} className="chat-form">
        <label htmlFor="chat">Message</label>
        <input id="chat" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Ask StudyFlow AI..." />
        <button type="submit" disabled={loading}>{loading ? 'Thinking...' : 'Send'}</button>
      </form>
    </div>
  );
}
