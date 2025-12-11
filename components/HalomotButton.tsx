"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface HalomotButtonProps {
  gradient?: string;
  text: string;
  onClick: () => void;
  onAuxClick?: (e: React.MouseEvent) => void;
  onDragStart?: (e: React.DragEvent) => void;
  fillWidth?: boolean;
  fixedWidth?: string;
  href?: string;
  backgroundColor?: string;
  icon?: React.ReactElement;
  buttonHeight?: string;
  padding?: string;
}

const HalomotButton: React.FC<HalomotButtonProps> = ({
  gradient = "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))",
  text,
  onClick,
  onAuxClick,
  onDragStart,
  fillWidth = false,
  fixedWidth,
  href,
  backgroundColor = "var(--background)",
  icon,
  buttonHeight,
  padding,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  const containerStyle: React.CSSProperties = fixedWidth
    ? { width: fixedWidth, display: "inline-block" }
    : {};

  const buttonStyle: React.CSSProperties = {
    margin: fillWidth || fixedWidth ? "0" : "auto",
    padding: "1px",
    background: "none",
    border: "0",
    borderRadius: "var(--outer-border-radius)",
    color: "var(--foreground)",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    whiteSpace: "nowrap",
    transition: "all .3s",
    width: fillWidth || fixedWidth ? "100%" : "50%",
    height: buttonHeight,
    backgroundImage: gradient,
    flexDirection: "row",
    cursor: "pointer",
  };

  const defaultPadding = fillWidth || fixedWidth ? "1rem 0" : "1rem 2.2rem";
  const appliedPadding = padding || (buttonHeight ? "0" : defaultPadding);

  const spanStyle: React.CSSProperties = {
    background: isHovered ? "none" : backgroundColor,
    padding: appliedPadding,
    border: "0",
    borderRadius: "var(--border-radius)",
    width: "100%",
    height: "100%",
    transition: "300ms",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "var(--foreground)",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
    fontSize: "16px",
    gap: icon ? "0.5em" : 0,
    flexDirection: "row",
  };

  const iconStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    height: "1em",
    width: "1em",
    fontSize: "1.1em",
    verticalAlign: "middle",
    flexShrink: 0,
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>
  ) => {
    if (href) {
      // Let browser open link naturally in new tab and trigger callback
      window.open(href, "_blank", "noopener,noreferrer");
    }
    onClick?.();
  };

  const ButtonContent = (
    <span
      style={spanStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && React.cloneElement(icon, { style: iconStyle })}
      {t(text)}
    </span>
  );

  const ButtonElement = href ? (
    <a
      href={href}
      style={buttonStyle}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      onAuxClick={onAuxClick}
      onDragStart={onDragStart}
    >
      {ButtonContent}
    </a>
  ) : (
    <button
      type="button"
      style={buttonStyle}
      onClick={handleClick}
      onAuxClick={onAuxClick}
      onDragStart={onDragStart}
    >
      {ButtonContent}
    </button>
  );

  return fixedWidth ? (
    <div style={containerStyle}>{ButtonElement}</div>
  ) : (
    ButtonElement
  );
};

export default HalomotButton;
