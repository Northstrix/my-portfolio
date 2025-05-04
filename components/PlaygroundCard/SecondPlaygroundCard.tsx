'use client';
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface PlaygroundCardProps {
  componentWidth?: string;
  aspectRatio?: string;
  outerRounding?: string;
  innerRounding?: string;
  backgroundColor?: string;
  adjacentColor?: string;
  foregroundColor?: string;
  imageHeightPercentage?: number;
  imageSrc: string;
  imageAlt?: string;
  outlineColor?: string;
  hoverOutlineColor?: string;
  textArray: string[];
  minWidth: number;
  maxWidth: number;
  minTextSize: number;
  maxTextSize: number;
  verticalPadding?: string;
  horizontalPadding?: string;
  manualLetterSpacing?: number;
  componentId?: string;
  swapCard: () => void; // Add swapCard prop
}

const SecondPlaygroundCard: React.FC<PlaygroundCardProps> = ({
  componentWidth = "412px",
  aspectRatio = '9/16',
  outerRounding = 'var(--outer-moderate-rounding)',
  innerRounding = 'var(--moderate-rounding)',
  backgroundColor = '#FFF',
  adjacentColor = '#E0E0E0',
  foregroundColor = 'var(--foreground)',
  imageHeightPercentage = 70,
  imageSrc,
  imageAlt = '',
  outlineColor = 'var(--refresh-inscription-color)',
  hoverOutlineColor = 'var(--background-adjacent-color)',
  textArray,
  minWidth,
  maxWidth,
  minTextSize,
  maxTextSize,
  verticalPadding = '20px',
  horizontalPadding = '20px',
  manualLetterSpacing,
  componentId = 'card-2',
  swapCard, // Destructure swapCard prop
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textSize, setTextSize] = useState(maxTextSize);
  const [letterSpacing, setLetterSpacing] = useState(manualLetterSpacing ?? 0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateTextSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const calculatedTextSize = ((maxTextSize - minTextSize) / (maxWidth - minWidth)) * (width - minWidth) + minTextSize;
        const cappedTextSize = Math.min(calculatedTextSize, maxTextSize);
        setTextSize(cappedTextSize);
      }
    };
    const handleResize = () => {
      setTimeout(updateTextSize, 500);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    updateTextSize();
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [minWidth, maxWidth, minTextSize, maxTextSize]);

  useEffect(() => {
    if (manualLetterSpacing !== undefined) {
      setLetterSpacing(manualLetterSpacing);
      return;
    }
    const textElement = containerRef.current?.querySelector(`#${componentId}-text`);
    if (!textElement) return;
    const letterWidth = textElement.clientWidth / textArray.length;
    setLetterSpacing(letterWidth);
  }, [textArray, textSize, manualLetterSpacing, componentId]);

  return (
    <div
      ref={containerRef}
      style={{ maxWidth: componentWidth, width: '100%' }}
      data-component-id={componentId}
      onClick={swapCard} // Add onClick handler
    >
      <div
        style={{
          borderRadius: outerRounding,
          padding: '1px',
          background: isHovered ? hoverOutlineColor : adjacentColor,
          display: 'inline-block',
          width: '100%',
          aspectRatio: aspectRatio,
          transition: 'background 0.3s ease-in-out',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            backgroundColor: isHovered ? 'var(--background)' : backgroundColor,
            padding: `${verticalPadding} ${horizontalPadding}`,
            borderRadius: innerRounding,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background-color 0.3s ease-in-out',
          }}
        >
          {/* Main Text - Top left */}
          <div
            id={`${componentId}-text`}
            style={{
              position: 'absolute',
              top: verticalPadding,
              left: horizontalPadding,
              display: 'flex',
              justifyContent: 'flex-end',
              zIndex: 2,
              color: isHovered ? foregroundColor : 'var(--background)',
              fontWeight: 'bold',
              fontSize: `${textSize}px`,
              flexDirection: 'row',
              transition: 'color 0.3s ease-in-out',
            }}
          >
            {textArray.map((letter, index) => (
              <div
                key={`${componentId}-letter-${index}`}
                style={{
                  transform: letterSpacing < 0 && index > 0 ? `translateX(${letterSpacing * index}px)` : 'none',
                  marginLeft: letterSpacing >= 0 ? `${Math.abs(letterSpacing)}px` : '0',
                  letterSpacing: `${letterSpacing}px`,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
          {/* Mirrored Text - Bottom Right */}
          <div
            id={`${componentId}-mirror`}
            style={{
              position: 'absolute',
              bottom: verticalPadding,
              right: horizontalPadding,
              display: 'flex',
              justifyContent: 'flex-start',
              zIndex: 2,
              color: isHovered ? foregroundColor : 'var(--background)',
              fontWeight: 'bold',
              fontSize: `${textSize}px`,
              flexDirection: 'row',
              transform: 'scale(-1)',
              transition: 'color 0.3s ease-in-out',
            }}
          >
            {textArray.map((letter, index) => (
              <div
                key={`${componentId}-mirror-letter-${index}`}
                style={{
                  transform: letterSpacing < 0 && index > 0 ? `translateX(${letterSpacing * index}px)` : 'none',
                  marginLeft: letterSpacing >= 0 ? `${Math.abs(letterSpacing)}px` : '0',
                  letterSpacing: `${letterSpacing}px`,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', width: '100%' }}>
            <div style={{ position: 'relative', height: `${imageHeightPercentage}%`, width: 'auto', aspectRatio: '1/1' }}>
              <Image src={imageSrc} alt={imageAlt} fill style={{ objectFit: 'contain', objectPosition: 'center' }} priority sizes={`${componentWidth} ${aspectRatio.replace('/', ' ')}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondPlaygroundCard;
