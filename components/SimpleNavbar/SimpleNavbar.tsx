"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import LanguageIcon from "@/components/LanguageIcon";
import { AnimatedTooltip } from "@/components/AnimatedTooltip/AnimatedTooltip";
import { contentProps } from "@/app/LandingPage.styles";

interface SimpleNavbarProps {
  logo: string;
  appName: string;
  onLanguageIconClick: () => void;
  isRTL?: boolean;
}

const desktopVersionBottomThreshold = 768;

const SimpleNavbar: React.FC<SimpleNavbarProps> = ({
  logo,
  appName,
  onLanguageIconClick,
  isRTL = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAppNameHovered, setIsAppNameHovered] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (navbarRef.current) {
        setIsMobileView(
          navbarRef.current.offsetWidth < desktopVersionBottomThreshold
        );
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (navbarRef.current) {
      resizeObserver.observe(navbarRef.current);
    }

    handleResize();

    return () => {
      if (navbarRef.current) {
        resizeObserver.unobserve(navbarRef.current);
      }
    };
  }, []);

  const padding = isMobileView
    ? {
        left: contentProps.mobilePadding.left,
        right: contentProps.mobilePadding.right,
      }
    : {
        left: contentProps.desktopPadding.left,
        right: contentProps.desktopPadding.right,
      };

  return (
    <motion.nav
      ref={navbarRef}
      className="flex items-center justify-between h-14"
      style={{
        backgroundColor: "var(--navbar-background)",
        width: "100%",
        borderBottom: "1px solid var(--background-adjacent-color)",
        paddingLeft: padding.left,
        paddingRight: padding.right,
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      initial={false}
      animate={{
        borderColor: isHovered
          ? "var(--lightened-background-adjacent-color)"
          : "var(--background-adjacent-color)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir={"ltr"} // Important for proper text direction
    >
      {/* Language Icon on the left for RTL, right for LTR */}
      {isRTL ? (
        <div
          style={{ transform: "translateX(-15px) translateY(6px)" }}
          className="flex items-center"
        >
          <AnimatedTooltip
            items={[
              {
                id: 1,
                name: "Language",
                icon: <LanguageIcon />,
                onClick: onLanguageIconClick,
              },
            ]}
            isRTL={isRTL}
            showTooltip={false}
          />
        </div>
      ) : null}

      {/* App Name and Logo */}
      <a
        href="/"
        className="flex items-center cursor-pointer"
        onMouseEnter={() => setIsAppNameHovered(true)}
        onMouseLeave={() => setIsAppNameHovered(false)}
      >
        {isRTL ? (
          <>
            {/* App Name to the left of logo */}
            <span
              className="font-bold ml-2"
              style={{
                color: isAppNameHovered
                  ? "var(--first-theme-color)"
                  : "var(--foreground)",
                fontSize: "16px",
                transition: "color 0.2s",
              }}
            >
              {appName}
            </span>
            <img
              src={logo}
              alt={`${appName} logo`}
              className="w-6 h-6"
              style={{ marginLeft: 0, marginRight: 0 }}
            />
          </>
        ) : (
          <>
            <img
              src={logo}
              alt={`${appName} logo`}
              className="w-6 h-6"
              style={{ marginRight: 0, marginLeft: 0 }}
            />
            <span
              className="font-bold ml-2"
              style={{
                color: isAppNameHovered
                  ? "var(--first-theme-color)"
                  : "var(--foreground)",
                fontSize: "16px",
                transition: "color 0.2s",
              }}
            >
              {appName}
            </span>
          </>
        )}
      </a>
      {/* Language Icon on the right for LTR, hidden for RTL */}
      {!isRTL ? (
        <div
          style={{ transform: "translateX(15px) translateY(6px)" }}
          className="flex items-center"
        >
          <AnimatedTooltip
            items={[
              {
                id: 1,
                name: "Language",
                icon: <LanguageIcon />,
                onClick: onLanguageIconClick,
              },
            ]}
            isRTL={isRTL}
            showTooltip={false}
          />
        </div>
      ) : null}
    </motion.nav>
  );
};

export default SimpleNavbar;
