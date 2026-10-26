import React, { useRef, useEffect, useCallback } from "react";
import portraitImg from "../assets/darshil-portrait.png";

interface EducationRecord {
  institution: string;
  degree: string;
  period: string;
  location: string;
  courses: string[];
}

interface LanyardIdCardProps {
  educationData: EducationRecord[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  studentName: string;
}

export const LanyardIdCard: React.FC<LanyardIdCardProps> = ({
  educationData,
  activeIndex,
  onSelectIndex,
  studentName,
}) => {
  // Mutable Physics State declared before any hooks
  const physicsRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotZ: 0,
    rotX: 0,
    rotY: activeIndex === 1 ? 180 : 0,
    dragging: false,
    startX: 0,
    startY: 0,
    hasDragged: false,
    swayTime: 0,
    stageWidth: 420,
    stageHeight: 560,
  });

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lanyardSvgRef = useRef<SVGSVGElement>(null);

  // Dynamic SVG path refs
  const strapLeftRef = useRef<SVGPathElement>(null);
  const strapRightRef = useRef<SVGPathElement>(null);
  const strapLowerRef = useRef<SVGPathElement>(null);
  const clipGroupRef = useRef<SVGGElement>(null);

  const isFlipped = activeIndex === 1;

  // Toggle Flip Function
  const toggleFlip = useCallback(() => {
    const nextIdx = activeIndex === 0 ? 1 : 0;
    onSelectIndex(nextIdx);
  }, [activeIndex, onSelectIndex]);

  // Main Physics & Render Loop
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let isVisible = true;
    let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
    };
    reduceMotionQuery.addEventListener("change", handleMotionChange);

    let rafId: number;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(stage);

    const updateStageDimensions = () => {
      if (stage) {
        const rect = stage.getBoundingClientRect();
        physicsRef.current.stageWidth = rect.width;
        physicsRef.current.stageHeight = rect.height;
      }
    };
    updateStageDimensions();
    window.addEventListener("resize", updateStageDimensions);

    // Pointer Event Listeners
    const handlePointerDown = (e: PointerEvent) => {
      // Don't drag if clicking specific clickable buttons
      const target = e.target as HTMLElement;
      if (target.closest("button:not(.id-card-wrapper), a")) return;

      const p = physicsRef.current;
      p.dragging = true;
      p.hasDragged = false;
      p.startX = e.clientX - p.x;
      p.startY = e.clientY - p.y;
      p.vx = 0;
      p.vy = 0;

      stage.classList.add("is-dragging");
      try {
        stage.setPointerCapture(e.pointerId);
      } catch {
        // pointer capture fallback
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const p = physicsRef.current;
      if (!p.dragging) return;

      const rawX = e.clientX - p.startX;
      const rawY = e.clientY - p.startY;

      // Distance check for drag vs click
      if (Math.hypot(rawX - p.x, rawY - p.y) > 6) {
        p.hasDragged = true;
      }

      // Restrain drag limits so card stays connected to lanyard
      const clampedX = Math.max(-150, Math.min(150, rawX));
      const clampedY = Math.max(-35, Math.min(140, rawY));

      p.vx = clampedX - p.x;
      p.vy = clampedY - p.y;
      p.x = clampedX;
      p.y = clampedY;

      // Realistic tilt lag while dragging
      p.rotZ = Math.max(-28, Math.min(28, p.x * 0.22));
      p.rotX = Math.max(-18, Math.min(18, -p.y * 0.15));
    };

    const handlePointerUp = (e: PointerEvent) => {
      const p = physicsRef.current;
      if (!p.dragging) return;
      p.dragging = false;
      stage.classList.remove("is-dragging");

      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      // If user performed a clean tap/click without dragging, flip the card!
      if (!p.hasDragged) {
        toggleFlip();
      } else {
        p.justDropped = true;
        setTimeout(() => {
          p.justDropped = false;
        }, 120);
      }
    };

    stage.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    // Physics Animation Loop
    const springK = 0.055;
    const friction = 0.93;

    const frame = () => {
      const p = physicsRef.current;

      if (isVisible) {
        if (!p.dragging) {
          // Pendulum Spring Force
          const fx = -springK * p.x;
          const fy = -springK * p.y;

          p.vx = (p.vx + fx) * friction;
          p.vy = (p.vy + fy) * friction;

          p.x += p.vx;
          p.y += p.vy;

          // Natural pendulum torque: tilt follows displacement and swing speed
          const targetRotZ = p.x * 0.16 - p.vx * 0.5;
          p.rotZ += (targetRotZ - p.rotZ) * 0.14;

          const targetRotX = -p.y * 0.12 - p.vy * 0.35;
          p.rotX += (targetRotX - p.rotX) * 0.14;

          // Settle naturally to stationary resting position under gravity
          if (
            Math.abs(p.x) < 0.05 &&
            Math.abs(p.vx) < 0.01 &&
            Math.abs(p.y) < 0.05 &&
            Math.abs(p.vy) < 0.01
          ) {
            p.x = 0;
            p.y = 0;
            p.vx = 0;
            p.vy = 0;
            p.rotZ = 0;
            p.rotX = 0;
          }
        }

        // 3D Flip Interpolation towards active qualification
        const targetRotY = activeIndex === 1 ? 180 : 0;
        if (reduceMotion) {
          p.rotY = targetRotY;
          p.x = 0;
          p.y = 0;
          p.rotZ = 0;
          p.rotX = 0;
        } else {
          p.rotY += (targetRotY - p.rotY) * 0.12;
          if (Math.abs(targetRotY - p.rotY) < 0.08) {
            p.rotY = targetRotY;
          }
        }

        // Apply 3D Transform to Card
        if (cardRef.current) {
          const transformStr = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0px) rotateZ(${p.rotZ.toFixed(2)}deg) rotateX(${p.rotX.toFixed(2)}deg) rotateY(${p.rotY.toFixed(2)}deg)`;
          cardRef.current.style.transform = transformStr;
        }

        // Update Dynamic SVG Lanyard Ribbon Paths
        const cx = p.stageWidth / 2;
        const claspY = 56;
        const hookRestY = 115;
        const hookX = cx + p.x;
        const hookY = hookRestY + p.y;

        // V-Neck Straps
        if (strapLeftRef.current) {
          strapLeftRef.current.setAttribute(
            "d",
            `M ${cx - 48} 0 Q ${cx - 24} ${claspY * 0.5} ${cx} ${claspY}`
          );
        }
        if (strapRightRef.current) {
          strapRightRef.current.setAttribute(
            "d",
            `M ${cx + 48} 0 Q ${cx + 24} ${claspY * 0.5} ${cx} ${claspY}`
          );
        }

        // Lower strap segment connecting from clasp to swivel hook
        if (strapLowerRef.current) {
          const ctrlX = cx + (hookX - cx) * 0.45;
          const ctrlY = claspY + (hookY - claspY) * 0.45;
          strapLowerRef.current.setAttribute(
            "d",
            `M ${cx} ${claspY} Q ${ctrlX} ${ctrlY} ${hookX} ${hookY - 14}`
          );
        }

        // Move Metallic Swivel Clip to Card Attachment Point
        if (clipGroupRef.current) {
          clipGroupRef.current.setAttribute(
            "transform",
            `translate(${hookX}, ${hookY - 6}) rotate(${p.rotZ.toFixed(2)})`
          );
        }
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", updateStageDimensions);
      reduceMotionQuery.removeEventListener("change", handleMotionChange);
      stage.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [activeIndex, toggleFlip]);

  const primaryEdu = educationData[0];
  const secondaryEdu = educationData[1] || educationData[0];

  return (
    <div className="id-card-stage" ref={stageRef}>
      {/* Dynamic Physical Lanyard SVG Layer */}
      <svg className="id-card-lanyard-svg" ref={lanyardSvgRef}>
        <defs>
          {/* Lanyard Fabric Pattern / Gradient */}
          <linearGradient id="lanyardStrapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#050814" />
            <stop offset="12%" stopColor="#00d4ff" />
            <stop offset="22%" stopColor="#0c1024" />
            <stop offset="78%" stopColor="#0c1024" />
            <stop offset="88%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#050814" />
          </linearGradient>

          {/* Metal Chrome Gradient for Clip & Clasp */}
          <linearGradient id="metalChromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="25%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="75%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Clip Drop Shadow */}
          <filter id="clipShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* Left V-Neck Ribbon */}
        <path
          ref={strapLeftRef}
          d="M 160 0 Q 185 30 210 56"
          stroke="url(#lanyardStrapGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
          filter="url(#clipShadow)"
        />

        {/* Right V-Neck Ribbon */}
        <path
          ref={strapRightRef}
          d="M 260 0 Q 235 30 210 56"
          stroke="url(#lanyardStrapGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
          filter="url(#clipShadow)"
        />

        {/* Lower Ribbon Segment to Hook */}
        <path
          ref={strapLowerRef}
          d="M 210 56 Q 210 85 210 100"
          stroke="url(#lanyardStrapGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          filter="url(#clipShadow)"
        />

        {/* Metallic Clasp Junction at V-Neck Split */}
        <g transform="translate(0, 0)">
          {/* Outer Clasp Ring */}
          <rect
            x="200"
            y="50"
            width="20"
            height="12"
            rx="4"
            fill="url(#metalChromeGrad)"
            stroke="#1e293b"
            strokeWidth="0.8"
            filter="url(#clipShadow)"
          />
          <circle cx="210" cy="56" r="3.5" fill="#0f172a" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        </g>

        {/* Swivel Snap Hook Clip (Moves with Card Anchor) */}
        <g ref={clipGroupRef} filter="url(#clipShadow)">
          {/* Swivel Top Ring */}
          <circle cx="0" cy="-16" r="6" fill="none" stroke="url(#metalChromeGrad)" strokeWidth="3.2" />
          {/* Swivel Barrel Cylinder */}
          <rect x="-4.5" y="-12" width="9" height="10" rx="2.5" fill="url(#metalChromeGrad)" stroke="#1e293b" strokeWidth="0.6" />
          <line x1="-4" y1="-7" x2="4" y2="-7" stroke="#334155" strokeWidth="0.8" />
          {/* Spring Snap Hook Arm passing through punch slot */}
          <path
            d="M -3 -2 L -3 10 C -3 15 4 15 4 10 L 4 1 C 4 -2 0 -2 0 4 L 0 9"
            stroke="url(#metalChromeGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>

      {/* 3D Physical ID Card Wrapper */}
      <div
        className="id-card-wrapper"
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`Student ID Card: ${isFlipped ? secondaryEdu.degree : primaryEdu.degree}. Click to flip or drag to swing.`}
        title="Click to flip qualification · Drag to swing"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleFlip();
          }
        }}
      >
        <div className="id-card-inner">
          {/* ========================================================
              FRONT FACE: Degree 1 (B.E. Computer Engineering / LDRP)
              ======================================================== */}
          <div className="id-card-face id-card-face--front">
            {/* Glossy Reflective Sheen Layer */}
            <div className="id-card-gloss" />

            <div>
              {/* Punch Slot for Lanyard Hook */}
              <div className="id-card-punch-slot" />

              {/* Holographic Security Ribbon Line */}
              <div className="id-card-holo-stripe" />

              {/* Institution Header */}
              <div className="id-card-header">
                <div className="id-card-univ-name">{primaryEdu.institution}</div>
                <div className="id-card-badge-type">STUDENT IDENTIFICATION</div>
              </div>

              {/* Middle Row: Photo + Golden EMV Chip & Validity */}
              <div className="id-card-mid">
                <div className="id-card-photo-box">
                  <img
                    src={portraitImg}
                    alt={studentName}
                    className="id-card-photo"
                    loading="eager"
                  />
                  <div className="id-card-photo-watermark">KSV // AUTH</div>
                </div>

                <div className="id-card-mid-info">
                  {/* Golden Smart Card Chip */}
                  <div className="id-card-chip" title="EMV Smart Chip">
                    <div className="id-card-chip-line-h" />
                    <div className="id-card-chip-line-v1" />
                    <div className="id-card-chip-line-v2" />
                  </div>

                  <div className="id-card-pill-tag">
                    <span className="id-card-status-dot" />
                    <span>GRADUATED</span>
                  </div>

                  <div className="id-card-pill-tag" style={{ color: "var(--cyan, #00d4ff)" }}>
                    <span>{primaryEdu.period}</span>
                  </div>
                </div>
              </div>

              {/* Student Bio Info */}
              <div className="id-card-bio">
                <div className="id-card-name">{studentName}</div>
                <div className="id-card-degree-name">{primaryEdu.degree}</div>
                <div className="id-card-meta-row">
                  <span>LOC: {primaryEdu.location.split(",")[0].toUpperCase()}</span>
                  <span>STATUS: GRADUATED</span>
                </div>
              </div>
            </div>

            {/* Bottom: Barcode & Flip Hint */}
            <div className="id-card-bottom">
              <div className="id-card-barcode-wrap">
                <div className="id-card-barcode-bars" />
                <div className="id-card-barcode-num">GRAD // 2023-2026 // LDRP-ITR</div>
              </div>
              <div className="id-card-flip-cue">
                <span>↻ CLICK TO FLIP QUALIFICATION</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              REVERSE FACE: Degree 2 (Diploma CE / MSU Baroda)
              ======================================================== */}
          <div className="id-card-face id-card-face--back">
            {/* Glossy Reflective Sheen Layer */}
            <div className="id-card-gloss" />

            <div>
              {/* Punch Slot for Lanyard Hook */}
              <div className="id-card-punch-slot" />

              {/* Magnetic Stripe across the top */}
              <div className="id-card-magstripe" />

              {/* Institution Header */}
              <div className="id-card-header">
                <div className="id-card-univ-name">{secondaryEdu.institution}</div>
                <div className="id-card-badge-type">POLYTECHNIC DIVISION // ALUMNI</div>
              </div>

              {/* Middle Row: Photo + University Academic Detail */}
              <div className="id-card-mid">
                <div className="id-card-photo-box">
                  <img
                    src={portraitImg}
                    alt={studentName}
                    className="id-card-photo"
                    loading="lazy"
                  />
                  <div className="id-card-photo-watermark">MSU // DIPLOMA</div>
                </div>

                <div className="id-card-mid-info">
                  <div className="id-card-pill-tag">
                    <span className="id-card-status-dot" />
                    <span>GRADUATED</span>
                  </div>
                  <div className="id-card-pill-tag" style={{ color: "var(--cyan, #00d4ff)" }}>
                    <span>{secondaryEdu.period}</span>
                  </div>
                  <div className="id-card-pill-tag">
                    <span>{secondaryEdu.location}</span>
                  </div>
                </div>
              </div>

              {/* Student Bio Info */}
              <div className="id-card-bio">
                <div className="id-card-name">{studentName}</div>
                <div className="id-card-degree-name">{secondaryEdu.degree}</div>
                <div className="id-card-meta-row">
                  <span>CAMPUS: VADODARA</span>
                  <span>STATUS: GRADUATED</span>
                </div>
              </div>

              {/* Signature Panel */}
              <div className="id-card-sig-panel">
                <span>Darshil G.</span>
              </div>
              <div className="id-card-disclaimer">
                This student identification card is property of the university. If found, please return to the academic registrar.
              </div>
            </div>

            {/* Bottom: Barcode & Flip Hint */}
            <div className="id-card-bottom">
              <div className="id-card-barcode-wrap">
                <div className="id-card-barcode-bars" />
                <div className="id-card-barcode-num">ALUMNI // 2020-2023 // MSU-BARODA</div>
              </div>
              <div className="id-card-flip-cue">
                <span>↻ CLICK TO FLIP QUALIFICATION</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanyardIdCard;
