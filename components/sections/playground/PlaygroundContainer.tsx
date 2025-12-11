"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import PlaygroundCardArea from "@/components/sections/playground/PlaygroundCardArea";
import MobilePlaygroundCard from "@/components/sections/playground/MobilePlaygroundCard";

interface PlaygroundContainerProps {
  isRTL: boolean;
  onCardClick: (index: number) => void;
  activeCard: number;
  containerWidth: number;
  shaderKey: number;
}

const PlaygroundContainer: React.FC<PlaygroundContainerProps> = ({
  isRTL,
  onCardClick,
  activeCard,
  containerWidth,
  shaderKey,
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);

  // --- 1. Resize Logic ---
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 876);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- 2. Glow Animation Logic (Only active on Desktop via conditional rendering) ---
  const handleMove = useCallback(
    (e?: MouseEvent | { x: number; y: number }) => {
      if (!containerRef.current) return;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const element = containerRef.current;
        if (!element) return;

        const { left, top, width, height } = element.getBoundingClientRect();
        const mouseX = e?.x ?? lastPosition.current.x;
        const mouseY = e?.y ?? lastPosition.current.y;

        if (e) {
          lastPosition.current = { x: mouseX, y: mouseY };
        }

        const centerX = left + width * 0.5;
        const centerY = top + height * 0.5;
        const distanceFromCenter = Math.hypot(
          mouseX - centerX,
          mouseY - centerY
        );

        const inactiveRadius = 0.5 * Math.min(width, height) * 0.01;
        if (distanceFromCenter < inactiveRadius) {
          element.style.setProperty("--active", "0");
          return;
        }

        const isActive =
          mouseX > left - 64 &&
          mouseX < left + width + 64 &&
          mouseY > top - 64 &&
          mouseY < top + height + 64;

        element.style.setProperty("--active", isActive ? "1" : "0");
        if (!isActive) return;

        const currentAngle =
          parseFloat(element.style.getPropertyValue("--start")) || 0;
        let targetAngle =
          (180 * Math.atan2(mouseY - centerY, mouseX - centerX)) / Math.PI +
          90;
        const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
        const newAngle = currentAngle + angleDiff;

        animate(currentAngle, newAngle, {
          duration: 2,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (value) => {
            element.style.setProperty("--start", String(value));
          },
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!isCardHovered || isMobile) return;

    const handleScroll = () => handleMove();
    const handlePointerMove = (e: PointerEvent) =>
      handleMove({ x: e.clientX, y: e.clientY });

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.body.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
      document.body.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handleMove, isCardHovered, isMobile]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "group/bento flex flex-col h-full relative",
        // Only apply transition and shadow classes if NOT mobile
        !isMobile && "hover:shadow-xl transition duration-200",
        "[--spread:40] [--start:0] [--active:0] [--glowingeffect-border-width:1px] [--repeating-conic-gradient-times:5]"
      )}
      style={
        {
          "--gradient": `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%), radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%), radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%), radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%), repeating-conic-gradient(from 236.84deg at 50% 50%, #dd7bbb 0%, #d79f1e calc(25% / var(--repeating-conic-gradient-times)), #5a922c calc(50% / var(--repeating-conic-gradient-times)), #4c7894 calc(75% / var(--repeating-conic-gradient-times)), #dd7bbb calc(100% / var(--repeating-conic-gradient-times)))`,
          // On mobile, remove visible container styles so only the card is seen
          padding: isMobile ? "0" : "1px",
          borderRadius: "var(--border-radius)",
          border: "1px solid var(--border-color)",
          transition: "background-color 0.3s ease-in-out, border 0.3s ease-in-out",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          backgroundColor: isMobile 
            ? "transparent" 
            : (isCardHovered
                ? "var(--lightened-background-adjacent-color)"
                : "var(--background-adjacent-color)"),
        } as React.CSSProperties
      }
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      {/* GLOW EFFECT (Desktop Only) */}
      {!isMobile && (
        <div
          className={cn(
            "glow",
            "rounded-[inherit]",
            'after:content-[""] after:rounded-[inherit] after:absolute after:-inset-[1px]',
            "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
            "after:[background:var(--gradient)] after:[background-attachment:fixed]",
            "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
            "after:[mask-clip:padding-box,border-box]",
            "after:[mask-composite:intersect]",
            "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
          )}
        />
      )}

      <div
        className="flex flex-col h-full"
        style={{
          backgroundColor: isMobile ? "transparent" : "var(--card-background)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
        }}
      >
        {isMobile ? (
          // Height Taker: Invisible wrapper enforcing height
          <div className="w-full min-h-[650px] flex items-center justify-center bg-transparent">
            <MobilePlaygroundCard onCardClick={onCardClick} />
          </div>
        ) : (
          <PlaygroundCardArea
            isRTL={isRTL}
            onCardClick={onCardClick}
            activeCard={activeCard}
            containerWidth={containerWidth}
            shaderKey={shaderKey}
          />
        )}
      </div>
    </motion.div>
  );
};

export default PlaygroundContainer;