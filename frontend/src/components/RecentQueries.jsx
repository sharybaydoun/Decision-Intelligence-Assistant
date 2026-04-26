function RecentQueries({ items, onSelectQuery }) {
  return (
    <section className="panel recent-queries">
      <div className="panel-header">
        <h2>Recent Queries</h2>
        <span className="query-count">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">No queries yet. Try asking something!</p>
      ) : (
        <ul className="query-list">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="query-item"
                onClick={() => onSelectQuery(item)}
              >
                <p className="query-text">{item.text}</p>
                <p className="query-time">{item.timestamp}</p>
                {item.preview && <p className="query-preview">{item.preview}</p>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default RecentQueries;
