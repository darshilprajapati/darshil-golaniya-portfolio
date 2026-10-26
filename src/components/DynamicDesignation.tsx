import React, { useState, useEffect } from "react";

const DESIGNATION_TITLES = [
  "Full Stack Developer",
  "ASP.NET Core Developer",
  "React Developer",
  "Python Developer",
  "AI/ML Enthusiast",
];

const TYPING_SPEED = 75; // ms per char
const PAUSE_DURATION = 1400; // ms pause on full title
const DELETING_SPEED = 40; // ms per char deleting
const SWITCH_DELAY = 180; // ms pause before next title

export const DynamicDesignation: React.FC = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState(DESIGNATION_TITLES[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  // Reduced motion support listener
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Smooth typewriter cycle loop
  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const currentFullTitle = DESIGNATION_TITLES[titleIndex];

    if (!isDeleting) {
      // Forward typing
      if (displayText.length < currentFullTitle.length) {
        timer = setTimeout(() => {
          setDisplayText(currentFullTitle.slice(0, displayText.length + 1));
        }, TYPING_SPEED);
      } else {
        // Full title typed, pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, PAUSE_DURATION);
      }
    } else {
      // Backward deleting
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentFullTitle.slice(0, displayText.length - 1));
        }, DELETING_SPEED);
      } else {
        // Finished deleting, transition to next title
        timer = setTimeout(() => {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % DESIGNATION_TITLES.length);
        }, SWITCH_DELAY);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, titleIndex, prefersReducedMotion]);

  const activeText = prefersReducedMotion ? DESIGNATION_TITLES[0] : displayText;

  return (
    <div className="portfolio-hero__role-badge" aria-label="Professional Designation">
      <span className="portfolio-hero__role-rule" aria-hidden="true" />
      <span className="portfolio-hero__role-text-container">
        <span className="portfolio-hero__role-text">{activeText}</span>
        {!prefersReducedMotion && (
          <span className="portfolio-hero__cursor" aria-hidden="true" />
        )}
      </span>
      <span className="portfolio-hero__role-rule" aria-hidden="true" />
    </div>
  );
};

export default DynamicDesignation;
