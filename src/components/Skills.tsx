import { motion } from "framer-motion";
import { skills } from "../data/portfolioData";

const Skills = () => {
  return (
    <section
      id="skills"
      style={{
        padding: "100px 2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: "60px" }}>
        <span className="section-label">Skills</span>
        <h2 className="section-title gradient-text">
          Technical Expertise
        </h2>
        <div className="section-divider" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
        }}
      >
        {skills.map((skill, index) => (
          <motion.div
            key={skill.category}
            className="glass-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ translateY: -6 }}
            style={{
              padding: "24px",
            }}
          >
            {/* Category Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{skill.icon}</span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                }}
              >
                {skill.category}
              </h3>
            </div>

            {/* Skill Tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {skill.items.map((item) => (
                <span key={item} className="skill-tag">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;