function Sidebar({ activeTab, onTabChange }) {
  const navItems = [
    { key: "dashboard", label: "Home", icon: "🏠" },
    { key: "compare", label: "Compare AI Responses", icon: "⚖️" },
    { key: "recent", label: "History", icon: "🕒" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">DI</div>
        <div>
          <p className="brand-title">Decision Intelligence</p>
          <p className="brand-subtitle">Assistant Console</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`nav-item ${activeTab === item.key ? "active" : ""}`}
            onClick={() => onTabChange(item.key)}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
