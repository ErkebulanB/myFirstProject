export default function AccessibilitySection() {
  return (
    <section className="card" id="accessibility">
      <h2>WCAG и доступность</h2>
      <ul>
        <li>Высокий контраст текста и кнопок для лучшей читаемости.</li>
        <li>Полная keyboard navigation: можно пройти сценарий только клавиатурой.</li>
        <li>У каждого поля есть label для screen reader.</li>
        <li>Статусы задач, формы и чата объявляются через aria-live.</li>
        <li>Адаптивная верстка для мобильных устройств и ноутбуков.</li>
      </ul>
    </section>
  );
}
