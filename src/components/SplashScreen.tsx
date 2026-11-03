import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type SplashState = "loading" | "transitioning" | "complete";

export interface SplashScreenProps {
  splashState: SplashState;
  onStartTransition: () => void;
  onComplete: () => void;
}

interface LogoCoords {
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  splashState,
  onStartTransition,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"logo" | "name" | "loading" | "readyToFly">("logo");
  const [displayName, setDisplayName] = useState("");
  const fullName = "DARSHIL GOLANIYA";

  const staticLogoRef = useRef<HTMLDivElement>(null);
  const [flightCoords, setFlightCoords] = useState<{
    start: LogoCoords;
    dest: LogoCoords;
  } | null>(null);

  const isReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    // Phase 1: logo appears (0-300ms)
    // Phase 2: name types out (300-900ms)
    // Phase 3: loading bar (900-1400ms)

    const t1 = setTimeout(() => setPhase("name"), 300);

    let typeInterval: ReturnType<typeof setInterval> | undefined;

    const t2 = setTimeout(() => {
      let i = 0;
      typeInterval = setInterval(() => {
        setDisplayName(fullName.slice(0, i + 1));
        i++;
        if (i >= fullName.length && typeInterval) {
          clearInterval(typeInterval);
        }
      }, 30);
    }, 300);

    const t3 = setTimeout(() => {
      setPhase("loading");
      let prog = 0;
      const bar = setInterval(() => {
        prog += Math.random() * 15 + 10;
        if (prog >= 100) {
          prog = 100;
          clearInterval(bar);
          setProgress(100);

          // Brief pause at 100% so the user perceives completion
          setTimeout(() => {
            initiateLogoFlight();
          }, 180);
        } else {
          setProgress(Math.min(prog, 100));
        }
      }, 40);

      return () => clearInterval(bar);
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, []);

  const initiateLogoFlight = () => {
    // 1. Measure start coordinates from centered static splash logo
    const staticEl = staticLogoRef.current;
    if (!staticEl) {
      onStartTransition();
      onComplete();
      return;
    }

    const startRect = staticEl.getBoundingClientRect();
    const startComputed = window.getComputedStyle(staticEl);
    const startFontSize = parseFloat(startComputed.fontSize) || 120;

    // 2. Measure destination coordinates from actual navbar logo
    const navLogoEl = document.getElementById("navbar-logo");
    let destRect: DOMRect | null = null;
    let destFontSize = 23.2;

    if (navLogoEl) {
      destRect = navLogoEl.getBoundingClientRect();
      const destComputed = window.getComputedStyle(navLogoEl);
      destFontSize = parseFloat(destComputed.fontSize) || 23.2;
    }

    // Dynamic responsive fallback if DOM node hasn't laid out
    if (!destRect || destRect.width === 0) {
      const isMobile = window.innerWidth <= 768;
      const leftPos = isMobile ? 24 : 32;
      destRect = {
        left: leftPos,
        top: 13.5,
        width: 38.125,
        height: 37.125,
        right: leftPos + 38.125,
        bottom: 50.625,
        x: leftPos,
        y: 13.5,
        toJSON: () => {},
      } as DOMRect;
    }

    setFlightCoords({
      start: {
        left: startRect.left,
        top: startRect.top,
        width: startRect.width,
        height: startRect.height,
        fontSize: startFontSize,
      },
      dest: {
        left: destRect.left,
        top: destRect.top,
        width: destRect.width,
        height: destRect.height,
        fontSize: destFontSize,
      },
    });

    setPhase("readyToFly");

    // Reveal the homepage behind the dissolving splash backdrop
    onStartTransition();
  };

  const isTransitioning = splashState === "transitioning" && flightCoords !== null;
  const flightDuration = isReducedMotion ? 0.25 : 1.25;

  return (
    <>
      {/* Splash Screen Container & Backdrop */}
      <motion.div
        className="splash-screen"
        initial={{ opacity: 1 }}
        animate={{
          opacity: isTransitioning ? 0 : 1,
        }}
        transition={{
          duration: isReducedMotion ? 0.25 : 0.75,
          ease: "easeOut",
        }}
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--bg)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "32px",
          pointerEvents: isTransitioning ? "none" : "auto",
        }}
      >
        {/* Background grid */}
        <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />

        {/* Animated corner brackets */}
        <motion.svg
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M5,15 L5,5 L15,5"
            stroke="var(--cyan)"
            strokeWidth="0.3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <motion.path
            d="M85,5 L95,5 L95,15"
            stroke="var(--cyan)"
            strokeWidth="0.3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <motion.path
            d="M95,85 L95,95 L85,95"
            stroke="var(--purple)"
            strokeWidth="0.3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          <motion.path
            d="M15,95 L5,95 L5,85"
            stroke="var(--purple)"
            strokeWidth="0.3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.svg>

        {/* Glowing orb behind */}
        <motion.div
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Static DG Monogram (visible before flight begins) */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{
            scale: 1,
            rotate: 0,
            opacity: isTransitioning ? 0 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ textAlign: "center" }}
        >
          <div
            ref={staticLogoRef}
            className="splash-logo"
            style={{
              fontSize: "clamp(4rem, 15vw, 9rem)",
              letterSpacing: "-0.02em",
              visibility: isTransitioning ? "hidden" : "visible",
            }}
          >
            DG
          </div>
        </motion.div>

        {/* Name typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: !isTransitioning && (phase === "name" || phase === "loading" || phase === "readyToFly") ? 1 : 0,
          }}
          transition={{ duration: 0.25 }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.75rem, 2vw, 1rem)",
            letterSpacing: "0.3em",
            color: "var(--text-muted)",
            minHeight: "1.5em",
            textAlign: "center",
          }}
        >
          {displayName}
          <span className="typewriter-cursor" />
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: !isTransitioning && (phase === "loading" || phase === "readyToFly") ? 1 : 0,
            y: phase === "loading" || phase === "readyToFly" ? 0 : 20,
          }}
          transition={{ duration: 0.25 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
        >
          <div className="splash-bar-track">
            <div className="splash-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--cyan)",
              letterSpacing: "0.1em",
            }}
          >
            INITIALIZING PORTFOLIO... {Math.round(progress)}%
          </span>
        </motion.div>

        {/* Scanning lines */}
        <motion.div
          animate={{
            y: ["0%", "100%"],
            opacity: isTransitioning ? 0 : 1,
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* FLYING LOGO: Seamless FLIP Transformation from Center to Navbar */}
      <AnimatePresence>
        {isTransitioning && flightCoords && (
          <motion.div
            key="flying-dg-logo"
            initial={{
              position: "fixed",
              left: flightCoords.start.left,
              top: flightCoords.start.top,
              width: flightCoords.start.width,
              height: flightCoords.start.height,
              fontSize: flightCoords.start.fontSize,
              zIndex: 10005,
              pointerEvents: "none",
              margin: 0,
              padding: 0,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            animate={{
              left: flightCoords.dest.left,
              top: flightCoords.dest.top,
              width: flightCoords.dest.width,
              height: flightCoords.dest.height,
              fontSize: flightCoords.dest.fontSize,
            }}
            transition={{
              duration: flightDuration,
              ease: [0.16, 1, 0.3, 1], // Custom cinematic bezier curve for confident acceleration & gentle docking
            }}
            onAnimationComplete={() => {
              // Exact arrival at destination: hand off to navbar logo and clean up splash
              onComplete();
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Layer 1: Orbitron (Initial Splash Monogram Style) */}
              <motion.span
                style={{
                  position: "absolute",
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  color: "var(--cyan)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  whiteSpace: "nowrap",
                }}
                animate={{
                  opacity: [1, 1, 0, 0],
                  textShadow: [
                    "0 0 40px rgba(0, 212, 255, 0.6), 0 0 80px rgba(0, 212, 255, 0.3)",
                    "0 0 26px rgba(0, 212, 255, 0.5)",
                    "0 0 16px rgba(0, 212, 255, 0.4)",
                    "0 0 16px rgba(0, 212, 255, 0.4)",
                  ],
                }}
                transition={{
                  duration: flightDuration,
                  times: [0, 0.35, 0.7, 1],
                  ease: "easeInOut",
                }}
              >
                DG
              </motion.span>

              {/* Layer 2: Plus Jakarta Sans (Destination Navbar Monogram Style) */}
              <motion.span
                style={{
                  position: "absolute",
                  fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                  fontWeight: 800,
                  color: "var(--cyan)",
                  textShadow: "0 0 16px rgba(0, 212, 255, 0.4)",
                  lineHeight: 1,
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
                animate={{
                  opacity: [0, 0, 1, 1],
                }}
                transition={{
                  duration: flightDuration,
                  times: [0, 0.35, 0.7, 1],
                  ease: "easeInOut",
                }}
              >
                DG
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SplashScreen;
