import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { certifications } from "../data/portfolioData";

const Certifications = () => {
  const [selected, setSelected] = useState<any>(null);

  return (
    <section
      id="certifications"
      style={{
        padding: "100px 2rem",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "60px" }}>
        <span className="section-label">Certifications</span>
        <h2 className="section-title gradient-text">
          Achievements & Certifications
        </h2>
        <div className="section-divider" />
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            className="glass-card"
            onClick={() => setSelected(cert)} // 👈 CLICK
            whileHover={{ translateY: -6 }}
            style={{
              padding: "20px",
              cursor: "pointer",
              borderLeft: `3px solid ${cert.color}`,
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
              {cert.icon}
            </div>

            <h3 style={{ fontFamily: "var(--font-display)" }}>
              {cert.title}
            </h3>

            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {cert.issuer}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 🔥 MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <motion.img
              src={selected.image}
              alt="certificate"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              onClick={(e) => e.stopPropagation()} // prevent closing
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: "12px",
                boxShadow: "0 0 30px rgba(0,212,255,0.4)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certifications;