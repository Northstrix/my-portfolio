"use client";
import {
  ElementType,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import {
  AnimatePresence,
  motion,
  MotionProps,
  Transition
} from "framer-motion";
import gsap from "gsap";
import { cn } from "@/lib/utils";

// Split text into characters with support for Unicode and emojis
const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
};

interface TextRotateProps {
  texts: string[];
  as?: ElementType;
  rotationInterval?: number;
  initial?: MotionProps["initial"] | MotionProps["initial"][];
  animate?: MotionProps["animate"] | MotionProps["animate"][];
  exit?: MotionProps["exit"] | MotionProps["exit"][];
  animatePresenceMode?: "wait" | "sync" | "popLayout";
  animatePresenceInitial?: boolean;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number | "random";
  transition?: Transition;
  loop?: boolean;
  auto?: boolean;
  splitBy?: "words" | "characters" | "lines" | string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  style?: React.CSSProperties;
  disableRotation?: boolean;
}

export interface TextRotateRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

interface WordObject {
  characters: string[];
  needsSpace: boolean;
}

const WIDTH_BUFFER = 4;
type Step = "idle" | "exiting" | "resizing" | "entering";

const TextRotate = forwardRef<TextRotateRef, TextRotateProps>(
  (
    {
      texts,
      as = "p",
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      disableRotation = false,
      ...props
    },
    ref
  ) => {
    // sequence state
    const [step, setStep] = useState<Step>("idle");
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [nextTextIndex, setNextTextIndex] = useState<number | null>(null);
    const [showText, setShowText] = useState(true);
    const [fixedHeight, setFixedHeight] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const allMeasureRefs = useRef<Array<HTMLSpanElement | null>>([]);

    // Split text into elements for output/animation
    const elements = useMemo(() => {
      const activeText = disableRotation
        ? texts[0]
        : typeof nextTextIndex === "number"
        ? texts[nextTextIndex]
        : texts[currentTextIndex];
      if (splitBy === "characters") {
        const textParts = activeText.split(" ");
        return textParts.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== textParts.length - 1,
        }));
      }
      if (splitBy === "words") {
        return activeText.split(" ").map((word, i) => ({
          characters: word.split(""),
          needsSpace: i !== activeText.split(" ").length - 1,
        }));
      }
      if (splitBy === "lines") {
        return activeText.split("\n").map((line, i) => ({
          characters: line.split(""),
          needsSpace: i !== activeText.split("\n").length - 1,
        }));
      }
      return activeText.split(splitBy).map((part, i) => ({
        characters: part.split(""),
        needsSpace: i !== activeText.split(splitBy).length - 1,
      }));
    }, [texts, currentTextIndex, nextTextIndex, splitBy, disableRotation]);

    // Animation prop helpers
    const getAnimationProps = useCallback(
      (index: number) => {
        const getProp = (prop: any) =>
          Array.isArray(prop) ? prop[index % prop.length] : prop;
        return {
          initial: getProp(initial) as MotionProps["initial"],
          animate: getProp(animate) as MotionProps["animate"],
          exit: getProp(exit) as MotionProps["exit"],
        };
      },
      [initial, animate, exit]
    );

    const getStaggerDelay = useCallback(
      (index: number, totalChars: number) => {
        const total = totalChars;
        switch (staggerFrom) {
          case "first":
            return index * staggerDuration;
          case "last":
            return (total - 1 - index) * staggerDuration;
          case "center": {
            const center = Math.floor(total / 2);
            return Math.abs(center - index) * staggerDuration;
          }
          case "random": {
            const rand = Math.floor(Math.random() * total);
            return Math.abs(rand - index) * staggerDuration;
          }
          default:
            if (typeof staggerFrom === "number") {
              return Math.abs(staggerFrom - index) * staggerDuration;
            }
            return 0;
        }
      },
      [staggerFrom, staggerDuration]
    );

    // Navigation / imperative handle
    const goToIndex = useCallback(
      (targetIndex: number) => {
        if (disableRotation) return; // prevent rotation when disabled
        if (targetIndex === currentTextIndex || step !== "idle") return;
        if (typeof onNext === "function") onNext(targetIndex);
        setNextTextIndex(targetIndex);
        setStep("exiting");
        setShowText(false);
      },
      [currentTextIndex, step, onNext, disableRotation]
    );

    const next = useCallback(() => {
      if (disableRotation) return;
      const nextIndex =
        currentTextIndex === texts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1;
      goToIndex(nextIndex);
    }, [currentTextIndex, texts.length, loop, goToIndex, disableRotation]);

    const previous = useCallback(() => {
      if (disableRotation) return;
      const prevIndex =
        currentTextIndex === 0
          ? loop
            ? texts.length - 1
            : currentTextIndex
          : currentTextIndex - 1;
      goToIndex(prevIndex);
    }, [currentTextIndex, texts.length, loop, goToIndex, disableRotation]);

    const jumpTo = useCallback(
      (index: number) => {
        if (disableRotation) return;
        const validIndex = Math.max(0, Math.min(index, texts.length - 1));
        goToIndex(validIndex);
      },
      [texts.length, goToIndex, disableRotation]
    );

    const reset = useCallback(() => {
      if (disableRotation) return;
      goToIndex(0);
    }, [goToIndex, disableRotation]);

    useImperativeHandle(
      ref,
      () => ({
        next,
        previous,
        jumpTo,
        reset,
      }),
      [next, previous, jumpTo, reset]
    );

    // Auto rotate
    useEffect(() => {
      if (disableRotation) return;
      if (!auto || step !== "idle") return;
      const id = setInterval(() => {
        next();
      }, rotationInterval);
      return () => clearInterval(id);
    }, [auto, rotationInterval, next, step, disableRotation]);

    // Measure heights for animation
    useEffect(() => {
      if (!allMeasureRefs.current.length) return;
      let maxHeight = 0;
      allMeasureRefs.current.forEach((ref) => {
        if (ref) {
          const h = ref.getBoundingClientRect().height;
          if (h > maxHeight) maxHeight = h;
        }
      });
      setFixedHeight(maxHeight);
    }, [texts, mainClassName, splitBy]);

    // Handle word exit completion (including simulated flip)
    const handleTextExitComplete = useCallback(() => {
      if (disableRotation) return;
      setStep("resizing");
      requestAnimationFrame(() => {
        if (!containerRef.current || !measureRef.current) return;
        const targetWidth = measureRef.current.getBoundingClientRect().width + WIDTH_BUFFER;
        gsap.to(containerRef.current, {
          width: targetWidth,
          duration: 0.2,
          ease: "power1.inOut",
          onComplete: () => {
            setStep("entering");
            setCurrentTextIndex(nextTextIndex!);
            setNextTextIndex(null);
            setShowText(true);
          }
        });
      });
    }, [nextTextIndex, disableRotation]);

    // Set width initially
    useEffect(() => {
      if (!containerRef.current || !measureRef.current) return;
      containerRef.current.style.width =
        measureRef.current.getBoundingClientRect().width + WIDTH_BUFFER + "px";
    }, []);

    // After enter resets
    useEffect(() => {
      if (disableRotation) return;
      if (step === "entering" && showText) {
        const timeout = setTimeout(() => {
          setStep("idle");
        }, 250);
        return () => clearTimeout(timeout);
      }
    }, [step, showText, disableRotation]);

    // --- FIX: simulate flip for initial word ---
    useEffect(() => {
      if (disableRotation) return;
      setStep("exiting");
      setShowText(false);
      setNextTextIndex(0); // Always flip the first word
    }, []);

    useEffect(() => {
      if (
        !disableRotation &&
        step === "exiting" &&
        typeof nextTextIndex === "number" &&
        nextTextIndex === 0
      ) {
        handleTextExitComplete();
      }
    }, [step, nextTextIndex, handleTextExitComplete, disableRotation]);

    const MotionComponent = useMemo(() => motion(as ?? "p"), [as]);

    // ---- RENDER ----
    return (
      <>
        {/* hidden offscreen spans to measure height */}
        <span
          style={{
            position: "absolute",
            left: -9999,
            top: 0,
            opacity: 0,
            pointerEvents: "none",
            whiteSpace: "pre"
          }}
        >
          {texts.map((t, i) => (
            <span
              ref={(el) => {
                allMeasureRefs.current[i] = el;
              }}
              key={i}
              className={mainClassName}
            >
              {t}
            </span>
          ))}
        </span>
        <div
          ref={containerRef}
          style={{
            display: "inline-flex",
            alignItems: "center",
            overflow: "hidden",
            verticalAlign: "middle",
            width: "auto",
            height: fixedHeight ? `${fixedHeight}px` : undefined,
            minHeight: fixedHeight ? `${fixedHeight}px` : undefined,
            maxHeight: fixedHeight ? `${fixedHeight}px` : undefined,
            ...props.style
          }}
          className={cn("relative", mainClassName)}
        >
          {/* hidden span just for measuring target width */}
          <span
            ref={measureRef}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              opacity: 0,
              pointerEvents: "none",
              whiteSpace: "pre",
              height: 0,
            }}
            className={mainClassName}
          >
            {disableRotation
              ? texts[0]
              : typeof nextTextIndex === "number" && step === "resizing"
              ? texts[nextTextIndex]
              : texts[currentTextIndex]}
          </span>
          <MotionComponent
            className={cn("flex whitespace-nowrap w-full", mainClassName)}
            transition={transition}
            layout
          >
            <span className="sr-only">
              {disableRotation ? texts[0] : texts[currentTextIndex]}
            </span>
            <AnimatePresence
              mode={animatePresenceMode}
              initial={animatePresenceInitial}
              onExitComplete={handleTextExitComplete}
            >
              {showText && (
                <motion.span
                  key={
                    disableRotation
                      ? "static"
                      : typeof nextTextIndex === "number" && step === "entering"
                      ? nextTextIndex
                      : currentTextIndex
                  }
                  className={cn(
                    "flex whitespace-nowrap",
                    splitBy === "lines" && "flex-col w-full"
                  )}
                  aria-hidden
                  layout
                >
                  {(splitBy === "characters"
                    ? (elements as WordObject[])
                    : (elements as string[]).map((el, i) => ({
                        characters: [el],
                        needsSpace: i !== (elements as string[]).length - 1,
                      })))
                    .map((wordObj, wordIndex, array) => {
                      const previousCharsCount = array
                        .slice(0, wordIndex)
                        .reduce((sum, word) => sum + word.characters.length, 0);
                      return (
                        <span
                          key={wordIndex}
                          className={cn(
                            "inline-flex whitespace-nowrap",
                            splitLevelClassName
                          )}
                        >
                          {wordObj.characters.map((char, charIndex) => {
                            const totalIndex = previousCharsCount + charIndex;
                            const animationProps = getAnimationProps(totalIndex);
                            return (
                              <span
                                key={totalIndex}
                                className={elementLevelClassName}
                              >
                                <motion.span
                                  {...animationProps}
                                  key={charIndex}
                                  transition={{
                                    ...transition,
                                    delay: getStaggerDelay(
                                      previousCharsCount + charIndex,
                                      array.reduce(
                                        (sum, word) => sum + word.characters.length,
                                        0
                                      )
                                    ),
                                  }}
                                  className="inline-block"
                                >
                                  {char}
                                </motion.span>
                              </span>
                            );
                          })}
                          {wordObj.needsSpace && (
                            <span className="whitespace-pre"> </span>
                          )}
                        </span>
                      );
                    })}
                </motion.span>
              )}
            </AnimatePresence>
          </MotionComponent>
        </div>
      </>
    );
  }
);

TextRotate.displayName = "TextRotate";
export default TextRotate;
