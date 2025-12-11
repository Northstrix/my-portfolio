"use client";

import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import NavCenter from "./Limelight";
import { getLegacyBackdropStyle } from "./LegacyBackdrop";
import { useTranslation } from "react-i18next";
import LogoWithLegacyBackdrop from "@/components/NavbarProfileImageWithLegacyBackdrop";
import LanguageButton from "@/components/LanguageButton";

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactElement;
  targetId: string;
}

interface NavbarProps {
  navItems: NavItem[];
  onLanguageClick?: () => void;
  scrollContainerRef: React.RefObject<HTMLElement>;
  isRTL?: boolean;
  isMobile: boolean;
  bodyOpacity?: number;
  borderOpacity?: number;
  blurStrength?: number;
}

export default function Navbar({
  navItems: originalNavItems,
  onLanguageClick,
  scrollContainerRef,
  isRTL = false,
  isMobile,
  bodyOpacity = 0.64,
  borderOpacity = 0.14,
  blurStrength = 5.2,
}: NavbarProps) {
  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);
  const disableScrollHighlightRef = useRef(false);
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems = originalNavItems;

  const supportsBackdropFilter =
    typeof window !== "undefined" &&
    window.CSS &&
    typeof window.CSS.supports === "function" &&
    (window.CSS.supports("backdrop-filter", `blur(${blurStrength}px)`) ||
      window.CSS.supports("-webkit-backdrop-filter", `blur(${blurStrength}px)`));

  // Scroll detection
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const onScroll = () => setIsScrolled(container.scrollTop > 0);
    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [scrollContainerRef]);

  // Intersection observer for active section
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const heroAnchor = document.getElementById("home-anchor");
    const heroSection = document.getElementById("home");

    const sections: HTMLElement[] = originalNavItems
      .filter((item) => item.id !== "home")
      .map(({ targetId }) => document.getElementById(targetId))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0 || !heroAnchor || !heroSection) return;

    let ticking = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (disableScrollHighlightRef.current) return;

        let newActiveIndex = -1;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          if (target === heroAnchor || target === heroSection) {
            newActiveIndex = 0;
          } else {
            const index = sections.indexOf(target);
            if (
              index !== -1 &&
              (newActiveIndex === -1 || index + 1 < newActiveIndex)
            ) {
              newActiveIndex = index + 1;
            }
          }
        });

        if (newActiveIndex !== -1 && !ticking && newActiveIndex !== activeIndex) {
          ticking = true;
          setActiveIndex(newActiveIndex);
          setTimeout(() => (ticking = false), 80);
        }
      },
      { root: container, threshold: [0], rootMargin: "0px 0px -100% 0px" }
    );

    observer.observe(heroAnchor);
    observer.observe(heroSection);
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [originalNavItems, scrollContainerRef, activeIndex]);

  // Hover
  const handleHoverStart = useCallback(() => setIsHovered(true), []);
  const handleHoverEnd = useCallback(() => setIsHovered(false), []);

  // Item click → smooth scroll
  const handleItemClick = useCallback(
    (index: number) => {
      const item = navItems[index];
      if (!item || !scrollContainerRef.current) return;

      disableScrollHighlightRef.current = true;

      if (item.id === "home") {
        const heroAnchor = document.getElementById("home-anchor");
        if (heroAnchor) {
          scrollContainerRef.current.scrollTo({
            top: heroAnchor.offsetTop,
            behavior: "smooth",
          });
        }
      } else {
        const target = document.getElementById(item.targetId);
        if (!target) return;
        scrollContainerRef.current.scrollTo({
          top: target.offsetTop,
          behavior: "smooth",
        });
      }

      setActiveIndex(index);

      if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
      scrollEndTimeoutRef.current = setTimeout(() => {
        disableScrollHighlightRef.current = false;
      }, 800);
    },
    [navItems, scrollContainerRef]
  );

  // Limelight indicator movement
  useLayoutEffect(() => {
    if (navItems.length === 0) return;
    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];
    if (limelight && activeItem) {
      const iconCenter = activeItem.offsetLeft + activeItem.offsetWidth / 2;
      const limelightLeft = iconCenter - limelight.offsetWidth / 2;
      limelight.style.left = `${limelightLeft}px`;
      if (!isReady) setTimeout(() => setIsReady(true), 40);
    }
  }, [activeIndex, isReady, navItems]);

  const setNavItemRef = useCallback(
    (index: number) => (el: HTMLAnchorElement | null) => {
      navItemRefs.current[index] = el;
    },
    []
  );

  // Localized items (memoized to prevent re-renders)
  const localizedItems = useMemo(
    () =>
      navItems.map((item, index) => ({
        ...item,
        label: t?.(`nav_${item.id.toLowerCase()}`) || item.label,
        icon: item.icon,
        onClick: () => handleItemClick(index),
      })),
    [navItems, t, handleItemClick]
  );

  const logoFontSize = isMobile ? "text-[19px]" : "text-xl";
  const navPaddingY = isMobile ? "py-[3px]" : "py-[7px]";

  const navContainerStyle = getLegacyBackdropStyle({
    supportsBackdropFilter,
    bodyOpacity,
    borderOpacity,
    blurStrength,
    isScrolled,
  });

  return (
    <div id="nav-wrapper">
      <nav
        className="sticky top-0 z-40 w-full bg-transparent"
        style={{
          transform: isScrolled
            ? isMobile
              ? "translateY(6px)"
              : "translateY(12px)"
            : "translateY(-1px)",
          transition:
            "transform 0.2s ease-in-out, padding 0.2s ease-in-out, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, backdrop-filter 0.2s ease, -webkit-backdrop-filter 0.2s ease",
          paddingInlineStart: 0,
          paddingInlineEnd: 0,
        }}
      >
        <div className="w-full mx-auto">
          <div
            className={`relative flex items-center justify-between rounded-(--border-radius) overflow-hidden ${navPaddingY}`}
            style={{
              ...navContainerStyle,
              paddingInlineStart: isScrolled ? "12px" : "23px",
              paddingInlineEnd: isScrolled ? "12px" : "23px",
              transition:
                "padding 0.2s ease-in-out, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, backdrop-filter 0.2s ease, -webkit-backdrop-filter 0.2s ease",
            }}
          >
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(0);
              }}
              className="group/logo flex items-center cursor-pointer font-bold gap-2"
              onMouseEnter={handleHoverStart}
              onMouseLeave={handleHoverEnd}
              style={{
                color: isHovered ? "var(--accent)" : "var(--foreground)",
                transition: "color 0.3s ease-in-out",
                userSelect: "none",
              }}
            >
              <LogoWithLegacyBackdrop size={32} />
              <span className={`font-bold ${logoFontSize} transition-colors duration-300 ease-in-out`}>
                {t("profile_name")}
              </span>
            </a>

            <div style={{ direction: "ltr" }}>
              <NavCenter
                isMobile={isMobile}
                localizedItems={localizedItems}
                activeIndex={activeIndex}
                setNavItemRef={setNavItemRef}
                limelightRef={limelightRef}
                isReady={isReady}
                isRTL={isRTL}
              />
            </div>

            {/* Language Icon */}
            <div
              className={`flex items-center gap-2 ${
                isRTL ? "mr-auto justify-start" : "ml-auto justify-end"
              }`}
            >
              <LanguageButton onClick={onLanguageClick} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
