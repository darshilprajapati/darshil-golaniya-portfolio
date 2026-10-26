import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "../data/portfolioData";
import { CanvasRevealEffect } from "./ui/canvas-reveal-effect";
import "./Skills.css";

interface SkillCategory {
  category: string;
  icon: string;
  items: string[];
}

const SkillCategoryCard: React.FC<{
  skill: SkillCategory;
  index: number;
}> = ({ skill, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="skill-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ translateY: -5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="region"
      aria-label={`${skill.category} Skills`}
    >
      {/* Fine-grained Particle Canvas Reveal Layer */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="skill-card__canvas-wrapper"
          >
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-transparent"
              colors={[
                [59, 130, 246], // Blue
                [139, 92, 246], // Violet
              ]}
              opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
              dotSize={2}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Card Foreground Content */}
      <div className="skill-card__content">
        <div className="skill-card__header">
          <span className="skill-card__icon">{skill.icon}</span>
          <h3 className="skill-card__title">{skill.category}</h3>
        </div>

        <div className="skill-card__items">
          {skill.items.map((item) => (
            <span key={item} className="skill-tag">
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  return (
    <section id="skills" className="skills-section">
      {/* Section Header */}
      <div className="skills-header">
        <span className="section-label">Skills</span>
        <h2 className="section-title gradient-text">Technical Expertise</h2>
        <div className="section-divider" />
      </div>

      {/* Six Technical Skill Categories Grid */}
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <SkillCategoryCard
            key={skill.category}
            skill={skill}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default Skills;