"use client";
import React, { useState, useRef } from "react";
/*
InflectedCard Event Tracking Schema:

Events tracked (image/button only):
┌─────────────────────┬─────────────────────┬─────────────────────────────────────┐
│ Part       │ Type          │ Full Metric Pattern                 │
├────────────┼────────────────┼─────────────────────────────────────┤
│ image      │ clicked       │ `{id}-image-clicked-from-inflected-card` │
│ image      │ wheel-clicked │ `{id}-image-wheel-clicked-from-inflected-card` │
│ image      │ dragged       │ `{id}-image-dragged-from-inflected-card` │
│ image      │ hovered       │ `{id}-image-hovered-from-inflected-card` │
├────────────┼────────────────┼─────────────────────────────────────┤
│ button     │ clicked       │ `{id}-button-clicked-from-inflected-card` │
│ button     │ wheel-clicked │ `{id}-button-wheel-clicked-from-inflected-card` │
│ button     │ dragged       │ `{id}-button-dragged-from-inflected-card` │
│ button     │ hovered       │ `{id}-button-hovered-from-inflected-card` │
└────────────┴────────────────┴─────────────────────────────────────┘

Pattern: `{componentId}-{part}-{eventType}-from-inflected-card`

Example for component "refined-chronicle-button":
- refined-chronicle-button-image-clicked-from-inflected-card
- refined-chronicle-button-button-hovered-from-inflected-card
*/
export interface InflectedCardProps {
  id: string;
  title: string;
  description: string;
  parentBackgroundColor?: string;
  url: string;
  onClick?: (
    info: {
      part: "body" | "image" | "button";
      type: "clicked" | "wheel-clicked" | "dragged" | "hovered";
      extra?: any;
    },
    id: string
  ) => void;
  fontSizes?: { title?: string; description?: string };
  margins?: { title?: string; description?: string };
  buttonIcon: React.ElementType<{ size?: number; color?: string }>;
  buttonIconSize?: number;
  buttonIconColor?: string;
  buttonIconHoverColor?: string;
  buttonBackgroundColor?: string;
  buttonBackgroundHoverColor?: string;
  imageHoverZoom?: number;
  titleColor?: string;
  descriptionColor?: string;
  mirrored?: boolean;
  titleAlignment?: "left" | "center" | "right";
  descriptionAlignment?: "left" | "center" | "right";
  maxWidth?: string;
  titleLineClamp?: number;
  descriptionLineClamp?: number;
  tagHoverBrightness?: number;
  imageContainerAspectRatio?: string;
  mediaNode?: React.ReactNode;
}

export default function InflectedCard({
  id,
  title,
  description,
  parentBackgroundColor = "var(--background)",
  url,
  onClick,
  fontSizes = {},
  margins = {},
  buttonIcon: ButtonIcon,
  buttonIconSize = 24,
  buttonIconColor = "#fff",
  buttonIconHoverColor = "#fff",
  buttonBackgroundColor = "#282828",
  buttonBackgroundHoverColor = "#484848",
  imageHoverZoom = 1.1,
  titleColor = "#f7f7ff",
  descriptionColor = "#c7c7cf",
  mirrored = false,
  titleAlignment = "left",
  descriptionAlignment = "left",
  maxWidth = "100%",
  titleLineClamp,
  descriptionLineClamp,
  tagHoverBrightness = 0.8,
  imageContainerAspectRatio = "16 / 10",
  mediaNode,
}: InflectedCardProps) {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const mirrorStyle: React.CSSProperties = mirrored ? { transform: "scaleX(-1)" } : {};
  const reverseMirrorStyle: React.CSSProperties = mirrored ? { transform: "scaleX(-1)" } : {};

  const isRTL = (text: string) => /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text);
  const autoTitleAlign = isRTL(title) ? "right" : titleAlignment;
  const autoDescriptionAlign = isRTL(description) ? "right" : descriptionAlignment;

  const emit = (
    part: "body" | "image" | "button",
    type: "clicked" | "wheel-clicked" | "dragged" | "hovered",
    extra?: any
  ) => {
    onClick?.({ part, type, extra }, id);
  };

  const imageHandlers = {
    onClickCapture: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emit("image", "clicked");
      window.open(url, "_blank");
    },
    onAuxClickCapture: (e: React.MouseEvent) => {
      if (e.button === 1) {
        emit("image", "wheel-clicked");
        window.open(url, "_blank");
      }
    },
    onDragStartCapture: (e: React.DragEvent) => {
      emit("image", "dragged");
    },
  };

  return (
    <div
      className="inflected-card-link"
      style={{ maxWidth, display: "block", position: "relative" }}
      onClick={() => emit("body", "clicked")}
      onAuxClick={(e) => {
        if (e.button === 1) emit("body", "wheel-clicked");
      }}
      onDragStart={() => emit("body", "dragged")}
    >
      <div
        className="inflected-card"
        style={
          {
            "--tag-brightness": `brightness(${Math.min(Math.max(tagHoverBrightness, 0.1), 1.9).toFixed(2)})`,
            ...mirrorStyle,
          } as React.CSSProperties
        }
      >
        <div className="inflected-cardInner" style={{ "--parent-bg": parentBackgroundColor } as React.CSSProperties}>
          <div className="inflected-box">
            {/* === IMAGE AREA WITH ANCHOR === */}
            <a
              href={url}
              className="inflected-imgBox rounded-[var(--smooth-border-radius)]"
              style={{
                overflow: "hidden",
                width: "100%",
                position: "relative",
                aspectRatio: imageContainerAspectRatio,
                ...reverseMirrorStyle,
                display: "block",
                textDecoration: "none",
              }}
              ref={imageContainerRef}
              onMouseEnter={() => {
                if (!isImageHovered) {
                  setIsImageHovered(true);
                  emit("image", "hovered");
                }
              }}
              onMouseLeave={() => setIsImageHovered(false)}
              {...imageHandlers}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  transform: isImageHovered ? `scale(${imageHoverZoom})` : "scale(1)",
                  transition: "transform 0.3s ease",
                  willChange: "transform",
                }}
              >
                {mediaNode}
              </div>
            </a>

            {/* === BUTTON AREA === */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inflected-icon"
              style={{
                position: "absolute",
                bottom: "-6px",
                right: "-6px",
                width: "96px",
                height: "96px",
                background: parentBackgroundColor,
                borderTopLeftRadius: "50%",
                transition: "all 0.3s ease",
                display: "block",
              }}
              onClick={(e) => {
                if (e.button === 0) emit("button", "clicked");
              }}
              onAuxClick={(e) => {
                if (e.button === 1) emit("button", "wheel-clicked");
              }}
              onDragStart={() => emit("button", "dragged")}
              onMouseEnter={() => {
                if (!isButtonHovered) {
                  setIsButtonHovered(true);
                  emit("button", "hovered");
                }
              }}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              <div
                className="inflected-iconBox"
                style={
                  {
                    position: "absolute",
                    inset: "10px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    backgroundColor: isButtonHovered ? buttonBackgroundHoverColor : buttonBackgroundColor,
                  } as React.CSSProperties
                }
              >
                {ButtonIcon && (
                  <ButtonIcon size={buttonIconSize} color={isButtonHovered ? buttonIconHoverColor : buttonIconColor} />
                )}
              </div>
            </a>
          </div>
        </div>

        {/* === TEXT AREA === */}
        <div className="inflected-content" style={reverseMirrorStyle}>
          <h3
            style={{
              fontSize: fontSizes.title,
              color: titleColor,
              margin: margins.title,
              fontWeight: "bold",
              direction: isRTL(title) ? "rtl" : "ltr",
              textAlign: autoTitleAlign,
              ...(titleLineClamp
                ? {
                    display: "-webkit-box",
                    WebkitLineClamp: titleLineClamp,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }
                : {}),
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: fontSizes.description,
              color: descriptionColor,
              margin: margins.description,
              direction: isRTL(description) ? "rtl" : "ltr",
              textAlign: autoDescriptionAlign,
              ...(descriptionLineClamp
                ? {
                    display: "-webkit-box",
                    WebkitLineClamp: descriptionLineClamp,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }
                : {}),
            }}
          >
            {description}
          </p>
        </div>
      </div>

      <style jsx>{`
        .inflected-card {
          position: relative;
          border-radius: var(--card-rounding);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .inflected-cardInner {
          position: relative;
          width: 100%;
          background: var(--parent-bg);
          border-radius: var(--card-rounding);
          border-bottom-right-radius: 0;
          overflow: hidden;
        }
        .inflected-box {
          width: 100%;
          position: relative;
        }
        .inflected-imgBox {
          width: 100%;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          /* Fix border radius on hover */
          border-radius: var(--smooth-border-radius) !important;
          contain: paint; /* Prevents layout shift during hover */
        }
        .inflected-icon::before,
        .inflected-icon::after {
          position: absolute;
          content: "";
          background: transparent;
          width: 20px;
          height: 20px;
          border-bottom-right-radius: 20px;
          box-shadow: 5px 5px 0 5px var(--parent-bg);
        }
        .inflected-icon::before {
          bottom: 6px;
          left: -20px;
        }
        .inflected-icon::after {
          top: -20px;
          right: 6px;
        }
        .inflected-iconBox {
          position: absolute;
          inset: 10px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .inflected-iconBox:hover {
          transform: scale(1.1);
        }
        .inflected-content {
          padding: 15px 10px;
        }
        .inflected-content h3,
        .inflected-content p {
          transition: color 0.3s ease;
        }
      `}</style>
    </div>
  );
}
