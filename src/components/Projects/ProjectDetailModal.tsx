import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiGithub, FiExternalLink } from "react-icons/fi";
import type { Project } from "./types";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  index?: number;
  total?: number;
}

export const ProjectDetailModal = ({
  project,
  onClose,
  index,
  total,
}: ProjectDetailModalProps) => {
  const isOpen = Boolean(project);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  const formattedNum = index !== undefined ? String(index + 1).padStart(2, "0") : "";
  const formattedTotal = total !== undefined ? String(total).padStart(2, "0") : "";

  const modalContent = (
    <div
      className="projects-orbital__modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="orbital-modal-title"
    >
      <div
        className="projects-orbital__modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="projects-orbital__modal-header">
          <div className="projects-orbital__modal-meta">
            {formattedNum && (
              <span className="projects-orbital__mono-badge">
                ORBITAL // {formattedNum} {formattedTotal ? `OF ${formattedTotal}` : ""}
              </span>
            )}
            <span className="projects-orbital__year-badge">{project.year}</span>
            {project.highlight && (
              <span className="highlight-badge">⭐ Featured</span>
            )}
          </div>
          <button
            className="projects-orbital__modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        <h3 id="orbital-modal-title" className="projects-orbital__modal-title">
          {project.title}
        </h3>

        <div className="projects-orbital__modal-scroll">
          <p className="projects-orbital__modal-desc">{project.description}</p>

          <div className="projects-orbital__modal-section">
            <span className="projects-orbital__section-label">TECHNOLOGY STACK</span>
            <div className="projects-orbital__tech-wrap">
              {project.tech.map((t) => (
                <span key={t} className="tech-badge">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {project.note && (
            <div className="projects-orbital__modal-note">
              ⚠️ <strong>Note:</strong> {project.note}
            </div>
          )}
        </div>

        <div className="projects-orbital__modal-actions">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <FiGithub size={16} />
              <span>Source Code</span>
            </a>
          )}
          {project.demo && project.demo !== "#" && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <FiExternalLink size={16} />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default ProjectDetailModal;
