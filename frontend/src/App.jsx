import { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query) return;

    setLoading(true);

    try {
      const res = await axios.post("http://backend:8000/compare", {
        text: query,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error calling backend");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Decision Intelligence Assistant</h1>

      {/* INPUT */}
      <div className="input-box">
        <input
          type="text"
          placeholder="Enter your support ticket..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      {/* RESULTS */}
      {result && (
        <div className="results">

          {/* COMPARISON GRID */}
          <div className="grid">

            {/* ML */}
            <div className="card">
              <h2>ML</h2>
              <p><b>Label:</b> {result.ml.prediction}</p>
              <p><b>Confidence:</b> {(result.ml.confidence * 100).toFixed(1)}%</p>
              <p><b>Latency:</b> {result.ml.latency.toFixed(2)} ms</p>
              <p><b>Cost:</b> $0</p>
            </div>

            {/* LLM */}
            <div className="card">
              <h2>LLM</h2>
              <p><b>Label:</b> {result.llm.prediction}</p>
              <p><b>Latency:</b> {result.llm.latency.toFixed(2)} ms</p>
              <p><b>Cost:</b> ${result.llm.cost}</p>
            </div>

            {/* RAG */}
            <div className="card">
              <h2>RAG</h2>
              <p>{result.rag.answer}</p>
              <p className="meta">
                {result.rag.latency.toFixed(2)} ms • ${result.rag.cost}
              </p>
            </div>

            {/* NON-RAG */}
            <div className="card">
              <h2>Non-RAG</h2>
              <p>{result.non_rag.answer}</p>
              <p className="meta">
                {result.non_rag.latency.toFixed(2)} ms • ${result.non_rag.cost}
              </p>
            </div>

          </div>

          {/* SOURCES */}
          <div className="sources">
            <h2>Sources</h2>
            <ul>
              {result.rag.sources.map((s, i) => (
                <li key={i}>
                  {s}
                  <span>
                    score: {result.rag.scores[i]?.toFixed(3)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;