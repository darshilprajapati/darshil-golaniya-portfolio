import { motion } from "framer-motion";
import { education } from "../data/portfolioData";

const Education = () => {
  return (
    <section
      id="education"
      style={{
        padding: "100px 2rem",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: "60px" }}>
        <span className="section-label">Education</span>
        <h2 className="section-title gradient-text">
          Academic Background
        </h2>
        <div className="section-divider" />
      </div>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gap: "24px",
        }}
      >
        {education.map((edu, index) => (
          <motion.div
            key={index}
            className="glass-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ translateY: -6 }}
            style={{
              padding: "24px",
            }}
          >
            {/* Top Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.2rem",
                }}
              >
                {edu.degree}
              </h3>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                {edu.period}
              </span>
            </div>

            {/* Institution */}
            <p
              style={{
                color: "var(--cyan)",
                fontSize: "0.9rem",
                marginBottom: "6px",
                fontFamily: "var(--font-mono)",
              }}
            >
              {edu.institution}
            </p>

            {/* Location */}
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                marginBottom: "14px",
              }}
            >
              {edu.location}
            </p>

            {/* Courses */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {edu.courses.map((course) => (
                <span key={course} className="skill-tag">
                  {course}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Education;