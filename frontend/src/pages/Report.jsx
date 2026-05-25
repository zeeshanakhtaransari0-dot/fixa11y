import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

function Report() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const violations = scan?.results?.issues || [];

  // Filtering & search
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`http://localhost:5000/api/scan/${id}`, {
        headers: { Authorization: token },
      });
      setScan(res.data.scan);
    } catch (err) {
      alert("Failed to load report");
    }
  };

  // Helper: copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  // CSV export
  const exportToCSV = () => {
    let csvRows = [["Issue", "Severity", "Description", "Element", "Fix"]];
    violations.forEach((issue) => {
      const element = issue.nodes?.length ? issue.nodes[0].html.replace(/<[^>]+>/g, "") : "Not detected";
      let fix = issue.nodes?.[0]?.failureSummary;
      if (!fix) {
        if (issue.help.toLowerCase().includes("image")) fix = "Add alt text";
        else if (issue.help.toLowerCase().includes("landmark")) fix = "Use semantic HTML";
        else fix = "Follow WCAG guidelines";
      }
      csvRows.push([
        `"${issue.help}"`,
        issue.impact || "unknown",
        `"${issue.description}"`,
        `"${element}"`,
        `"${fix}"`,
      ]);
    });
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accessibility_report_${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // PDF export (unchanged from original)
  const handleExport = () => {
    const doc = new jsPDF();
    let y = 15;
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Accessibility Audit Report", 10, y);
    y += 10;
    doc.setDrawColor(200);
    doc.line(10, y, 200, y);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`URL: ${scan?.url}`, 10, y);
    y += 6;
    doc.text(`Score: ${scan?.results?.summary?.score}`, 10, y);
    y += 10;
    doc.setFontSize(14);
    doc.text("Issues Found", 10, y);
    y += 8;
    violations.forEach((issue, index) => {
      if (y > 270) {
        doc.addPage();
        y = 15;
      }
      doc.setFontSize(12);
      doc.setTextColor(220, 38, 38);
      doc.text(`${index + 1}. ${issue.help}`, 10, y);
      y += 6;
      let impact = issue.impact;
      if (!impact) {
        if (issue.help.toLowerCase().includes("image")) impact = "Moderate";
        else if (issue.help.toLowerCase().includes("landmark")) impact = "Serious";
        else impact = "Moderate";
      }
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Impact: ${impact}`, 10, y);
      y += 5;
      const element = issue.nodes?.length
        ? issue.nodes[0].html.replace(/<[^>]+>/g, "")
        : "Not detected";
      let fix = issue.nodes?.[0]?.failureSummary;
      if (!fix) {
        if (issue.help.toLowerCase().includes("image")) fix = "Add meaningful alt text to all <img> elements.";
        else if (issue.help.toLowerCase().includes("landmark")) fix = "Use semantic HTML tags like <main>, <header>, <nav>, <footer>.";
        else fix = "Improve accessibility according to WCAG guidelines.";
      }
      doc.text(`Element: ${element}`, 10, y);
      y += 5;
      doc.text(`Fix: ${fix}`, 10, y);
      y += 8;
    });
    doc.save("Accessibility_Report.pdf");
  };

  if (!scan) return <div style={styles.loader}>Loading report...</div>;

  // Apply filters
  let filteredIssues = [...violations];
  if (severityFilter !== "all") {
    filteredIssues = filteredIssues.filter(i => {
      const level = i.impact?.toLowerCase() || "";
      if (severityFilter === "high") return level.includes("critical") || level.includes("serious") || level.includes("high");
      if (severityFilter === "medium") return level.includes("moderate") || level.includes("medium");
      if (severityFilter === "low") return level.includes("minor") || level.includes("low");
      return true;
    });
  }
  if (searchTerm.trim()) {
    filteredIssues = filteredIssues.filter(i =>
      i.help.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const getSeverityStyle = (impact) => {
    if (!impact) return { borderLeftColor: "#94a3b8", backgroundColor: "rgba(148,163,184,0.06)" };
    const level = impact.toLowerCase();
    if (level === "critical" || level === "serious" || level.includes("high"))
      return { borderLeftColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)" };
    if (level === "moderate" || level.includes("medium"))
      return { borderLeftColor: "#3b82f6", backgroundColor: "rgba(59,130,246,0.1)" };
    if (level === "minor" || level.includes("low"))
      return { borderLeftColor: "#facc15", backgroundColor: "rgba(250,204,21,0.1)" };
    return { borderLeftColor: "#94a3b8", backgroundColor: "rgba(148,163,184,0.06)" };
  };

  // Mini score gauge (circular progress)
  const score = scan.results.summary.score;
  const gaugeRadius = 30;
  const circumference = 2 * Math.PI * gaugeRadius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
          <h1 style={styles.title}>Accessibility Report</h1>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.secondaryBtn} onClick={handleExport}>📄 PDF</button>
          <button style={styles.secondaryBtn} onClick={exportToCSV}>📊 CSV</button>
          <button style={styles.secondaryBtn} onClick={() => navigate("/history")}>History</button>
        </div>
      </div>

      {/* Summary Section with mini gauge */}
      <div style={styles.summary}>
        <div style={styles.summaryTop}>
          <div style={styles.urlBox}>
            <span style={styles.urlLabel}>URL</span>
            <p style={styles.urlText}>{scan.url}</p>
          </div>
          <div style={styles.gaugeBox}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r={gaugeRadius} fill="none" stroke="#1e293b" strokeWidth="6" />
              <circle
                cx="40"
                cy="40"
                r={gaugeRadius}
                fill="none"
                stroke="#22c55e"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
              <text x="40" y="45" textAnchor="middle" fill="#22c55e" fontSize="14" fontWeight="bold">{score}</text>
              <text x="40" y="55" textAnchor="middle" fill="#94a3b8" fontSize="8">score</text>
            </svg>
          </div>
        </div>
        <div style={styles.statsRow}>
          <div style={styles.statCardRed}><span>High</span><strong>{scan.results.summary.high}</strong></div>
          <div style={styles.statCardBlue}><span>Medium</span><strong>{scan.results.summary.medium}</strong></div>
          <div style={styles.statCardYellow}><span>Low</span><strong>{scan.results.summary.low}</strong></div>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} style={styles.filterSelect}>
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <span style={styles.filterCount}>{filteredIssues.length} / {violations.length} issues</span>
      </div>

      {/* Issues Grid */}
      <div style={styles.issuesGrid}>
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue, idx) => {
            const severity = getSeverityStyle(issue.impact);
            return (
              <div
                key={idx}
                style={{
                  ...styles.card,
                  borderLeft: `4px solid ${severity.borderLeftColor}`,
                  backgroundColor: severity.backgroundColor,
                }}
              >
                <div style={styles.cardHeader}>
                  <h4 style={styles.cardTitle}>{issue.help}</h4>
                  <span style={styles.impactBadge(issue.impact)}>{issue.impact || "unknown"}</span>
                </div>
                <p style={styles.cardDesc}>{issue.description}</p>
                {(issue.nodes || []).length > 0 ? (
                  issue.nodes.map((node, i) => (
                    <div key={i} style={styles.solutionBox}>
                      <div style={styles.codeHeader}>
                        <code style={styles.codeBlock}>{node.html}</code>
                        <button
                          style={styles.copyBtn}
                          onClick={() => copyToClipboard(node.html + "\n\nFix: " + (node.failureSummary || "See WCAG guidelines"))}
                        >
                          📋
                        </button>
                      </div>
                      <p style={styles.solutionText}>{node.failureSummary}</p>
                    </div>
                  ))
                ) : (
                  <p style={styles.naText}>No element details</p>
                )}
              </div>
            );
          })
        ) : (
          <div style={styles.emptyState}>No issues match your filters ✅</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e2e8f0",
    padding: "16px 20px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  loader: { textAlign: "center", padding: "40px", color: "#94a3b8" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
  headerRight: { display: "flex", gap: "10px" },
  backBtn: {
    padding: "6px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid #334155",
    borderRadius: "30px",
    color: "#cbd5f5",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  secondaryBtn: {
    padding: "6px 14px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "30px",
    color: "#cbd5f5",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  title: { fontSize: "1.5rem", fontWeight: "600", margin: 0, color: "#f1f5f9" },
  summary: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: "16px",
    padding: "14px 18px",
    marginBottom: "20px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  summaryTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
    flexWrap: "wrap",
    gap: "12px",
  },
  urlBox: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: "12px",
    padding: "6px 12px",
    flex: 1,
  },
  urlLabel: { fontSize: "0.65rem", color: "#94a3b8", display: "block" },
  urlText: { fontSize: "0.8rem", color: "#60a5fa", wordBreak: "break-all", margin: "2px 0 0" },
  gaugeBox: { minWidth: "80px", textAlign: "center" },
  statsRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
  statCardRed: {
    flex: 1,
    background: "#7f1d1d",
    borderRadius: "12px",
    padding: "6px 10px",
    textAlign: "center",
    fontSize: "0.7rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statCardBlue: {
    flex: 1,
    background: "#1e3a8a",
    borderRadius: "12px",
    padding: "6px 10px",
    textAlign: "center",
    fontSize: "0.7rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statCardYellow: {
    flex: 1,
    background: "#854d0e",
    borderRadius: "12px",
    padding: "6px 10px",
    textAlign: "center",
    fontSize: "0.7rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchInput: {
    flex: 2,
    minWidth: "180px",
    padding: "6px 12px",
    borderRadius: "30px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#fff",
    fontSize: "0.8rem",
    outline: "none",
  },
  filterSelect: {
    padding: "6px 12px",
    borderRadius: "30px",
    background: "#1e293b",
    border: "1px solid #334155",
    color: "#fff",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  filterCount: { fontSize: "0.7rem", color: "#94a3b8" },
  issuesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: "14px",
  },
  card: {
    borderRadius: "14px",
    padding: "12px 14px",
    transition: "all 0.1s",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" },
  cardTitle: { fontSize: "0.9rem", fontWeight: "600", margin: 0, color: "#f1f5f9" },
  impactBadge: (impact) => ({
    fontSize: "0.65rem",
    fontWeight: "500",
    padding: "2px 8px",
    borderRadius: "20px",
    background: !impact ? "#334155" :
      impact.toLowerCase().includes("critical") || impact.toLowerCase().includes("serious") ? "#ef4444" :
      impact.toLowerCase().includes("moderate") ? "#3b82f6" :
      impact.toLowerCase().includes("minor") || impact.toLowerCase().includes("low") ? "#facc15" : "#334155",
    color: "#fff",
  }),
  cardDesc: { fontSize: "0.75rem", color: "#cbd5f5", marginBottom: "8px", lineHeight: "1.4" },
  solutionBox: { marginTop: "8px", padding: "8px", background: "rgba(0,0,0,0.3)", borderRadius: "10px" },
  codeHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" },
  codeBlock: {
    flex: 1,
    background: "#020617",
    padding: "6px 8px",
    borderRadius: "8px",
    fontSize: "0.7rem",
    fontFamily: "monospace",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
  },
  copyBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "6px",
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: "0.7rem",
    color: "#cbd5f5",
  },
  solutionText: { fontSize: "0.7rem", color: "#cbd5f5", margin: "6px 0 0" },
  naText: { fontSize: "0.7rem", color: "#64748b", marginTop: "6px" },
  emptyState: { gridColumn: "1 / -1", textAlign: "center", padding: "30px", color: "#64748b" },
};

export default Report;