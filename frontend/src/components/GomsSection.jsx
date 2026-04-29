export default function GomsSection() {
  return (
    <section className="card">
      <h2>GOMS-модель</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Operators</th>
              <th>Methods</th>
              <th>Selection rules</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Добавить задачу</td>
              <td>Ввод, выбор из списка, клик</td>
              <td>Заполнить форму и нажать кнопку</td>
              <td>Если дедлайн срочный — выбрать высокий приоритет</td>
            </tr>
            <tr>
              <td>Завершить задачу</td>
              <td>Клик по checkbox</td>
              <td>Отметить задачу выполненной</td>
              <td>Если задача завершена — отметить сразу, чтобы обновить статистику</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
