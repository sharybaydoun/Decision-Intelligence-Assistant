function formatLatency(latency) {
  if (typeof latency !== "number") return "--";
  return `${latency.toFixed(2)} ms`;
}

function ResultCard({ title, subtitle, type, data }) {
  return (
    <article className="result-card">
      <header className="result-card-header">
        <h3>{title}</h3>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </header>

      <div className="result-card-body">
        {type === "answer" ? (
          <p className="result-answer">{data?.answer ?? "No answer yet."}</p>
        ) : (
          <p className="result-prediction">
            <span className="label">Prediction</span>
            <strong>{data?.prediction ?? "--"}</strong>
          </p>
        )}

        <div className="result-meta">
          <p>
            <span className="label">Response time</span>
            <strong>{formatLatency(data?.latency)}</strong>
          </p>
        </div>
      </div>
    </article>
  );
}

export default ResultCard;