import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FiGithub,
  FiExternalLink,
  FiInfo,
  FiPlay,
  FiPause,
  FiChevronLeft,
  FiChevronRight,
  FiBox,
  FiLayers,
} from "react-icons/fi";
import type { Project } from "./types";

interface OrbitalRingProps {
  projects: Project[];
  onSelectProject: (project: Project, index: number) => void;
}

const SPACING_LEVELS = [0.86, 1.0, 1.15]; // Tight, Default, Wide

function computeResponsiveDimensions(width: number, height: number, count: number) {
  let w = 235;
  let h = 305;
  let baseR = Math.max(380, Math.min(width * 0.28, count * 45));
  let tiltX = -13;
  let activeBoost = 12;
  let neighborScale = 0.94;
  let farScale = 0.82;
  let ringOffsetY = -12;

  if (width < 360 || height < 650) {
    // Ultra compact mobile (e.g. 320px width or short screens)
    w = Math.min(160, Math.round(width * 0.5));
    h = Math.min(215, Math.round(height * 0.34));
    baseR = Math.max(150, Math.round(width * 0.44));
    tiltX = -6;
    activeBoost = 26;
    neighborScale = 0.78;
    farScale = 0.62;
    ringOffsetY = -52;
  } else if (width < 480) {
    // Standard mobile (360px - 479px, e.g. 375, 390, 430)
    w = Math.min(Math.round(width * 0.48), 185);
    h = Math.min(Math.round(w * 1.34), Math.round(height * 0.36), 254);
    baseR = Math.max(165, Math.round(width * 0.45));
    tiltX = -7;
    activeBoost = 26;
    neighborScale = 0.80;
    farScale = 0.65;
    ringOffsetY = -44;
  } else if (width < 768) {
    // Large mobile / mini tablet (480px - 767px)
    w = 200;
    h = 270;
    baseR = Math.max(220, Math.round(width * 0.38));
    tiltX = -9;
    activeBoost = 22;
    neighborScale = 0.85;
    farScale = 0.72;
    ringOffsetY = -36;
  } else if (width < 1024) {
    // Tablet (768px - 1023px)
    w = 220;
    h = 290;
    baseR = Math.max(300, Math.min(width * 0.32, count * 37));
    tiltX = -11;
    activeBoost = 16;
    neighborScale = 0.90;
    farScale = 0.78;
    ringOffsetY = -20;
  } else if (height < 780) {
    // Compact desktop height
    w = 220;
    h = 280;
    baseR = Math.max(350, count * 40);
    tiltX = -11;
    activeBoost = 12;
    neighborScale = 0.94;
    farScale = 0.82;
    ringOffsetY = -14;
  }

  return { w, h, baseR, tiltX, activeBoost, neighborScale, farScale, ringOffsetY };
}

export const OrbitalRing: React.FC<OrbitalRingProps> = ({
  projects,
  onSelectProject,
}) => {
  const count = projects.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Responsive state initialized with current window dimensions
  const [panelSize, setPanelSize] = useState(() =>
    computeResponsiveDimensions(
      typeof window !== "undefined" ? window.innerWidth : 1400,
      typeof window !== "undefined" ? window.innerHeight : 800,
      count
    )
  );

  // Orbital 3D carousel is default on all devices (mobile & desktop)
  const [viewMode, setViewMode] = useState<"orbit" | "card">("orbit");
  const [spacingIdx, setSpacingIdx] = useState(1);
  const [autoOrbit, setAutoOrbit] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Mutable animation state in Ref to avoid re-renders on 60fps frame loop
  const animRef = useRef({
    rotation: 0,
    velocity: 0,
    targetRotation: null as number | null,
    dragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    hasMoved: false,
    justFinishedDrag: false,
    isHovered: false,
    isVisible: true,
    targetParallaxX: 0,
    targetParallaxY: 0,
    currentParallaxX: 0,
    currentParallaxY: 0,
    reduceMotion: false,
    autoOrbit: true,
    lastReportedIndex: 0,
    viewMode: "orbit" as "orbit" | "card",
  });

  // Keep animRef in sync
  useEffect(() => {
    animRef.current.autoOrbit = autoOrbit;
  }, [autoOrbit]);

  useEffect(() => {
    animRef.current.viewMode = viewMode;
  }, [viewMode]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setPanelSize(computeResponsiveDimensions(w, h, count));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [count]);

  // Main 3D Animation & Interaction Hook
  useEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    animRef.current.reduceMotion = reduceMotionQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      animRef.current.reduceMotion = e.matches;
    };
    reduceMotionQuery.addEventListener("change", handleMotionChange);

    const stage = stageRef.current;
    const ring = ringRef.current;
    const parallax = parallaxRef.current;
    if (!stage || !ring) return;

    let rafId: number;

    const baseDrift = 0.09; // gentle degrees per frame
    const friction = 0.94;
    const MAX_VELOCITY = 6;
    const DRAG_SENS = 0.28;
    const WHEEL_SENS = 0.04;
    const rangeY = 22;
    const rangeX = 16;
    const biasX = 6;

    // Viewport IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          animRef.current.isVisible = entry.isIntersecting || entry.intersectionRatio > 0;
        });
      },
      { threshold: 0 }
    );
    observer.observe(stage);

    // Parallax mousemove on window
    const handleMouseMove = (e: MouseEvent) => {
      if (animRef.current.reduceMotion) return;
      const mx = e.clientX / window.innerWidth - 0.5;
      const my = e.clientY / window.innerHeight - 0.5;
      animRef.current.targetParallaxY = mx * rangeY;
      animRef.current.targetParallaxX = -my * rangeX + biasX;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Touch & Pointer Gesture Management
    let isHorizontalGesture = false;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea")) return;

      animRef.current.startX = e.clientX;
      animRef.current.startY = e.clientY;
      animRef.current.lastX = e.clientX;
      animRef.current.hasMoved = false;
      isHorizontalGesture = false;

      if (e.pointerType === "mouse") {
        animRef.current.dragging = true;
        animRef.current.velocity = 0;
        animRef.current.targetRotation = null;
        stage.classList.add("is-dragging");
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      } else {
        // Touch events: do NOT capture immediately to preserve native vertical scroll
        animRef.current.dragging = false;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const dx = e.clientX - animRef.current.lastX;
      const totalDx = e.clientX - animRef.current.startX;
      const totalDy = e.clientY - animRef.current.startY;
      const dist = Math.hypot(totalDx, totalDy);

      // On touch devices, detect if intent is horizontal swipe or vertical page scroll
      if (e.pointerType === "touch" && !animRef.current.dragging && !isHorizontalGesture) {
        if (dist > 8) {
          if (Math.abs(totalDx) > Math.abs(totalDy) * 1.1) {
            // Horizontal intent confirmed
            isHorizontalGesture = true;
            animRef.current.dragging = true;
            animRef.current.hasMoved = true;
            animRef.current.velocity = 0;
            animRef.current.targetRotation = null;
            stage.classList.add("is-dragging");
            try {
              stage.setPointerCapture(e.pointerId);
            } catch {
              // ignore
            }
          } else {
            // Vertical intent: let normal scroll happen
            return;
          }
        } else {
          return;
        }
      }

      if (!animRef.current.dragging) return;
      if (dist > 6) {
        animRef.current.hasMoved = true;
      }
      animRef.current.lastX = e.clientX;
      animRef.current.rotation += dx * DRAG_SENS;
      animRef.current.velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, dx * DRAG_SENS));
    };

    const endDrag = (e: PointerEvent) => {
      if (!animRef.current.dragging && !isHorizontalGesture) return;
      animRef.current.dragging = false;
      isHorizontalGesture = false;
      stage.classList.remove("is-dragging");
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      if (animRef.current.hasMoved) {
        animRef.current.justFinishedDrag = true;
        setTimeout(() => {
          animRef.current.justFinishedDrag = false;
        }, 120);
      }
    };

    stage.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    // Horizontal wheel or trackpad scroll
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        animRef.current.targetRotation = null;
        animRef.current.velocity = Math.max(
          -MAX_VELOCITY,
          Math.min(MAX_VELOCITY, animRef.current.velocity + e.deltaX * WHEEL_SENS)
        );
      }
    };
    stage.addEventListener("wheel", handleWheel, { passive: false });

    // Hover detection to pause drift smoothly
    const handleMouseEnter = () => {
      animRef.current.isHovered = true;
    };
    const handleMouseLeave = () => {
      animRef.current.isHovered = false;
    };
    stage.addEventListener("mouseenter", handleMouseEnter);
    stage.addEventListener("mouseleave", handleMouseLeave);

    // 60FPS Render & Physics Loop
    const loop = () => {
      const state = animRef.current;

      if (state.isVisible && state.viewMode === "orbit") {
        if (!state.dragging) {
          if (state.targetRotation !== null) {
            const diff = state.targetRotation - state.rotation;
            state.rotation += diff * 0.08;
            if (Math.abs(diff) < 0.04) {
              state.rotation = state.targetRotation;
              state.targetRotation = null;
            }
          } else {
            const drift =
              !state.reduceMotion && state.autoOrbit && !state.isHovered ? baseDrift : 0;
            state.rotation += drift + state.velocity;
            state.velocity *= friction;
            if (Math.abs(state.velocity) < 0.001) state.velocity = 0;
          }
        }

        // Apply Ring 3D rotation
        ring.style.transform = `rotateY(${state.rotation.toFixed(3)}deg)`;

        // Apply Parallax tilt
        if (!state.reduceMotion && parallax) {
          state.currentParallaxX += (state.targetParallaxX - state.currentParallaxX) * 0.06;
          state.currentParallaxY += (state.targetParallaxY - state.currentParallaxY) * 0.06;
          parallax.style.transform = `rotateX(${state.currentParallaxX.toFixed(2)}deg) rotateY(${state.currentParallaxY.toFixed(2)}deg)`;
        }

        // Calculate closest front project
        if (count > 0) {
          const stepAngle = 360 / count;
          const normalized = ((-state.rotation % 360) + 360) % 360;
          const currentClosest = Math.round(normalized / stepAngle) % count;
          if (currentClosest !== state.lastReportedIndex) {
            state.lastReportedIndex = currentClosest;
            setActiveIndex(currentClosest);
          }
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      reduceMotionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("mousemove", handleMouseMove);
      stage.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      stage.removeEventListener("wheel", handleWheel);
      stage.removeEventListener("mouseenter", handleMouseEnter);
      stage.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [count]);

  // Programmatic rotate to specific project
  const rotateToProject = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(index);
      const stepAngle = 360 / count;
      const desiredAngle = -index * stepAngle;
      const currentRot = animRef.current.rotation;

      let delta = (desiredAngle - currentRot) % 360;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      animRef.current.targetRotation = currentRot + delta;
      animRef.current.velocity = 0;
    },
    [count]
  );

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + count) % count;
    rotateToProject(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % count;
    rotateToProject(nextIdx);
  };

  const effectiveRadius = Math.round(panelSize.baseR * SPACING_LEVELS[spacingIdx]);

  // Touch swipe support for card mode
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleCardTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleCardTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 35) {
      if (dx > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  return (
    <div className={`projects-orbital__stage-container view-mode--${viewMode}`}>
      {/* 3D Grab & Drag Stage */}
      <div
        className="projects-orbital__stage"
        ref={stageRef}
        onTouchStart={viewMode === "card" ? handleCardTouchStart : undefined}
        onTouchEnd={viewMode === "card" ? handleCardTouchEnd : undefined}
      >
        <div className="projects-orbital__parallax" ref={parallaxRef}>
          {/* Centered 3D Background Heading - Embedded naturally behind the orbital ring */}
          <div className="projects-orbital__bg-heading">
            <div className="projects-orbital__bg-eyebrow">PORTFOLIO // SYSTEM</div>
            <h2 className="projects-orbital__bg-title">FEATURED WORK</h2>
          </div>

          {/* 3D Orbit Ring Mode */}
          <div
            className={`projects-orbital__ring-tilt ${
              viewMode === "card" ? "is-hidden-mode" : ""
            }`}
            style={
              {
                "--tiltX": `${panelSize.tiltX}deg`,
                "--ringOffsetY": `${panelSize.ringOffsetY}px`,
              } as React.CSSProperties
            }
          >
            {/* Core Ambient Light Halo */}
            <div className="projects-orbital__core-halo" />

            {/* 3D Orbital Ring */}
            <div className="projects-orbital__ring" ref={ringRef}>
              {projects.map((project, i) => {
                const angle = (360 / count) * i;
                const tilt = Math.sin((i / count) * Math.PI * 2) * 6;
                const formattedNum = String(i + 1).padStart(2, "0");
                const isActive = activeIndex === i;
                const distFromActive = Math.min(
                  Math.abs(i - activeIndex),
                  count - Math.abs(i - activeIndex)
                );

                const scaleFactor = isActive
                  ? 1.06
                  : distFromActive === 1
                  ? panelSize.neighborScale
                  : panelSize.farScale;

                const activeZ = isActive ? panelSize.activeBoost : 0;

                return (
                  <div
                    key={`${project.title}-${project.year}-${i}`}
                    className={`projects-orbital__panel ${
                      isActive ? "is-active-panel" : ""
                    } dist-${distFromActive}`}
                    style={
                      {
                        "--ry": `${angle}deg`,
                        "--tz": `${effectiveRadius}px`,
                        "--rz": `${tilt.toFixed(2)}deg`,
                        "--i": i,
                        "--panel-w": `${panelSize.w}px`,
                        "--panel-h": `${panelSize.h}px`,
                        "--active-z": `${activeZ}px`,
                        "--scale-factor": scaleFactor,
                      } as React.CSSProperties
                    }
                    onClick={() => {
                      if (animRef.current.justFinishedDrag || animRef.current.hasMoved) {
                        return;
                      }
                      if (activeIndex === i) {
                        onSelectProject(project, i);
                      } else {
                        rotateToProject(i);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Project ${i + 1}: ${project.title}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectProject(project, i);
                      }
                    }}
                  >
                    {/* Front Face: Text-only high-tech glass card */}
                    <div className="projects-orbital__panel-face projects-orbital__panel-face--front">
                      <div className="projects-orbital__panel-content-top">
                        {/* Header Row: Number, Year, and Featured indicator */}
                        <div className="projects-orbital__panel-top">
                          <span className="projects-orbital__pnum">{formattedNum}</span>
                          <span className="projects-orbital__year-badge">{project.year}</span>
                          {project.highlight && (
                            <span className="highlight-badge">⭐</span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="projects-orbital__panel-title">{project.title}</h4>

                        {/* Readable Short Description */}
                        <p className="projects-orbital__panel-desc">{project.description}</p>
                      </div>

                      <div className="projects-orbital__panel-content-bottom">
                        {/* Compact Tech Stack Pills */}
                        <div className="projects-orbital__tech-row">
                          {project.tech.slice(0, 2).map((tech) => (
                            <span key={tech} className="projects-orbital__tech-badge">
                              {tech}
                            </span>
                          ))}
                          {project.tech.length > 2 && (
                            <span className="projects-orbital__tech-more">
                              +{project.tech.length - 2}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div
                          className="projects-orbital__panel-actions"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="projects-orbital__btn-link projects-orbital__btn-code"
                              title="View Source Code"
                            >
                              <FiGithub size={12} />
                              <span>Code</span>
                            </a>
                          )}
                          {project.demo && project.demo !== "#" && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="projects-orbital__btn-link projects-orbital__btn-live"
                              title="Live Demo"
                            >
                              <FiExternalLink size={12} />
                              <span>Live</span>
                            </a>
                          )}
                          <button
                            type="button"
                            className="projects-orbital__btn-details"
                            onClick={() => onSelectProject(project, i)}
                            title="Inspect Project Details"
                            aria-label={`Inspect ${project.title}`}
                          >
                            <FiInfo size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Back Face: Frosted dark glass with orbital number */}
                    <div className="projects-orbital__panel-face projects-orbital__panel-face--back">
                      <div className="projects-orbital__back-num">{formattedNum}</div>
                      <div className="projects-orbital__back-title">{project.title}</div>
                      <div className="projects-orbital__back-cue">
                        <span>FOCUS</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Focused Responsive Card Presentation Mode */}
          {viewMode === "card" && (
            <div className="projects-orbital__deck-container">
              {projects.map((project, i) => {
                if (i !== activeIndex) return null;
                const formattedNum = String(i + 1).padStart(2, "0");

                return (
                  <div
                    key={`card-deck-${project.title}-${i}`}
                    className="projects-orbital__deck-card"
                    style={
                      {
                        "--card-w": `${Math.min(panelSize.w + 30, 340)}px`,
                        "--card-h": `${Math.min(panelSize.h + 50, 390)}px`,
                      } as React.CSSProperties
                    }
                  >
                    <div className="projects-orbital__deck-card-inner">
                      <div className="projects-orbital__panel-content-top">
                        <div className="projects-orbital__panel-top">
                          <span className="projects-orbital__pnum">{formattedNum} / {String(count).padStart(2, "0")}</span>
                          <span className="projects-orbital__year-badge">{project.year}</span>
                          {project.highlight && (
                            <span className="highlight-badge">⭐ Featured</span>
                          )}
                        </div>

                        <h3 className="projects-orbital__deck-title">{project.title}</h3>

                        <p className="projects-orbital__deck-desc">{project.description}</p>
                      </div>

                      <div className="projects-orbital__panel-content-bottom">
                        <div className="projects-orbital__tech-row">
                          {project.tech.map((tech) => (
                            <span key={tech} className="projects-orbital__tech-badge">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {project.note && (
                          <div className="projects-orbital__deck-note">
                            ⚠️ <strong>Note:</strong> {project.note}
                          </div>
                        )}

                        <div className="projects-orbital__panel-actions">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="projects-orbital__btn-link projects-orbital__btn-code"
                            >
                              <FiGithub size={13} />
                              <span>Source Code</span>
                            </a>
                          )}
                          {project.demo && project.demo !== "#" && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="projects-orbital__btn-link projects-orbital__btn-live"
                            >
                              <FiExternalLink size={13} />
                              <span>Live Demo</span>
                            </a>
                          )}
                          <button
                            type="button"
                            className="projects-orbital__btn-details"
                            onClick={() => onSelectProject(project, i)}
                            title="Inspect Details"
                            aria-label={`Inspect ${project.title}`}
                          >
                            <FiInfo size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Vertical Project-Number Selector on the Right Side */}
      <nav
        className="projects-orbital__vertical-nav"
        role="tablist"
        aria-label="Project Navigation"
      >
        <div className="projects-orbital__vertical-line" />
        {projects.map((p, idx) => {
          const isActive = activeIndex === idx;
          const formattedNum = String(idx + 1).padStart(2, "0");
          return (
            <button
              key={`${p.title}-${idx}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`projects-orbital__v-item ${isActive ? "is-active" : ""}`}
              onClick={() => rotateToProject(idx)}
              title={`Focus ${formattedNum}: ${p.title}`}
              aria-label={`Focus Project ${formattedNum}: ${p.title}`}
            >
              <span className="projects-orbital__v-indicator" />
              <span className="projects-orbital__v-num">{formattedNum}</span>
            </button>
          );
        })}
      </nav>

      {/* Lower Unified Controls Cluster */}
      <div className="projects-orbital__controls-bottom-left">
        {/* Mobile Horizontal Navigation Indicators */}
        <div className="projects-orbital__mobile-nav" role="tablist" aria-label="Mobile Project Navigation">
          {projects.map((p, idx) => {
            const isActive = activeIndex === idx;
            const formattedNum = String(idx + 1).padStart(2, "0");
            return (
              <button
                key={`mob-nav-${p.title}-${idx}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`projects-orbital__mob-dot ${isActive ? "is-active" : ""}`}
                onClick={() => rotateToProject(idx)}
                aria-label={`Jump to Project ${formattedNum}`}
              >
                <span className="projects-orbital__mob-dot-fill" />
              </button>
            );
          })}
        </div>

        {/* Buttons Row */}
        <div className="projects-orbital__controls-row">
          {/* Step Arrows + Active Counter */}
          <div className="projects-orbital__mini-group">
            <button
              type="button"
              className="projects-orbital__step-btn"
              onClick={handlePrev}
              aria-label="Previous Project"
              title="Rotate to previous project"
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="projects-orbital__step-btn"
              onClick={handleNext}
              aria-label="Next Project"
              title="Rotate to next project"
            >
              <FiChevronRight size={16} />
            </button>
            <span className="projects-orbital__mono-counter">
              {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>

          {/* Spacing Controls (T, D, W) */}
          {viewMode === "orbit" && (
            <div
              className="projects-orbital__mini-spacing"
              role="group"
              aria-label="Ring spacing"
            >
              {["T", "D", "W"].map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  className={`projects-orbital__spacing-btn ${
                    spacingIdx === idx ? "is-active" : ""
                  }`}
                  onClick={() => setSpacingIdx(idx)}
                  title={`${
                    label === "T" ? "Tight" : label === "D" ? "Default" : "Wide"
                  } Spacing`}
                  aria-label={`Spacing option ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* View Toggle (3D Orbit vs Focused Card) */}
          <button
            type="button"
            className="projects-orbital__view-toggle"
            onClick={() => setViewMode(viewMode === "orbit" ? "card" : "orbit")}
            title={`Switch to ${viewMode === "orbit" ? "Card Deck" : "3D Orbit"} View`}
            aria-label={`Switch view, current mode is ${viewMode}`}
          >
            {viewMode === "orbit" ? <FiLayers size={12} /> : <FiBox size={12} />}
            <span>{viewMode === "orbit" ? "CARD" : "3D"}</span>
          </button>

          {/* Auto-Orbit Pause/Play Switch */}
          {viewMode === "orbit" && (
            <button
              type="button"
              className={`projects-orbital__switch ${autoOrbit ? "is-active" : ""}`}
              onClick={() => setAutoOrbit(!autoOrbit)}
              aria-pressed={autoOrbit}
              title={autoOrbit ? "Pause Auto-Orbit" : "Resume Auto-Orbit"}
            >
              {autoOrbit ? <FiPause size={11} /> : <FiPlay size={11} />}
              <span>{autoOrbit ? "ORBIT" : "PAUSED"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrbitalRing;
