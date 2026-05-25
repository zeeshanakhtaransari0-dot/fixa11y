import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log(res.data);

      navigate("/dashboard");

      // save token
      localStorage.setItem("token", res.data.token);

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
  <div style={styles.page}>

    {/* LEFT SIDE (LOGIN) */}
    <div style={styles.left}>
      <div style={styles.loginBox}>
        <h2 style={styles.heading}>Welcome Back</h2>
<p style={styles.subText}>Sign in to continue to FixA11y</p>

  <input
  type="email"
  placeholder="Enter your email"
  style={styles.input}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onFocus={(e) => {
    e.target.style.border = "1px solid #3b82f6";
  }}
  onBlur={(e) => {
    e.target.style.border = "1px solid #334155";
  }}
/>

    <input
  type="password"
  placeholder="Password"
  style={styles.input}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  onFocus={(e) => {
    e.target.style.border = "1px solid #3b82f6";
  }}
  onBlur={(e) => {
    e.target.style.border = "1px solid #334155";
  }}
/>
      <button style={styles.button} onClick={handleLogin}>
  Login
</button>
        <div style={styles.footer}>
  <p>
  Don’t have an account?{" "}
  <span
    style={styles.link}
    onClick={() => navigate("/signup")}
  >
    Sign up
  </span>
</p>

  <p style={styles.smallText}>
    Secure accessibility testing platform
  </p>
</div>
      </div>
    </div>

    {/* RIGHT SIDE (IMAGE) */}
    <div style={styles.right}>
     <img
  src="/accessibility.jpg"
  alt="Accessibility"
  style={styles.image}
/>
    </div>

  </div>
);
;
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#0f172a",
  },
  form: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
input: {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "8px",
  border: "1px solid #334155",
  outline: "none",
  background: "#1e293b", // 👈 lighter than before
  color: "#fff",
},
  button: {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "0.2s",
},
  page: {
  display: "flex",
  height: "100vh",
},

left: {
  width: "50%",
  background: "radial-gradient(circle at top left, #1e3a8a, #0f172a)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
},

right: {
  width: "50%",
},

image: {
  width: "100%",
  height: "100%",
  objectFit: "cover",
},

loginBox: {
  background: "rgba(30, 41, 59, 0.8)", // glass effect
  padding: "35px",
  borderRadius: "16px",
  width: "320px",
  textAlign: "center",
  backdropFilter: "blur(10px)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
},

input: {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "6px",
  border: "none",
  outline: "none",
},

button: {
  width: "100%",
  padding: "10px",
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
},
heading: {
  fontSize: "24px",
  marginBottom: "5px",
},

subText: {
  fontSize: "13px",
  color: "#94a3b8",
  marginBottom: "20px",
},
footer: {
  marginTop: "20px",
  fontSize: "13px",
  color: "#94a3b8",
},

link: {
  color: "#3b82f6",
  cursor: "pointer",
  fontWeight: "500",
},

smallText: {
  marginTop: "8px",
  fontSize: "11px",
  color: "#64748b",
},
};

export default Login;