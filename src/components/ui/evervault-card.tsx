import React, { useState, useCallback, useRef } from "react";

const generateRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><,./-=";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export interface EvervaultCardProps {
  text?: string;
  className?: string;
  color?: string;
  children?: React.ReactNode;
}

export const EvervaultCard: React.FC<EvervaultCardProps> = ({
  text,
  className = "",
  color = "#00d4ff",
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [randomString, setRandomString] = useState(() =>
    generateRandomString(1800)
  );

  const updateCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    containerRef.current.style.setProperty("--mouse-x", `${x}px`);
    containerRef.current.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updateCoordinates(e.clientX, e.clientY);
      setRandomString(generateRandomString(1800));
    },
    [updateCoordinates]
  );

  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updateCoordinates(e.clientX, e.clientY);
      setRandomString(generateRandomString(1800));
    },
    [updateCoordinates]
  );

  const onMouseLeave = useCallback(() => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty("--mouse-x", "-999px");
    containerRef.current.style.setProperty("--mouse-y", "-999px");
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`evervault-card-container relative overflow-hidden ${className}`}
      style={
        {
          "--card-glow": color,
          "--mouse-x": "-999px",
          "--mouse-y": "-999px",
        } as React.CSSProperties
      }
    >
      {/* 1. Dynamic Ambient Radial Glow Spotlight Layer */}
      <div className="evervault-glow-layer pointer-events-none absolute inset-0 z-0" />

      {/* 2. Encrypted Matrix Character Spotlight Layer */}
      <div
        className="evervault-matrix-layer pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{ borderRadius: "inherit" }}
      >
        <p
          className="evervault-characters font-mono select-none"
          style={{ color: color }}
        >
          {randomString}
        </p>
      </div>

      {/* 3. Card Content (Role, Company, Badges, Details) */}
      {children ? (
        <div className="relative z-10 w-full h-full">{children}</div>
      ) : (
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-44 w-44 rounded-full flex items-center justify-center text-white font-bold text-4xl">
            <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" />
            <span className="dark:text-white text-black z-20">{text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const Icon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className = "",
  ...rest
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={`evervault-corner-icon ${className}`}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

export default EvervaultCard;
