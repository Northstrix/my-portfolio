"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Import Shaders
import BalatroShader from "./shaders/Balatro";
import FlowShader from "./shaders/Flow";
import VoronoiShader from "./shaders/Voronoi";

// ==========================================
// INDIVIDUAL CARD COMPONENT
// ==========================================

interface PlaygroundCardProps {
  // Visuals
  imageSrc: string;
  revealImageSrc?: string;
  imageHeightPercentage: number;
  shader: React.ReactNode;
  backgroundColor?: string;
  enableVignette?: boolean;
  
  // Dimensions
  width: number;
  height: number;
  scaleFactor: number;

  // Positioning
  rotation: number;
  translateX: number;
  zIndex: number;
  
  // Inscriptions
  textArray: string[];
  mirroredTextArray: string[];
  
  // Colors
  inscriptionColor: string;
  inscriptionColorHovered: string;
  
  // Interaction
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  isStackExpanded: boolean;
  
  // Context
  isRTL: boolean;
}

const PlaygroundCard = ({
  imageSrc,
  revealImageSrc,
  imageHeightPercentage,
  shader,
  backgroundColor = "#fff",
  enableVignette = false,
  width,
  height,
  scaleFactor,
  rotation,
  translateX,
  zIndex,
  textArray,
  mirroredTextArray,
  inscriptionColor,
  inscriptionColorHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
  isStackExpanded,
  isRTL,
}: PlaygroundCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic Styles based on scale
  const borderRadius = "var(--outer-playing-card-rounding)";
  const fontSize = 24 * scaleFactor;
  const textPadding = 20 * scaleFactor;

  // Unveil: Slide the white cover away
  const coverVariants: Variants = {
    hidden: { 
      x: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    visible: { 
      x: isRTL ? "-100%" : "100%", 
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const renderInscription = (chars: string[]) => (
    <div className="flex flex-col items-center gap-[0.17em] leading-none">
      {chars.map((char, i) => (
        <div key={i}>{char}</div>
      ))}
    </div>
  );

  return (
    <motion.div
      className={cn(
        "absolute top-0 origin-center shadow-2xl transform-gpu select-none", // Added select-none
        // Enable pointer events on the card itself so clicks work
        "pointer-events-auto",
        // Cursor logic: Only pointer if unfolded or hovered
        (isStackExpanded || isHovered) ? "cursor-pointer" : "cursor-default"
      )}
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
        left: `calc(50% - ${width / 2}px)`, 
      }}
      animate={{
        rotate: rotation,
        x: translateX,
        scale: 1, 
        zIndex: zIndex,
      }}
      transition={{ 
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 1,
      }}
      onHoverStart={() => {
        setIsHovered(true);
        onMouseEnter();
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        onMouseLeave();
      }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent bubbling if container has other clicks
        onClick();
      }}
    >
      {/* Border Container */}
      <div
        className="w-full h-full p-[1px] transition-colors duration-300"
        style={{
          borderRadius: borderRadius,
          backgroundColor: isHovered ? "var(--border-color, #000)" : "#aaa",
        }}
      >
        {/* Inner Content */}
        <div 
          className="relative w-full h-full overflow-hidden"
          style={{ 
            backgroundColor: backgroundColor,
            borderRadius: "var(--playing-card-rounding)",
          }}
        >
          {/* Layer 0: Shader & Vignette */}
          {/* Both are at Z-0, meaning they sit BEHIND the white cover (Z-10) */}
          <div className="absolute inset-0 z-0">
            {shader}
            
            {/* Vignette is now here, part of the shader layer */}
            {enableVignette && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
                    mixBlendMode: "multiply"
                }}
              />
            )}
          </div>

          {/* Layer 1: White Cover (The "Paper") */}
          <motion.div
            className="absolute inset-0 z-10 bg-white"
            variants={coverVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
          />

          {/* Layer 2: Images */}
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <div 
              className="relative w-full"
              style={{ height: `${imageHeightPercentage}%` }}
            >
              <Image
                src={imageSrc}
                alt="card-visual"
                fill
                className="object-contain drop-shadow-lg"
                style={{ opacity: 1 }} 
                draggable={false} // Prevent image dragging
                priority
              />
              {revealImageSrc && (
                <div 
                  className="absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out"
                  style={{ opacity: isHovered ? 1 : 0 }}
                >
                  <Image
                    src={revealImageSrc}
                    alt="card-reveal"
                    fill
                    className="object-contain drop-shadow-lg"
                    draggable={false} // Prevent image dragging
                    priority
                  />
                </div>
              )}
            </div>
          </div>

          {/* Layer 3: Inscriptions */}
{/* Layer 3: Inscriptions */}
<div
  className="absolute inset-0 z-30 pointer-events-none select-none font-serif font-black"
  style={{
    color: isHovered ? inscriptionColorHovered : inscriptionColor,
    transition: "color 0.3s ease-in-out",
    fontSize: `${fontSize}px`,
  }}
>
  {/* Top inscription (normal) */}
  <div style={{ position: "absolute", top: textPadding, left: textPadding }}>
    {renderInscription(textArray)}
  </div>

  {/* Mirrored Bottom inscription (flipped like a real playing card) */}
  <div
    style={{
      position: "absolute",
      bottom: textPadding,
      right: textPadding,
      transform: "scale(-1, -1)", // mirror across both axes
      transformOrigin: "center",
    }}
  >
    {renderInscription(mirroredTextArray)}
  </div>
</div>


        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN AREA COMPONENT
// ==========================================

interface PlaygroundCardAreaProps {
  isRTL: boolean;
  onCardClick: (index: number) => void;
  activeCard?: number;
  containerWidth: number;
  shaderKey: number; // Used to force remount shaders
}

const PlaygroundCardArea = ({ 
  isRTL, 
  containerWidth,
  onCardClick,
  shaderKey
}: PlaygroundCardAreaProps) => {
  
  const [isStackExpanded, setIsStackExpanded] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. Calculate Responsive Sizes ---
  const { cardWidth, cardHeight, scaleFactor } = useMemo(() => {
    const minBreak = 912;
    const maxBreak = 1200;
    const minCardW = 240;
    const maxCardW = 360;

    let w = maxCardW;
    if (containerWidth >= maxBreak) {
      w = maxCardW;
    } else if (containerWidth <= minBreak) {
      w = minCardW;
    } else {
      const t = (containerWidth - minBreak) / (maxBreak - minBreak);
      w = minCardW + t * (maxCardW - minCardW);
    }

    return { 
      cardWidth: w, 
      cardHeight: w * 1.4, 
      scaleFactor: w / maxCardW 
    };
  }, [containerWidth]);

  // --- 2. Card Data ---
  // Using shaderKey as the key for shader components forces them to remount (reload)
  const cardsData = useMemo(() => [
    {
      id: 0, 
      imageSrc: "/playground-card-image.webp",
      imageHeightPercentage: 70,
      shader: <BalatroShader key={`balatro-${shaderKey}`} />, 
      backgroundColor: "#fff",
      textArray: ["洪", "秀", "全"],
      mirroredTextArray: ["洪", "秀", "全"],
      inscriptionColor: "#3662F4",
      inscriptionColorHovered: "#fff",
      enableVignette: false,
    },
    {
      id: 1,
      imageSrc: "/second-playground-card-image.png",
      revealImageSrc: "/second-playground-card-reveal-image.png",
      imageHeightPercentage: 80,
      shader: <FlowShader key={`flow-${shaderKey}`} />,
      backgroundColor: "#fff",
      textArray: ["改", "善"],
      mirroredTextArray: ["改", "善"],
      inscriptionColor: "#00A9FE",
      inscriptionColorHovered: "#fff",
      enableVignette: true,
    },
    {
      id: 2, 
      imageSrc: "/third-playground-card-image.png",
      revealImageSrc: "/third-playground-card-reveal-image.png",
      imageHeightPercentage: 92,
      shader: <VoronoiShader key={`voronoi-${shaderKey}`} />,
      backgroundColor: "#fff",
      textArray: ["武", "士", "道"],
      mirroredTextArray: ["さ", "む", "ら", "い"],
      inscriptionColor: "#000",
      inscriptionColorHovered: "#fff",
      enableVignette: true,
    },
  ], [shaderKey]); // Recalculate if shaderKey changes

  // --- 3. Interaction Logic ---
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsStackExpanded(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsStackExpanded(false);
    }, 150);
  };

  const getCardTransform = (index: number, total: number) => {
    const centerOffset = index - (total - 1) / 2;
    const compactSpacing = 18 * scaleFactor; 
    const compactRotation = 6;
    const gap = 12 * scaleFactor;
    const expandedSpacing = cardWidth + gap;

    let x = 0;
    let r = 0;

    if (isStackExpanded) {
      x = centerOffset * expandedSpacing;
      r = 0;
    } else {
      x = centerOffset * compactSpacing;
      r = centerOffset * compactRotation;
    }

    if (isRTL) return { x: -x, rotation: -r };
    return { x, rotation: r };
  };

  return (
    <div 
      className="relative w-full flex items-center justify-center py-20 min-h-[650px]"
      // Ensure this area itself allows pointer events to pass through voids, 
      // but catches interaction on the cards.
      style={{ pointerEvents: "none" }}
    >
      <div 
        className="relative [perspective:1000px]"
        style={{
          width: cardWidth,
          height: cardHeight,
          pointerEvents: "none" // Container is ghost
        }}
      >
        {cardsData.map((card, index) => {
          const { x, rotation } = getCardTransform(index, cardsData.length);
          return (
            <PlaygroundCard
              key={card.id}
              {...card}
              width={cardWidth}
              height={cardHeight}
              scaleFactor={scaleFactor}
              translateX={x}
              rotation={rotation}
              zIndex={index}
              isRTL={isRTL}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => onCardClick(card.id)}
              isStackExpanded={isStackExpanded}
              // Card component enforces pointer-events-auto
            />
          );
        })}
      </div>
    </div>
  );
};

export default PlaygroundCardArea;