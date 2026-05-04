import { motion } from "framer-motion";
import { personalInfo } from "../data/portfolioData";

const About = () => {
  return (
    <section
      id="about"
      style={{
        padding: "100px 2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: "60px" }}>
        <span className="section-label">About Me</span>
        <h2 className="section-title gradient-text">
          Who I Am
        </h2>
        <div className="section-divider" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center",
        }}
      >
        {/* Left Content */}
        <div>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-muted)",
              lineHeight: 1.8,
              marginBottom: "24px",
            }}
          >
            {personalInfo.summary}
          </p>

          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              lineHeight: 1.8,
            }}
          >
            I specialize in building intelligent applications using AI/ML,
            along with modern full-stack technologies like React and .NET.
            My focus is on creating scalable, real-world solutions with clean
            architecture and impactful user experience.
          </p>

          {/* Info Cards */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "32px",
              flexWrap: "wrap",
            }}
          >
            <div className="glass-card" style={{ padding: "16px 20px" }}>
              <span className="gradient-text">AI / ML</span>
            </div>
            <div className="glass-card" style={{ padding: "16px 20px" }}>
              <span className="gradient-text">Full Stack</span>
            </div>
            <div className="glass-card" style={{ padding: "16px 20px" }}>
              <span className="gradient-text">.NET + React</span>
            </div>
          </div>
        </div>

        {/* Right Visual Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          style={{
            padding: "40px",
            borderRadius: "16px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              marginBottom: "20px",
            }}
          >
            Quick Info
          </h3>

          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
            }}
          >
            <li>📍 Bhavnagar, India</li>
            <li>🎓 B.E. Computer Engineering</li>
            <li>💼 Open to Full-Time Opportunities</li>
            <li>⚡AI & full-stack (.NET, React) growth.</li>
          </ul>
        </motion.div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          section#about div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;