export default function Header() {
  return (
    <header className="header">
      <h1>Student Planner</h1>
      <p>Учебный планировщик задач с HCI-подходом и AI-помощником.</p>
      <nav aria-label="Навигация по странице">
        <a href="#tasks">Задачи</a>
        <a href="#accessibility">Доступность</a>
        <a href="#chat">Чатбот</a>
        <a href="#testing">Тестирование</a>
      </nav>
    </header>
  );
}
