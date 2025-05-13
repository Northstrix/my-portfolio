"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Aurora from "@/components/Aurora/Aurora";

interface ContactCardProps {
  isRTL: boolean;
  outerRounding: string;
  innerRounding: string;
  onCardClick: (index: number) => void;
  activeCard: number;
  firstCardRevealCanvas: boolean;
  secondCardText: string[];
  emails: string[]; // Add emails prop
}

const ContactCard: React.FC<ContactCardProps> = ({
  isRTL,
  outerRounding,
  innerRounding,
  onCardClick,
  activeCard,
  firstCardRevealCanvas,
  secondCardText,
  emails, // Destructure emails prop
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [textSize, setTextSize] = useState(24);
  const [letterSpacing, setLetterSpacing] = useState(0.32);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      if (containerRef.current) {
        setIsMobile(containerRef.current.offsetWidth < 580);
      }
    };

    const updateTextSize = () => {
      if (cardRef.current) {
        const width = cardRef.current.offsetWidth;
        const minWidth = 200;
        const maxWidth = isMobile ? 580 : 600;
        const minTextSize = isMobile ? 8 : 8;
        const maxTextSize = isMobile ? 24 : 18;
        const calculatedTextSize =
          ((maxTextSize - minTextSize) / (maxWidth - minWidth)) *
            (width - minWidth) +
          minTextSize;
        const cappedTextSize = Math.min(calculatedTextSize, maxTextSize);
        setTextSize(cappedTextSize);
      }
    };

    const handleResize = () => {
      updateLayout();
      setTimeout(updateTextSize, 60);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    updateLayout();
    updateTextSize();

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [isMobile]);

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  return (
    <motion.div
      ref={containerRef}
      style={{
        backgroundColor: isCardHovered
          ? "var(--lightened-background-adjacent-color)"
          : "var(--background-adjacent-color)",
        padding: "1px",
        borderRadius: outerRounding,
        transition:
          "background-color 0.3s ease-in-out, border 0.3s ease-in-out",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden", // Ensure the container hides overflow
        position: "relative", // Ensure the container can position absolutely
      }}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <div
        className="flex flex-col h-full"
        style={{
          borderRadius: innerRounding,
          backgroundColor: "var(--card-background)",
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          position: "relative", // Ensure content is above the Aurora
          zIndex: 1, // Ensure content is above the Aurora
        }}
      >
        <div
          className="flex flex-col items-center w-full"
          style={{ maxWidth: "600px" }}
        >
          <div
            className="relative w-full mx-auto"
            style={{ aspectRatio: isMobile ? "412/640" : "16/9" }}
          >
            <AnimatePresence>
              <motion.div
                key="card-1"
                initial={{ opacity: 0, scale: 0.84, rotate: randomRotateY() }}
                animate={{ opacity: 1, scale: 1, rotate: 0, zIndex: 30, y: 0 }}
                exit={{ opacity: 0, scale: 0.84, rotate: randomRotateY() }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 origin-center cursor-pointer"
                onHoverStart={() => setHoveredCard(1)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 w-full h-full">
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      ref={cardRef}
                      style={{ maxWidth: "100%", width: "100%" }}
                      data-component-id="card-2"
                      onClick={() => onCardClick(1)}
                    >
                      <div
                        style={{
                          borderRadius: outerRounding,
                          padding: "1px",
                          background: isHovered
                            ? "var(--background-adjacent-color)"
                            : "var(--refresh-inscription-color)",
                          display: "inline-block",
                          width: "100%",
                          aspectRatio: isMobile ? "412/640" : "16/9",
                          transition: "background 0.3s ease-in-out",
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <div
                          style={{
                            backgroundColor: isHovered
                              ? "var(--background)"
                              : "var(--foreground)",
                            padding: "16px",
                            borderRadius: innerRounding,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            color: "var(--foreground)",
                            position: "relative",
                            overflow: "hidden",
                            transition: "background-color 0.3s ease-in-out",
                          }}
                        >
                          {
                            <div
                              className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-3000 ${
                                isHovered ? "opacity-100" : "opacity-0"
                              }`}
                              style={{
                                borderRadius: innerRounding,
                              }}
                            >
                              <Aurora />
                            </div>
                          }
                          <div
                            id="card-2-text"
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "17px",
                              display: "flex",
                              flexDirection: "row",
                              zIndex: 2,
                              color: isHovered
                                ? "var(--foreground)"
                                : "var(--background)",
                              fontWeight: "bold",
                              fontSize: `${textSize}px`,
                              transition: "color 0.3s ease-in-out",
                            }}
                          >
                            {secondCardText.map((letter, index) => (
                              <div
                                key={`card-2-letter-${index}`}
                                style={{
                                  transform:
                                    letterSpacing < 0 && index > 0
                                      ? `translateX(${letterSpacing * index}px)`
                                      : "none",
                                  marginLeft:
                                    letterSpacing >= 0
                                      ? `${Math.abs(letterSpacing)}px`
                                      : "0",
                                  letterSpacing: `${letterSpacing}px`,
                                }}
                              >
                                {letter}
                              </div>
                            ))}
                          </div>
                          <div
                            id="card-2-mirror"
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              left: "17px",
                              display: "flex",
                              flexDirection: "row",
                              transform: "scale(-1, -1)",
                              zIndex: 2,
                              color: isHovered
                                ? "var(--foreground)"
                                : "var(--background)",
                              fontWeight: "bold",
                              fontSize: `${textSize}px`,
                              transition: "color 0.3s ease-in-out",
                            }}
                          >
                            {secondCardText.map((letter, index) => (
                              <div
                                key={`card-2-mirror-letter-${index}`}
                                style={{
                                  transform:
                                    letterSpacing < 0 && index > 0
                                      ? `translateX(${letterSpacing * index}px)`
                                      : "none",
                                  marginLeft:
                                    letterSpacing >= 0
                                      ? `${Math.abs(letterSpacing)}px`
                                      : "0",
                                  letterSpacing: `${letterSpacing}px`,
                                }}
                              >
                                {letter}
                              </div>
                            ))}
                          </div>
                          <div
                            style={{
                              flex: 1,
                              display: "flex",
                              flexDirection: isMobile ? "column" : "row",
                              alignItems: "center",
                              position: "relative",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                transform: !isMobile
                                  ? "translateX(-23px)"
                                  : "none",
                                position: "relative",
                                height: isMobile ? "auto" : "100%",
                                width: isMobile ? "100%" : "50%",
                                aspectRatio: "1/1",
                                padding: "15px",
                              }}
                            >
                              <Image
                                src="/second-playground-card-image.webp"
                                alt=""
                                fill
                                style={{
                                  objectFit: "contain",
                                  objectPosition: "center",
                                }}
                                priority
                                sizes="412px 16 9"
                              />
                            </div>
                            <div
                              style={{
                                transform: !isMobile
                                  ? "translateX(-52px)"
                                  : "none",
                                display: isMobile ? "" : "flex",
                                textAlign: isMobile ? "center" : "left",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                width: isMobile ? "100%" : "50%",
                                padding: "15px",
                              }}
                            >
                              {emails.map((email, index) => (
                                <div
                                  key={`email-${index}`}
                                  style={{
                                    marginBottom: "9px",
                                    fontSize: `${textSize}px`,
                                    fontWeight: "bold",
                                    color: isHovered
                                      ? "var(--foreground)"
                                      : "var(--background)",
                                  }}
                                >
                                  {email}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactCard;
