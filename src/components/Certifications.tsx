import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { certifications } from "../data/portfolioData";
import {
  DraggableCardContainer,
  DraggableCardBody,
} from "./ui/draggable-card";
import "./Certifications.css";

interface Certificate {
  title: string;
  issuer: string;
  icon: string;
  color: string;
  image: string;
}

// Initial scattered asymmetric stack positions
const STACK_PRESETS = [
  { initialX: -110, initialY: -45, initialRotate: -7, initialZIndex: 10 },
  { initialX: 95, initialY: -30, initialRotate: 6, initialZIndex: 12 },
  { initialX: -55, initialY: 35, initialRotate: -3, initialZIndex: 14 },
  { initialX: 65, initialY: 55, initialRotate: 8, initialZIndex: 16 },
];

const Certifications = () => {
  const [selected, setSelected] = useState<Certificate | null>(null);

  // Close modal on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
      }
    },
    []
  );

  useEffect(() => {
    if (selected) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected, handleKeyDown]);

  return (
    <section id="certifications" className="certifications-section">
      {/* Header */}
      <div className="certifications-header">
        <span className="section-label">Certifications</span>
        <h2 className="section-title gradient-text">
          Achievements & Certifications
        </h2>
        <div className="section-divider" />
      </div>

      {/* Interactive 3D Draggable Certificate Stack */}
      <DraggableCardContainer className="certifications-stage-wrapper">
        {/* Subtle Ambient Backdrop Watermark */}
        <div className="certifications-backdrop-watermark">
          <span className="certifications-backdrop-text">
            Interactive Stack
          </span>
          <span className="certifications-backdrop-sub">
            Drag cards to explore · Click to inspect
          </span>
        </div>

        {/* Dynamic Draggable Cards Stack */}
        {certifications.map((cert, index) => {
          const layout = STACK_PRESETS[index % STACK_PRESETS.length];
          return (
            <DraggableCardBody
              key={cert.title}
              id={`cert-card-${index}`}
              className="certificate-card-item"
              initialX={layout.initialX}
              initialY={layout.initialY}
              initialRotate={layout.initialRotate}
              initialZIndex={layout.initialZIndex}
              onClick={() => setSelected(cert)}
              ariaLabel={`Certificate: ${cert.title} by ${cert.issuer}. Click to inspect, drag to move.`}
            >
              {/* Top Accent Bar */}
              <div
                className="certificate-card__accent-bar"
                style={{ backgroundColor: cert.color }}
              />

              {/* Certificate Image Thumbnail */}
              <div className="certificate-card__image-wrap">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="certificate-card__image"
                  loading="lazy"
                />
              </div>

              {/* Card Body Information */}
              <div className="certificate-card__body">
                <div className="certificate-card__issuer-row">
                  <span className="certificate-card__issuer-badge">
                    <span className="certificate-card__icon">{cert.icon}</span>
                    <span>{cert.issuer}</span>
                  </span>
                  <span className="certificate-card__tag">Verified</span>
                </div>

                <h3 className="certificate-card__title" title={cert.title}>
                  {cert.title}
                </h3>
              </div>

              {/* Card Bottom Meta */}
              <div className="certificate-card__footer">
                <span>CREDENTIAL</span>
                <span className="certificate-card__view-hint">
                  <span>Enlarge</span>
                  <span>↗</span>
                </span>
              </div>
            </DraggableCardBody>
          );
        })}
      </DraggableCardContainer>

      {/* Certificate Full-Screen / High-Resolution Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="certificate-modal-overlay"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
          >
            <motion.div
              className="certificate-modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="certificate-modal-header">
                <div className="certificate-modal-title-wrap">
                  <h3 className="certificate-modal-title">{selected.title}</h3>
                  <span className="certificate-modal-issuer">
                    {selected.icon} Issued by {selected.issuer}
                  </span>
                </div>
                <button
                  type="button"
                  className="certificate-modal-close-btn"
                  onClick={() => setSelected(null)}
                  aria-label="Close certificate preview"
                  title="Close (Esc)"
                >
                  ✕
                </button>
              </div>

              <div className="certificate-modal-body">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="certificate-modal-image"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certifications;