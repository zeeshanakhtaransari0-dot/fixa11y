import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();


  // Original states
  const [stats, setStats] = useState({
    total: 0,
    score: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  const [issues, setIssues] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [lastScanDate, setLastScanDate] = useState("");
  const [recentScans, setRecentScans] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [wcagFilter, setWcagFilter] = useState("all");

  // Team & collaboration states (missing)
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [issueAssignees, setIssueAssignees] = useState({});
  const [issueComments, setIssueComments] = useState({});
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [previousScans, setPreviousScans] = useState([]);
  const teamMembers = ["Unassigned", "Zeeshan", "Amit", "Priya", "Raj"];

  // Helper functions (missing)
  const estimateFixTime = (issue) => {
    const text = (issue.issue + " " + (issue.description || "")).toLowerCase();
    if (text.includes("alt") || text.includes("lang")) return 2;
    if (text.includes("label") || text.includes("aria")) return 5;
    if (text.includes("contrast") || text.includes("focus")) return 10;
    if (text.includes("landmark") || text.includes("heading")) return 8;
    return 15;
  };

  const isAutoFixable = (issue) => {
    const text = (issue.issue + " " + (issue.description || "")).toLowerCase();
    return text.includes("alt") || text.includes("lang") || text.includes("duplicate id");
  };

  const getIssueAge = (issue) => {
    if (!previousScans.length) return "New";
    const existsInPrev = previousScans.some(scan =>
      scan.results?.issues?.some(prevIssue => prevIssue.issue === issue.issue)
    );
    return existsInPrev ? "Recurring" : "New";
  };

  const handleAssign = (issueId, assignee) => {
    const newAssignees = { ...issueAssignees, [issueId]: assignee };
    setIssueAssignees(newAssignees);
    localStorage.setItem("fixa11y_assignees", JSON.stringify(newAssignees));
  };

  const handleAddComment = (issueId, comment) => {
    const existing = issueComments[issueId] || [];
    const newComments = { ...issueComments, [issueId]: [...existing, { text: comment, date: new Date().toISOString() }] };
    setIssueComments(newComments);
    localStorage.setItem("fixa11y_comments", JSON.stringify(newComments));
    setActiveCommentId(null);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    let start = 0;
    const end = stats.score;
    if (start === end) return;
    let duration = 1000;
    let incrementTime = 20;
    let timer = setInterval(() => {
      start += Math.ceil(end / (duration / incrementTime));
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setAnimatedScore(start);
    }, incrementTime);
  }, [stats.score]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/scan", {
        headers: { Authorization: token },
      });
      const scans = res.data.scans;
      if (!scans || scans.length === 0) return;

      const last = scans[0];
      setStats({
        total: scans.length,
        score: last.results.summary.score,
        high: last.results.summary.high,
        medium: last.results.summary.medium,
        low: last.results.summary.low,
      });
      setLastScanDate(new Date(last.createdAt).toLocaleDateString());
      setIssues(last.results.issues);
      
      let elements = 0;
      last.results.issues.forEach(issue => {
        elements += (issue.nodes || []).length;
      });
      setTotalElements(elements);

      setChartData([
        { name: "High", value: last.results.summary.high, color: "#ef4444" },
        { name: "Medium", value: last.results.summary.medium, color: "#f59e0b" },
        { name: "Low", value: last.results.summary.low, color: "#22c55e" },
      ]);

      const trend = scans.slice(0, 5).map((scan, index) => ({
        name: `Scan ${scans.length - index}`,
        score: scan.results.summary.score,
      }));
      setTrendData(trend.reverse());

      setRecentScans(scans.slice(0, 3));
      setPreviousScans(scans.slice(1, 3)); // for issue age

      // Load saved assignees/comments
      const savedAssignees = localStorage.getItem("fixa11y_assignees");
      if (savedAssignees) setIssueAssignees(JSON.parse(savedAssignees));
      const savedComments = localStorage.getItem("fixa11y_comments");
      if (savedComments) setIssueComments(JSON.parse(savedComments));

    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const getRecommendation = () => {
    if (stats.high > 5) return "🔴 Fix high-severity issues first to improve score quickly.";
    if (stats.medium > 10) return "🟠 Medium issues are holding you back. Address them for a better rating.";
    if (stats.low > 15) return "🟢 Low issues are easy wins. Fix them to reach compliance.";
    if (stats.score < 70) return "📉 Your score is below average. Run a full audit and tackle critical issues.";
    if (stats.score >= 85) return "🎉 Great! Maintain this by running weekly scans.";
    return "💡 Run a new scan to track your progress over time.";
  };

  const filteredIssues = issues
    .filter((i) => i.issue.toLowerCase().includes(search.toLowerCase()))
    .filter((i) => (filter === "all" ? true : i.severity === filter))
    .filter((i) => {
      if (wcagFilter === "all") return true;
      return i.wcag?.startsWith(wcagFilter) || false;
    })
    .filter((i) => {
      if (assigneeFilter === "all") return true;
      return (issueAssignees[i.id || i.issue] || "Unassigned") === assigneeFilter;
    });

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        {/* Header */}
       <div style={styles.header}>
  <div>
    <h1
      style={{ ...styles.title, cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      FixA11y Dashboard
    </h1>
    <p style={styles.subHeader}>
      Last scan: {lastScanDate || "—"}
    </p>
  </div>

  {/* RIGHT SIDE */}
  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    
    <button
      onClick={() => navigate("/")}
      style={{
        padding: "6px 14px",
        borderRadius: "20px",
        background: "#3b82f6",
        color: "#fff",
        border: "none",
        fontSize: "0.75rem",
        cursor: "pointer"
      }}
    >
      Home
    </button>

    <span style={styles.badgeLive}>Live</span>
  </div>
</div>

        {/* Stats Row with colors */}
        <div style={styles.statsRow}>
          <div style={{ ...styles.statCard, background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))", borderLeft: "3px solid #3b82f6" }}>
            <p style={styles.statLabel}>Total Scans</p>
            <p style={{ ...styles.statValue, color: "#60a5fa" }}>{stats.total}</p>
          </div>
          <div style={{ ...styles.statCard, background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))", borderLeft: "3px solid #22c55e" }}>
            <p style={styles.statLabel}>Last Score</p>
            <p style={{ ...styles.statValue, color: "#4ade80" }}>{stats.score}%</p>
          </div>
          <div style={{ ...styles.statCard, background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))", borderLeft: "3px solid #ef4444" }}>
            <p style={styles.statLabel}>Critical</p>
            <p style={{ ...styles.statValue, color: "#f87171" }}>{stats.high}</p>
          </div>
          <div style={{ ...styles.statCard, background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))", borderLeft: "3px solid #f59e0b" }}>
            <p style={styles.statLabel}>Medium</p>
            <p style={{ ...styles.statValue, color: "#fbbf24" }}>{stats.medium}</p>
          </div>
          <div style={{ ...styles.statCard, background: "linear-gradient(135deg, rgba(132,204,22,0.15), rgba(132,204,22,0.05))", borderLeft: "3px solid #a3e635" }}>
            <p style={styles.statLabel}>Low</p>
            <p style={{ ...styles.statValue, color: "#bef264" }}>{stats.low}</p>
          </div>
          <div style={{ ...styles.statCard, background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))", borderLeft: "3px solid #a855f7" }}>
            <p style={styles.statLabel}>Elements</p>
            <p style={{ ...styles.statValue, color: "#c084fc" }}>{totalElements}</p>
          </div>
        </div>

        {/* Score + Actions + Recommendation */}
        <div style={styles.scoreActionRow}>
          <div style={styles.scoreCompact}>
            <div style={styles.scoreRingSmall}>
              <span style={styles.scoreRingText}>{animatedScore}%</span>
            </div>
            <div>
              <p style={styles.scoreLabel}>Accessibility Score</p>
              <p style={styles.scoreLevel}>Level {stats.score > 80 ? "AA" : "A"}</p>
              <div style={styles.progressBarSmall}>
                <div style={{ ...styles.progressFillSmall, width: `${animatedScore}%` }} />
              </div>
            </div>
          </div>
          <div style={styles.actionButtons}>
            <button style={styles.primaryBtn} onClick={() => navigate("/scan")}>New Scan</button>
            <button style={styles.secondaryBtn} onClick={() => navigate("/history")}>History</button>
          </div>
          <div style={styles.recommendCard}>
            <p style={styles.recommendText}>{getRecommendation()}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div style={styles.chartsRow}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Issues by Severity (Bar)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={35}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: "8px" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Distribution (Pie)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                  {chartData.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Score Trend (Target 85%)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="goal" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <p style={styles.chartNote}>Dashed line: goal (85%)</p>
          </div>
        </div>

        {/* Recent Scans */}
        <div style={styles.recentSection}>
          <h3 style={styles.recentTitle}>Recent Scans</h3>
          <div style={styles.recentList}>
            {recentScans.map((scan, idx) => (
              <div key={idx} style={styles.recentItem} onClick={() => navigate(`/report/${scan._id}`)}>
                <span style={styles.recentUrl}>{scan.url.length > 40 ? scan.url.substring(0, 40) + "…" : scan.url}</span>
                <span style={{ ...styles.recentScore, color: scan.results.summary.score >= 80 ? "#22c55e" : "#f59e0b" }}>
                  {scan.results.summary.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Issues Table - Enhanced */}
        <div style={styles.tableSection}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>All Issues</h3>
            <div style={styles.controls}>
              <input placeholder="Search issues..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.input} />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.select}>
                <option value="all">Severity: All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select value={wcagFilter} onChange={(e) => setWcagFilter(e.target.value)} style={styles.select}>
                <option value="all">WCAG: All</option>
                <option value="A">Level A</option>
                <option value="AA">Level AA</option>
              </select>
              <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)} style={styles.select}>
                <option value="all">Assignee: All</option>
                {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Issue</th>
                  <th style={styles.th}>Severity</th>
                  <th style={styles.th}>WCAG</th>
                  <th style={styles.th}>⏱️ Fix</th>
                  <th style={styles.th}>🔄 Age</th>
                  <th style={styles.th}>👤 Assignee</th>
                  <th style={styles.th}>💬 Notes</th>
                  <th style={styles.th}>Fix</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue, idx) => (
                  <tr key={idx} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span>{issue.issue}</span>
                        {isAutoFixable(issue) && <span style={styles.autoFixBadge}>Auto-fix</span>}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: issue.severity === "high" ? "#ef4444" : issue.severity === "medium" ? "#f59e0b" : "#10b981" }}>
                        {issue.severity}
                      </span>
                    </td>
                    <td style={styles.td}>{issue.wcag || "—"}</td>
                    <td style={styles.td}>{estimateFixTime(issue)} min</td>
                    <td style={styles.td}>{getIssueAge(issue)}</td>
                    <td style={styles.td}>
                      <select value={issueAssignees[issue.id || issue.issue] || "Unassigned"} onChange={(e) => handleAssign(issue.id || issue.issue, e.target.value)} style={styles.assignSelect}>
                        {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.commentBtn} onClick={() => setActiveCommentId(activeCommentId === `comment-${idx}` ? null : `comment-${idx}`)}>💬</button>
                      {activeCommentId === `comment-${idx}` && (
                        <div style={styles.commentBox}>
                          {issueComments[issue.id || issue.issue]?.map((c, i) => (
                            <div key={i} style={styles.commentItem}>
                              <small>{new Date(c.date).toLocaleString()}</small>
                              <p style={styles.commentText}>{c.text}</p>
                            </div>
                          ))}
                          <form onSubmit={(e) => { e.preventDefault(); const input = e.target.comment.value; if (input) handleAddComment(issue.id || issue.issue, input); e.target.reset(); }}>
                            <input name="comment" placeholder="Add note..." style={styles.commentInput} />
                            <button type="submit" style={styles.submitBtn}>Add</button>
                          </form>
                        </div>
                      )}
                    </td>
                    <td style={styles.td}>
                      <a href={issue.helpUrl} target="_blank" rel="noopener noreferrer" style={styles.fixBtn}>Fix →</a>
                    </td>
                  </tr>
                ))}
                {filteredIssues.length === 0 && (
                  <tr><td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No issues match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#0f172a", minHeight: "100vh", color: "#f1f5f9", fontFamily: "'Inter', system-ui, sans-serif" },
  container: { maxWidth: "1400px", margin: "0 auto", padding: "20px 24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", borderBottom: "1px solid #1e293b", paddingBottom: "16px" },
  title: { fontSize: "1.8rem", fontWeight: "700", margin: 0, background: "linear-gradient(135deg, #fff, #60a5fa)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" },
  subHeader: { fontSize: "0.8rem", color: "#64748b", marginTop: "4px" },
  badgeLive: { background: "#22c55e", padding: "4px 12px", borderRadius: "30px", fontSize: "0.7rem", fontWeight: "600" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "12px", marginBottom: "24px" },
  statCard: { padding: "10px 6px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" },
  statLabel: { fontSize: "0.65rem", textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.5px", marginBottom: "4px" },
  statValue: { fontSize: "1.5rem", fontWeight: "700", margin: 0, lineHeight: 1 },
  scoreActionRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "28px", flexWrap: "wrap" },
  scoreCompact: { display: "flex", alignItems: "center", gap: "16px", background: "rgba(255,255,255,0.03)", padding: "10px 18px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)", flex: 2 },
  scoreRingSmall: { width: "60px", height: "60px", borderRadius: "50%", background: `conic-gradient(#3b82f6 0%, #1e293b 0%)`, display: "flex", alignItems: "center", justifyContent: "center" },
  scoreRingText: { fontSize: "1rem", fontWeight: "800", color: "#fff" },
  scoreLabel: { fontSize: "0.75rem", color: "#94a3b8", marginBottom: "2px" },
  scoreLevel: { fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" },
  progressBarSmall: { width: "100px", height: "4px", background: "#1e293b", borderRadius: "4px", overflow: "hidden" },
  progressFillSmall: { height: "100%", background: "linear-gradient(90deg, #3b82f6, #22c55e)", borderRadius: "4px" },
  actionButtons: { display: "flex", gap: "10px" },
  primaryBtn: { padding: "8px 16px", borderRadius: "30px", border: "none", background: "#3b82f6", color: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "0.8rem" },
  secondaryBtn: { padding: "8px 16px", borderRadius: "30px", border: "1px solid #334155", background: "transparent", color: "#cbd5f5", fontWeight: "600", cursor: "pointer", fontSize: "0.8rem" },
  recommendCard: { background: "rgba(59,130,246,0.1)", padding: "10px 16px", borderRadius: "20px", borderLeft: "3px solid #3b82f6", flex: 1 },
  recommendText: { fontSize: "0.8rem", margin: 0, color: "#cbd5f5" },
  chartsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "28px" },
  chartCard: { background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "14px", border: "1px solid rgba(255,255,255,0.05)" },
  chartTitle: { fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px", color: "#cbd5f5" },
  chartNote: { fontSize: "0.7rem", color: "#64748b", marginTop: "6px", textAlign: "center" },
  recentSection: { marginBottom: "28px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "14px", border: "1px solid rgba(255,255,255,0.05)" },
  recentTitle: { fontSize: "0.9rem", fontWeight: "600", marginBottom: "10px", color: "#cbd5f5" },
  recentList: { display: "flex", flexDirection: "column", gap: "8px" },
  recentItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", cursor: "pointer", transition: "background 0.2s" },
  recentUrl: { fontSize: "0.8rem", color: "#e2e8f0" },
  recentScore: { fontSize: "0.9rem", fontWeight: "700" },
  tableSection: { background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" },
  tableHeader: { padding: "12px 16px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" },
  tableTitle: { fontSize: "0.95rem", fontWeight: "600", margin: 0 },
  controls: { display: "flex", gap: "8px" },
  input: { padding: "5px 10px", borderRadius: "30px", border: "1px solid #334155", background: "#1e293b", color: "#fff", fontSize: "0.75rem", width: "150px" },
  select: { padding: "5px 10px", borderRadius: "30px", background: "#1e293b", color: "#fff", border: "1px solid #334155", fontSize: "0.75rem" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: "0.7rem", fontWeight: "600", color: "#94a3b8", borderBottom: "1px solid #1e293b" },
  td: { padding: "10px 12px", fontSize: "0.8rem", borderBottom: "1px solid #1e293b", color: "#e2e8f0" },
  badge: { padding: "2px 8px", borderRadius: "30px", color: "#fff", fontSize: "0.65rem", fontWeight: "600", textTransform: "capitalize", display: "inline-block" },
  fixBtn: { color: "#22c55e", textDecoration: "none", fontSize: "0.75rem", fontWeight: "500" },
  tableRow: { transition: "background 0.15s" },
  autoFixBadge: { background: "#22c55e", padding: "2px 8px", borderRadius: "20px", fontSize: "0.65rem", fontWeight: "600", color: "#fff", whiteSpace: "nowrap" },
  commentItem: { borderBottom: "1px solid #334155", marginBottom: "8px", paddingBottom: "6px" },
  assignSelect: { background: "#1e293b", color: "#fff", border: "1px solid #334155", borderRadius: "6px", padding: "4px 8px", fontSize: "0.7rem", cursor: "pointer" },
  commentBtn: { background: "transparent", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: "1rem", padding: "4px 8px", borderRadius: "6px", transition: "background 0.2s" },
  commentBox: { position: "absolute", background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "12px", marginTop: "8px", zIndex: 100, width: "260px", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" },
  commentInput: { width: "100%", padding: "6px 10px", borderRadius: "20px", border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: "0.75rem", marginTop: "6px", outline: "none" },
  submitBtn: { marginTop: "6px", background: "#3b82f6", border: "none", borderRadius: "20px", color: "#fff", padding: "4px 12px", fontSize: "0.7rem", cursor: "pointer", width: "100%" },
};

export default Dashboard;