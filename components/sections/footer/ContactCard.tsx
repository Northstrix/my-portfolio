"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tranquiluxe } from "./Tranquiluxe";

interface ContactCardProps {
  isRTL: boolean;
  isMobile: boolean;
  onCardClick: () => void;
  propWidth?: number;
}

const ContactCard = ({
  isRTL,
  isMobile,
  onCardClick,
  propWidth,
}: ContactCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [cardWidth, setCardWidth] = useState(360);

  useLayoutEffect(() => {
    if (!isMobile) {
      if (propWidth) setCardWidth(propWidth);
      return;
    }
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver(() => setCardWidth(el.clientWidth));
    observer.observe(el);
    setCardWidth(el.clientWidth);
    return () => observer.disconnect();
  }, [isMobile, propWidth]);

  const scaleFactor = cardWidth / 360;
  const width = cardWidth;
  const height = width * 1.4;
  const borderRadius = "var(--outer-playing-card-rounding)";
  const fontSize = 24 * scaleFactor;
  const textPadding = 20 * scaleFactor;

  const tranquiluxeProps = {
    color: [1, 0.47, 0.07] as [number, number, number],
  };
  const tranquiluxePropsActive = {
    color: [0.27, 0.78, 1] as [number, number, number],
  };
  const currentTranquiluxeProps =
    isActive ? tranquiluxePropsActive : tranquiluxeProps;

  const handleInteraction = (e: React.MouseEvent) => {
    if (e.type === "mousedown") setIsActive(true);
    if (e.type === "mouseup") setIsActive(false);
    if (e.type === "click" && e.button === 0) {
      e.preventDefault();
      onCardClick();
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
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center h-auto",
        isMobile ? "w-full max-w-[360px]" : "w-auto"
      )}
    >
      <motion.a
        href="/"
        className={cn(
          "origin-center shadow-2xl transform-gpu select-none pointer-events-auto block transition-transform duration-300 ease-in-out",
          isHovered ? "cursor-pointer" : "cursor-default"
        )}
        style={{
          width,
          height,
          borderRadius,
          display: "block",
          maxWidth: isMobile ? "360px" : "none",
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onMouseDown={handleInteraction}
        onMouseUp={handleInteraction}
        onClick={handleInteraction}
      >
        {/* Border Container */}
        <div
          className="w-full h-full p-[1px] transition-colors duration-300"
          style={{
            borderRadius,
            backgroundColor: isHovered
              ? "var(--border-color, #000)"
              : "#aaa",
          }}
        >
          {/* Inner Content */}
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              borderRadius: "var(--playing-card-rounding)",
            }}
          >
            {/* Shader */}
            <div
              className={cn(
                "absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700",
                isHovered ? "opacity-100" : "opacity-0"
              )}
              style={{ borderRadius: "var(--playing-card-rounding)", zIndex: 1 }}
            >
              <Tranquiluxe {...currentTranquiluxeProps} />
            </div>

            {/* White Fade Overlay (opacity transition) */}
            <div
              className="absolute inset-0 z-10 bg-white transition-opacity duration-300 ease-in-out"
              style={{
                opacity: isHovered ? 0 : 1,
                borderRadius,
              }}
            />

            {/* Image */}
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
              <div className="relative w-full" style={{ height: "76%" }}>
                <Image
                  src="/contact-card-image.png"
                  alt="contact-card"
                  fill
                  className="object-contain drop-shadow-lg"
                  draggable={false}
                  priority
                />
              </div>
            </div>

            {/* Inscriptions */}
            <div
              className="absolute inset-0 z-30 pointer-events-none select-none font-serif font-black"
              style={{
                color: isHovered ? "#fff" : "#000",
                transition: "color 0.3s ease-in-out",
                fontSize: `${fontSize}px`,
              }}
            >
              {/* Top inscription */}
              <div
                style={{
                  position: "absolute",
                  top: textPadding,
                  left: textPadding,
                }}
              >
                {renderInscription(["啟", "蒙"])}
              </div>

              {/* Mirrored bottom inscription */}
              <div
                style={{
                  position: "absolute",
                  bottom: textPadding,
                  right: textPadding,
                  transform: "scale(-1, -1)",
                }}
              >
                {renderInscription(["こ", "う", "や"])}
              </div>
            </div>
          </div>
        </div>
      </motion.a>
    </div>
  );
};

export default ContactCard;
