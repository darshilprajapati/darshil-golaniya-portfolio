import { motion } from "framer-motion";
import { personalInfo } from "../data/portfolioData";

const Footer = () => {
  return (
    <footer
      style={{
        padding: "60px 2rem 30px",
        borderTop: "1px solid var(--border)",
        marginTop: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Name / Logo */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            marginBottom: "12px",
          }}
        >
          <span className="gradient-text">
            {personalInfo.name}
          </span>
        </motion.h3>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            marginBottom: "24px",
          }}
        >
          {personalInfo.tagline}
        </motion.p>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            marginBottom: "30px",
          }}
        >
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon github"
          >
            G
          </a>

          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon linkedin"
          >
            in
          </a>

          <a
            href={`mailto:${personalInfo.email}`}
            className="social-icon email"
          >
            @
          </a>

          <a
            href={personalInfo.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon whatsapp"
          >
            W
          </a>
        </motion.div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.08)",
            margin: "20px auto",
            maxWidth: "300px",
          }}
        />

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            letterSpacing: "0.05em",
          }}
        >
          © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;