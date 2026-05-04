import { motion } from "framer-motion";
import { webProjects } from "../../data/portfolioData";
import ProjectCard from "./ProjectCard";

const ReactProjects = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
      }}
    >
      {webProjects.map((project, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ReactProjects;