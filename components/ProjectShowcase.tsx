"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState, useCallback, useRef, memo } from "react";
import RefinedChronicleButton from "@/components/RefinedChronicleButton";
import SilkRefinedChronicleButton from "@/components/SilkRefinedChronicleButton"
import { LinkIcon } from "@/components/Icons";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  designation: string;
  src: string;
  link?: string;
};

type ProjectShowcaseProps = {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: { name?: string; position?: string; testimony?: string };
  fontSizes?: { name?: string; position?: string; testimony?: string };
  spacing?: {
    top?: string;
    bottom?: string;
    lineHeight?: string;
    nameTop?: string;
    nameBottom?: string;
    positionTop?: string;
    positionBottom?: string;
    testimonyTop?: string;
    testimonyBottom?: string;
  };
  desktopVersionBottomThreshold?: number;
  mobile?: {
    fontSizes?: { name?: string; position?: string; testimony?: string };
    spacing?: {
      top?: string;
      bottom?: string;
      lineHeight?: string;
      nameTop?: string;
      nameBottom?: string;
      positionTop?: string;
      positionBottom?: string;
      testimonyTop?: string;
      testimonyBottom?: string;
    };
  };
  imageAspectRatio?: number;
  isRTL?: boolean;
  onItemClick?: (metric: string) => void;
  outerRounding?: string;
  innerRounding?: string;
  outlineColor?: string;
  buttonInscriptions?: {
    previousButton: string;
    nextButton: string;
    openWebAppButton: string;
  };
};

const ImageContainer = memo(
  ({
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
        padding: "1px", // The outline width
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
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
    </div>
  )
);

export const ProjectShowcase = ({
  testimonials,
  autoplay = false,
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
  mobile = {},
  imageAspectRatio = 1.37,
  isRTL = false,
  onItemClick,
  outerRounding = "var(--outer-smooth-border-radius)",
  innerRounding = "var(--smooth-border-radius)",
  outlineColor = "var(--border-color)",
  buttonInscriptions = {
    previousButton: "Previous",
    nextButton: "Next",
    openWebAppButton: "Open Web App",
  },
}: ProjectShowcaseProps) => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [changeId, setChangeId] = useState(0);
  const [isAutoplayActive, setIsAutoplayActive] = useState(autoplay);
  const [isMobileView, setIsMobileView] = useState(false);
  const [componentWidth, setComponentWidth] = useState(0);
  const componentRef = useRef<HTMLDivElement>(null);
  const resizeTimeout = useRef<number | null>(null);

  // Prefer reduced motion for better performance and accessibility
  const shouldReduceMotion = useReducedMotion();

  const stopAutoplay = useCallback(() => {
    setIsAutoplayActive(false);
  }, []);

  const currentFontSizes =
    isMobileView && mobile.fontSizes ? mobile.fontSizes : fontSizes;
  const currentSpacing = {
    ...spacing,
    ...(isMobileView && mobile.spacing ? mobile.spacing : {}),
  };

  const handleNext = useCallback(() => {
    setDirection("forward");
    setChangeId((id) => id + 1);
    setActive((prev) => (prev + 1) % testimonials.length);
    stopAutoplay();
  }, [testimonials.length, stopAutoplay]);

  const handlePrev = useCallback(() => {
    setDirection("backward");
    setChangeId((id) => id + 1);
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    stopAutoplay();
  }, [testimonials.length, stopAutoplay]);

  const isActive = (index: number) => index === active;

  useEffect(() => {
    if (isAutoplayActive && !shouldReduceMotion) {
      const interval = setInterval(() => {
        setDirection("forward");
        setChangeId((id) => id + 1);
        setActive((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoplayActive, testimonials.length, shouldReduceMotion]);

  const handleResize = useCallback(() => {
    if (componentRef.current) {
      const width = componentRef.current.offsetWidth;
      setComponentWidth(width);
      setIsMobileView(width < desktopVersionBottomThreshold);
    }
  }, [desktopVersionBottomThreshold]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (!resizeTimeout.current) {
        resizeTimeout.current = window.setTimeout(() => {
          handleResize();
          resizeTimeout.current = null;
        }, 100);
      }
    });
    if (componentRef.current) resizeObserver.observe(componentRef.current);
    handleResize();
    return () => {
      resizeObserver.disconnect();
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
    };
  }, [handleResize]);

  // Suppress random rotation for reduced motion or mobile (performance boost)
  const randomRotateY = useCallback(() => {
    return Math.floor(Math.random() * 21) - 10;
  }, [shouldReduceMotion, isMobileView]);

  const calculateGap = useCallback((width: number) => {
    const minWidth = 1024,
      maxWidth = 1456;
    const minGap = 60,
      maxGap = 86;
    if (width <= minWidth) return minGap;
    if (width >= maxWidth)
      return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
    return minGap + ((maxGap - minGap) * (width - minWidth)) / (maxWidth - minWidth);
  }, []);

  // Text animation variants for entry/exit
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
      className={`w-full mx-auto antialiased font-sans py-${currentSpacing.top} pb-${currentSpacing.bottom}`}
      style={{
        lineHeight: currentSpacing.lineHeight,
        backgroundColor: "transparent",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div
        className="relative"
        style={{
          display: "grid",
          gridTemplateColumns: isMobileView ? "1fr" : "1fr 1fr",
          gap: `${calculateGap(componentWidth)}px`,
        }}
      >
        {/* Image stack */}
        <div className="w-full">
          <div
            className="relative"
            style={{ paddingTop: `${(1 / imageAspectRatio) * 100}%` }}
          >
            <AnimatePresence>
              {testimonials.map((testimonial, index) => {
                // On reduced motion or mobile, animate only active testimonial
                if ((shouldReduceMotion || isMobileView) && !isActive(index)) {
                  return null;
                }
                return (
                  <motion.div
                    key={testimonial.src}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: randomRotateY(),
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : randomRotateY(),
                      zIndex: isActive(index) ? 999 : testimonials.length + 2 - index,
                      y: isActive(index) ? [0, -80, 0] : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: randomRotateY(),
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <ImageContainer
                      src={testimonial.src}
                      alt={testimonial.name}
                      outerRounding={outerRounding}
                      innerRounding={innerRounding}
                      outlineColor={outlineColor}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Text content */}
        <div className="flex justify-between flex-col py-4 w-full">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={`${active}-${changeId}`}
              variants={textVariants}
              custom={direction}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <h3
                className="font-bold"
                style={{
                  fontSize: currentFontSizes.name,
                  color: colors.name,
                  marginTop: currentSpacing.nameTop,
                  marginBottom: currentSpacing.nameBottom,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {testimonials[active].name}
              </h3>
              <p
                style={{
                  fontSize: currentFontSizes.position,
                  color: colors.position,
                  marginTop: currentSpacing.positionTop,
                  marginBottom: currentSpacing.positionBottom,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {testimonials[active].designation}
              </p>
              <motion.p
                style={{
                  fontSize: currentFontSizes.testimony,
                  color: colors.testimony,
                  marginTop: currentSpacing.testimonyTop,
                  marginBottom: currentSpacing.testimonyBottom,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {testimonials[active].quote.split(" ").map((word, index) => (
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

          {/* Buttons row */}
          <div
            className="grid grid-cols-4 gap-4 w-full"
            style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
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
              {testimonials[active].link ? (
                <a
                  href={testimonials[active].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={true}
                  style={{ display: "inline-block", width: "100%", height: "100%" }}
                  onClick={async (e) => {
                    const isLeftClick =
                      e.button === 0 &&
                      !e.ctrlKey &&
                      !e.metaKey &&
                      !e.shiftKey &&
                      !e.altKey;
                    if (isLeftClick) {
                      // Do not call e.preventDefault() so link opens in new tab
                      onItemClick?.(testimonials[active].id + "-clicked-from-project-showcase");
                      // The link will open as usual in a new tab
                    }
                    // For ctrl/cmd and middle clicks, do nothing and let browser handle
                  }}
                  onAuxClick={async (e) => {
                    if (e.button === 1) { // middle-click
                      onItemClick?.(testimonials[active].id + "-wheel-clicked-from-project-showcase");
                    }
                  }}
                  onDragStart={() => {
                    onItemClick?.(testimonials[active].id + "-dragged-from-project-showcase");
                  }}
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
                    as="span" // Necessary to avoid nested button inside anchor warning
                    style={{ width: "100%", height: "100%" }}
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
                  buttonHeight="2.875rem"
                  width="100%"
                  isRTL={isRTL}
                  onClick={() => onItemClick?.(testimonials[active].id + "-clicked-from-project-showcase")}
                >
                  {buttonInscriptions.openWebAppButton}
                </RefinedChronicleButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;
