"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageIcon from '@/components/LanguageIcon';
import { AnimatedTooltip } from '@/components/AnimatedTooltip/AnimatedTooltip';
import { isRTLCheck } from "@/components/utils";

interface ComponentItem {
  id: string;
  name: string;
  integrity?: boolean;
  onClick?: () => void;
}

interface SectionItem {
  title: string;
  components: ComponentItem[];
}

interface UnfoldingSidebarProps {
  logo: string;
  appName: string;
  sections: SectionItem[];
  onComponentClick: (componentId: string) => void;
  onAppNameClick: () => void;
  onLanguageIconClick: () => void;
  initialOpenState?: boolean;
  unfoldIcon: React.ReactElement;
  foldIcon: React.ReactElement;
  iconColor?: string;
  iconHoverColor?: string;
  foldIconRotation?: number;
  unfoldIconRotation?: number;
  backgroundColor?: string;
  headerBackgroundColor?: string;
  textColor?: string;
  hoverBackgroundColor?: string;
  sidebarWidth?: string;
  collapsedWidth?: string;
  headerHeight?: string;
  appNameFontSize?: string;
  sectionTitleFontSize?: string;
  componentFontSize?: string;
  iconSize?: number;
  rightStripeColor?: string;
  rightStripeHoverColor?: string;
  itemBorderRadius?: string;
  appNameColor?: string;
  sectionTitleColor?: string;
  componentHeight?: string;
  appNameYOffset?: string;
  isRTL?: boolean;
}

const UnfoldingSidebar: React.FC<UnfoldingSidebarProps> = ({
  logo,
  appName,
  sections,
  onComponentClick,
  onAppNameClick,
  onLanguageIconClick,
  initialOpenState = false,
  unfoldIcon,
  foldIcon,
  iconColor = "#a2a2a9",
  iconHoverColor = "#ffffff",
  foldIconRotation = 90,
  unfoldIconRotation = 0,
  backgroundColor = "#161618",
  headerBackgroundColor = "#151515",
  textColor = "#a2a2a9",
  hoverBackgroundColor = "#2c2c2a",
  sidebarWidth = "256px",
  collapsedWidth = "54px",
  headerHeight = "50px",
  appNameFontSize = "16px",
  sectionTitleFontSize = "15px",
  componentFontSize = "14px",
  iconSize = 26,
  rightStripeColor = "#2c2c2a",
  rightStripeHoverColor = "#3c3c3a",
  itemBorderRadius = "8px",
  appNameColor = "#ffffff",
  sectionTitleColor = "var(--secondary-foreground)",
  componentHeight = '33px',
  appNameYOffset = '1px',
  isRTL = false,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialOpenState);
  const [isContentVisible, setIsContentVisible] = useState(initialOpenState);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [isAppNameHovered, setIsAppNameHovered] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleComponentClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const componentId = event.currentTarget.dataset.id;
    if (componentId) {
      onComponentClick(componentId);
    }
  };

  const handleAppNameClick: React.MouseEventHandler<HTMLDivElement> = () => {
    onAppNameClick();
  };

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      setIsContentVisible(false);
      setTimeout(() => setIsSidebarOpen(false), 300);
    } else {
      setIsSidebarOpen(true);
      setTimeout(() => setIsContentVisible(true), 300);
    }
  };

  const [windowHeight, setWindowHeight] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight;
    }
    return 0;
  });

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowHeight(window.innerHeight);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <motion.aside
      ref={sidebarRef}
      initial={{ width: isSidebarOpen ? sidebarWidth : collapsedWidth }}
      animate={{ width: isSidebarOpen ? sidebarWidth : collapsedWidth }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col flex-shrink-0 relative h-screen"
      style={{ backgroundColor, [isRTL ? 'right' : 'left']: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <nav
        className={`flex items-center p-4 relative ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}
        style={{ backgroundColor: headerBackgroundColor, height: headerHeight }}
      >
        {isRTL ? (
          <button
            onClick={toggleSidebar}
            className="transition-colors duration-200"
            style={{ color: isHovered ? iconHoverColor : iconColor, transform: isRTL ? 'scaleX(-1)' : 'none' }}
          >
            {isSidebarOpen
              ? React.cloneElement(foldIcon, { size: iconSize, style: { transform: `rotate(${foldIconRotation}deg)` } })
              : React.cloneElement(unfoldIcon, { size: iconSize, style: { transform: `rotate(${unfoldIconRotation}deg)` } })}
          </button>
        ) : (
          <></>
        )}
        <AnimatePresence>
          {isContentVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onAppNameClick();
                }}
                onMouseEnter={() => setIsAppNameHovered(true)}
                onMouseLeave={() => setIsAppNameHovered(false)}
              >
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleAppNameClick}
                  onMouseEnter={() => setIsAppNameHovered(true)}
                  onMouseLeave={() => setIsAppNameHovered(false)}
                >
                  {isRTL ? (
                    <>
                      <span
                        className="font-bold"
                        style={{
                          fontSize: appNameFontSize,
                          color: isAppNameHovered ? 'var(--first-theme-color)' : appNameColor,
                          transition: 'color 0.3s',
                          transform: `translateY(${appNameYOffset})`,
                        }}
                      >
                        {appName}
                      </span>
                      <img src={logo} alt={`${appName} logo`} className="w-[24px] h-[24px] ml-[10px]" />
                    </>
                  ) : (
                    <>
                      <img src={logo} alt={`${appName} logo`} className="w-[24px] h-[24px] mr-[10px]" />
                      <span
                        className="font-bold"
                        style={{
                          fontSize: appNameFontSize,
                          color: isAppNameHovered ? 'var(--first-theme-color)' : appNameColor,
                          transition: 'color 0.3s',
                          transform: `translateY(${appNameYOffset})`,
                        }}
                      >
                        {appName}
                      </span>
                    </>
                  )}
                </div>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
        {!isRTL ? (
          <button
            onClick={toggleSidebar}
            className="transition-colors duration-200"
            style={{ color: isHovered ? iconHoverColor : iconColor, transform: isRTL ? 'scaleX(-1)' : 'none' }}
          >
            {isSidebarOpen
              ? React.cloneElement(foldIcon, { size: iconSize, style: { transform: `rotate(${foldIconRotation}deg)` } })
              : React.cloneElement(unfoldIcon, { size: iconSize, style: { transform: `rotate(${unfoldIconRotation}deg)` } })}
          </button>
        ) : (
          <></>
        )}
        {isSidebarOpen && (
          <div style={{ position: 'absolute', bottom: '-1px', left: '5%', width: '90%', height: '1px', backgroundColor: 'var(--separator-color)', }} />
        )}
      </nav>
      <AnimatePresence>
        {isContentVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-4 flex-grow overflow-y-auto ${isRTL ? 'text-right' : ''}`}
            style={{ maxHeight: `calc(100vh - ${parseInt(headerHeight) + 64}px)` }}
          >
            {windowHeight < 680 ? (
              <>
                {sections.map((section) =>
                  section.components.map((component) => (
                    <div key={component.id}>
                      <button
                        data-id={component.id}
                        onClick={handleComponentClick}
                        onMouseEnter={() => setHoveredComponent(component.id)}
                        onMouseLeave={() => setHoveredComponent(null)}
                        className={`w-full px-4 transition-all duration-200 ease-in-out flex items-center ${isRTL ? '' : 'text-left'}`}
                        style={{
                          fontSize: componentFontSize,
                          height: componentHeight,
                          color: hoveredComponent === component.id ? iconHoverColor : component.integrity === false ? 'var(--theme-red-color)' : textColor,
                          backgroundColor: hoveredComponent === component.id ? hoverBackgroundColor : 'transparent',
                          borderRadius: itemBorderRadius,
                          fontStyle: component.integrity === false ? 'italic' : 'normal',
                          direction: isRTLCheck(component.name) ? 'rtl' : 'ltr'
                        }}
                      >
                        {component.name}
                      </button>
                    </div>
                  ))
                )}
              </>
            ) : (
              <>
                {sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="mb-5">
                    <h2
                      className="text-1xl mb-3 block"
                      style={{
                        direction: isRTLCheck(section.title) ? 'rtl' : 'ltr',
                        fontSize: sectionTitleFontSize,
                        color: sectionTitleColor
                      }}
                    >
                      {section.title}
                    </h2>
                    <ul className="menu w-full rounded-box mt-0">
                      {section.components.map((component) => (
                        <li key={component.id} className="mb-0">
                          <button
                            data-id={component.id}
                            onClick={handleComponentClick}
                            onMouseEnter={() => setHoveredComponent(component.id)}
                            onMouseLeave={() => setHoveredComponent(null)}
                            className={`w-full px-4 transition-all duration-200 ease-in-out flex items-center ${isRTL ? '' : 'text-left'}`}
                            style={{
                              fontSize: componentFontSize,
                              height: componentHeight,
                              color: hoveredComponent === component.id ? iconHoverColor : component.integrity === false ? 'var(--theme-red-color)' : textColor,
                              backgroundColor: hoveredComponent === component.id ? hoverBackgroundColor : 'transparent',
                              borderRadius: itemBorderRadius,
                              fontStyle: component.integrity === false ? 'italic' : 'normal',
                              direction: isRTLCheck(component.name) ? 'rtl' : 'ltr',
                            }}
                          >
                            {component.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="absolute bottom-0 w-full p-4 flex justify-center"
        style={{ backgroundColor: headerBackgroundColor, height: headerHeight }}
      >
        <AnimatedTooltip
          items={[{ id: 1, name: "Language", icon: <LanguageIcon />, onClick: onLanguageIconClick }]}
          isRTL={isRTL}
          showTooltip={isSidebarOpen}
        />
      </motion.div>
      <motion.div
        className="absolute top-0 bottom-0 w-[1px]"
        style={{ [isRTL ? 'left' : 'right']: 0 }}
        initial={{ backgroundColor: rightStripeColor }}
        animate={{ backgroundColor: isHovered ? rightStripeHoverColor : rightStripeColor }}
        transition={{ duration: 0.2 }}
      />
    </motion.aside>
  );
};

export default UnfoldingSidebar;
