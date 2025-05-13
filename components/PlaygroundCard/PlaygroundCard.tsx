"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { CanvasRevealEffect } from "./CanvasReveal"; // Adjust the import path as necessary

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
  swapCard: () => void;
  revealCanvas?: boolean; // Add revealCanvas prop
}

const PlaygroundCard: React.FC<PlaygroundCardProps> = ({
  componentWidth = "412px",
  aspectRatio = "9/16",
  outerRounding = "var(--outer-moderate-rounding)",
  innerRounding = "var(--moderate-rounding)",
  backgroundColor = "#FFF",
  adjacentColor = "var(--refresh-inscription-color)",
  foregroundColor = "#000",
  imageHeightPercentage = 70,
  imageSrc,
  imageAlt = "",
  outlineColor = "var(--refresh-inscription-color)",
  hoverOutlineColor = "var(--secondary-foreground)",
  textArray,
  minWidth,
  maxWidth,
  minTextSize,
  maxTextSize,
  verticalPadding = "20px",
  horizontalPadding = "20px",
  manualLetterSpacing,
  componentId = "card-1",
  swapCard,
  revealCanvas = false, // Default to false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textSize, setTextSize] = useState(maxTextSize);
  const [letterSpacing, setLetterSpacing] = useState(manualLetterSpacing ?? 0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateTextSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const calculatedTextSize =
          ((maxTextSize - minTextSize) / (maxWidth - minWidth)) *
            (width - minWidth) +
          minTextSize;
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
    const textElement = containerRef.current?.querySelector(
      `#${componentId}-text`,
    );
    if (!textElement) return;
    const letterHeight = textElement.clientHeight / textArray.length;
    setLetterSpacing(letterHeight);
  }, [textArray, textSize, manualLetterSpacing, componentId]);

  return (
    <div
      ref={containerRef}
      style={{ maxWidth: componentWidth, width: "100%" }}
      data-component-id={componentId}
      onClick={swapCard}
    >
      <div
        style={{
          borderRadius: outerRounding,
          padding: "1px",
          background: isHovered
            ? hoverOutlineColor || outlineColor
            : adjacentColor,
          display: "inline-block",
          width: "100%",
          aspectRatio: aspectRatio,
          transition: "background 2s ease-in-out 0.7s",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            backgroundColor: backgroundColor,
            padding: `${verticalPadding} ${horizontalPadding}`,
            borderRadius: innerRounding,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            color: foregroundColor,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {revealCanvas && (
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="absolute inset-0"
              colors={[
                [236, 72, 153], // --first-theme-color
                [232, 121, 249], // --second-theme-color
              ]}
              dotSize={4}
              replaceBackground
            />
          )}
          {revealCanvas && (
            <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
          )}
          {/* Main Text */}
          <div
            id={`${componentId}-text`}
            style={{
              position: "absolute",
              top: verticalPadding,
              left: horizontalPadding,
              display: "flex",
              flexDirection: "column",
              zIndex: 2,
              color: isHovered
                ? "var(--theme-red-color)"
                : "var(--theme-blue-color)",
              fontWeight: "bold",
              fontSize: `${textSize}px`,
              transition: "color 2s ease-in-out 0.7s",
            }}
          >
            {textArray.map((letter, index) => (
              <div
                key={`${componentId}-letter-${index}`}
                style={{
                  transform:
                    letterSpacing < 0 && index > 0
                      ? `translateY(${letterSpacing * index}px)`
                      : "none",
                  marginBottom:
                    letterSpacing >= 0 ? `${Math.abs(letterSpacing)}px` : "0",
                  letterSpacing: `${letterSpacing}px`,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
          {/* Mirrored Text */}
          <div
            id={`${componentId}-mirror`}
            style={{
              position: "absolute",
              bottom: verticalPadding,
              right: horizontalPadding,
              display: "flex",
              flexDirection: "column",
              transform: "scale(-1)",
              zIndex: 2,
              color: isHovered
                ? "var(--theme-red-color)"
                : "var(--theme-blue-color)",
              fontWeight: "bold",
              fontSize: `${textSize}px`,
              transition: "color 2s ease-in-out 0.7s",
            }}
          >
            {textArray.map((letter, index) => (
              <div
                key={`${componentId}-mirror-letter-${index}`}
                style={{
                  transform:
                    letterSpacing < 0 && index > 0
                      ? `translateY(${letterSpacing * index}px)`
                      : "none",
                  marginBottom:
                    letterSpacing >= 0 ? `${Math.abs(letterSpacing)}px` : "0",
                  letterSpacing: `${letterSpacing}px`,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              width: "100%",
            }}
          >
            <div
              style={{
                position: "relative",
                height: `${imageHeightPercentage}%`,
                width: "auto",
                aspectRatio: "1/1",
              }}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                style={{ objectFit: "contain", objectPosition: "center" }}
                priority
                sizes={`${componentWidth} ${aspectRatio.replace("/", " ")}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundCard;
