import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

function History() {
  const [scans, setScans] = useState([]);
  const [filteredScans, setFilteredScans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRange, setDateRange] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    fetchScans();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
    setCurrentPage(1);
  }, [scans, searchTerm, sortBy, dateRange]);

  const fetchScans = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/scan`, {
        headers: { Authorization: token },
      });
      setScans(res.data.scans);
    } catch (err) {
      alert("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...scans];
    if (searchTerm.trim()) {
      result = result.filter(scan =>
        scan.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const now = new Date();
    if (dateRange !== "all") {
      const days = dateRange === "7days" ? 7 : 30;
      const cutoff = new Date(now.setDate(now.getDate() - days));
      result = result.filter(scan => new Date(scan.createdAt) >= cutoff);
    }
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "highest":
        result.sort((a, b) => b.results.summary.score - a.results.summary.score);
        break;
      case "lowest":
        result.sort((a, b) => a.results.summary.score - b.results.summary.score);
        break;
      default:
        break;
    }
    setFilteredScans(result);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this scan permanently?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/scan/${id}`, {
        headers: { Authorization: token },
      });
      fetchScans();
    } catch (err) {
      alert("Failed to delete scan");
    }
  };

  // Export all current filtered scans to CSV
  const exportToCSV = () => {
    let csvRows = [["URL", "Score", "High", "Medium", "Low", "Date"]];
    filteredScans.forEach(scan => {
      csvRows.push([
        `"${scan.url}"`,
        scan.results.summary.score,
        scan.results.summary.high,
        scan.results.summary.medium,
        scan.results.summary.low,
        new Date(scan.createdAt).toLocaleString(),
      ]);
    });
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fixa11y_history_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Aggregated stats
  const totalScans = scans.length;
  const avgScore = scans.length ? Math.round(scans.reduce((s, c) => s + c.results.summary.score, 0) / scans.length) : 0;
  const totalHigh = scans.reduce((s, c) => s + c.results.summary.high, 0);
  const totalMedium = scans.reduce((s, c) => s + c.results.summary.medium, 0);
  const totalLow = scans.reduce((s, c) => s + c.results.summary.low, 0);

  // Score distribution data for histogram
  const scoreBins = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const distribution = Array(10).fill(0);
  scans.forEach(scan => {
    const score = scan.results.summary.score;
    const binIndex = Math.floor(score / 10);
    if (binIndex >= 0 && binIndex < 10) distribution[binIndex]++;
  });
  const distData = scoreBins.slice(0, 10).map((bin, i) => ({
    range: `${bin}-${bin+9}`,
    count: distribution[i],
  }));

  // Pagination
  const totalPages = Math.ceil(filteredScans.length / itemsPerPage);
  const paginatedScans = filteredScans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Trend data (last 5 scans sorted by date)
  const trendData = [...scans]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-5)
    .map(scan => ({
      date: new Date(scan.createdAt).toLocaleDateString().slice(0, 5),
      score: scan.results.summary.score,
    }));

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loader}>Loading history...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>← Back</button>
        <h1 style={styles.title}>Scan History</h1>
        <div style={styles.headerActions}>
          <button style={styles.exportBtn} onClick={exportToCSV}>📎 Export CSV</button>
          <button style={styles.refreshBtn} onClick={fetchScans}>Refresh</button>
        </div>
      </div>

      {/* Quick Stats Row */}
      {scans.length > 0 && (
        <div style={styles.statsRow}>
          <div style={styles.statBox}><span>Total scans</span><strong>{totalScans}</strong></div>
          <div style={styles.statBox}><span>Avg. score</span><strong>{avgScore}%</strong></div>
          <div style={styles.statBox}><span>Issues found</span><strong>{totalHigh+totalMedium+totalLow}</strong></div>
          <div style={styles.statBoxRed}><span>High</span><strong>{totalHigh}</strong></div>
          <div style={styles.statBoxBlue}><span>Medium</span><strong>{totalMedium}</strong></div>
          <div style={styles.statBoxYellow}><span>Low</span><strong>{totalLow}</strong></div>
        </div>
      )}

      {/* Filters & Tools */}
      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest score</option>
          <option value="lowest">Lowest score</option>
        </select>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={styles.select}>
          <option value="all">All time</option>
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
        </select>
      </div>

      {/* Charts Row (Trend + Distribution) */}
      {scans.length >= 2 && (
        <div style={styles.chartsRow}>
          <div style={styles.chartCard}>
            <p style={styles.chartLabel}>Score trend (last 5 scans)</p>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={trendData}>
                <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.chartCard}>
            <p style={styles.chartLabel}>Score distribution</p>
            <ResponsiveContainer width="100%" height={60}>
              <BarChart data={distData} layout="vertical" barSize={8}>
                <XAxis type="number" hide />
                <YAxis dataKey="range" type="category" hide />
                <Tooltip contentStyle={{ background: "#1e293b", border: "none", fontSize: "10px" }} />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Scan count & results */}
      {scans.length === 0 ? (
        <p style={styles.noScans}>No scans yet. Start a new scan from the dashboard.</p>
      ) : (
        <>
          <p style={styles.sectionLabel}>
            Showing {paginatedScans.length} of {filteredScans.length} scan{filteredScans.length !== 1 ? "s" : ""}
            {filteredScans.length !== scans.length && ` (filtered from ${scans.length} total)`}
          </p>
          <div style={styles.list}>
            {paginatedScans.map((scan) => (
              <div
                key={scan._id}
                style={{
                  ...styles.card,
                  borderLeft: `5px solid ${
                    scan.results.summary.score >= 90
                      ? "#22c55e"
                      : scan.results.summary.score >= 70
                      ? "#eab308"
                      : "#ef4444"
                  }`,
                }}
                onClick={() => navigate(`/report/${scan._id}`)}
              >
                <div style={styles.cardContent}>
                  <div style={styles.leftSide}>
                    <div style={styles.urlRow}>
                      <img src={`https://www.google.com/s2/favicons?domain=${scan.url}`} alt="" style={styles.favicon} />
                      <h3 style={styles.url}>{scan.url}</h3>
                    </div>
                    <div style={styles.divider}></div>
                    <p style={styles.date}>{new Date(scan.createdAt).toLocaleString()}</p>
                  </div>
                  <div style={styles.rightSide}>
                    <div style={styles.scoreWrapper}>
                      <span
                        style={{
                          ...styles.score,
                          color:
                            scan.results.summary.score >= 90
                              ? "#22c55e"
                              : scan.results.summary.score >= 70
                              ? "#eab308"
                              : "#ef4444",
                        }}
                      >
                        {scan.results.summary.score}
                      </span>
                      <p style={styles.scoreLabel}>
                        {scan.results.summary.score >= 90
                          ? "Excellent"
                          : scan.results.summary.score >= 70
                          ? "Average"
                          : "Poor"}
                      </p>
                    </div>
                    <button style={styles.deleteBtn} onClick={(e) => handleDelete(scan._id, e)} title="Delete scan">🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p-1)} style={styles.pageBtn}>← Prev</button>
              <span style={styles.pageInfo}>{currentPage} / {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p+1)} style={styles.pageBtn}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#fff",
    padding: "20px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  loader: { textAlign: "center", padding: "50px", color: "#94a3b8" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  headerActions: { display: "flex", gap: "10px" },
  title: { fontSize: "28px", fontWeight: "bold", margin: 0 },
  backBtn: {
    background: "#1e293b",
    color: "#fff",
    border: "1px solid #334155",
    padding: "8px 14px",
    borderRadius: "30px",
    cursor: "pointer",
  },
  refreshBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "30px",
    cursor: "pointer",
  },
  exportBtn: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "30px",
    cursor: "pointer",
  },
  statsRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  statBox: {
    background: "#1e293b",
    padding: "6px 12px",
    borderRadius: "40px",
    display: "flex",
    gap: "8px",
    alignItems: "baseline",
    fontSize: "0.8rem",
  },
  statBoxRed: {
    background: "#7f1d1d",
    padding: "6px 12px",
    borderRadius: "40px",
    display: "flex",
    gap: "8px",
    fontSize: "0.8rem",
  },
  statBoxBlue: { background: "#1e3a8a", padding: "6px 12px", borderRadius: "40px", display: "flex", gap: "8px", fontSize: "0.8rem" },
  statBoxYellow: { background: "#854d0e", padding: "6px 12px", borderRadius: "40px", display: "flex", gap: "8px", fontSize: "0.8rem" },
  toolbar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchInput: {
    flex: 2,
    minWidth: "180px",
    padding: "8px 14px",
    borderRadius: "30px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#fff",
    fontSize: "0.85rem",
    outline: "none",
  },
  select: {
    padding: "8px 14px",
    borderRadius: "30px",
    background: "#1e293b",
    border: "1px solid #334155",
    color: "#fff",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px",
  },
  chartCard: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: "14px",
    padding: "8px 12px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  chartLabel: { fontSize: "0.65rem", color: "#94a3b8", marginBottom: "4px" },
  noScans: { textAlign: "center", marginTop: "50px", color: "#94a3b8" },
  sectionLabel: { color: "#94a3b8", fontSize: "0.8rem", marginBottom: "10px" },
  list: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" },
  card: {
    background: "#1e293b",
    padding: "14px",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  cardContent: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  leftSide: { flex: 1 },
  urlRow: { display: "flex", alignItems: "center", gap: "8px" },
  favicon: { width: "18px", height: "18px" },
  url: { fontSize: "14px", fontWeight: "600", margin: 0, wordBreak: "break-all" },
  divider: { height: "1px", background: "#334155", margin: "8px 0" },
  date: { fontSize: "11px", color: "#94a3b8" },
  rightSide: { display: "flex", alignItems: "center", gap: "12px" },
  scoreWrapper: { background: "#0f172a", padding: "6px 12px", borderRadius: "10px", textAlign: "center", minWidth: "70px" },
  score: { fontSize: "18px", fontWeight: "bold" },
  scoreLabel: { fontSize: "10px", color: "#94a3b8", marginTop: "2px" },
  deleteBtn: { background: "rgba(239,68,68,0.2)", border: "none", borderRadius: "30px", padding: "6px 10px", cursor: "pointer", fontSize: "14px" },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "24px",
  },
  pageBtn: {
    background: "#1e293b",
    border: "1px solid #334155",
    padding: "6px 14px",
    borderRadius: "30px",
    color: "#fff",
    cursor: "pointer",
  },
  pageInfo: { fontSize: "0.85rem", color: "#94a3b8" },
};

export default History;