import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
 
const handleSignup = async () => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
      name,
      email,
      password,
    });

    alert("Signup successful");

    navigate("/login"); // redirect after signup

  } catch (err) {
    alert(err.response?.data?.message || "Signup failed");
  }
};
  return (
  <div style={styles.page}>

  {/* LEFT (IMAGE) ✅ */}
  <div style={styles.right}>
    <img
      src="/abcd.jpg"
      alt="Accessibility"
      style={styles.image}
    />
  </div>

  {/* RIGHT (FORM) ✅ */}
  <div style={styles.left}>
    <div style={styles.loginBox}>
      <h2 style={styles.heading}>Create Account</h2>
      <p style={styles.subText}>Start your accessibility journey</p>

      <input
        type="text"
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        style={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        style={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={styles.button} onClick={handleSignup}>
        Signup
      </button>

      <div style={styles.footer}>
        <p>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        <p style={styles.smallText}>
          Secure accessibility testing platform
        </p>
      </div>
    </div>
  </div>

</div>
);
}
const styles = {
page: {
  display: "flex",
  height: "100vh",
  background: "#0f172a",
  gap: "20px", // 👈 more gap now
  padding: "20px", // 👈 VERY IMPORTANT
},
  left: {
 width: "50%",
  height: "100%",
  overflow: "hidden",
  borderRadius: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "radial-gradient(circle at top left, #1e3a8a, #0f172a)",
},

right: {
  width: "50%",
  height: "100%",
  overflow: "hidden",
  borderRadius: "30px", // 👈 ALL SIDES
},
image: {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "30px", // 👈 match container
},
 loginBox: {
  background: "rgba(30, 41, 59, 0.9)",
  padding: "35px",
  borderRadius: "20px",
  width: "340px",
  textAlign: "center",
  backdropFilter: "blur(10px)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
},

  heading: {
    fontSize: "24px",
    marginBottom: "5px",
    color: "#fff",
  },

  subText: {
    fontSize: "13px",
    color: "#94a3b8",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #334155",
    outline: "none",
    background: "#1e293b",
    color: "#fff",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
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

export default Signup;