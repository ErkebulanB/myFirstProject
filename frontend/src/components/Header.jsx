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
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>
      <div className="topbar-right">
        <span>{today}</span>
        <button className="profile-btn" aria-label="Профиль пользователя">
          АС
        </button>
      </div>
    </header>
  );
}
