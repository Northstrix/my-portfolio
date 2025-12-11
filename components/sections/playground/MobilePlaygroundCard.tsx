"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
  useAnimationControls,
} from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

// --- Configuration ---
const CARD_WIDTH = 320; 
const CARD_HEIGHT = 450;

// --- Helper: Backdrop/Glass Logic (Exact provided snippet) ---
interface BackdropOptions {
  supportsBackdropFilter: boolean;
  bodyOpacity: number;
  borderOpacity: number;
  blurStrength: number;
  isScrolled?: boolean;
}

export function getLegacyBackdropStyle({
  supportsBackdropFilter,
  bodyOpacity,
  borderOpacity,
  blurStrength,
  isScrolled = false,
}: BackdropOptions): React.CSSProperties {
  const invisibleOpacity = 0;

  return {
    background: supportsBackdropFilter
      ? `rgba(0, 0, 0, ${isScrolled ? bodyOpacity : invisibleOpacity})`
      : `rgba(0, 0, 0, ${isScrolled ? bodyOpacity + 0.2 : invisibleOpacity})`,
    backdropFilter: supportsBackdropFilter
      ? `blur(${isScrolled ? blurStrength : 0}px)`
      : undefined,
    WebkitBackdropFilter: supportsBackdropFilter
      ? `blur(${isScrolled ? blurStrength : 0}px)`
      : undefined,
    border: `1px solid rgba(255,255,255,${
      isScrolled ? borderOpacity : invisibleOpacity
    })`,
    boxShadow: isScrolled ? "0 2px 16px 0 rgba(0,0,0,0.08)" : "none",
    transition:
      "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease",
  };
}

interface MobilePlaygroundCardProps {
  onCardClick: (index: number) => void;
}

const MobilePlaygroundCard: React.FC<MobilePlaygroundCardProps> = ({
  onCardClick,
}) => {
  // --- State ---
  const [supportsBackdrop, setSupportsBackdrop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  
  // --- Physics ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = { stiffness: 100, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), springConfig);
  const glareOpacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.12, 0, 0.12]), springConfig);

  // --- Initialization ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSupportsBackdrop(
        CSS.supports("backdrop-filter: blur(0px)") ||
          CSS.supports("-webkit-backdrop-filter: blur(0px)")
      );
    }
  }, []);

  // --- Handlers ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleTap = () => {
    // Generate random id (0, 1, or 2)
    const randomId = Math.floor(Math.random() * 3);
    if (onCardClick) {
      onCardClick(randomId);
    }
  };

  // --- Styles ---
  
  // 1. Glassy Background
  const glassStyle = getLegacyBackdropStyle({
    supportsBackdropFilter: supportsBackdrop,
    bodyOpacity: 0.25, 
    borderOpacity: 0.15, 
    blurStrength: 75,
    isScrolled: true, 
  });

  // 2. Tricky Text Transition & Texture
  // Transition: Wait 1s, then Ease over 2s
  const textStyle: React.CSSProperties = {
    color: isHovered ? "#f12b30" : "#3662F4",
    transition: isHovered 
      ? "color 3.6s ease 1s"    // On Enter: Delay 1s, Duration 2s
      : "color 0.9s ease 0s", // On Leave: Instant reset
  };

  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-auto">
      <motion.div
        ref={cardRef}
        onTap={handleTap} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        drag
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
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
          width: isMobile ? '100%' : CARD_WIDTH,
          maxWidth: CARD_WIDTH,
          height: CARD_HEIGHT,
          willChange: "transform",
          borderRadius: "18px",
          overflow: "hidden",
          cursor: "pointer",
        }}
        animate={controls}
        whileTap={{ scale: 0.98 }}
        className="relative shadow-2xl transform-3d flex flex-col items-center touch-none p-4"
      >
        {/* --- Card Content --- */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between">
          
          {/* Main Image Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-[80%] h-[60%]">
              <Image
                src="/playground-card-image.webp"
                alt="Mobile Card"
                fill
                className="object-contain drop-shadow-xl opacity-75"
                priority
                style={{ mixBlendMode: "normal" }}
              />
            </div>
          </div>

          {/* Inscriptions (Top Left) */}
          <div 
            className="flex flex-col items-center gap-1 select-none pointer-events-none absolute top-4 left-4 opacity-80 mix-blend-overlay" 
            style={textStyle}
          >
             {["洪", "秀", "全"].map((char, i) => (
                <span key={i} className="font-serif font-black text-2xl leading-none drop-shadow-sm">
                  {char}
                </span>
             ))}
          </div>

          {/* Inscriptions (Bottom Right - Mirrored) */}
          <div 
            className="flex flex-col items-center gap-1 rotate-180 select-none pointer-events-none absolute bottom-4 right-4 opacity-80 mix-blend-overlay" 
            style={textStyle}
          >
             {["洪", "秀", "全"].map((char, i) => (
                <span key={i} className="font-serif font-black text-2xl leading-none drop-shadow-sm">
                  {char}
                </span>
             ))}
          </div>

        </div>

        {/* --- Effects --- */}
        
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
    </div>
  );
};

export default MobilePlaygroundCard;