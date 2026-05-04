import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AIMLProjects from "./AIMLProjects";
import ReactProjects from "./ReactProjects";

const Projects = () => {
  const [activeTab, setActiveTab] = useState<"aiml" | "web">("aiml");

  return (
    <section
      id="projects"
      style={{
        padding: "100px 2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: "60px" }}>
        <span className="section-label">Projects</span>
        <h2 className="section-title gradient-text">
          Featured Work
        </h2>
        <div className="section-divider" />
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "50px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveTab("aiml")}
          className={`tab-btn ${activeTab === "aiml" ? "active" : ""}`}
        >
          AI / ML Projects
        </button>

        <button
          onClick={() => setActiveTab("web")}
          className={`tab-btn ${activeTab === "web" ? "active" : ""}`}
        >
          Web / Full Stack
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === "aiml" ? <AIMLProjects /> : <ReactProjects />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Projects;