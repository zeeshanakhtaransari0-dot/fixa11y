import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LandingPage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.gridBackground}></div>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logoWrap}>
          <img src="/hijk.jpg" alt="FixA11y logo" style={styles.logoImg} />
          <span style={styles.logo}>FixA11y</span>
        </div>
        <div style={styles.navActions}>
          <button style={styles.navBtn} onClick={() => navigate("/login")}>Login</button>
          <button style={styles.primaryBtn} onClick={() => navigate("/signup")}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>✨ WCAG 2.1 AA Compliant</div>
        <h1 style={styles.heroTitle}>
          Make Your Website <span style={styles.gradientText}>Accessible</span> in Minutes
        </h1>
        <p style={styles.heroSubtitle}>
          Scan, detect, and fix accessibility issues instantly — no technical expertise required.
        </p>
        <div style={styles.heroButtons}>
          <button style={styles.primaryLarge} onClick={() => navigate("/signup")}>Start Scanning →</button>
          <button style={styles.secondaryLarge} onClick={() => navigate("/demo")}>Watch Demo</button>
        </div>
        <div style={styles.liveDemo}>
          <input type="text" placeholder="https://example.com" style={styles.demoInput} />
          <button style={styles.demoBtn}>Try now</button>
        </div>
        <div style={styles.trustBar}>
          <div style={styles.trustItem}><span>100+</span><small>Scans Completed</small></div>
          <div style={styles.trustItem}><span>50+</span><small>Issues Detected</small></div>
          <div style={styles.trustItem}><span>99%</span><small>Accuracy</small></div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsGrid}>
          {[
            { step: "01", title: "Enter URL", desc: "Paste your website link to start the scan." },
            { step: "02", title: "Run Scan", desc: "We analyze your site for accessibility issues." },
            { step: "03", title: "Get Report", desc: "View detailed results with fixes and insights." },
          ].map((item, idx) => (
            <div key={idx} style={styles.stepCard}>
              <div style={styles.stepNumber}>{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Powerful Features</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}><div style={styles.featureIcon}>🔍</div><h3>Smart Scanning</h3><p>Deep scan with axe‑core.</p></div>
          <div style={styles.featureCard}><div style={styles.featureIcon}>🛠️</div><h3>Fix Suggestions</h3><p>Actionable steps & code snippets.</p></div>
          <div style={styles.featureCard}><div style={styles.featureIcon}>📊</div><h3>Visual Reports</h3><p>Scores, charts, progress.</p></div>
          <div style={styles.featureCard}><div style={styles.featureIcon}>🤝</div><h3>Team Collaboration</h3><p>Assign issues, comments.</p></div>
          <div style={styles.featureCard}><div style={styles.featureIcon}>📅</div><h3>Scheduled Scans</h3><p>Weekly + email alerts.</p></div>
          <div style={styles.featureCard}><div style={styles.featureIcon}>📎</div><h3>Export Reports</h3><p>PDF / CSV.</p></div>
        </div>
      </section>

      {/* Previews */}
      <section style={styles.previewSection}>
        <div style={styles.previewText}>
          <h2 style={styles.previewHeading}>Built for All Accessibility Needs</h2>
          <p style={styles.previewDescription}>Cognitive, visual, auditory, motor, speech.</p>
        </div>
       
      </section>
      <section style={styles.previewSection}>
        <img src="/efgh.jpg" alt="Report preview" style={styles.previewImage} />
      </section>

      {/* Testimonials */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Loved by Developers</h2>
        <div style={styles.testimonialsGrid}>
          {[
            { quote: "Helped me fix issues in minutes!", name: "Rahul", role: "Developer" },
            { quote: "Clean reports and easy fixes.", name: "Ayesha", role: "Designer" },
            { quote: "Perfect for quick compliance.", name: "Arjun", role: "Owner" },
          ].map((t, i) => (
            <div key={i} style={styles.testimonialCard}>
              <p style={styles.testimonialQuote}>“{t.quote}”</p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.testimonialAvatar}></div>
                <div><strong>{t.name}</strong><br /><span style={styles.testimonialRole}>{t.role}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statBox}><span>15k+</span><p>Websites scanned</p></div>
          <div style={styles.statBox}><span>120k+</span><p>Issues fixed</p></div>
          <div style={styles.statBox}><span>98%</span><p>Satisfaction</p></div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <h2 style={styles.ctaTitle}>Start Improving Accessibility Today</h2>
          <p style={styles.ctaText}>Scan your website in minutes.</p>
          <button style={styles.primaryLarge} onClick={() => navigate("/signup")}>Start Scanning →</button>
        </div>
      </section>

      {/* FAQ */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>FAQs</h2>
        <div style={styles.faqGrid}>
          <div style={styles.faqItem}><h3>Is it free?</h3><p>Basic scanning is free. Premium adds team features.</p></div>
          <div style={styles.faqItem}><h3>How accurate?</h3><p>axe‑core industry standard, WCAG 2.1 AA.</p></div>
          <div style={styles.faqItem}><h3>Need coding?</h3><p>Beginner‑friendly, developers get code fixes.</p></div>
          <div style={styles.faqItem}><h3>Scheduled scans?</h3><p>Yes, weekly scans + email alerts.</p></div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div><h3 style={styles.footerLogo}>FixA11y</h3><p style={styles.footerText}>Accessible web for all.</p></div>
          <div style={styles.footerLinks}>
            <span onClick={() => navigate("/login")}>Login</span>
            <span onClick={() => navigate("/signup")}>Signup</span>
            <span onClick={() => navigate("/dashboard")}>Dashboard</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
          <div style={styles.footerSocial}>
            <span>🐦 Twitter</span>
            <span>💼 LinkedIn</span>
            <span>📧 Contact</span>
          </div>
        </div>
        <div style={styles.footerCopyright}>© 2026 FixA11y.</div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    background: "#eef2f5",
    color: "#2c3e50",
    fontFamily: "'Inter', system-ui, sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  gridBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `
      linear-gradient(#dce5ec 1px, transparent 1px),
      linear-gradient(90deg, #dce5ec 1px, transparent 1px)
    `,
    backgroundSize: "48px 48px",
    opacity: 0.3,
    pointerEvents: "none",
    zIndex: 0,
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 24px",
    background: "rgba(242,246,249,0.9)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid #d4dee5",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logoWrap: { display: "flex", alignItems: "center", gap: "8px" },
  logoImg: { width: "28px", height: "28px", borderRadius: "50%" },
  logo: { fontSize: "1.2rem", fontWeight: "700", background: "linear-gradient(135deg, #2c3e50, #5a6e7c)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" },
  navActions: { display: "flex", gap: "10px" },
  navBtn: { background: "transparent", border: "1px solid #cbd8e4", padding: "5px 14px", borderRadius: "30px", color: "#2c3e50", cursor: "pointer", fontSize: "0.85rem" },
  primaryBtn: { background: "#5a6e7c", border: "none", padding: "5px 16px", borderRadius: "30px", color: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" },
  hero: { textAlign: "center", padding: "32px 20px 24px", position: "relative", zIndex: 2 },
  heroBadge: { display: "inline-block", background: "#e2eaf1", borderRadius: "30px", padding: "2px 10px", fontSize: "0.7rem", marginBottom: "12px", color: "#4a627a" },
  heroTitle: { fontSize: "2.2rem", fontWeight: "800", maxWidth: "700px", margin: "0 auto 8px", lineHeight: "1.2", color: "#1e2f3e" },
  gradientText: { background: "linear-gradient(135deg, #5a6e7c, #7c8f9e)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" },
  heroSubtitle: { fontSize: "0.9rem", color: "#4a627a", maxWidth: "500px", margin: "0 auto 20px" },
  heroButtons: { display: "flex", gap: "12px", justifyContent: "center", marginBottom: "20px" },
  primaryLarge: { background: "#5a6e7c", border: "none", padding: "8px 22px", borderRadius: "30px", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer", color: "#fff" },
  secondaryLarge: { background: "transparent", border: "1px solid #cbd8e4", padding: "8px 22px", borderRadius: "30px", color: "#2c3e50", fontWeight: "500", cursor: "pointer" },
  liveDemo: { display: "flex", justifyContent: "center", gap: "10px", marginBottom: "28px", flexWrap: "wrap" },
  demoInput: { padding: "8px 16px", width: "240px", borderRadius: "30px", border: "1px solid #cbd8e4", fontSize: "0.85rem", background: "#fff" },
  demoBtn: { background: "#8f9eae", border: "none", padding: "8px 20px", borderRadius: "30px", color: "#fff", fontWeight: "500", cursor: "pointer" },
  trustBar: { display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap", padding: "12px", borderTop: "1px solid #d4dee5", borderBottom: "1px solid #d4dee5", maxWidth: "500px", margin: "0 auto" },
  trustItem: { textAlign: "center", '& span': { fontSize: "1.3rem", fontWeight: "700", color: "#5a6e7c", display: "block" }, '& small': { fontSize: "0.65rem", color: "#5f7f9e" } },
  section: { padding: "28px 20px", maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 2 },
  sectionTitle: { fontSize: "1.5rem", fontWeight: "700", textAlign: "center", marginBottom: "24px", color: "#1e2f3e" },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "16px" },
  stepCard: { background: "#f9fbfd", borderRadius: "16px", padding: "14px", textAlign: "center", border: "1px solid #e2eaf0" },
  stepNumber: { width: "30px", height: "30px", background: "#5a6e7c", borderRadius: "30px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontWeight: "bold", color: "#fff", fontSize: "0.8rem" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" },
  featureCard: { background: "#f9fbfd", borderRadius: "14px", padding: "14px", textAlign: "center", border: "1px solid #e2eaf0" },
  featureIcon: { fontSize: "1.5rem", marginBottom: "6px" },
  previewSection: { padding: "20px 20px", textAlign: "center", maxWidth: "700px", margin: "0 auto" },
  previewText: { marginBottom: "12px" },
  previewHeading: { fontSize: "1.3rem", fontWeight: "600", marginBottom: "6px", color: "#1e2f3e" },
  previewDescription: { fontSize: "0.9rem", color: "#4a627a" },
  previewImage: { width: "100%", maxWidth: "550px", borderRadius: "14px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", border: "1px solid #d4dee5" },
  testimonialsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" },
  testimonialCard: { background: "#f9fbfd", borderRadius: "14px", padding: "14px", border: "1px solid #e2eaf0" },
  testimonialQuote: { fontSize: "0.8rem", lineHeight: "1.4", marginBottom: "10px", color: "#3a5670" },
  testimonialAuthor: { display: "flex", alignItems: "center", gap: "8px" },
  testimonialAvatar: { width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #5a6e7c, #7c8f9e)" },
  testimonialRole: { fontSize: "0.65rem", color: "#5f7f9e" },
  statsSection: { padding: "20px 20px", backgroundColor: "#e9f0f5", position: "relative", zIndex: 2 },
  statsGrid: { display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap", maxWidth: "600px", margin: "0 auto" },
  statBox: { textAlign: "center", '& span': { fontSize: "1.6rem", fontWeight: "700", color: "#5a6e7c", display: "block" }, '& p': { margin: "2px 0 0", fontSize: "0.75rem", color: "#4a627a" } },
  ctaSection: { padding: "28px 20px", position: "relative", zIndex: 2 },
  ctaCard: { background: "#e2eaf1", borderRadius: "24px", padding: "24px 20px", textAlign: "center", maxWidth: "550px", margin: "0 auto" },
  ctaTitle: { fontSize: "1.5rem", fontWeight: "700", marginBottom: "8px", color: "#1e2f3e" },
  ctaText: { fontSize: "0.9rem", color: "#4a627a", marginBottom: "20px" },
  faqGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "14px" },
  faqItem: { background: "#f9fbfd", borderRadius: "14px", padding: "12px 16px", border: "1px solid #e2eaf0" },
  footer: { background: "#f4f8fc", padding: "20px 20px 12px", borderTop: "1px solid #d4dee5", position: "relative", zIndex: 2 },
  footerContent: { maxWidth: "900px", margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
  footerLogo: { fontSize: "1rem", color: "#5a6e7c", marginBottom: "2px" },
  footerText: { fontSize: "0.7rem", color: "#5f7f9e", maxWidth: "160px" },
  footerLinks: { display: "flex", gap: "14px", '& span': { cursor: "pointer", fontSize: "0.75rem", color: "#3a5670" } },
  footerSocial: { display: "flex", gap: "12px", '& span': { fontSize: "0.75rem", color: "#5f7f9e", cursor: "pointer" } },
  footerCopyright: { textAlign: "center", paddingTop: "14px", fontSize: "0.65rem", color: "#7c8f9e", borderTop: "1px solid #d4dee5", marginTop: "14px" },
};

export default LandingPage;