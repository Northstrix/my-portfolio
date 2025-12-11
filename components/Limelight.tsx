"use client";
import React, { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface NavCenterProps {
  isMobile: boolean; // affects sizing only
  localizedItems: {
    id: string;
    label: string;
    icon?: React.ReactElement;
    onClick: () => void;
  }[];
  activeIndex: number;
  setNavItemRef: (index: number) => (el: HTMLAnchorElement | null) => void;
  limelightRef: React.RefObject<HTMLDivElement>;
  isReady: boolean;
  isRTL?: boolean;
  activeIconLightenPercentage?: number;
}

const NavCenter: React.FC<NavCenterProps> = ({
  isMobile,
  localizedItems,
  activeIndex,
  setNavItemRef,
  limelightRef,
  isReady,
  isRTL = false,
  activeIconLightenPercentage = 60,
}) => {
  const { t, i18n } = useTranslation();

  const currentBreakpoint = 976;

  const [showNavCenter, setShowNavCenter] = useState<boolean>(true);

  // Evaluates whether nav center should render according to width + breakpoint
  const evaluateVisibility = useCallback(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= currentBreakpoint;
  }, [currentBreakpoint]);

  // Do initial check, recheck after 1s (layout shift guard), and listen to resize
  useEffect(() => {
    const update = () => setShowNavCenter(evaluateVisibility());
    update();
    const timeout = setTimeout(update, 1000); // 1s delayed check

    window.addEventListener("resize", update);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", update);
    };
  }, [evaluateVisibility]);

  // React to language change or isMobile change
  useEffect(() => {
    setShowNavCenter(evaluateVisibility());
    const timeout = setTimeout(() => {
      setShowNavCenter(evaluateVisibility());
    }, 1000);
    return () => clearTimeout(timeout);
  }, [i18n.language, isMobile, evaluateVisibility]);

  // position limelight (only DOM updates — no re-render)
  useEffect(() => {
    if (!limelightRef.current || localizedItems.length === 0 || !isReady) return;
    const limelight = limelightRef.current;
    const activeLink = limelight.parentElement?.querySelectorAll("a")[
      activeIndex
    ] as HTMLElement | undefined;
    if (activeLink) {
      const iconCenter = activeLink.offsetLeft + activeLink.offsetWidth / 2;
      const limelightLeft = iconCenter - limelight.offsetWidth / 2;
      limelight.style.left = `${limelightLeft}px`;
    } else {
      limelight.style.left = "-999px";
    }
  }, [activeIndex, limelightRef, localizedItems.length, isReady, showNavCenter]);

  if (!showNavCenter) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 flex justify-center items-center pointer-events-none",
        isRTL ? "[transform:rotateY(180deg)]" : undefined
      )}
      style={{ direction: "ltr" }}
    >
      <div
        className={cn(
          "relative flex items-center h-full pointer-events-auto overflow-hidden"
        )}
      >
        {localizedItems.map((item, index) => (
          <a
            key={item.id}
            ref={setNavItemRef(index)}
            className={cn(
              "relative z-20 flex h-full cursor-pointer items-center justify-center group",
              isMobile ? "p-4" : "p-5"
            )}
            onClick={item.onClick}
            aria-label={item.label}
          >
            {React.cloneElement(item.icon || <></>, {
              className: cn(
                isMobile ? "w-[22px] h-[22px]" : "w-6 h-6",
                "transition-colors duration-300 ease-in-out",
                activeIndex === index
                  ? "opacity-100" // active item is locked, handled via style
                  : "opacity-100 text-[var(--subtle-foreground)] group-hover:text-[#aaa]", // inactive items react on hover
                isRTL ? "[transform:rotateY(180deg)]" : undefined,
              ),
              style:
                activeIndex === index
                  ? {
                      color: `color-mix(in srgb, var(--accent), white ${activeIconLightenPercentage}%)`,
                    }
                  : undefined, // inactive items don’t get inline color so they rely on class hover change
            })}
          </a>
        ))}

        {/* Limelight Indicator */}
        <div
          ref={limelightRef}
          style={{
            position: "absolute",
            top: 0,
            zIndex: 10,
            width: isMobile ? 42 : 44,
            height: 5,
            borderRadius: "0.5rem",
            backgroundColor: "var(--accent)",
            boxShadow: `0 8px 25px -5px var(--accent)`,
            transition: isReady
              ? "left 0.35s cubic-bezier(0.4,0,0.2,1)"
              : "none",
            left: "-999px",
          }}
        >
          {/* Triangle glow */}
          <div
            style={{
              position: "absolute",
              left: "-30%",
              top: 3,
              width: "160%",
              height: isMobile ? 50 : 56,
              clipPath: "polygon(5% 100%, 25% 0, 75% 0, 95% 100%)",
              background: `linear-gradient(to bottom, var(--accent), transparent)`,
              pointerEvents: "none",
            }}
          />
          {/* Bottom glowing line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: isMobile ? "-39px" : "-43px",
              width: "82%",
              height: "2px",
              borderRadius: "12px",
              background: `radial-gradient(ellipse 120% 200% at 50% 50%, var(--accent), transparent 80%)`,
              boxShadow: `0 0 10px 5px var(--accent), inset 0 0 20px 8px var(--accent)`,
              filter: "blur(5px)",
              zIndex: -1,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Prevents re-renders unless props actually change
export default React.memo(NavCenter);
