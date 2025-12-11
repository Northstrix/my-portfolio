"use client";

import * as React from "react";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Navbar, { NavItem } from "@/components/CustomizedTruncatingNavbar";
import useIsRTL from "@/hooks/useIsRTL";
import { LanguageSelector, LanguageSelectorHandle } from "@/components/LanguageSelector";
import LimitedWidthWrapper from "@/components/limited-width-wrapper";
import UnblurringWrapper from "@/components/unblurringWrapper";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useIsShow2ColumnHero } from "@/hooks/useIsShow2ColumnHero";
import { useTranslation } from "react-i18next";
import HeroSection from "@/components/sections/hero/HeroSection";
import MobileHeroSection from "@/components/sections/hero/MobileHeroSection";
import ProjectsSection from "@/components/sections/projects/ProjectsSection";
import ComponentsSection from "@/components/sections/components/ComponentsSection";
import EmbeddedProjectsSection from "@/components/sections/embedded-projects/EmbeddedProjectsSection";
import MobileEmbeddedProjectsSection from "@/components/sections/embedded-projects/MobileEmbeddedProjectsSection";
import EducationSection from "@/components/sections/education/EducationSection";
import PlaygroundSection from "@/components/sections/playground/PlaygroundSection";
import {
  User,
  FolderKanban,
  Puzzle,
  Circuitry,
  GraduationCap,
  ShootingStar,
  Info,
} from "@/components/Icons";
import EnhancedFooter from "@/components/sections/footer/EnhancedFooter";
import CreditModal, { CreditModalHandle } from "@/components/CreditModal";
import { useMetrics } from "@/hooks/useMetrics";

const HEIGHT_MIN = 800;
const HEIGHT_MAX = 912;

const LARGE_SETTINGS = {
  CONTENT_MAX_WIDTH: "1448px",
  NAVBAR_PADDING_DESKTOP: 24,
  NAVBAR_PADDING_MOBILE: 10,
  CONTENT_PADDING_DESKTOP: 48,
  CONTENT_PADDING_MOBILE: 20,
};

const SMALL_SETTINGS = {
  CONTENT_MAX_WIDTH: "1306px",
  NAVBAR_PADDING_DESKTOP: 16,
  NAVBAR_PADDING_MOBILE: 10,
  CONTENT_PADDING_DESKTOP: 40,
  CONTENT_PADDING_MOBILE: 20,
};

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

function interpolatePx(minPxStr: string, maxPxStr: string, t: number) {
  const minPx = parseInt(minPxStr, 10);
  const maxPx = parseInt(maxPxStr, 10);
  const val = Math.round(lerp(minPx, maxPx, t));
  return `${val}px`;
}

// 1. Define the interface for the Ref
export interface PlaygroundHandle {
  incrementUfoCount: () => void;
}

// --- HELPER COMPONENTS MOVED OUTSIDE ---
// We pass the dynamic styles (widths/paddings) as props now.

interface SectionProps {
  id: string;
  bg?: string;
  height: string;
  children?: React.ReactNode;
  maxWidth: string;
  paddingDesktop: string;
  paddingMobile: string;
}

const Section = ({
  id,
  bg,
  height,
  children,
  maxWidth,
  paddingDesktop,
  paddingMobile,
}: SectionProps) => (
  <div
    id={id}
    style={{
      background: bg,
      minHeight: height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <LimitedWidthWrapper
      expandToFull={false}
      maxWidth={maxWidth}
      paddingDesktop={paddingDesktop}
      paddingMobile={paddingMobile}
    >
      {children || id}
    </LimitedWidthWrapper>
  </div>
);

const SectionWithExternalWidthLimiter = ({
  id,
  bg,
  height,
  children,
}: {
  id: string;
  bg?: string;
  height: string;
  children?: React.ReactNode;
}) => (
  <div
    id={id}
    style={{
      ...(bg ? { background: bg } : {}),
      minHeight: height,
      position: "relative",
    }}
    className="flex flex-col"
  >
    {children}
  </div>
);
// ---------------------------------------

export default function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const languageSelectorRef = useRef<LanguageSelectorHandle>(null);
  const creditModalRef = useRef<CreditModalHandle>(null);
  const playgroundRef = useRef<PlaygroundHandle>(null);

  const isRTL = useIsRTL();
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : HEIGHT_MAX
  );
  const isMobile = useIsMobile();
  const show2ColumnHero = useIsShow2ColumnHero();
  const { t } = useTranslation();

  // Initialize the hook
  const { sendAnalyticsIncrement } = useMetrics();

  const handleContactCardClick = useCallback(() => {
    if (playgroundRef.current) {
      console.log("Triggering UFO via Ref");
      playgroundRef.current.incrementUfoCount();
    }
  }, []);

  useEffect(() => {
    function onResize() {
      setWindowHeight(window.innerHeight);
    }
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onCreditClicked = useCallback(() => {
    creditModalRef.current?.open();
  }, []);

  const scl =
    windowHeight >= HEIGHT_MAX
      ? 1
      : windowHeight <= HEIGHT_MIN
      ? 0
      : (windowHeight - HEIGHT_MIN) / (HEIGHT_MAX - HEIGHT_MIN);

  const NAVBAR_PADDING_DESKTOP = `${lerp(
    SMALL_SETTINGS.NAVBAR_PADDING_DESKTOP,
    LARGE_SETTINGS.NAVBAR_PADDING_DESKTOP,
    scl
  )}px`;
  const NAVBAR_PADDING_MOBILE = `${lerp(
    SMALL_SETTINGS.NAVBAR_PADDING_MOBILE,
    LARGE_SETTINGS.NAVBAR_PADDING_MOBILE,
    scl
  )}px`;
  const CONTENT_PADDING_DESKTOP = `${lerp(
    SMALL_SETTINGS.CONTENT_PADDING_DESKTOP,
    LARGE_SETTINGS.CONTENT_PADDING_DESKTOP,
    scl
  )}px`;
  const CONTENT_PADDING_MOBILE = `${lerp(
    SMALL_SETTINGS.CONTENT_PADDING_MOBILE,
    LARGE_SETTINGS.CONTENT_PADDING_MOBILE,
    scl
  )}px`;

  const CONTENT_MAX_WIDTH = interpolatePx(
    SMALL_SETTINGS.CONTENT_MAX_WIDTH,
    LARGE_SETTINGS.CONTENT_MAX_WIDTH,
    scl
  );

  // Memoize navItems to prevent downstream unnecessary updates
  const navItems: NavItem[] = useMemo(() => [
    { id: "home", label: t("home_title"), icon: <User />, targetId: "home" },
    {
      id: "projects",
      label: t("projects_block"),
      icon: <FolderKanban />,
      targetId: "projects",
    },
    {
      id: "components",
      label: t("components_block"),
      icon: <Puzzle />,
      targetId: "components",
    },
    {
      id: "embedded",
      label: t("embedded_projects_block"),
      icon: <Circuitry />,
      targetId: "embedded",
    },
    {
      id: "education",
      label: t("education_block"),
      icon: <GraduationCap />,
      targetId: "education",
    },
    {
      id: "playground",
      label: t("playground_block"),
      icon: <ShootingStar />,
      targetId: "playground",
    },
    {
      id: "contact",
      label: t("contact_info_title"),
      icon: <Info />,
      targetId: "contact",
    },
  ], [t]);

  const handleButtonClick = useCallback(
    (buttonKey: "explore" | "contact-info") => {
      let targetId = "";
      if (buttonKey === "explore") targetId = "projects";
      else if (buttonKey === "contact-info") targetId = "contact";

      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    },
    []
  );

  const handleMetricEvent = useCallback((metric: string) => {
    sendAnalyticsIncrement(metric);
  }, [sendAnalyticsIncrement]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--background)]">
      <UnblurringWrapper delay={1.2} duration={0.45}>
        <div className="flex flex-col h-full w-full overflow-hidden bg-[var(--background)] relative">
          <div
            id="page-scroll-container"
            ref={scrollContainerRef}
            className="flex-grow w-full h-full overflow-y-auto overflow-x-hidden"
          >
            <div id="home-anchor" style={{ height: 0, margin: 0, padding: 0 }} />
            <div className="sticky top-0 z-[1000] w-full bg-transparent">
              <LimitedWidthWrapper
                expandToFull={false}
                maxWidth={CONTENT_MAX_WIDTH}
                paddingDesktop={NAVBAR_PADDING_DESKTOP}
                paddingMobile={NAVBAR_PADDING_MOBILE}
              >
                <Navbar
                  navItems={navItems}
                  isRTL={isRTL}
                  isMobile={isMobile}
                  scrollContainerRef={
                    scrollContainerRef as React.RefObject<HTMLElement>
                  }
                  onLanguageClick={() => languageSelectorRef.current?.open()}
                />
              </LimitedWidthWrapper>
            </div>
            <main className="flex-1">
              <Section 
                id="home" 
                bg="transparent" 
                height="auto"
                maxWidth={CONTENT_MAX_WIDTH}
                paddingDesktop={CONTENT_PADDING_DESKTOP}
                paddingMobile={CONTENT_PADDING_MOBILE}
              >
                {!show2ColumnHero ? (
                  <MobileHeroSection onButtonClick={handleButtonClick} />
                ) : (
                  <HeroSection
                    scrollContainerRef={
                      scrollContainerRef as React.RefObject<HTMLElement>
                    }
                    onButtonClick={handleButtonClick}
                  />
                )}
              </Section>
              <div className="h-[2px]" />
              <SectionWithExternalWidthLimiter id="projects" height="auto">
                <ProjectsSection
                  maxWidth={CONTENT_MAX_WIDTH}
                  paddingDesktop={CONTENT_PADDING_DESKTOP}
                  paddingMobile={CONTENT_PADDING_MOBILE}
                  scrollContainerRef={
                    scrollContainerRef as React.RefObject<HTMLElement>
                  }
                  metricEvent={handleMetricEvent}
                />
              </SectionWithExternalWidthLimiter>
              <div className="h-[2px]" />
              <SectionWithExternalWidthLimiter id="components" height="auto">
                <ComponentsSection
                  maxWidth={CONTENT_MAX_WIDTH}
                  paddingDesktop={CONTENT_PADDING_DESKTOP}
                  paddingMobile={CONTENT_PADDING_MOBILE}
                  scrollContainerRef={
                    scrollContainerRef as React.RefObject<HTMLElement>
                  }
                  metricEvent={handleMetricEvent}
                />
              </SectionWithExternalWidthLimiter>
              <div className="h-[2px]" />
              <SectionWithExternalWidthLimiter id="embedded" height="auto">
                {isMobile ? (
                  <MobileEmbeddedProjectsSection
                    maxWidth={CONTENT_MAX_WIDTH}
                    paddingDesktop={CONTENT_PADDING_DESKTOP}
                    paddingMobile={CONTENT_PADDING_MOBILE}
                    scrollContainerRef={
                      scrollContainerRef as React.RefObject<HTMLElement>
                    }
                    metricEvent={handleMetricEvent}
                  />
                ) : (
                  <EmbeddedProjectsSection
                    maxWidth={CONTENT_MAX_WIDTH}
                    paddingDesktop={CONTENT_PADDING_DESKTOP}
                    paddingMobile={CONTENT_PADDING_MOBILE}
                    scrollContainerRef={
                      scrollContainerRef as React.RefObject<HTMLElement>
                    }
                    metricEvent={handleMetricEvent}
                  />
                )}
              </SectionWithExternalWidthLimiter>
              <div className="h-[2px]" />
              <SectionWithExternalWidthLimiter id="education" height="auto">
                <EducationSection
                  maxWidth={CONTENT_MAX_WIDTH}
                  paddingDesktop={CONTENT_PADDING_DESKTOP}
                  paddingMobile={CONTENT_PADDING_MOBILE}
                  scrollContainerRef={
                    scrollContainerRef as React.RefObject<HTMLElement>
                  }
                />
              </SectionWithExternalWidthLimiter>
              <div className="h-[2px]" />

              <SectionWithExternalWidthLimiter id="playground" height="auto">
                <PlaygroundSection
                  maxWidth={CONTENT_MAX_WIDTH}
                  paddingDesktop={CONTENT_PADDING_DESKTOP}
                  paddingMobile={CONTENT_PADDING_MOBILE}
                  scrollContainerRef={
                    scrollContainerRef as React.RefObject<HTMLElement>
                  }
                  metricEvent={handleMetricEvent}
                  ref={playgroundRef}
                />
              </SectionWithExternalWidthLimiter>

              <div className="h-[2px]" />
              <SectionWithExternalWidthLimiter
                id="contact"
                bg="var(--footer-background)"
                height="auto"
              >
                <div className="h-[1px] bg-[var(--border-color)]" />
                <div className="h-[1px] bg-[var(--footer-background)]" />
                <EnhancedFooter
                  navItems={navItems}
                  maxWidth={CONTENT_MAX_WIDTH}
                  paddingDesktop={CONTENT_PADDING_DESKTOP}
                  paddingMobile={CONTENT_PADDING_MOBILE}
                  isMobile={isMobile}
                  isRTL={isRTL}
                  metricEvent={handleMetricEvent}
                  onCreditClicked={onCreditClicked}
                  onContactCardClick={handleContactCardClick}
                />
              </SectionWithExternalWidthLimiter>
            </main>
          </div>
          <LanguageSelector ref={languageSelectorRef} />
          <CreditModal ref={creditModalRef} />
        </div>
      </UnblurringWrapper>
    </div>
  );
}