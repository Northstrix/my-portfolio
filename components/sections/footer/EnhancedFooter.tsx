"use client";

import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import FooterBadgesGroup from "./FooterBadge";
import LimitedWidthWrapper from "@/components/limited-width-wrapper";
import HighlightHover from "@/components/HighlightHover";
import LogoWithLegacyBackdrop from "@/components/NavbarProfileImageWithLegacyBackdrop";
import { footerBadges } from "@/data/stuff";
import ContactCard from "./ContactCard";

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactElement;
  targetId: string;
}

interface EnhancedFooterProps {
  navItems: NavItem[];
  paddingDesktop: string;
  paddingMobile: string;
  maxWidth: string;
  isMobile: boolean;
  isRTL: boolean;
  onCreditClicked: () => void;
  metricEvent: (metric: string) => void;
  onContactCardClick?: () => void;
}

export default function EnhancedFooter({
  navItems,
  paddingDesktop,
  paddingMobile,
  maxWidth,
  isMobile,
  isRTL,
  onCreditClicked,
  metricEvent,
  onContactCardClick,
}: EnhancedFooterProps) {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const columnProbeRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState(`${15.2}em`);
  const [isVisible, setIsVisible] = useState(true);
  const [profileHovered, setProfileHovered] = useState(false);
  const [cardWidth, setCardWidth] = useState(360);

  const firstSectionId = navItems?.[0]?.targetId || "home-anchor";

  // Font scaling logic (unchanged)
  useEffect(() => {
    function updateFontSize() {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      if (width < 280) {
        setIsVisible(false);
        return;
      }
      setIsVisible(true);
      if (width >= 1536) {
        setFontSize(`${15.2}em`);
        return;
      }
      const clampedWidth = Math.min(Math.max(width, 280), 1536);
      const normalizedScale = (clampedWidth - 280) / (1536 - 280);
      const nonLinearScale = Math.pow(normalizedScale, 0.8);
      let fSize = 1.6 + nonLinearScale * (15.2 - 1.6);
      fSize *= i18n.language === "he" ? 1.14 : 0.96;
      setFontSize(`${fSize.toFixed(2)}em`);
    }
    updateFontSize();
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, [i18n.language]);

  // Measure available width for ContactCard on desktop, factoring wrapper padding and all gaps
  useEffect(() => {
    if (isMobile) return;
    const gridEl = gridRef.current;
    const probeEl = columnProbeRef.current;
    const wrapEl = wrapperRef.current;
    if (!gridEl || !probeEl || !wrapEl) return;

    const calc = () => {
      const wrapperWidth = wrapEl.clientWidth; // real available width in wrapper (after padding)
      const gridStyle = getComputedStyle(gridEl);
      const gap = parseFloat(gridStyle.columnGap || "0");
      const totalGapsWidth = gap * 4; // 5 columns → 4 gaps
      const colWidth = (wrapperWidth - totalGapsWidth) / 5;
      const totalWidth = colWidth * 2 + gap; // two columns + single gap between them
      setCardWidth(totalWidth);
    };

    const observer = new ResizeObserver(calc);
    observer.observe(gridEl);
    observer.observe(wrapEl);
    calc();
    window.addEventListener("resize", calc);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, [isMobile]);

  const gapClass = isRTL
    ? isMobile
      ? "gap-[6.5px]"
      : "gap-[7px]"
    : isMobile
    ? "gap-[5.5px]"
    : "gap-[6px]";

  const bioTextClass = isMobile ? "text-xs" : "text-sm";
  const logoFontSize = isMobile ? "text-[19px]" : "text-xl";

  const handleSmoothScroll = (targetId: string) => {
    const scrollContainer = document.getElementById("page-scroll-container");
    if (!scrollContainer) return;
    const el =
      targetId === "hero"
        ? document.getElementById("hero-anchor")
        : document.getElementById(targetId);
    if (el)
      scrollContainer.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  };

  return (
    <footer
      className="w-full text-[var(--foreground)] flex flex-col items-center"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ minHeight: "100vh" }}
    >
      <div className={cn(isMobile ? "h-[84px]" : "h-[118px]")} />

      <LimitedWidthWrapper
        expandToFull={false}
        maxWidth={maxWidth}
        paddingDesktop={paddingDesktop}
        paddingMobile={paddingMobile}
      >
        {/* wrapperRef added here to measure true available space */}
        <div
          ref={wrapperRef}
          className={`flex flex-col gap-12 ${isMobile ? "items-center" : ""}`}
        >
          <div
            ref={gridRef}
            className={`grid gap-8 ${isMobile ? "grid-cols-1" : "grid-cols-5"}`}
            style={{
              textAlign: isMobile ? "center" : "start",
              justifyItems: isMobile ? "center" : "start",
              alignItems: isMobile ? "center" : "start",
            }}
          >
            {/* Column 1 - probe */}
            <div
              ref={columnProbeRef}
              className={cn(
                "flex flex-col",
                isMobile ? "items-center" : "items-start"
              )}
              style={{ textAlign: isMobile ? "center" : "start" }}
            >
              <a
                href="."
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll(firstSectionId);
                }}
                className={`group/logo flex items-center font-bold ${gapClass} justify-center cursor-pointer`}
                onMouseEnter={() => setProfileHovered(true)}
                onMouseLeave={() => setProfileHovered(false)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSmoothScroll(firstSectionId);
                  }
                }}
                style={{
                  color: profileHovered
                    ? "var(--accent)"
                    : "var(--foreground)",
                  transition: "color 0.3s ease-in-out",
                  userSelect: "none",
                  fontSize: isMobile ? 19 : 20,
                  maxWidth: "max-content",
                }}
              >
                <LogoWithLegacyBackdrop size={isMobile ? 28 : 32} />
                <span
                  className={`font-bold ${logoFontSize} transition-colors duration-300 ease-in-out`}
                  style={{
                    color: profileHovered
                      ? "var(--accent)"
                      : "var(--foreground)",
                  }}
                >
                  {t("profile_name")}
                </span>
              </a>
              <p
                className={`mt-4 ${bioTextClass} text-[var(--sub-foreground)]`}
              >
                {t("profile_bio")}
              </p>
              <div
                className="mt-4 md:mt-6"
                style={{
                  display: "flex",
                  justifyContent: isMobile ? "center" : "",
                  width: "100%",
                }}
              >
                <FooterBadgesGroup
                  isRTL={isRTL}
                  metricEvent={metricEvent}
                  badges={footerBadges.map((item) => ({
                    id: item.id,
                    link: item.link,
                    image: item.image,
                    topText: t(item.topTextKey),
                    subText: t(item.subTextKey),
                    isMobile,
                  }))}
                />
              </div>
            </div>

            {/* Navigation - SAME TEXT SIZE */}
            <nav
              aria-label="Footer Navigation"
              style={{
                direction: isRTL ? "rtl" : "ltr",
                textAlign: isMobile ? "center" : "start",
                justifySelf: isMobile ? "center" : "start",
              }}
            >
              <h3 className="font-semibold text-[var(--foreground)] mb-4">
                {t("navigation_inscription")}
              </h3>
              <ul
                className={`space-y-[2px] ${
                  isMobile ? "flex flex-col items-center" : ""
                }`}
              >
                {navItems.slice(0, -1).map(({ id, label }) => (
                  <li
                    key={id}
                    onClick={() => handleSmoothScroll(id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSmoothScroll(id);
                      }
                    }}
                    style={{ maxWidth: "max-content" }}
                  >
                    <HighlightHover
                      as="span"
                      barThickness={0.0}
                      gapRatio={0.03}
                      className={`cursor-pointer ${bioTextClass}`}
                    >
                      {label}
                    </HighlightHover>
                  </li>
                ))}
                <li
                  onClick={onCreditClicked}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onCreditClicked();
                    }
                  }}
                  style={{ maxWidth: "max-content" }}
                >
                  <HighlightHover
                    as="span"
                    barThickness={0.0}
                    gapRatio={0.03}
                    className={`cursor-pointer ${bioTextClass}`}
                  >
                    {t("credit_inscription")}
                  </HighlightHover>
                </li>
              </ul>
            </nav>

            {/* Contact Info - EXACT NAVIGATION SPACING */}
            <div
              style={{
                direction: isRTL ? "rtl" : "ltr",
                textAlign: isMobile ? "center" : "start",
                justifySelf: isMobile ? "center" : "start",
                transform:
                  !isMobile && isRTL
                    ? "translateX(24px)"
                    : !isMobile && !isRTL
                    ? "translateX(-24px)"
                    : "none",
                transition: "transform 0.3s ease-in-out",
              }}
            >
              <h3
                className={`font-semibold text-[var(--foreground)] mb-4 ${bioTextClass}`}
              >
                {t("contact_info")}
              </h3>
              <ul
                className={`space-y-[2px] ${
                  isMobile ? "flex flex-col items-center" : ""
                }`}
              >
                <li style={{ maxWidth: "max-content" }}>
                  <a
                    href="mailto:maxim.bortnikov_fvrr@outlook.com"
                    className="hover:text-[var(--foreground)] transition-colors no-underline"
                  >
                    <HighlightHover
                      as="span"
                      barThickness={0.0}
                      gapRatio={0.03}
                      className={bioTextClass}
                    >
                      maxim.bortnikov_fvrr@outlook.com
                    </HighlightHover>
                  </a>
                </li>
                <li style={{ maxWidth: "max-content" }}>
                  <a
                    href="mailto:maxim.bort.devel@gmail.com"
                    className="hover:text-[var(--foreground)] transition-colors no-underline"
                  >
                    <HighlightHover
                      as="span"
                      barThickness={0.0}
                      gapRatio={0.03}
                      className={bioTextClass}
                    >
                      maxim.bort.devel@gmail.com
                    </HighlightHover>
                  </a>
                </li>
                <li style={{ maxWidth: "max-content" }}>
                  <a
                    href="mailto:Northstrix@emailthing.xyz"
                    className="hover:text-[var(--foreground)] transition-colors no-underline"
                  >
                    <HighlightHover
                      as="span"
                      barThickness={0.0}
                      gapRatio={0.03}
                      className={bioTextClass}
                    >
                      Northstrix@emailthing.xyz
                    </HighlightHover>
                  </a>
                </li>
                <li style={{ maxWidth: "max-content" }}>
                  <span>
                    <HighlightHover
                      as="span"
                      barThickness={0.0}
                      gapRatio={0.03}
                      noReact
                      className={bioTextClass}
                    >
                      X:
                    </HighlightHover>{" "}
                    <a
                      href="https://x.com/maxim_bortnikov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--foreground)] transition-colors no-underline"
                    >
                      <HighlightHover
                        as="span"
                        barThickness={0.0}
                        gapRatio={0.03}
                        className={bioTextClass}
                      >
                        maxim_bortnikov
                      </HighlightHover>
                    </a>
                  </span>
                </li>
                <li style={{ maxWidth: "max-content" }}>
                  <span>
                    <HighlightHover
                      as="span"
                      barThickness={0.0}
                      gapRatio={0.03}
                      noReact
                      className={bioTextClass}
                    >
                      {isRTL ? "טלגרם:" : "Telegram:"}
                    </HighlightHover>{" "}
                    <a
                      href="https://t.me/maxim_brt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--foreground)] transition-colors no-underline"
                    >
                      <HighlightHover
                        as="span"
                        barThickness={0.0}
                        gapRatio={0.03}
                        className={bioTextClass}
                      >
                        maxim_brt
                      </HighlightHover>
                    </a>
                  </span>
                </li>
              </ul>
            </div>
            

            {/* Card column (2-column span) */}
            <div
              className={cn(
                isMobile
                  ? "w-full flex justify-center mt-8 col-span-1"
                  : "col-span-2 flex items-center",
                isRTL ? "justify-start" : "justify-end"
              )}
              style={{ minHeight: isMobile ? "auto" : "480px" }}
            >
              <ContactCard
                onCardClick={onContactCardClick}
                isRTL={isRTL}
                isMobile={isMobile}
                propWidth={!isMobile ? cardWidth : undefined}
              />
            </div>
          </div>

          {isVisible && (
            <div
              className="w-full flex justify-center my-10"
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
              }}
            />
          )}
        </div>
      </LimitedWidthWrapper>
    </footer>
  );
}
