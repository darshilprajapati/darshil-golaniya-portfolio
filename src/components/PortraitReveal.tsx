import React, { useRef, useState, useCallback, useEffect } from "react";
import portraitImg from "../assets/darshil-portrait.png";

interface PortraitRevealProps {
  className?: string;
}

export const PortraitReveal: React.FC<PortraitRevealProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maskPos, setMaskPos] = useState({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = useState(false);
  const targetPosRef = useRef({ x: -500, y: -500 });
  const currentPosRef = useRef({ x: -500, y: -500 });
  const animFrameRef = useRef<number | null>(null);

  // Smooth lerp movement for mask tracking
  useEffect(() => {
    let active = true;

    const updateLoop = () => {
      if (!active) return;

      const target = targetPosRef.current;
      const current = currentPosRef.current;

      const dx = target.x - current.x;
      const dy = target.y - current.y;

      // Lerp tracking
      current.x += dx * 0.18;
      current.y += dy * 0.18;

      setMaskPos({ x: Math.round(current.x), y: Math.round(current.y) });

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    targetPosRef.current = { x, y };
    if (!isHovered) {
      setIsHovered(true);
    }
  }, [isHovered]);

  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    targetPosRef.current = { x, y };
    currentPosRef.current = { x, y };
    setMaskPos({ x, y });
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    targetPosRef.current = { x: -500, y: -500 };
  }, []);

  // Soft, feathered gradient mask without any circular outline
  const colorMaskStyle = isHovered
    ? `radial-gradient(circle 160px at ${maskPos.x}px ${maskPos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0) 100%)`
    : `radial-gradient(circle 0px at ${maskPos.x}px ${maskPos.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)`;

  return (
    <div
      ref={containerRef}
      className={`portfolio-hero__portrait-wrapper ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Background ambient gold wire curves for spatial depth */}
      <svg
        className="portfolio-hero__portrait-ambient-curves"
        viewBox="0 0 500 550"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M 50,300 C 30,120 180,40 380,110 C 520,160 480,380 340,460 C 200,530 80,480 60,350"
          stroke="rgba(54, 217, 255, 0.22)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <path
          d="M 110,240 C 90,80 260,20 420,130 C 510,210 460,430 310,480"
          stroke="rgba(71, 123, 255, 0.2)"
          strokeWidth="1"
        />
      </svg>

      {/* Subtle fine dotted matrix texture */}
      <div className="portfolio-hero__portrait-dots" aria-hidden="true" />

      {/* Second, offset translucent glass panel behind the main frame */}
      <div className="portfolio-hero__glass-panel-backdrop" aria-hidden="true" />

      {/* Main modern tilted glass-style picture frame with glowing champagne-gold rim */}
      <div className="portfolio-hero__glass-frame">
        {/* Glowing edge lighting overlay */}
        <div className="portfolio-hero__frame-rim-light" aria-hidden="true" />

        {/* Inner portrait content */}
        <div className="portfolio-hero__portrait-inner">
          {/* Base layer: Grayscale photograph with crisp contrast */}
          <img
            src={portraitImg}
            alt="Darshil Golaniya"
            className="portfolio-hero__portrait-img portfolio-hero__portrait-img--bw"
            loading="eager"
            decoding="async"
            width={576}
            height={1024}
          />

          {/* Reveal layer: Full color photograph revealed under cursor */}
          <div
            className="portfolio-hero__portrait-color-layer"
            style={{
              position: "absolute",
              inset: 0,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.35s ease",
              WebkitMaskImage: colorMaskStyle,
              maskImage: colorMaskStyle,
              pointerEvents: "none",
            }}
          >
            <img
              src={portraitImg}
              alt=""
              aria-hidden="true"
              className="portfolio-hero__portrait-img portfolio-hero__portrait-img--color"
              loading="eager"
              decoding="async"
              width={576}
              height={1024}
            />
          </div>

          {/* Subtle bottom gradient to blend the suit into the frame base */}
          <div className="portfolio-hero__frame-bottom-fade" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default PortraitReveal;
