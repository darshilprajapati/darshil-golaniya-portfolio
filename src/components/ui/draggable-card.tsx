import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";

interface DraggableCardContextType {
  containerRef: React.RefObject<HTMLDivElement | null>;
  bringToFront: (id: string) => number;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

const DraggableCardContext = createContext<DraggableCardContextType | null>(
  null
);

export interface DraggableCardContainerProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const DraggableCardContainer: React.FC<DraggableCardContainerProps> = ({
  className = "",
  style,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zIndexCounter = useRef<number>(20);
  const [activeId, setActiveId] = useState<string | null>(null);

  const bringToFront = useCallback((id: string) => {
    zIndexCounter.current += 1;
    setActiveId(id);
    return zIndexCounter.current;
  }, []);

  return (
    <DraggableCardContext.Provider
      value={{
        containerRef,
        bringToFront,
        activeId,
        setActiveId,
      }}
    >
      <div
        ref={containerRef}
        className={`draggable-card-container ${className}`}
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          touchAction: "none",
          ...style,
        }}
      >
        {children}
      </div>
    </DraggableCardContext.Provider>
  );
};

export interface DraggableCardBodyProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  initialX?: number;
  initialY?: number;
  initialRotate?: number;
  initialZIndex?: number;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  ariaLabel?: string;
}

export const DraggableCardBody: React.FC<DraggableCardBodyProps> = ({
  id = "",
  className = "",
  style,
  initialX = 0,
  initialY = 0,
  initialRotate = 0,
  initialZIndex = 10,
  onClick,
  children,
  ariaLabel,
}) => {
  const context = useContext(DraggableCardContext);
  const [currentZIndex, setCurrentZIndex] = useState(initialZIndex);
  const [isDragging, setIsDragging] = useState(false);

  // Pointer drag distance tracking to strictly distinguish drag from click
  const dragDistanceRef = useRef(0);
  const dragStartPointRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  // Dynamic tilt motion values during dragging
  const x = useMotionValue(0);
  // Mild dynamic tilt based on horizontal drag offset
  const dynamicRotate = useTransform(
    x,
    [-180, 180],
    [initialRotate - 8, initialRotate + 8]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    dragDistanceRef.current = 0;
    dragStartPointRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;

    if (context && id) {
      const newZ = context.bringToFront(id);
      setCurrentZIndex(newZ);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dx = e.clientX - dragStartPointRef.current.x;
    const dy = e.clientY - dragStartPointRef.current.y;
    const dist = Math.hypot(dx, dy);
    dragDistanceRef.current = dist;
    if (dist > 6) {
      hasDraggedRef.current = true;
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    hasDraggedRef.current = true;
    if (context && id) {
      const newZ = context.bringToFront(id);
      setCurrentZIndex(newZ);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    if (Math.hypot(info.offset.x, info.offset.y) > 6) {
      hasDraggedRef.current = true;
    }
    // Briefly keep flag true to suppress synthetic click after drag release
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 80);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hasDraggedRef.current || dragDistanceRef.current > 6) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent);
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={context?.containerRef || false}
      dragElastic={0.16}
      dragTransition={{ power: 0.18, timeConstant: 240 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel || "Draggable Certificate Card. Click to inspect, drag to move."}
      whileHover={{ scale: isDragging ? 1.05 : 1.025 }}
      whileTap={{ cursor: "grabbing" }}
      whileDrag={{
        scale: 1.05,
        cursor: "grabbing",
        boxShadow: "0 28px 60px rgba(0, 0, 0, 0.85), 0 0 25px rgba(0, 212, 255, 0.25)",
      }}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        x,
        rotate: dynamicRotate,
        zIndex: currentZIndex,
        cursor: isDragging ? "grabbing" : "grab",
        willChange: "transform",
        touchAction: "none",
        ...style,
      }}
      initial={{
        x: initialX,
        y: initialY,
        rotate: initialRotate,
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      }}
      className={`draggable-card-body ${className}`}
    >
      {children}
    </motion.div>
  );
};
