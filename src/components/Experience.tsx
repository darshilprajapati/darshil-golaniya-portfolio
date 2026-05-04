import { motion } from "framer-motion";
import { experience } from "../data/portfolioData";

const Experience = () => {
  return (
    <section
      id="experience"
      style={{
        padding: "100px 2rem",
        maxWidth: "1100px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: "60px" }}>
        <span className="section-label">Experience</span>
        <h2 className="section-title gradient-text">
          Professional Journey
        </h2>
        <div className="section-divider" />
      </div>

      {/* Timeline Wrapper */}
      <div style={{ position: "relative", paddingLeft: "60px" }}>
        {/* Vertical Line */}
        <div className="timeline-line" />

        {experience.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              position: "relative",
              marginBottom: "50px",
            }}
          >
            {/* Dot */}
            <div
              className="timeline-dot"
              style={{
                borderColor: exp.color,
                boxShadow: `0 0 12px ${exp.color}`,
              }}
            />

            {/* Card */}
            <motion.div
              className="glass-card"
              whileHover={{ translateY: -6 }}
              style={{
                padding: "24px",
                marginLeft: "20px",
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: "12px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                    marginBottom: "4px",
                  }}
                >
                  {exp.role}
                </h3>

                <span
                  style={{
                    color: exp.color,
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {exp.company}
                </span>
              </div>

              {/* Meta Info */}
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginBottom: "14px",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.05em",
                }}
              >
                {exp.period} • {exp.location}
              </div>

              {/* Points */}
              <ul
                style={{
                  paddingLeft: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              >
                {exp.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;