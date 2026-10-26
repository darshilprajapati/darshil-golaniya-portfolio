import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "../data/portfolioData";
import ParticleTypography from "./ParticleTypography";
import PortraitReveal from "./PortraitReveal";
import DynamicDesignation from "./DynamicDesignation";
import "./Hero.css";

const Hero: React.FC = () => {
  const ambientCanvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle ambient gold dust specks in the hero background
  useEffect(() => {
    const canvas = ambientCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    interface AmbientDust {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }

    const dustCount = 40;
    const dustParticles: AmbientDust[] = [];

    for (let i = 0; i < dustCount; i++) {
      const rand = Math.random();
      let color = "202, 213, 232"; // Cool silver (#CAD5E8)
      if (rand < 0.4) {
        color = "54, 217, 255"; // Electric cyan (#36D9FF)
      } else if (rand < 0.65) {
        color = "71, 123, 255"; // Electric blue (#477BFF)
      }

      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -0.08 - Math.random() * 0.16,
        size: Math.random() * 1.3 + 0.6,
        alpha: Math.random() * 0.35 + 0.08,
        color,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dustCount; i++) {
        const p = dustParticles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section id="hero" className="portfolio-hero">
      {/* Background Ambient Canvas for champagne dust */}
      <canvas ref={ambientCanvasRef} className="portfolio-hero__ambient-canvas" />

      {/* Subtle Noise Texture */}
      <div className="portfolio-hero__noise" aria-hidden="true" />

      {/* Main Hero Container */}
      <div className="portfolio-hero__container">
        {/* Centerpiece: Flanked Particle Typography & Tilted Glass Frame */}
        <motion.div
          className="portfolio-hero__centerpiece"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left Flank: D A R S H I L in dense sparkling gold particles */}
          <div className="portfolio-hero__flank portfolio-hero__flank--left">
            <ParticleTypography
              text="D A R S H I L"
              align="right"
              roleDescription="Full Stack Developer"
            />
          </div>

          {/* Center Anchor: The tilted glowing glass portrait frame */}
          <div className="portfolio-hero__portrait-center">
            <PortraitReveal />
          </div>

          {/* Right Flank: G O L A N I Y A in dense sparkling gold particles */}
          <div className="portfolio-hero__flank portfolio-hero__flank--right">
            <ParticleTypography
              text="G O L A N I Y A"
              align="left"
              roleDescription="Full Stack Developer"
            />
          </div>
        </motion.div>

        {/* Mobile-only unified particle name */}
        <div className="portfolio-hero__mobile-name">
          <ParticleTypography
            text="DARSHIL GOLANIYA"
            align="center"
            roleDescription="Full Stack Developer"
          />
        </div>

        {/* Role Badge directly below the frame */}
        <motion.div
          className="portfolio-hero__sub-content"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Dynamically Changing Professional Designation with Typewriter & Blinking Cyan Cursor */}
          <DynamicDesignation />
        </motion.div>
      </div>

      {/* Bottom Bar: Socials (Left), Scroll & Location (Center), Actions (Right) */}
      <div className="portfolio-hero__bottom-bar">
        {/* Left: Social Icons */}
        <div className="portfolio-hero__bottom-socials">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-hero__social-link"
            title="GitHub"
            aria-label="GitHub Profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-hero__social-link"
            title="LinkedIn"
            aria-label="LinkedIn Profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            className="portfolio-hero__social-link"
            title="Email"
            aria-label="Send Email"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </a>
          <a
            href={personalInfo.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-hero__social-link"
            title="WhatsApp"
            aria-label="WhatsApp Contact"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>

        {/* Center: Subtle Scroll Indicator */}
        <div className="portfolio-hero__bottom-meta">
          <a href="#about" className="portfolio-hero__scroll-indicator">
            <span>SCROLL DOWN</span>
            <span className="portfolio-hero__scroll-line" />
          </a>
        </div>

        {/* Right: Primary CTAs */}
        <div className="portfolio-hero__bottom-actions">
          <a href="#projects" className="portfolio-hero__btn-primary">
            View Projects ↗
          </a>
          <a href="#contact" className="portfolio-hero__btn-secondary">
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;