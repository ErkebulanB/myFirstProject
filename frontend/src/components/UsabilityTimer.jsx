import { useEffect, useMemo, useState } from 'react';

export default function UsabilityTimer({ onStart }) {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const formatted = useMemo(() => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }, [seconds]);

  const start = () => {
    setSeconds(0);
    setRunning(true);
    onStart();
  };

  const stop = () => setRunning(false);

  return (
    <section className="card" id="testing">
      <h2>Usability Testing</h2>
      <p>
        Сценарий: Добавьте задачу по предмету HCI с высоким приоритетом и дедлайном на этой неделе.
      </p>
      <p className="timer" aria-live="polite">
        Время: {formatted}
      </p>
      <div className="actions-row">
        <button onClick={start}>Начать тест</button>
        <button onClick={stop} disabled={!running}>
          Завершить тест
        </button>
      </div>
    </section>
  );
}
