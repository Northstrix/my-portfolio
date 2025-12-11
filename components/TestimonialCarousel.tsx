"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import RefinedChronicleButton from "@/components/RefinedChronicleButton";
import SilkRefinedChronicleButton from "@/components/SilkRefinedChronicleButton";
import { LinkIcon } from "@/components/Icons";
import useMobileButtonHeight from "@/hooks/useMobileButtonHeight";

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  quote: string;
  src: string;
  link?: string;
}

interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowHoverBackground?: string;
  arrowForeground?: string;
  arrowForegroundHover?: string;
}

interface ButtonInscriptions {
  previousButton: string;
  nextButton: string;
  openWebAppButton: string;
}

interface Props {
  testimonials: Testimonial[];
  isRTL?: boolean;
  testimonialStartFraction?: number;
  testimonialHeight?: number;
  testimonialPadding?: string;
  imageBorderRadius?: string;
  imageAspectRatio?: string;
  nameFontSize?: string;
  designationFontSize?: string;
  quoteFontSize?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  showFirstSentenceOnly?: boolean;
  colors?: Colors;
  onItemClick?: (metric: string) => void;
  buttonInscriptions?: ButtonInscriptions;
}

export function TestimonialCarousel({
  testimonials,
  isRTL = false,
  testimonialStartFraction = 0.75,
  testimonialHeight = 300,
  testimonialPadding = "32px 40px",
  imageBorderRadius = "12px",
  imageAspectRatio = "1 / 1",
  nameFontSize = "1.5rem",
  designationFontSize = "0.875rem",
  quoteFontSize = "1rem",
  autoplay = true,
  autoplayInterval = 5000,
  showFirstSentenceOnly = false,
  colors = {},
  onItemClick,
  buttonInscriptions = {
    previousButton: "Previous",
    nextButton: "Next",
    openWebAppButton: "Open Web App",
  },
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [imageWidth, setImageWidth] = useState(0);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const designationRef = useRef<HTMLParagraphElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAutoplayActiveRef = useRef(autoplay);
  
  // Button height hook
  const mobileButtonHeight = useMobileButtonHeight();

  const testimonialsLength = testimonials.length;
  const active = testimonials[activeIndex];

  // Colors
  const {
    name: colorName = "white",
    designation: colorDesignation = "#9ca3af",
    testimony: colorTestimony = "#d1d5db",
  } = colors;

  // Navigation + Stop autoplay
  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    isAutoplayActiveRef.current = false;
  }, []);

  const handleNext = useCallback(() => {
    setDirection('next');
    setActiveIndex((i) => (i + 1) % testimonialsLength);
    stopAutoplay();
  }, [testimonialsLength, stopAutoplay]);

  const handlePrev = useCallback(() => {
    setDirection('prev');
    setActiveIndex((i) => (i - 1 + testimonialsLength) % testimonialsLength);
    stopAutoplay();
  }, [testimonialsLength, stopAutoplay]);

  // Track image wrapper size
  useEffect(() => {
    if (!imgWrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setImageWidth(entry.contentRect.width);
    });
    observer.observe(imgWrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const horizontalOffset = imageWidth * testimonialStartFraction;

  // ✅ FIXED: Proper RTL-aware image transitions (Next=-40/Prev=+40 for LTR, opposite for RTL)
  useEffect(() => {
    if (!imagesRef.current) return;
    
    const imgs = imagesRef.current.children;
    Array.from(imgs).forEach((img, idx) => {
      if (idx === activeIndex) {
        // Calculate direction-aware X movement
        const xStart = direction === 'next' 
          ? (isRTL ? 40 : -40)    // Next: RTL=+40, LTR=-40
          : (isRTL ? -40 : 40);   // Prev: RTL=-40, LTR=+40
        
        gsap.fromTo(
          img,
          { 
            opacity: 0, 
            scale: 0.92, 
            x: xStart, 
            filter: "blur(16px)" 
          },
          { 
            opacity: 1, 
            scale: 1, 
            x: 0, 
            filter: "blur(0px)", 
            duration: 0.7, 
            ease: "power2.out" 
          }
        );
      } else {
        // Exit animation - opposite direction
        const xExit = direction === 'next' 
          ? (isRTL ? -40 : 40)    // Exit next: RTL=-40, LTR=+40
          : (isRTL ? 40 : -40);   // Exit prev: RTL=+40, LTR=-40
        
        gsap.to(img, {
          opacity: 0,
          scale: 0.92,
          x: xExit,
          filter: "blur(16px)",
          duration: 0.5,
          ease: "power2.in",
        });
      }
    });
  }, [activeIndex, direction, isRTL]);

  // Text animation (original working logic)
  const wrapLines = (element: HTMLElement, text: string) => {
    element.innerHTML = "";
    const parent = document.createElement("div");
    parent.classList.add("split-parent");
    const child = document.createElement("div");
    child.classList.add("split-child");
    child.textContent = text;
    parent.appendChild(child);
    element.appendChild(parent);
    return child;
  };

  const animateNameAndDesignation = useCallback(() => {
    if (!nameRef.current || !designationRef.current) return;
    const nameChild = wrapLines(nameRef.current, active.name);
    const designationChild = wrapLines(
      designationRef.current,
      active.designation
    );
    const fromY = direction === 'next' ? -100 : 100;
    gsap.fromTo(nameChild, { yPercent: fromY, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(designationChild, { yPercent: fromY, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.05 });
  }, [active, direction]);

  useEffect(() => {
    animateNameAndDesignation();
  }, [activeIndex, animateNameAndDesignation]);

  // Autoplay
  useEffect(() => {
    if (autoplay && isAutoplayActiveRef.current) {
      autoplayRef.current = setInterval(() => {
        handleNext();
      }, autoplayInterval);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplay, autoplayInterval, handleNext]);

  // Quote handling
  const quoteToDisplay = useMemo(() => {
    if (!active.quote) return "";
    if (!showFirstSentenceOnly) return active.quote;
    const match = active.quote.match(/.*?[.?!](\s|$)/);
    return match ? match[0] : active.quote;
  }, [active, showFirstSentenceOnly]);

  return (
    <div style={{ position: "relative", width: "100%", display: "flex" }}>
      {/* Image Container */}
      <div
        ref={imgWrapperRef}
        style={{
          width: "50%",
          aspectRatio: imageAspectRatio,
          borderRadius: imageBorderRadius,
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          order: isRTL ? 2 : 1,
        }}
      >
        <div ref={imagesRef} style={{ position: "absolute", inset: 0 }}>
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: imageBorderRadius,
                overflow: "hidden",
                border: "1px solid var(--border-color)",
                transition: "background-color 0.3s ease-in-out",
              }}
              onMouseEnter={() => setHoveredImage(idx)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <div
                style={{
                  borderRadius: "var(--border-radius)",
                  overflow: "hidden",
                  position: "absolute",
                  inset: 0,
                }}
              >
                <img
                  src={t.src}
                  alt={t.name}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Container */}
      <div
        style={{
          backgroundColor: "var(--background)",
          border: "1px solid var(--border-color)",
          borderRadius: imageBorderRadius,
          padding: testimonialPadding,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          height: `${testimonialHeight}px`,
          marginLeft: isRTL ? 0 : horizontalOffset,
          marginRight: isRTL ? horizontalOffset : 0,
          left: isRTL ? "auto" : 0,
          right: isRTL ? 0 : "auto",
          width: `calc(100% - ${horizontalOffset}px)`,
          boxSizing: "border-box",
          zIndex: 100,
          color: "var(--foreground)",
        }}
      >
        <div>
          <h3
            ref={nameRef}
            style={{ 
              fontSize: nameFontSize, 
              fontWeight: "bold", 
              marginBottom: "0.5rem", 
              color: colorName,
              textAlign: isRTL ? "right" : "left"
            }}
          />
          <p
            ref={designationRef}
            style={{ 
              fontSize: designationFontSize, 
              marginBottom: "1rem", 
              color: colorDesignation,
              textAlign: isRTL ? "right" : "left"
            }}
          />
          <motion.p
            key={active.id}
            style={{ 
              fontSize: quoteFontSize, 
              lineHeight: 1.5, 
              color: colorTestimony,
              textAlign: isRTL ? "right" : "left"
            }}
          >
            {quoteToDisplay.split(" ").map((word, index) => (
              <motion.span
                key={index}
                initial={{ filter: "blur(8px)", opacity: 0, y: 10 }}
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut", delay: 0.02 * index }}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </motion.p>
        </div>

        {/* ✅ BUTTONS: 25%-25%-50% HORIZONTAL + useMobileButtonHeight */}
        <div 
          className="flex w-full gap-4 mt-6"
          style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
        >
          {/* Previous - 25% */}
          <div style={{ flex: 1 }}>
            <SilkRefinedChronicleButton
              backgroundColor="var(--background)"
              textColor="var(--foreground)"
              borderColor="var(--border-color)"
              hoverBackgroundColor="var(--background)"
              hoverBorderColor="var(--border-color)"
              hoverTextColor="var(--foreground)"
              buttonHeight={mobileButtonHeight ? "2.75rem" : "2.875rem"}
              width="100%"
              isRTL={isRTL}
              onClick={handlePrev}
            >
              {buttonInscriptions.previousButton}
            </SilkRefinedChronicleButton>
          </div>
          
          {/* Next - 25% */}
          <div style={{ flex: 1 }}>
            <SilkRefinedChronicleButton
              backgroundColor="var(--background)"
              textColor="var(--foreground)"
              borderColor="var(--border-color)"
              hoverBackgroundColor="var(--background)"
              hoverBorderColor="var(--border-color)"
              hoverTextColor="var(--foreground)"
              buttonHeight={mobileButtonHeight ? "2.75rem" : "2.875rem"}
              width="100%"
              isRTL={isRTL}
              onClick={handleNext}
            >
              {buttonInscriptions.nextButton}
            </SilkRefinedChronicleButton>
          </div>
          
          {/* Open Web App - 50% */}
          <div style={{ flex: 2 }}>
              {active.link ? (
                <a
                  href={active.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", width: "100%" }}
                  // 1. Left Click
                  onClick={(e) => {
                    const isLeftClick = e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;
                    if (isLeftClick) {
                      onItemClick?.(active.id + "-clicked-from-testimonial-carousel");
                    }
                  }}
                  // 2. Middle (Wheel) Click
                  onAuxClick={(e) => {
                    if (e.button === 1) {
                      onItemClick?.(active.id + "-wheel-clicked-from-testimonial-carousel");
                    }
                  }}
                  // 3. Drag Start
                  onDragStart={() => {
                    onItemClick?.(active.id + "-dragged-from-testimonial-carousel");
                  }}
                >
                  <RefinedChronicleButton
                    backgroundColor="var(--foreground)"
                    textColor="var(--background)"
                    hoverBackgroundColor="var(--accent)"
                    hoverTextColor="var(--foreground)"
                    borderVisible={false}
                    buttonHeight={mobileButtonHeight ? "2.75rem" : "2.875rem"}
                    width="100%"
                    isRTL={isRTL}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6em" }}>
                      <LinkIcon size={21} style={{ marginTop: 1 }} />
                      {buttonInscriptions.openWebAppButton}
                    </span>
                  </RefinedChronicleButton>
                </a>
              ) : (
                <RefinedChronicleButton
                  backgroundColor="var(--foreground)"
                  textColor="var(--background)"
                  hoverBackgroundColor="var(--accent)"
                  hoverTextColor="var(--foreground)"
                  borderVisible={false}
                  buttonHeight={mobileButtonHeight ? "2.75rem" : "2.875rem"}
                  width="100%"
                  isRTL={isRTL}
                  onClick={() => onItemClick?.(active.id + "-clicked-from-testimonial-carousel")}
                >
                  {buttonInscriptions.openWebAppButton}
                </RefinedChronicleButton>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
