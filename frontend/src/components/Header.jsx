export default function Header({ today }) {
  return (
    <header className="topbar">
      <label className="search-wrap">
        <span className="sr-only">Search</span>
        <input type="search" placeholder="Search tasks, subjects, notes..." aria-label="Search" />
      </label>
      <div className="topbar-right">
        <span>{today}</span>
        <button className="profile-btn" aria-label="Profile">AS</button>
      </div>
    </header>
  );
}
