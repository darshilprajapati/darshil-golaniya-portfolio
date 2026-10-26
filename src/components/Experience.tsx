import React from "react";
import { motion } from "framer-motion";
import { experience } from "../data/portfolioData";
import { EvervaultCard, Icon } from "./ui/evervault-card";
import "./Experience.css";

const Experience: React.FC = () => {
  return (
    <section id="experience" className="experience-section">
      {/* Section Header */}
      <div className="experience-header">
        <span className="section-label">Experience</span>
        <h2 className="section-title gradient-text">Professional Journey</h2>
        <div className="section-divider" />
      </div>

      {/* Vertical Experience Timeline */}
      <div className="experience-timeline">
        {/* Continuous Gradient Connector Line */}
        <div className="timeline-line" />

        {experience.map((exp, index) => (
          <motion.div
            key={exp.company}
            className="timeline-item"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.16, duration: 0.55 }}
            viewport={{ once: true }}
          >
            {/* Timeline Node Dot */}
            <div
              className="timeline-dot"
              style={{
                borderColor: exp.color,
                boxShadow: `0 0 14px ${exp.color}`,
              }}
            />

            {/* Experience Card Outer with Evervault 4 Corner Icons (+) */}
            <motion.div
              className="experience-card-outer"
              whileHover={{ translateY: -5 }}
              transition={{ duration: 0.25 }}
            >
              <Icon className="evervault-corner-icon evervault-corner-icon--tl" />
              <Icon className="evervault-corner-icon evervault-corner-icon--tr" />
              <Icon className="evervault-corner-icon evervault-corner-icon--bl" />
              <Icon className="evervault-corner-icon evervault-corner-icon--br" />

              {/* Evervault Interactive Encrypted Hover Card */}
              <EvervaultCard className="experience-card" color={exp.color}>
                {/* Header: Role Title + Badge */}
                <div className="experience-card__header">
                  <div className="experience-card__title-group">
                    <h3 className="experience-card__role">{exp.role}</h3>

                    <div className="experience-card__company-row">
                      {exp.logo && (
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="experience-card__company-logo"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <span
                        className="experience-card__company-name"
                        style={{ color: exp.color }}
                      >
                        {exp.company}
                      </span>
                    </div>
                  </div>

                  {/* Work Arrangement & Employment Badge */}
                  {exp.workArrangement && (
                    <span className="experience-card__badge">
                      <span
                        className="experience-card__badge-dot"
                        style={{ backgroundColor: exp.color }}
                      />
                      <span>
                        {exp.employmentType
                          ? `${exp.employmentType} · ${exp.workArrangement}`
                          : exp.workArrangement}
                      </span>
                    </span>
                  )}
                </div>

                {/* Meta Row: Period & Location */}
                <div className="experience-card__meta">
                  <span className="experience-card__meta-item">
                    <span>🗓️</span>
                    <span>{exp.period}</span>
                  </span>
                  <span>•</span>
                  <span className="experience-card__meta-item">
                    <span>📍</span>
                    <span>{exp.location}</span>
                  </span>
                </div>

                {/* Verified Responsibilities / Points */}
                <ul className="experience-card__points">
                  {exp.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </EvervaultCard>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;