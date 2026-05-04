import { motion } from "framer-motion";
import { personalInfo } from "../data/portfolioData";

const Contact = () => {
  return (
    <section
      id="contact"
      style={{
        padding: "100px 2rem",
        maxWidth: "1100px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "60px" }}>
        <span className="section-label">Contact</span>
        <h2 className="section-title gradient-text">
          Let’s Work Together
        </h2>
        <div className="section-divider" style={{ margin: "0 auto 40px" }} />
      </div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{
          color: "var(--text-muted)",
          fontSize: "1rem",
          maxWidth: "600px",
          margin: "0 auto 40px",
          lineHeight: 1.8,
        }}
      >
        I’m open to full-time opportunities, internships, and exciting projects.
        If you’re looking for a developer with AI/ML expertise and full-stack
        experience, feel free to connect with me.
      </motion.p>

      {/* Contact Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Email */}
        <a
          href={`mailto:${personalInfo.email}`}
          className="btn-primary"
        >
          Email Me
        </a>

        {/* WhatsApp */}
        <a
          href={personalInfo.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          WhatsApp
        </a>

        {/* LinkedIn */}
        <a
          href={personalInfo.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          LinkedIn
        </a>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "60px",
        }}
      >
        <div className="glass-card" style={{ padding: "20px" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Email
          </p>
          <p style={{ color: "var(--cyan)", fontSize: "0.9rem" }}>
            {personalInfo.email}
          </p>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Phone
          </p>
          <p style={{ color: "var(--cyan)", fontSize: "0.9rem" }}>
            {personalInfo.phone}
          </p>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Location
          </p>
          <p style={{ color: "var(--cyan)", fontSize: "0.9rem" }}>
            Gandhinagar, India
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;