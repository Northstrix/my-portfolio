'use client';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Silk from '@/components/Silk';

export interface SilkRefinedChronicleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  borderWidth?: string | number;
  borderVisible?: boolean;
  hoverBorderVisible?: boolean;
  borderRadius?: string | number;
  fontSize?: string | number;
  fontWeight?: number | string;
  buttonHeight?: string | number;
  padding?: string;
  iconTextGap?: string | number;
  isRTL?: boolean;
  width?: string | number;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function separateContent(children: ReactNode): ReactNode[] {
  if (typeof children === 'string' || typeof children === 'number') return [children];
  if (Array.isArray(children)) return children;
  if (React.isValidElement(children)) return [children];
  return [children];
}

const SilkRefinedChronicleButton = React.forwardRef<
  HTMLButtonElement,
  SilkRefinedChronicleButtonProps
>(
  (
    {
      children,
      variant = 'default',
      size = 'default',
      backgroundColor = '#fafafa',
      hoverBackgroundColor = '#00a7fa',
      textColor = '#0a0a0a',
      hoverTextColor = '#fff',
      borderColor = '#cccccc',
      hoverBorderColor = '#999999',
      borderWidth = 1,
      borderVisible = true,
      hoverBorderVisible = true,
      borderRadius = "var(--border-radius)",
      fontSize = '1rem',
      fontWeight = 500,
      buttonHeight = '2.5rem',
      padding = '0.75rem 0rem',
      iconTextGap = '0.5rem',
      isRTL = false,
      width = 'auto',
      disabled = false,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLButtonElement | null>(null);
    const buttonRef = (ref as React.RefObject<HTMLButtonElement>) || internalRef;
    const [hovered, setHovered] = useState(false);
    const contentChildren = separateContent(children);

    const gapValue = typeof iconTextGap === 'number' ? `${iconTextGap}px` : iconTextGap;
    const showBorder = borderVisible || variant === 'outline';
    const showHoverBorder = hoverBorderVisible || variant === 'outline';

    const resolvedBorder = showBorder
      ? `${typeof borderWidth === 'number' ? borderWidth + 'px' : borderWidth} solid ${borderColor}`
      : '0px solid transparent';

    const resolvedHoverBorderColor = showHoverBorder ? hoverBorderColor : 'transparent';
    const resolvedFontSize =
      typeof fontSize === 'number'
        ? `${fontSize}px`
        : typeof fontSize === 'string'
        ? fontSize
        : '1rem';

    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: gapValue,
      lineHeight: 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      backgroundColor,
      color: textColor,
      border: resolvedBorder,
      fontSize: resolvedFontSize,
      fontWeight,
      height: typeof buttonHeight === 'number' ? `${buttonHeight}px` : buttonHeight,
      padding,
      transition:
        'background-color 0.25s ease-in-out, color 0.25s ease-in-out, border-color 0.25s ease-in-out, opacity 0.25s ease-in-out',
      direction: isRTL ? 'rtl' : 'ltr',
      userSelect: 'none',
      overflow: 'hidden',
      position: 'relative',
      width: typeof width === 'number' ? `${width}px` : width,
    };

    const emStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: gapValue,
      fontSize: 'inherit',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      willChange: 'transform, opacity',
      transition:
        'color 0.3s ease-in-out, transform 0.55s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.35s linear 0.2s',
    };

    const applyBaseStyle = (el: HTMLButtonElement | null) => {
      if (!el) return;
      Object.assign(el.style, baseStyle);
    };

    const applyHoverStyle = (el: HTMLButtonElement | null) => {
      if (!el) return;
      if (disabled) {
        applyBaseStyle(el);
        return;
      }
      Object.assign(el.style, {
        backgroundColor: hoverBackgroundColor || backgroundColor,
        color: hoverTextColor || textColor,
        borderColor: resolvedHoverBorderColor,
      });
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      applyHoverStyle(e.currentTarget);
      setHovered(true);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      applyBaseStyle(e.currentTarget);
      setHovered(false);
    };

    useEffect(() => {
      const el = buttonRef.current;
      if (!el) return;
      applyBaseStyle(el);
    }, [disabled, buttonRef]);

    return (
      <>
        <button
          {...props}
          ref={buttonRef as React.RefObject<HTMLButtonElement>}
          className={`RefinedchronicleButton variant-${variant} ${
            size !== 'default' ? `size-${size}` : ''
          } ${className ?? ''}`}
          type="button"
          style={baseStyle}
          disabled={disabled}
          onClick={(e) => !disabled && onClick?.(e)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Smooth silk overlay (same as ProfileCard) */}
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
              overflow: 'hidden',
              pointerEvents: 'none',
              background: 'transparent',
            }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <Silk speed={10} scale={1} noiseIntensity={0.5} rotation={0} isRTL={isRTL} />
          </motion.div>

          {/* Text flipping effect (exact original structure) */}
          {variant === 'default' ? (
            <span className="flip-wrapper">
              <span>
                <em style={emStyle}>
                  {contentChildren.map((child, i) =>
                    React.isValidElement(child)
                      ? React.cloneElement(child, {
                          key: `${i}-front`,
                          style: { display: 'inline-block', ...(child.props.style || {}) },
                        })
                      : child
                  )}
                </em>
              </span>
              <span>
                <em style={emStyle}>
                  {contentChildren.map((child, i) =>
                    React.isValidElement(child)
                      ? React.cloneElement(child, {
                          key: `${i}-back`,
                          style: { display: 'inline-block', ...(child.props.style || {}) },
                        })
                      : child
                  )}
                </em>
              </span>
            </span>
          ) : (
            <span style={emStyle}>
              {contentChildren.map((child, i) =>
                React.isValidElement(child)
                  ? React.cloneElement(child, {
                      key: i,
                      style: { display: 'inline-block', ...(child.props.style || {}) },
                    })
                  : child
              )}
            </span>
          )}

          <style jsx>{`
            .RefinedchronicleButton {
              border-radius: var(--radius, 8px);
              display: inline-flex;
              align-items: center;
              justify-content: center;
              line-height: 1;
              cursor: pointer;
              font-weight: 500;
              transition: background 0.25s ease-in-out, color 0.25s ease-in-out,
                border-color 0.25s ease-in-out, opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
              position: relative;
              height: 2.5rem;
              gap: 0.5rem;
              overflow: hidden;
              z-index: 0;
            }

            .flip-wrapper {
              position: relative;
              display: block;
              perspective: 108px;
              z-index: 1;
            }

            .flip-wrapper span {
              display: block;
            }

            .flip-wrapper span:nth-of-type(2) {
              position: absolute;
              top: 0;
              left: 0;
            }

            .flip-wrapper em {
              font-style: normal;
              display: inline-flex;
              align-items: center;
              gap: var(--icon-text-gap, 0.5rem);
              font-size: inherit;
              font-weight: inherit;
              line-height: inherit;
              will-change: transform, opacity;
              transition: color 0.3s ease-in-out,
                transform 0.55s cubic-bezier(0.645, 0.045, 0.355, 1),
                opacity 0.35s linear 0.2s;
            }

            .flip-wrapper span:nth-of-type(1) em {
              transform-origin: top;
              opacity: 1;
              transform: rotateX(0deg);
            }

            .flip-wrapper span:nth-of-type(2) em {
              opacity: 0;
              transform: rotateX(-90deg) scaleX(0.9) translate3d(0, 10px, 0);
              transform-origin: bottom;
            }

            .RefinedchronicleButton:not(:disabled):hover .flip-wrapper span:nth-of-type(1) em {
              opacity: 0;
              transform: rotateX(90deg) scaleX(0.9) translate3d(0, -10px, 0);
            }

            .RefinedchronicleButton:not(:disabled):hover .flip-wrapper span:nth-of-type(2) em {
              opacity: 1;
              transform: rotateX(0deg) scaleX(1) translateZ(0);
              transition: color 0.3s ease-in-out,
                transform 0.75s cubic-bezier(0.645, 0.045, 0.355, 1),
                opacity 0.35s linear 0.3s;
            }
          `}</style>
        </button>
      </>
    );
  }
);

SilkRefinedChronicleButton.displayName = 'SilkRefinedChronicleButton';
export default SilkRefinedChronicleButton;
