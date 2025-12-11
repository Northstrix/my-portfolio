"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import RefinedChronicleButton from "@/components/RefinedChronicleButton";
import SilkRefinedChronicleButton from "@/components/SilkRefinedChronicleButton";
import { LinkIcon } from "@/components/Icons";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  designation: string;
  src: string;
  link?: string;
}

interface Colors {
  name?: string;
  position?: string;
  testimony?: string;
}

interface FontSizes {
  name?: string;
  position?: string;
  testimony?: string;
}

interface Spacing {
  top?: string;
  bottom?: string;
  lineHeight?: string;
  nameTop?: string;
  nameBottom?: string;
  positionTop?: string;
  positionBottom?: string;
  testimonyTop?: string;
  testimonyBottom?: string;
}

interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  autoplayInterval?: number;
  colors?: Colors;
  fontSizes?: FontSizes;
  spacing?: Spacing;
  desktopVersionBottomThreshold?: number;
  isRTL?: boolean;
  gap?: string;
  imageWidth?: string;
  imageAspectRatio?: string;
  imageContainerTranslateX?: string;
  testimonialTextTranslateY?: string;
  arrowContainerTranslateY?: string; // NEW: For button positioning like ProjectShowcase
  imageContainerPerspective?: string;
  onItemClick?: (metric: string) => void;
  outerRounding?: string;
  innerRounding?: string;
  outlineColor?: string;
  buttonInscriptions?: {
    previousButton: string;
    nextButton: string;
    openWebAppButton: string;
  };
}

const ImageContainer = ({
  src,
  alt,
  outerRounding,
  innerRounding,
  outlineColor,
}: {
  src: string;
  alt: string;
  outerRounding: string;
  innerRounding: string;
  outlineColor: string;
}) => (
  <div
    className="relative h-full w-full"
    style={{
      borderRadius: outerRounding,
      padding: "1px",
      backgroundColor: outlineColor,
      transition: "background-color 0.3s ease-in-out",
    }}
  >
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ borderRadius: innerRounding }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  </div>
);

export function CircularTestimonials({
  testimonials,
  autoplay = true,
  autoplayInterval = 5000,
  colors = { name: "#fff", position: "gray-500", testimony: "gray-500" },
  fontSizes = { name: "2xl", position: "sm", testimony: "lg" },
  spacing = {
    top: "20",
    bottom: "20",
    lineHeight: "1.5",
    nameTop: "0",
    nameBottom: "0.5em",
    positionTop: "0",
    positionBottom: "0.25em",
    testimonyTop: "1em",
    testimonyBottom: "1em",
  },
  desktopVersionBottomThreshold = 0,
  isRTL = false,
  gap = "4.7rem",
  imageWidth = "77%",
  imageAspectRatio = "1 / 1",
  imageContainerTranslateX = "76px",
  testimonialTextTranslateY = "56px",
  arrowContainerTranslateY = "146px", // NEW: Controls button position relative to text
  imageContainerPerspective = "1000px",
  onItemClick,
  outerRounding = "12.56px",
  innerRounding = "12px",
  outlineColor = "var(--border-color)",
  buttonInscriptions = {
    previousButton: "Previous",
    nextButton: "Next",
    openWebAppButton: "Open Web App",
  },
}: CircularTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isAutoplayActive, setIsAutoplayActive] = useState(autoplay);
  const [isMobileView, setIsMobileView] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const resizeTimeout = useRef<number | null>(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = testimonials[activeIndex];

  const calculateGap = useCallback((width: number) => {
    const minWidth = 1024,
      maxWidth = 1456,
      minGap = 60,
      maxGap = 86;
    if (width <= minWidth) return minGap;
    if (width >= maxWidth)
      return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
    return minGap + ((maxGap - minGap) * (width - minWidth)) / (maxWidth - minWidth);
  }, []);

  const animateImages = useCallback(() => {
    if (!imageContainerRef.current) return;
    const containerWidth = imageContainerRef.current.offsetWidth;
    const gapValue = calculateGap(containerWidth);
    const maxStickUp = gapValue * 0.8;

    testimonials.forEach((_, index) => {
      const img = imageContainerRef.current!.querySelector(
        `[data-index="${index}"]`
      ) as HTMLElement;
      if (!img) return;

      let offset = index - activeIndex;
      if (isRTL) offset = -offset;
      if (offset > testimonialsLength / 2) offset -= testimonialsLength;
      if (offset < -testimonialsLength / 2) offset += testimonialsLength;

      const zIndex = testimonialsLength - Math.abs(offset);
      const opacity = offset === 0 ? 1 : 0.7;
      const scale = offset === 0 ? 1 : 0.85;

      let translateX = "0%";
      let translateY = "0%";
      let rotateY = 0;

      if (offset > 0) {
        translateX = "20%";
        translateY = `-${(maxStickUp / img.offsetHeight) * 100}%`;
        rotateY = -15;
      } else if (offset < 0) {
        translateX = "-20%";
        translateY = `-${(maxStickUp / img.offsetHeight) * 100}%`;
        rotateY = 15;
      }

      gsap.to(img, {
        zIndex,
        opacity,
        scale,
        x: translateX,
        y: translateY,
        rotateY,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  }, [activeIndex, calculateGap, testimonials, testimonialsLength, isRTL]);

  const updateTestimonial = useCallback(
    (dir: number) => {
      setDirection(dir > 0 ? "forward" : "backward");
      setActiveIndex((prev) => (prev + dir + testimonialsLength) % testimonialsLength);
    },
    [testimonialsLength]
  );

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
    setIsAutoplayActive(false);
  }, []);

  const handleNext = useCallback(() => {
    updateTestimonial(1);
    stopAutoplay();
  }, [updateTestimonial, stopAutoplay]);

  const handlePrev = useCallback(() => {
    updateTestimonial(-1);
    stopAutoplay();
  }, [updateTestimonial, stopAutoplay]);

  const handleResize = useCallback(() => {
    if (componentRef.current) {
      const width = componentRef.current.offsetWidth;
      setIsMobileView(width < desktopVersionBottomThreshold);
    }
  }, [desktopVersionBottomThreshold]);

  useEffect(() => {
    animateImages();
  }, [activeIndex, animateImages]);

  useEffect(() => {
    if (isAutoplayActive)
      autoplayIntervalRef.current = setInterval(() => {
        updateTestimonial(1);
      }, autoplayInterval);

    const resizeObserver = new ResizeObserver(() => {
      if (!resizeTimeout.current) {
        resizeTimeout.current = window.setTimeout(() => {
          handleResize();
          animateImages();
          resizeTimeout.current = null;
        }, 100);
      }
    });

    if (componentRef.current) resizeObserver.observe(componentRef.current);
    handleResize();

    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
      resizeObserver.disconnect();
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
      gsap.killTweensOf("[data-index]");
    };
  }, [
    isAutoplayActive,
    autoplayInterval,
    updateTestimonial,
    animateImages,
    handleResize,
  ]);

  const imageContainerTransform = useMemo(() => {
    const match = imageContainerTranslateX.match(/-?\d+(\.\d+)?/);
    if (!match) return imageContainerTranslateX;
    const num = parseFloat(match[0]);
    const unit = imageContainerTranslateX.replace(match[0], "");
    const final = isRTL ? -num : num;
    return `${final}${unit}`;
  }, [isRTL, imageContainerTranslateX]);

  const textVariants = {
    initial: (dir: "forward" | "backward") =>
      dir === "forward" ? { y: -20, opacity: 0 } : { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: (dir: "forward" | "backward") =>
      dir === "forward" ? { y: 20, opacity: 0 } : { y: -20, opacity: 0 },
  };

  return (
    <div
      ref={componentRef}
      className={`w-full mx-auto antialiased font-sans`}
      style={{
        lineHeight: spacing.lineHeight,
        backgroundColor: "transparent",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div className="testimonial-container">
        <div className="testimonial-grid" style={{ display: "grid", gap: gap }}>
          {/* Images */}
          <div
            className="image-container"
            ref={imageContainerRef}
            style={{
              transform: `translateX(${imageContainerTransform})`,
              perspective: imageContainerPerspective,
              position: "relative",
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="testimonial-image"
                data-index={index}
                style={{
                  position: "absolute",
                  width: imageWidth,
                  aspectRatio: imageAspectRatio,
                  opacity: index === activeIndex ? 1 : 0.7,
                  zIndex: testimonialsLength - Math.abs(index - activeIndex),
                  transition: "opacity 0.3s ease",
                }}
              >
                <ImageContainer
                  src={testimonial.src}
                  alt={testimonial.name}
                  outerRounding={outerRounding}
                  innerRounding={innerRounding}
                  outlineColor={outlineColor}
                />
              </div>
            ))}
          </div>

          {/* Text + Buttons Container - positioned by testimonialTextTranslateY */}
          <div
            className="flex flex-col justify-between py-4 w-full"
            style={{ transform: `translateY(${testimonialTextTranslateY})` }}
          >
            {/* TEXT AREA */}
            <div
              style={{
                flex: 1,
                minHeight: "12rem",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={`${activeIndex}-${direction}`}
                  variants={textVariants}
                  custom={direction}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h3
                    className="font-bold"
                    style={{
                      fontSize: fontSizes.name,
                      color: colors.name,
                      marginTop: spacing.nameTop,
                      marginBottom: spacing.nameBottom,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {activeTestimonial.name}
                  </h3>
                  <p
                    style={{
                      fontSize: fontSizes.position,
                      color: colors.position,
                      marginTop: spacing.positionTop,
                      marginBottom: spacing.positionBottom,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {activeTestimonial.designation}
                  </p>
                  <motion.p
                    style={{
                      fontSize: fontSizes.testimony,
                      color: colors.testimony,
                      marginTop: spacing.testimonyTop,
                      marginBottom: spacing.testimonyBottom,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {activeTestimonial.quote
                      .split(" ")
                      .map((word, index) => (
                        <motion.span
                          key={index}
                          initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.2,
                            ease: "easeInOut",
                            delay: 0.02 * index,
                          }}
                          className="inline-block"
                        >
                          {word}&nbsp;
                        </motion.span>
                      ))}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* BUTTON AREA - positioned by arrowContainerTranslateY (146px lower) */}
            <div
              className="grid grid-cols-4 gap-4 w-full mt-4"
              style={{
                justifyContent: isRTL ? "flex-end" : "flex-start",
                transform: `translateY(${arrowContainerTranslateY})`, // Exact ProjectShowcase pattern
              }}
            >
              <div className="col-span-1">
                <SilkRefinedChronicleButton
                  backgroundColor="var(--background)"
                  textColor="var(--foreground)"
                  borderColor="var(--border-color)"
                  hoverBackgroundColor="var(--background)"
                  hoverBorderColor="var(--border-color)"
                  hoverTextColor="var(--foreground)"
                  buttonHeight="2.875rem"
                  width="100%"
                  isRTL={isRTL}
                  onClick={handlePrev}
                >
                  {buttonInscriptions.previousButton}
                </SilkRefinedChronicleButton>
              </div>
              <div className="col-span-1">
                <SilkRefinedChronicleButton
                  backgroundColor="var(--background)"
                  textColor="var(--foreground)"
                  borderColor="var(--border-color)"
                  hoverBackgroundColor="var(--background)"
                  hoverBorderColor="var(--border-color)"
                  hoverTextColor="var(--foreground)"
                  buttonHeight="2.875rem"
                  width="100%"
                  isRTL={isRTL}
                  onClick={handleNext}
                >
                  {buttonInscriptions.nextButton}
                </SilkRefinedChronicleButton>
              </div>
              <div className="col-span-2">
                {activeTestimonial.link ? (
                  <a
                    href={activeTestimonial.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", width: "100%", height: "100%" }}
                    // 1. Left Click
                    onClick={() =>
                      onItemClick?.(
                        `${activeTestimonial.id}-clicked-from-circular-testimonials`
                      )
                    }
                    // 2. Middle (Wheel) Click
                    onAuxClick={(e) => {
                      if (e.button === 1) {
                        onItemClick?.(
                          `${activeTestimonial.id}-wheel-clicked-from-circular-testimonials`
                        );
                      }
                    }}
                    // 3. Drag Start
                    onDragStart={() =>
                      onItemClick?.(
                        `${activeTestimonial.id}-dragged-from-circular-testimonials`
                      )
                    }
                  >
                    <RefinedChronicleButton
                      backgroundColor="var(--foreground)"
                      textColor="var(--background)"
                      hoverBackgroundColor="var(--accent)"
                      hoverTextColor="var(--foreground)"
                      borderVisible={false}
                      buttonHeight="2.875rem"
                      width="100%"
                      isRTL={isRTL}
                      as="span"
                    >
                      <span
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.6em" }}
                      >
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
                    buttonHeight="2.875rem"
                    width="100%"
                    isRTL={isRTL}
                    // Non-link buttons usually just track clicks, but here is the logic if needed
                    onClick={() =>
                      onItemClick?.(
                        `${activeTestimonial.id}-clicked-from-circular-testimonials`
                      )
                    }
                  >
                    {buttonInscriptions.openWebAppButton}
                  </RefinedChronicleButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonial-container {
          width: 100%;
          min-height: 336px;
        }
        @media (min-width: 768px) {
          .testimonial-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default CircularTestimonials;
