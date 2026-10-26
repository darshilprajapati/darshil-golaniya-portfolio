import React, { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
  baseAlpha: number;
  isAmbient?: boolean;
}

interface ParticleTypographyProps {
  text: string;
  align?: "left" | "right" | "center";
  className?: string;
  roleDescription?: string;
  fontSizeOverride?: number;
}

export const ParticleTypography: React.FC<ParticleTypographyProps> = ({
  text,
  align = "center",
  className = "",
  roleDescription = "Full Stack Developer",
  fontSizeOverride,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Pointer state tracking
  const mouseRef = useRef<{
    x: number;
    y: number;
    lastX: number;
    lastY: number;
    vx: number;
    vy: number;
    isHovered: boolean;
  }>({
    x: -9999,
    y: -9999,
    lastX: -9999,
    lastY: -9999,
    vx: 0,
    vy: 0,
    isHovered: false,
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Dense particle sampling from rasterized editorial serif typography
  const initParticles = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const width = Math.max(Math.round(rect.width), 220);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Responsive font size: 52px on desktop (increased by ~18%)
    let fontSize = fontSizeOverride || 52;
    if (!fontSizeOverride) {
      if (width < 320) {
        fontSize = 30;
      } else if (width < 450) {
        fontSize = 36;
      } else if (width < 600) {
        fontSize = 44;
      } else {
        fontSize = 52;
      }
    }

    const height = Math.round(fontSize * 1.6);
    const canvasW = Math.round(width * dpr);
    const canvasH = Math.round(height * dpr);

    canvas.width = canvasW;
    canvas.height = canvasH;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Offscreen canvas for font glyph sampling
    const offscreen = document.createElement("canvas");
    offscreen.width = canvasW;
    offscreen.height = canvasH;
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    offCtx.scale(dpr, dpr);
    offCtx.font = `600 ${fontSize}px "Cormorant Garamond", "Playfair Display", Georgia, serif`;
    offCtx.textBaseline = "middle";
    offCtx.textAlign = align;

    // Safety auto-fit check so wide text never overflows the canvas
    const maxAvailableWidth = width - 40;
    let measuredWidth = offCtx.measureText(text).width;
    while (measuredWidth > maxAvailableWidth && fontSize > 26) {
      fontSize -= 1.5;
      offCtx.font = `600 ${fontSize}px "Cormorant Garamond", "Playfair Display", Georgia, serif`;
      measuredWidth = offCtx.measureText(text).width;
    }

    const textX = align === "center" ? width / 2 : align === "right" ? width - 20 : 20;
    offCtx.fillStyle = "#ffffff";
    offCtx.fillText(text, textX, height / 2);

    const imgData = offCtx.getImageData(0, 0, canvasW, canvasH);
    const data = imgData.data;

    const newParticles: Particle[] = [];
    const step = dpr > 1 ? 2.5 : 2;

    let maxX = 0;
    let minX = canvasW;
    let maxY = 0;
    let minY = canvasH;

    for (let y = 0; y < canvasH; y += step) {
      for (let x = 0; x < canvasW; x += step) {
        const index = (Math.floor(y) * canvasW + Math.floor(x)) * 4;
        const alpha = data[index + 3];

        if (alpha > 40) {
          if (x > maxX) maxX = x;
          if (x < minX) minX = x;
          if (y > maxY) maxY = y;
          if (y < minY) minY = y;

          // Coordinated Palette: ice-silver (#EAF2FF), cool silver (#CAD5E8), electric cyan (#36D9FF), electric blue (#477BFF)
          const rand = Math.random();
          let r = 234, g = 242, b = 255; // Primary ice-silver base (#EAF2FF)
          if (rand > 0.40 && rand <= 0.72) {
            r = 202; g = 213; b = 232; // Cool silver (#CAD5E8)
          } else if (rand > 0.72 && rand <= 0.90) {
            r = 54; g = 217; b = 255; // Electric cyan accent (#36D9FF)
          } else if (rand > 0.90) {
            r = 71; g = 123; b = 255; // Electric blue spark (#477BFF)
          }

          // Dense fine-grained pixel size
          const size = (0.95 + Math.random() * 0.9) * (dpr > 1 ? 1.2 : 1.0);
          const baseAlpha = (alpha / 255) * (0.85 + Math.random() * 0.15);

          newParticles.push({
            originX: x,
            originY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            size,
            r,
            g,
            b,
            alpha: baseAlpha,
            baseAlpha,
          });
        }
      }
    }

    // Add ambient cyan and silver dust particles around the outer edge
    if (maxX > minX) {
      const ambientCount = Math.round(width < 400 ? 25 : 45);
      const textHeight = Math.max(maxY - minY, 40);

      for (let i = 0; i < ambientCount; i++) {
        const isRightEdge = align === "left" || (align === "center" && Math.random() > 0.5);
        const xBase = isRightEdge ? maxX : minX;
        const xOffset = (isRightEdge ? Math.random() : -Math.random()) * 60 * dpr;
        const yOffset = (Math.random() - 0.5) * textHeight * 1.4;

        const originX = xBase + xOffset;
        const originY = (minY + maxY) / 2 + yOffset;

        const size = (0.7 + Math.random() * 0.9) * (dpr > 1 ? 1.1 : 1.0);
        const baseAlpha = 0.25 + Math.random() * 0.55;

        const isCyan = Math.random() < 0.65;
        const r = isCyan ? 54 : 202;
        const g = isCyan ? 217 : 213;
        const b = isCyan ? 255 : 232;

        newParticles.push({
          originX,
          originY,
          x: originX + (Math.random() - 0.5) * 6,
          y: originY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size,
          r,
          g,
          b,
          alpha: baseAlpha,
          baseAlpha,
          isAmbient: true,
        });
      }
    }

    particlesRef.current = newParticles;
  }, [text, align, fontSizeOverride]);

  // Handle font loading and responsive resizing
  useEffect(() => {
    initParticles();

    if (document.fonts) {
      document.fonts.ready.then(() => {
        initParticles();
      });
    }

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initParticles]);

  // Interactive animation loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const mouseCanvasX = mouse.x * dpr;
      const mouseCanvasY = mouse.y * dpr;
      const radius = 55 * dpr;
      const radiusSq = radius * radius;

      mouse.vx *= 0.82;
      mouse.vy *= 0.82;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        // 1. Pointer disturbance
        if (mouse.isHovered) {
          const dx = p.x - mouseCanvasX;
          const dy = p.y - mouseCanvasY;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = 1 - dist / radius;

            const nx = dx / dist;
            const ny = dy / dist;

            // Push impulse
            const push = force * 4.2 * dpr;
            p.vx += nx * push;
            p.vy += ny * push;

            // Directional trailing dust following pointer velocity
            p.vx += mouse.vx * 0.45 * force * dpr;
            p.vy += mouse.vy * 0.45 * force * dpr;

            // Natural micro-turbulence
            p.vx += (Math.random() - 0.5) * 1.3 * force;
            p.vy += (Math.random() - 0.5) * 1.3 * force;
          }
        }

        // 2. Magnetic spring return to origin
        const homeDx = p.originX - p.x;
        const homeDy = p.originY - p.y;
        const homeDistSq = homeDx * homeDx + homeDy * homeDy;

        p.vx += homeDx * 0.075;
        p.vy += homeDy * 0.075;

        p.vx *= 0.83;
        p.vy *= 0.83;

        p.x += p.vx;
        p.y += p.vy;

        // Micro-snap when resting
        if (homeDistSq < 0.1 && Math.abs(p.vx) < 0.03 && Math.abs(p.vy) < 0.03) {
          p.x = p.originX;
          p.y = p.originY;
          p.vx = 0;
          p.vy = 0;
        }

        // 3. Render particle
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [prefersReducedMotion]);

  // Pointer event handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const mouse = mouseRef.current;
    if (mouse.lastX !== -9999) {
      mouse.vx = currentX - mouse.lastX;
      mouse.vy = currentY - mouse.lastY;
    }
    mouse.lastX = currentX;
    mouse.lastY = currentY;
    mouse.x = currentX;
    mouse.y = currentY;
    mouse.isHovered = true;
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mouse = mouseRef.current;
    mouse.x = x;
    mouse.y = y;
    mouse.lastX = x;
    mouse.lastY = y;
    mouse.vx = 0;
    mouse.vy = 0;
    mouse.isHovered = true;
  };

  const handlePointerLeave = () => {
    const mouse = mouseRef.current;
    mouse.isHovered = false;
    mouse.x = -9999;
    mouse.y = -9999;
    mouse.lastX = -9999;
    mouse.lastY = -9999;
    mouse.vx = 0;
    mouse.vy = 0;
  };

  return (
    <div
      ref={containerRef}
      className={`portfolio-hero__typography-wrapper ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        position: "relative",
        display: "inline-block",
        width: "100%",
        cursor: "default",
        userSelect: "none",
      }}
    >
      {/* Semantic Accessible Heading for SEO & Screen Readers */}
      <h1
        className="portfolio-hero__sr-heading"
        aria-label={`${text} - ${roleDescription}`}
      >
        {text}
      </h1>

      {/* Dense Fine-Grained Particle Typography Canvas */}
      {!prefersReducedMotion ? (
        <canvas
          ref={canvasRef}
          className="portfolio-hero__particle-canvas"
          style={{
            display: "block",
            pointerEvents: "none",
            position: "relative",
            zIndex: 3,
          }}
        />
      ) : (
        <h1 className="portfolio-hero__heading-fallback">{text}</h1>
      )}
    </div>
  );
};

export default ParticleTypography;
