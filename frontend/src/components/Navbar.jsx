import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.nav}>

        {/* 🔵 LEFT LOGO */}
        <div style={styles.logoContainer}>
          <div style={styles.logoCircle}>♿</div>

          <div>
            <h2 style={styles.logoText}>FixA11y</h2>
            <p style={styles.subtitle}>Accessibility Made Simple ✨</p>
          </div>
        </div>

        {/* 🔘 RIGHT MENU */}
        <div style={styles.menu}>
          <button
            style={styles.activeBtn}
            onClick={() => navigate("/dashboard")}
          >
            🏠 Dashboard
          </button>

          <button
            style={styles.glassBtn}
            onClick={() => navigate("/history")}
          >
            🔍 Scans
          </button>

          <button
            style={styles.logoutBtn}
            onClick={logout}
          >
            🚪 Logout
          </button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "15px",
    background: "#0f172a",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    background: "linear-gradient(135deg, #020617, #0f172a)",
    borderRadius: "20px",
    padding: "15px 25px",

    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    border: "1px solid #1e293b",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logoCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "#fff",
    boxShadow: "0 0 15px rgba(59,130,246,0.6)",
  },

  logoText: {
    margin: 0,
    color: "#fff",
    fontWeight: "600",
  },

  subtitle: {
    margin: 0,
    fontSize: "12px",
    color: "#94a3b8",
  },

  menu: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  activeBtn: {
    padding: "10px 18px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "500",
    boxShadow: "0 0 15px rgba(59,130,246,0.5)",
  },

  glassBtn: {
    padding: "10px 18px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "rgba(255,255,255,0.05)",
    color: "#cbd5f5",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
  },

  logoutBtn: {
    padding: "10px 18px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #ef4444, #f43f5e)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 0 12px rgba(239,68,68,0.6)",
  },
};

export default Navbar;