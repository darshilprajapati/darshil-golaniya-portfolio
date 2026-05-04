import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo } from "../data/portfolioData";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer for active section
  useEffect(() => {
    const sections = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          padding: "0 2rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled
            ? "rgba(5,5,8,0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,212,255,0.08)" : "none",
          transition: "background 0.4s ease, border-bottom 0.4s ease",
        }}
      >
        {/* Logo */}
        <a href="#hero" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 900,
              background: "linear-gradient(135deg, var(--cyan), var(--purple))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.05em",
              cursor: "pointer",
            }}
          >
            DG
          </motion.div>
        </a>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="hidden-mobile">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="nav-link"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              style={{
                color: activeSection === link.href.slice(1) ? "var(--cyan)" : undefined,
              }}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.a
            href={`/Resume_Darshil.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ padding: "8px 20px", fontSize: "0.75rem" }}
          >
            <span>Resume</span>
          </motion.a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "none",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{
                rotate: mobileOpen && i === 0 ? 45 : mobileOpen && i === 2 ? -45 : 0,
                y: mobileOpen && i === 0 ? 10 : mobileOpen && i === 2 ? -10 : 0,
                opacity: mobileOpen && i === 1 ? 0 : 1,
              }}
              style={{
                display: "block",
                width: "22px",
                height: "2px",
                background: "var(--cyan)",
                borderRadius: "2px",
                transformOrigin: "center",
              }}
            />
          ))}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "75vw",
              maxWidth: "320px",
              background: "var(--bg-3)",
              borderLeft: "1px solid var(--border)",
              zIndex: 600,
              padding: "80px 32px 40px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                  color:
                    activeSection === link.href.slice(1)
                      ? "var(--cyan)"
                      : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  letterSpacing: "0.08em",
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;