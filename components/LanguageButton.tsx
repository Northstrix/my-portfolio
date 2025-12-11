"use client";

import { useMemo, useState, useEffect } from "react";
import { getLegacyBackdropStyle } from "./LegacyBackdrop";
import LanguageIcon from "./language-icon";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";

interface LanguageButtonProps {
  blurStrength?: number;
  bodyOpacity?: number;
  borderOpacity?: number;
  onClick?: () => void;
}

export default function LanguageButton({
  blurStrength = 5.2,
  bodyOpacity = 0.64,
  borderOpacity = 0.28,
  onClick,
}: LanguageButtonProps) {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const [accentRGBA, setAccentRGBA] = useState("rgba(255,255,255,1)");

  const hoverBodyOpacity = 0.96;
  const hoverBorderOpacity = 0.42;
  const hoverBodyMultiplier = 0.8;
  const hoverBorderMultiplier = 0.64;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    let rgba = "rgba(255,255,255,0.2)";
    if (accent.startsWith("rgb")) {
      const nums = accent.match(/\d+(\.\d+)?/g);
      if (nums && nums.length >= 3) {
        rgba = `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, 1)`;
      }
    } else if (accent.startsWith("#")) {
      const hex = accent.replace("#", "");
      const bigint = parseInt(hex.length === 3 ? hex + hex : hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      rgba = `rgba(${r}, ${g}, ${b}, 1)`;
    }
    setAccentRGBA(rgba);
  }, []);

  const supportsBackdropFilter =
    typeof window !== "undefined" &&
    window.CSS &&
    typeof window.CSS.supports === "function" &&
    (window.CSS.supports("backdrop-filter", `blur(${blurStrength}px)`) ||
      window.CSS.supports("-webkit-backdrop-filter", `blur(${blurStrength}px)`));

  const baseStyle = useMemo(() => {
    const base = getLegacyBackdropStyle({
      supportsBackdropFilter,
      bodyOpacity,
      borderOpacity,
      blurStrength,
      isScrolled: true,
    });
    const background = supportsBackdropFilter
      ? `rgba(0, 0, 0, ${bodyOpacity * 0.4})`
      : `rgba(0, 0, 0, ${bodyOpacity * 0.2})`;
    const border = `1px solid rgba(128,128,128,${borderOpacity})`;

    return {
      ...base,
      background,
      border,
      boxShadow: "0 1px 10px 0 rgba(0,0,0,0.05)",
      transition:
        "border-color 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    };
  }, [supportsBackdropFilter, bodyOpacity, borderOpacity, blurStrength]);

  const getHoverBackground = () =>
    accentRGBA.replace(/, *1\)$/, `, ${hoverBodyOpacity * hoverBodyMultiplier})`);
  const getHoverBorder = () =>
    accentRGBA.replace(/, *1\)$/, `, ${hoverBorderOpacity * hoverBorderMultiplier})`);

  return (
    <button
      onClick={onClick}
      aria-label="Language"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex items-center justify-center rounded-(--border-radius) transition-all duration-300 ease-in-out cursor-pointer",
        isMobile
          ? "my-[3px] py-[3px] px-[10px]"
          : "py-1.5 px-3"
      )}
      style={{
        ...baseStyle,
        border: hovered ? `1px solid ${getHoverBorder()}` : baseStyle.border,
        background: hovered ? getHoverBackground() : baseStyle.background,
        boxShadow: hovered
          ? `0 0 15px 0 ${accentRGBA.replace(/, *1\)$/, ", 0.4)")}`
          : "0 1px 10px 0 rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "var(--border-radius)",
          pointerEvents: "none",
          transition: "background 0.3s ease-in-out, opacity 0.3s ease-in-out",
          opacity: hovered ? 0.9 : 1,
        }}
      />
      <LanguageIcon width={isMobile ? 26 : 28} />
    </button>
  );
}
