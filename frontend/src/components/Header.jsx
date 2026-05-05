export default function Header({ today, search, onSearchChange }) {
  return (
    <header className="topbar">
      <label className="search-wrap" htmlFor="task-search">
        <span className="sr-only">Поиск задач</span>
        <input
          id="task-search"
          type="search"
          placeholder="Поиск по задаче, предмету или заметке..."
          aria-label="Поиск задач"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
      <div className="topbar-right">
        <span className="today-label">{today}</span>
        <button className="profile-btn" type="button" aria-label="Профиль пользователя">
          AS
        </button>
      </div>
    </header>
  );
}
