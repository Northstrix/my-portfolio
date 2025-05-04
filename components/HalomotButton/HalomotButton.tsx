'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface HalomotButtonProps {
  gradient?: string;
  text: string;
  onClick: () => void;
  fillWidth?: boolean;
  fixedWidth?: string; // Optional prop for fixed width
  href?: string;
  backgroundColor?: string; // Optional prop for background color when not hovered
  icon?: React.ReactElement; // Optional icon prop
}

const HalomotButton: React.FC<HalomotButtonProps> = ({
  gradient = 'linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))',
  text,
  onClick,
  fillWidth = false,
  fixedWidth,
  href,
  backgroundColor = 'var(--background)',
  icon,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  // Container style for fixed width
  const containerStyle: React.CSSProperties = fixedWidth
    ? { width: fixedWidth, display: 'inline-block' }
    : {};

  // Button style always fills container if fixedWidth or fillWidth is set
  const buttonStyle: React.CSSProperties = {
    margin: fillWidth || fixedWidth ? '0' : 'auto',
    padding: '1px',
    background: 'none',
    border: '0',
    borderRadius: 'var(--outer-mild-rounding)',
    color: '#fff',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    whiteSpace: 'nowrap',
    transition: 'all .3s',
    width: fillWidth || fixedWidth ? '100%' : '50%',
    backgroundImage: gradient,
    flexDirection: 'row',
  };

  // Inner span style (actual button)
  const spanStyle: React.CSSProperties = {
    background: isHovered ? 'none' : backgroundColor,
    padding: fillWidth || fixedWidth ? '1rem 0' : '1rem 2.2rem',
    border: '0',
    borderRadius: 'var(--mild-rounding)',
    width: '100%',
    height: '100%',
    transition: '300ms',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#fff',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
    fontSize: '1rem',
    gap: icon ? '0.5em' : 0, // Only add gap if icon is present
    flexDirection: 'row',
  };

  // Icon style: no vertical margin/padding, only horizontal gap
  const iconStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    height: '1em', // match font size
    width: '1em',
    fontSize: '1.1em',
    verticalAlign: 'middle',
    flexShrink: 0,
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    onClick();
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
    <a href={href} style={buttonStyle} onClick={handleClick}>
      {ButtonContent}
    </a>
  ) : (
    <button type="button" style={buttonStyle} onClick={handleClick}>
      {ButtonContent}
    </button>
  );

  // Wrap in container if fixedWidth is set
  return fixedWidth ? (
    <div style={containerStyle}>{ButtonElement}</div>
  ) : (
    ButtonElement
  );
};

export default HalomotButton;
