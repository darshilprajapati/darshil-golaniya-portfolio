import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"logo" | "name" | "loading" | "done">("logo");
  const [displayName, setDisplayName] = useState("");
  const fullName = "DARSHIL GOLANIYA";

  useEffect(() => {
    // Phase 1: logo appears (0-300ms)
    // Phase 2: name types out (300-900ms)
    // Phase 3: loading bar (900-1400ms)
    // Phase 4: exit

    const t1 = setTimeout(() => setPhase("name"), 300);

    let typeInterval: any;

    const t2 = setTimeout(() => {
      let i = 0;
      typeInterval = setInterval(() => {
        setDisplayName(fullName.slice(0, i + 1));
        i++;
        if (i >= fullName.length) clearInterval(typeInterval);
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
          setTimeout(() => setPhase("done"), 150);
          setTimeout(() => onComplete(), 400);
        }
        setProgress(Math.min(prog, 100));
      }, 40);
      return () => clearInterval(bar);
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
       if (typeInterval) clearInterval(typeInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="splash-screen"
          style={{ zIndex: 10000 }}
        >
          {/* Background grid */}
          <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />

          {/* Animated corner brackets */}
          <svg
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
          </svg>

          {/* Glowing orb behind */}
          <div
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* DG Monogram */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ textAlign: "center" }}
          >
            <div
              className="splash-logo"
              style={{
                fontSize: "clamp(4rem, 15vw, 9rem)",
                letterSpacing: "-0.02em",
              }}
            >
              DG
            </div>
          </motion.div>

          {/* Name typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "name" || phase === "loading" ? 1 : 0 }}
            transition={{ duration: 0.3 }}
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
            animate={{ opacity: phase === "loading" ? 1 : 0, y: phase === "loading" ? 0 : 20 }}
            transition={{ duration: 0.4 }}
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
            animate={{ y: ["0%", "100%"] }}
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
      ) : null}
    </AnimatePresence>
  );
};

export default SplashScreen;