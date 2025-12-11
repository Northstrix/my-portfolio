"use client";

import { cn } from "@/lib/utils";
import React, {
  useRef,
  useState,
  useEffect,
  ReactElement,
  ReactNode,
} from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
  useAnimationControls,
} from "framer-motion";

// --- Configuration ---
const CARD_WIDTH = 520; // Adjust card width here
const IMG_ASPECT_RATIO = 1280 / 935; // Exact aspect ratio

// --- Helper: Backdrop/Glass Logic ---
interface BackdropOptions {
  supportsBackdropFilter: boolean;
  bodyOpacity: number;
  borderOpacity: number;
  blurStrength: number;
  isScrolled?: boolean;
}

function getLegacyBackdropStyle({
  supportsBackdropFilter,
  bodyOpacity,
  borderOpacity,
  blurStrength,
  isScrolled = false,
}: BackdropOptions): React.CSSProperties {
  const targetOpacity = isScrolled ? bodyOpacity : 0.05;
  return {
    backgroundColor: supportsBackdropFilter
      ? `rgba(8, 8, 8, ${targetOpacity})`
      : `rgba(8, 8, 8, 0.85)`,
    backdropFilter: supportsBackdropFilter
      ? `blur(${isScrolled ? blurStrength : 0}px)`
      : undefined,
    WebkitBackdropFilter: supportsBackdropFilter
      ? `blur(${isScrolled ? blurStrength : 0}px)`
      : undefined,
    border: `1px solid rgba(255,255,255,${isScrolled ? borderOpacity : 0.1})`,
    boxShadow: isScrolled
      ? "0 8px 32px 0 rgba(0, 0, 0, 0.25)"
      : "none",
    transition:
      "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease",
  };
}

// --- Main Component ---
export const DraggableCardBody = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  // 1. Hook for responsive padding
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const [supportsBackdrop, setSupportsBackdrop] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSupportsBackdrop(
        CSS.supports("backdrop-filter: blur(0px)") ||
          CSS.supports("-webkit-backdrop-filter: blur(0px)")
      );
    }
  }, []);

  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  };

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [10, -10]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-10, 10]),
    springConfig
  );
  const glareOpacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.12, 0, 0.12]),
    springConfig
  );

  useEffect(() => {
    const updateConstraints = () => {
      if (typeof window !== "undefined") {
        setConstraints({
          top: -window.innerHeight / 2 + 100,
          left: -window.innerWidth / 2 + 100,
          right: window.innerWidth / 2 - 100,
          bottom: window.innerHeight / 2 - 100,
        });
      }
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => {
      window.removeEventListener("resize", updateConstraints);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(clientX - centerX);
    mouseY.set(clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const glassStyle = getLegacyBackdropStyle({
    supportsBackdropFilter: supportsBackdrop,
    bodyOpacity: 0.6,
    borderOpacity: 0.15,
    blurStrength: 18,
    isScrolled: true,
  });

  // 2. Determine padding based on device
  const paddingClass = isMobile ? "p-4" : "p-6";

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraints}
      onDragStart={() => (document.body.style.cursor = "grabbing")}
      onDragEnd={(event, info) => {
        document.body.style.cursor = "default";
        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: { type: "spring", ...springConfig },
        });
        const bounce = Math.min(
          0.8,
          Math.sqrt(velocityX.get() ** 2 + velocityY.get() ** 2) / 1000
        );
        animate(info.point.x, info.point.x + velocityX.get() * 0.3, {
          type: "spring",
          bounce,
          duration: 0.8,
        });
        animate(info.point.y, info.point.y + velocityY.get() * 0.3, {
          type: "spring",
          bounce,
          duration: 0.8,
        });
      }}
      style={{
        ...glassStyle,
        rotateX,
        rotateY,
        width: CARD_WIDTH, // Applied from constant
        willChange: "transform",
        borderRadius: "var(--border-radius)",
        overflow: "hidden",
      }}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        // Removed min-h-[300px], added h-auto
        "relative h-auto shadow-2xl transform-3d flex flex-col items-center cursor-grab active:cursor-grabbing",
        className
      )}
    >
      <div
        className={cn(
          "relative z-10 w-full h-full flex flex-col gap-4",
          paddingClass
        )}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) {
            return (
              <div className="text-[rgba(255,255,255,0.92)] font-medium tracking-wide drop-shadow-sm select-none pointer-events-none py-1">
                {child}
              </div>
            );
          }

          // Narrow the type so TypeScript knows `props` exists
          const element = child as ReactElement<any>;

          // If the child is an <img> or a plain <div>, treat it as media
          if (element.type === "img" || element.type === "div") {
            return (
              <div
                className="relative w-full overflow-hidden rounded-[var(--border-radius)] flex-shrink-0"
                style={{
                  border: glassStyle.border,
                  aspectRatio: `${IMG_ASPECT_RATIO}`, // Enforced Aspect Ratio
                }}
              >
                {React.cloneElement(element, {
                  className: cn(
                    "w-full h-full object-cover object-center opacity-75 select-none pointer-events-none",
                    element.props.className
                  ),
                  draggable: false,
                  style: {
                    ...element.props.style,
                    objectFit: "cover",
                    objectPosition: "center center",
                    mixBlendMode: "normal",
                  },
                })}
              </div>
            );
          }

          // Fallback: treat as text content
          return (
            <div className="text-[rgba(255,255,255,0.92)] font-medium tracking-wide drop-shadow-sm select-none pointer-events-none py-1">
              {child}
            </div>
          );
        })}
      </div>

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glare Effect */}
      <motion.div
        style={{ opacity: glareOpacity }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent z-20"
      />
    </motion.div>
  );
};

export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "[perspective:3000px] flex items-center justify-center p-8",
        className
      )}
      style={{
        direction: 'rtl'
      }}
    >
      {children}
    </div>
  );
};
