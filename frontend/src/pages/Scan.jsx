import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Scan() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);
  const [scanId, setScanId] = useState(null);
  const [progress, setProgress] = useState(0);
  

  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("lastScan");
    if (saved) {
      const data = JSON.parse(saved);
      setResult(data.result);
      setScanId(data.scanId);
      setDone(true);
    }
  }, []);

  const handleScan = async () => {
    if (!url) return;

    setLoading(true);
    setDone(false);
    setLogs(["Initializing scan..."]);
    setProgress(0);

    const steps = [
      "Connecting to website...",
      "Analyzing accessibility...",
      "Checking contrast & ARIA...",
      "Generating report...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setLogs((prev) => [...prev, steps[i]]);
        setProgress((prev) => prev + 20);
        i++;
      }
    }, 800);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/scan`,
        { url },
        { headers: { Authorization: token } }
      );

      clearInterval(interval);

      const scan = res.data.scan;
      const realResult = {
        score: scan.results.summary.score,
        issues:
          scan.results.summary.high +
          scan.results.summary.medium +
          scan.results.summary.low,
      };

      setResult(realResult);
      localStorage.setItem(
        "lastScan",
        JSON.stringify({
          result: realResult,
          scanId: scan._id,
        })
      );
      setLogs((prev) => [...prev, "Scan completed successfully ✅"]);
      setProgress(100);
      setScanId(scan._id);
      setDone(true);
      setLoading(false);
    } catch (err) {
      clearInterval(interval);
      setLogs((prev) => [...prev, "Error during scan ❌"]);
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: "20px",
    },
    inputRow: {
      display: "flex",
      gap: "12px",
      marginTop: "20px",
      alignItems: "center",
    },
    input: {
      padding: "14px 16px",
      width: "100%",
      borderRadius: "12px",
      border: "1px solid #334155",
      background: "linear-gradient(145deg, #01060b, #10275c)",
      color: "#fff",
      outline: "none",
      fontSize: "14px",
    },
    scanBtn: {
      height: "48px",
      padding: "0 20px",
      background: "#3b82f6",
      border: "none",
      borderRadius: "12px",
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap",
    },
    topBar: {
      display: "flex",
      justifyContent: "flex-start",
    },
    backBtn: {
      padding: "8px 14px",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid #334155",
      borderRadius: "8px",
      color: "#cbd5f5",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    logBox: {
      marginTop: "30px",
      background: "rgba(255,255,255,0.05)",
      padding: "20px",
      borderRadius: "12px",
      maxWidth: "600px",
      marginInline: "auto",
      textAlign: "left",
    },
    logItem: {
      fontSize: "14px",
      color: "#cbd5f5",
      marginBottom: "6px",
    },
    progressWrapper: {
      marginTop: "25px",
      textAlign: "center",
    },
    progressBar: {
      width: "100%",
      maxWidth: "400px",
      height: "10px",
      background: "#1e293b",
      borderRadius: "10px",
      margin: "auto",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #3b82f6, #22c55e)",
      boxShadow: "0 0 10px rgba(34,197,94,0.6)",
      borderRadius: "10px",
      transition: "width 0.4s ease",
    },
    progressText: {
      marginTop: "8px",
      fontSize: "13px",
      color: "#94a3b8",
    },
    resultBox: {
      marginTop: "30px",
      textAlign: "center",
    },
    completeBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      marginTop: "30px",
    },
    tick: {
      background: "#22c55e",
      color: "#fff",
      padding: "6px 10px",
      borderRadius: "6px",
      fontWeight: "bold",
    },
    resultActions: {
      display: "flex",
      gap: "20px",
      justifyContent: "center",
      marginTop: "20px",
      flexWrap: "wrap",
    },
    primaryBtn: {
      padding: "12px 22px",
      background: "linear-gradient(90deg, #22c55e, #16a34a)",
      border: "none",
      borderRadius: "10px",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
    },
    secondaryBtn: {
      padding: "12px 22px",
      background: "#1e293b",
      border: "1px solid #334155",
      borderRadius: "10px",
      color: "#cbd5f5",
      cursor: "pointer",
    },
    summaryCard: {
      marginTop: "30px",
      padding: "30px",
      borderRadius: "18px",
      background: "linear-gradient(145deg, #1e293b, #0f172a)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      maxWidth: "900px",
      marginInline: "auto",
    },
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "30px",
      marginTop: "25px",
      textAlign: "center",
    },
    summaryItem: {
      padding: "20px",
      borderRadius: "14px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      transition: "all 0.3s ease",
    },
    summaryLabel: {
      fontSize: "13px",
      color: "#94a3b8",
      letterSpacing: "0.5px",
    },
    scoreValue: {
      fontSize: "32px",
      fontWeight: "bold",
      marginTop: "10px",
      color: "#3b82f6",
    },
    issueValue: {
      fontSize: "28px",
      fontWeight: "bold",
      marginTop: "10px",
      color: "#f59e0b",
    },
    statusValue: {
      fontSize: "24px",
      fontWeight: "bold",
      marginTop: "10px",
      color: "#22c55e",
    },
    subText: {
      fontSize: "12px",
      color: "#94a3b8",
      marginTop: "5px",
    },
    progressMini: {
      marginTop: "10px",
      height: "6px",
      background: "#1e293b",
      borderRadius: "10px",
      overflow: "hidden",
    },
    progressMiniFill: {
      height: "100%",
      background: "linear-gradient(90deg, #3b82f6, #22c55e)",
    },
    scoreCard: {
      background: "linear-gradient(145deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))",
      border: "1px solid rgba(59,130,246,0.3)",
    },
    issueCard: {
      background: "linear-gradient(145deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
      border: "1px solid rgba(245,158,11,0.3)",
    },
    statusCard: {
      background: "linear-gradient(145deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))",
      border: "1px solid rgba(34,197,94,0.3)",
    },
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "#fff" }}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.topBar}>
          <button
            style={styles.backBtn}
            onClick={() => navigate(-1)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1e293b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
          >
            ← Back
          </button>
        </div>
        <h1>Scan Website</h1>
        <div style={styles.inputRow}>
          <input
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
            onFocus={(e) => {
              e.target.style.border = "1px solid #3b82f6";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid #334155";
            }}
          />
          <button style={styles.scanBtn} onClick={handleScan}>
            {loading ? "Scanning..." : "Start Scan"}
          </button>
        </div>

        {loading && (
          <>
            <div style={styles.progressWrapper}>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${progress}%` }} />
              </div>
              <p style={styles.progressText}>{progress}% Scanning...</p>
            </div>
            <div style={styles.logBox}>
              {logs.map((log, i) => (
                <p key={i} style={styles.logItem}>{log}</p>
              ))}
            </div>
          </>
        )}

        {done && (
          <div>
            <div style={styles.resultBox}>
              <div style={styles.completeBox}>
                <span style={styles.tick}>✔</span>
                <h3 style={{ margin: 0 }}>Scan Complete</h3>
              </div>
              <div style={styles.resultActions}>
                <button
                  style={styles.primaryBtn}
                  onClick={() => navigate(`/report/${scanId}`)}
                >
                  View Full Audit
                </button>
                <button style={styles.secondaryBtn} onClick={() => navigate("/")}>
                  Dashboard
                </button>
                <button style={styles.secondaryBtn} onClick={() => navigate("/history")}>
                  History
                </button>
              </div>
            </div>
            {result && (
              <div style={styles.summaryCard}>
                <h3>Scan Summary</h3>
                <div style={styles.summaryGrid}>
                  <div style={{ ...styles.summaryItem, ...styles.scoreCard }}>
                    <p style={styles.summaryLabel}>Score</p>
                    <p style={styles.scoreValue}>{result.score}%</p>
                    <div style={styles.progressMini}>
                      <div style={{ ...styles.progressMiniFill, width: `${result.score}%` }} />
                    </div>
                  </div>
                  <div style={{ ...styles.summaryItem, ...styles.issueCard }}>
                    <p style={styles.summaryLabel}>Issues Found</p>
                    <p style={styles.issueValue}>{result.issues}</p>
                    <p style={styles.subText}>Needs attention</p>
                  </div>
                  <div style={{ ...styles.summaryItem, ...styles.statusCard }}>
                    <p style={styles.summaryLabel}>Status</p>
                    <p style={styles.statusValue}>Completed</p>
                    <p style={styles.subText}>Scan successful</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Scan;