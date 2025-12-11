"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import clsx from "clsx";
import useIsRTL from "@/hooks/useIsRTL";
import ProfileCard from "@/components/ProfileCard";
import { useTranslation } from "react-i18next";

const SCALE_SETTINGS = {
  maxMultiplier: 2.35,
  minMultiplier: 1.01,
  minWidth: 200,
  maxWidth: 1200,
};

function getDynamicScale(width: number) {
  const { maxMultiplier, minMultiplier, minWidth, maxWidth } = SCALE_SETTINGS;
  if (width >= maxWidth) return minMultiplier;
  if (width <= minWidth) return maxMultiplier;
  const t = (maxWidth - width) / (maxWidth - minWidth);
  return minMultiplier + (maxMultiplier - minMultiplier) * t;
}

const animationStyle = `
  @keyframes float-up-horizontal {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-15px); }
  }
  @keyframes float-up-vertical {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  @keyframes float-translateY-profile {
    0%, 100% { transform: translateY(-55%); }
    50% { transform: translateY(-58%); }
  }
  .animate-float-up-horizontal {
    animation: float-up-horizontal 6s ease-in-out infinite;
  }
  .animate-float-up-vertical {
    animation: float-up-vertical 6s ease-in-out infinite;
  }
  .animate-float-translateY-profile {
    animation: float-translateY-profile 6s ease-in-out infinite;
  }
`;

const ImageContainer = memo(
  ({
    src,
    alt,
    outerRounding = "12.56px",
    innerRounding = "12px",
    outlineColor = "var(--border-color)",
  }: {
    src: string;
    alt: string;
    outerRounding?: string;
    innerRounding?: string;
    outlineColor?: string;
  }) => (
    <div
      className="relative w-full h-full"
      style={{
        borderRadius: outerRounding,
        padding: "1px",
        backgroundColor: outlineColor,
        transition: "background-color 0.3s ease-in-out",
        aspectRatio: "1280 / 935",
        overflow: "hidden",
      }}
    >
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ borderRadius: innerRounding }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  )
);

interface CollageImage {
  src: string;
  zIndex?: number;
  sizeFactor?: number;
  positionKind?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  animDuration?: string;
}

const BASE_IMAGES: CollageImage[] = [
  { src: "/blueberry-loom.webp", positionKind: "top-left", sizeFactor: 0.3 },
  { src: "/nof.webp", positionKind: "top-right", sizeFactor: 0.3 },
  { src: "/namer-ui.webp", positionKind: "bottom-left", sizeFactor: 0.25 },
  { src: "/merucav.webp", positionKind: "bottom-right", sizeFactor: 0.25 },
];

const HeroCollage = React.forwardRef<HTMLDivElement>((props, ref) => {
  const isRTL = useIsRTL();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Listen to container resize for width and window resize for width
  useEffect(() => {
    if (!containerRef.current) return;
    const updateContainerWidth = () => setContainerWidth(containerRef.current!.offsetWidth);
    const containerObserver = new ResizeObserver(updateContainerWidth);
    containerObserver.observe(containerRef.current);

    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);

    updateContainerWidth();
    onResize();

    return () => {
      containerObserver.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /**
   * Calculates size factor with adjustable exponential decay severity.
   * @param baseFactor Base size factor at max width
   * @param windowWidth Current window width
   * @param maxWidth Width above which scaling stops
   * @param decayPer100px Multiplier applied every 100px drop (e.g. 0.8 means 20% reduction)
   * @returns scaled size factor
   */
  function scaledSizeFactor(
    baseFactor: number,
    windowWidth: number,
    maxWidth: number,
    decayPer100px: number
  ) {
    if (windowWidth >= maxWidth) return baseFactor;
    if (windowWidth <= 0) return 0;

    const widthDrop = maxWidth - windowWidth;

    // Exponential decay multiplier: size reduces by decayPer100px every 100px width drop
    const multiplier = Math.pow(decayPer100px, widthDrop / 100);

    return baseFactor * multiplier;
  }

  // Usage in renderImage:

  function renderImage(img: CollageImage, idx: number) {
    let zIndexTopDefault = 105;
    let zIndexBottomDefault = 95;
    let zIndex = ["top-left", "top-right"].includes(img.positionKind || "")
      ? zIndexTopDefault
      : zIndexBottomDefault;

    // Adjust zIndex thresholds if needed
    if (windowWidth < 524 && ["top-left", "top-right"].includes(img.positionKind || "")) {
      zIndex = 0;
    }
    if (windowWidth < 624 && ["bottom-left", "bottom-right"].includes(img.positionKind || "")) {
      zIndex = 0;
    }

    let sizeFactor = img.sizeFactor ?? 0.25;

    // Define baseFactor and severities
    const topBaseFactor = 0.3;
    const bottomBaseFactor = 0.25;

    const topDecayPer100px = 0.88;
    const bottomDecayPer100px = 0.846;

    if (["top-left", "top-right"].includes(img.positionKind || "")) {
      sizeFactor = scaledSizeFactor(topBaseFactor, windowWidth, 1176, topDecayPer100px);
    }
    if (["bottom-left", "bottom-right"].includes(img.positionKind || "")) {
      sizeFactor = scaledSizeFactor(bottomBaseFactor, windowWidth, 1176, bottomDecayPer100px);
    }

    const scaleFactor = getDynamicScale(containerWidth);
    const imgWidth = sizeFactor * containerWidth * scaleFactor;
    const animDuration = img.animDuration ?? "6s";

    const baseStyle: React.CSSProperties = {
      width: `${imgWidth}px`,
      aspectRatio: "1280 / 935",
      zIndex,
      animationDuration: animDuration,
      animationDelay: `-${idx * 1.2}s`,
    };

    let positionStyle: React.CSSProperties = {};
    let animationClass = "animate-float-up";

    switch (img.positionKind) {
      case "top-left":
        positionStyle = {
          top: "10px",
          left: isRTL ? undefined : "10px",
          right: isRTL ? "10px" : undefined,
        };
        animationClass = "animate-float-up-horizontal";
        break;
      case "top-right":
        positionStyle = {
          top: "10px",
          left: isRTL ? "10px" : undefined,
          right: isRTL ? undefined : "10px",
        };
        animationClass = "animate-float-up-horizontal";
        break;
      case "bottom-left":
        positionStyle = {
          bottom: "10px",
          left: isRTL ? undefined : "10px",
          right: isRTL ? "10px" : undefined,
        };
        animationClass = "animate-float-up-vertical";
        break;
      case "bottom-right":
        positionStyle = {
          bottom: "10px",
          left: isRTL ? "10px" : undefined,
          right: isRTL ? undefined : "10px",
        };
        animationClass = "animate-float-up-vertical";
        break;
    }

    return (
      <div
        key={`img-${idx}`}
        className={clsx("absolute overflow-hidden rounded-xl shadow-lg", animationClass)}
        style={{ ...baseStyle, ...positionStyle }}
      >
        <ImageContainer
          src={img.src}
          alt={`image-${idx}`}
          outerRounding="12.56px"
          innerRounding="12px"
          outlineColor="var(--border-color)"
        />
      </div>
    );
  }

  const profileCardWidth = Math.min(containerWidth, 600) * 0.9;

  return (
    <>
      <style>{animationStyle}</style>
      <section
        ref={ref}
        className={clsx("relative w-full bg-background font-sans overflow-visible")}
        {...props}
      >
        <div ref={containerRef} className="relative z-0 h-[600px] m-0 p-0">
          <div className="relative h-full w-full m-0 p-0">
            {BASE_IMAGES.map(renderImage)}

            {/* Profile Card — left edge aligns with center */}
            <div
              className="absolute z-50"
              style={{
                top: "50%",
                left: "50%",
                width: `${profileCardWidth}px`,
                transform: "translateX(-50%)", // static horizontal centering on wrapper
              }}
            >
              <div
                className="animate-float-translateY-profile"
                style={{
                  willChange: "transform",
                }}
              >
                <ProfileCard name={t("profile_name")} bio={t("profile_bio")} isMobile={true} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

HeroCollage.displayName = "HeroCollage";
export default HeroCollage;
