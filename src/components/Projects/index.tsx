import { useState, useMemo } from "react";
import { aimlProjects, webProjects } from "../../data/portfolioData";
import OrbitalRing from "./OrbitalRing";
import ProjectDetailModal from "./ProjectDetailModal";
import type { Project } from "./types";
import "./ProjectsOrbital.css";

const Projects = () => {
  // Combine all existing project records without category filters and deduplicate
  const allProjects = useMemo<Project[]>(() => {
    const combined = [...aimlProjects, ...webProjects];
    return combined.filter(
      (project, index, self) =>
        index ===
        self.findIndex(
          (p) =>
            p.title.trim().toLowerCase() === project.title.trim().toLowerCase()
        )
    );
  }, []);

  const [selectedProject, setSelectedProject] = useState<{
    project: Project;
    index: number;
  } | null>(null);

  const handleSelectProject = (project: Project, index: number) => {
    setSelectedProject({ project, index });
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="projects-orbital">
      {/* Full-Screen Immersive 3D Orbital Showcase with embedded background typography */}
      <OrbitalRing
        projects={allProjects}
        onSelectProject={handleSelectProject}
      />

      {/* Accessible Detail Modal */}
      <ProjectDetailModal
        project={selectedProject?.project ?? null}
        index={selectedProject?.index}
        total={allProjects.length}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Projects;