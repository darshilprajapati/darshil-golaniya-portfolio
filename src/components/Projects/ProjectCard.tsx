import { motion } from "framer-motion";

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  year: string;
  highlight?: boolean;
  note?: string;
}

interface Props {
  project: Project;
}

const ProjectCard = ({ project }: Props) => {
  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ translateY: -8 }}
      style={{
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        height: "100%",              
        display: "flex",               
        flexDirection: "column",      
        justifyContent: "space-between" 
          }}
        >
      {/* Highlight Badge */}
      {project.highlight && (
        <div
          className="highlight-badge"
          style={{ position: "absolute", top: "16px", right: "16px" }}
        >
          ⭐ Featured
        </div>
      )}

      {/* Year */}
      <div
        style={{
          fontSize: "0.7rem",
          fontFamily: "var(--font-mono)",
          color: "var(--text-muted)",
          marginBottom: "8px",
        }}
      >
        {project.year}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.2rem",
          marginBottom: "12px",
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "0.9rem",
          lineHeight: 1.7,
          marginBottom: "18px",
        }}
      >
        {project.description}
      </p>

      {/* Tech Stack */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {project.tech.map((tech) => (
          <span key={tech} className="tech-badge">
            {tech}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
          style={{ padding: "8px 18px", fontSize: "0.75rem" }}
        >
          Code
        </a>

        {project.demo !== "#" && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: "8px 18px", fontSize: "0.75rem" }}
          >
            Live
          </a>
        )}
      </div>

      {project.note && (
        <div
          style={{
            marginTop: "16px",
            padding: "10px 14px",
            borderRadius: "8px",
            backgroundColor: "rgba(255, 107, 53, 0.08)",
            borderLeft: "4px solid #ff6b35",
            fontSize: "0.78rem",
            color: "rgba(255, 255, 255, 0.85)",
            lineHeight: "1.4",
            textAlign: "left",
          }}
        >
          ⚠️ <strong>Note:</strong> {project.note}
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;