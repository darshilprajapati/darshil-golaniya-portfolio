import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { education, personalInfo } from "../data/portfolioData";
import LanyardIdCard from "./LanyardIdCard";
import "./Education.css";

const Education = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentEdu = education[activeIndex] || education[0];

  return (
    <section id="education" className="education-section">
      {/* Section Header */}
      <div className="education-section__header">
        <span className="section-label">Education</span>
        <h2 className="section-title gradient-text">Academic Background</h2>
        <div className="section-divider" />
      </div>

      {/* Two-Column Responsive Layout */}
      <div className="education-grid">
        {/* Left Column: Academic Credentials Detail */}
        <div className="education-left">
          {/* Active Qualification Glass Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEdu.degree}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="education-card"
            >
              <div className="education-card__top">
                <span className="education-card__period">{currentEdu.period}</span>
                <span className="education-status-badge">
                  GRADUATED
                </span>
              </div>

              <h3 className="education-card__degree">{currentEdu.degree}</h3>

              <p className="education-card__institution">
                <span>🏛️</span>
                <span>{currentEdu.institution}</span>
              </p>

              <p className="education-card__location">
                <span>📍</span>
                <span>{currentEdu.location}</span>
              </p>

              <div>
                <span className="education-card__section-label">
                  Key Curriculum & Technical Focus
                </span>
                <div className="education-card__courses">
                  {currentEdu.courses.map((course) => (
                    <span key={course} className="skill-tag">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Physical 3D Student ID Card Suspended by Lanyard */}
        <div className="education-right">
          <LanyardIdCard
            educationData={education}
            activeIndex={activeIndex}
            onSelectIndex={setActiveIndex}
            studentName={personalInfo.name}
          />
        </div>
      </div>
    </section>
  );
};

export default Education;