import { useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import ResultCard from "./components/ResultCard";
import RecentQueries from "./components/RecentQueries";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentQueries, setRecentQueries] = useState([]);

  const canSubmit = query.trim().length > 0 && !loading;

  const handleSubmit = async (submittedQuery = query) => {
    const normalizedQuery = submittedQuery.trim();
    if (!normalizedQuery) return;

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/compare", {
        text: normalizedQuery,
      });

      setResult(res.data);

      setRecentQueries((prev) => {
        const nextItem = {
          id: Date.now(),
          text: normalizedQuery,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          preview:
            res.data?.rag?.answer ||
            res.data?.non_rag?.answer ||
            res.data?.llm?.prediction ||
            "",
          result: res.data,
        };

        const deduped = prev.filter((item) => item.text !== normalizedQuery);
        return [nextItem, ...deduped].slice(0, 10);
      });
    } catch (err) {
      console.error(err);
      alert("Error calling backend");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecentQuery = (item) => {
    setQuery(item.text);
    setResult(item.result);
    setActiveTab("compare");
  };

  const sourceItems = useMemo(() => {
    if (!result?.rag?.sources?.length) return [];
    return result.rag.sources.map((source, idx) => ({
      source,
      score: result.rag.scores?.[idx],
    }));
  }, [result]);

  const lastQuery = recentQueries[0];

  return (
    <div className="app-shell">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main-content">
        {activeTab === "dashboard" && (
          <>
            <header className="page-header">
              <h1>Welcome!</h1>
              <p>Ask a question to see how AI systems respond.</p>
            </header>

            <section className="panel overview-panel">
              <h2>What this tool does</h2>
              <p>
                This tool compares different AI approaches to help support teams
                respond faster and more consistently.
              </p>
            </section>

            <section className="summary-grid">
              <article className="panel summary-card">
                <p className="label">Total queries</p>
                <strong>{recentQueries.length}</strong>
              </article>
              <article className="panel summary-card">
                <p className="label">Last query</p>
                <strong>{lastQuery?.text || "No queries yet"}</strong>
              </article>
            </section>

            <section className="panel input-panel input-panel-prominent">
              <div className="input-row">
                <input
                  type="text"
                  placeholder="Ask about a support case..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                      setActiveTab("compare");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    handleSubmit();
                    setActiveTab("compare");
                  }}
                  disabled={!canSubmit}
                >
                  {loading ? "Asking..." : "Ask Question"}
                </button>
              </div>
              {loading && <p className="loading">Processing query, please wait...</p>}
            </section>
          </>
        )}

        {activeTab === "compare" && (
          <>
            <header className="page-header">
              <h1>Compare AI Responses</h1>
              <p>See how each approach answers the same support question.</p>
            </header>

            <section className="panel input-panel">
              <div className="input-row">
                <input
                  type="text"
                  placeholder="Enter a support ticket or customer question..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                />
                <button type="button" onClick={() => handleSubmit()} disabled={!canSubmit}>
                  {loading ? "Analyzing..." : "Run Comparison"}
                </button>
              </div>
              {loading && <p className="loading">Processing query, please wait...</p>}
            </section>

            {result ? (
              <section className="results-grid">
                <ResultCard
                  title="Fast Prediction (Model)"
                  subtitle="Quick priority suggestion from the trained model"
                  type="prediction"
                  data={result.ml}
                />
                <ResultCard
                  title="AI Assistant"
                  subtitle="General AI response without ticket memory"
                  type="prediction"
                  data={result.llm}
                />
                <ResultCard
                  title="AI with Memory"
                  subtitle="Uses past similar cases to improve answers"
                  type="answer"
                  data={result.rag}
                />
                <ResultCard
                  title="AI without Memory"
                  subtitle="Answers directly without using previous cases"
                  type="answer"
                  data={result.non_rag}
                />
              </section>
            ) : (
              <section className="panel empty-results">
                <p>Run your first query to see a system comparison.</p>
              </section>
            )}

            <section className="panel sources-panel">
              <h2>Retrieved Sources</h2>
              {sourceItems.length === 0 ? (
                <p className="empty-state">Sources will appear here after a query.</p>
              ) : (
                <ul className="sources-list">
                  {sourceItems.map((item, idx) => (
                    <li key={`${item.source}-${idx}`}>
                      <p>{item.source}</p>
                      <span>
                        score:{" "}
                        {typeof item.score === "number" ? item.score.toFixed(3) : "--"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

        {activeTab === "recent" && (
          <>
            <header className="page-header">
              <h1>History</h1>
              <p>Tap any previous query to reopen its saved result.</p>
            </header>
          </>
        )}

        {activeTab === "recent" && (
          <RecentQueries
            items={recentQueries}
            onSelectQuery={handleSelectRecentQuery}
          />
        )}
      </main>
    </div>
  );
}

export default App;