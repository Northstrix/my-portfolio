"use client";
import React, { useEffect, useState } from "react";

// --- Helper: Backdrop/Glass Logic ---
interface BackdropOptions {
  supportsBackdropFilter: boolean;
  bodyOpacity: number;
  borderOpacity: number;
  blurStrength: number;
  isScrolled?: boolean;
}

export function getLegacyBackdropStyle({
  supportsBackdropFilter,
  bodyOpacity,
  borderOpacity,
  blurStrength,
  isScrolled = false,
}: BackdropOptions): React.CSSProperties {
  const invisibleOpacity = 0;
  return {
    background: supportsBackdropFilter
      ? `rgba(0, 0, 0, ${isScrolled ? bodyOpacity : invisibleOpacity})`
      : `rgba(0, 0, 0, ${isScrolled ? bodyOpacity + 0.2 : invisibleOpacity})`,
    backdropFilter: supportsBackdropFilter
      ? `blur(${isScrolled ? blurStrength : 0}px)`
      : undefined,
    WebkitBackdropFilter: supportsBackdropFilter
      ? `blur(${isScrolled ? blurStrength : 0}px)`
      : undefined,
    border: `1px solid rgba(255,255,255,${
      isScrolled ? borderOpacity : invisibleOpacity
    })`,
    boxShadow: isScrolled ? "0 2px 16px 0 rgba(0,0,0,0.08)" : "none",
    transition:
      "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease",
  };
}

interface RectangleNotificationProps {
  type?: "success" | "error";
  message: string;
  message1?: string;
  isVisible?: boolean;
  onClose: () => void;
}

const RectangleNotification: React.FC<RectangleNotificationProps> = ({
  type = "success",
  message,
  message1,
  isVisible = false, // Default to false to prevent load flash
  onClose,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [supportsBackdrop, setSupportsBackdrop] = useState(false);

  // --- Initialization for Glass Support ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSupportsBackdrop(
        CSS.supports("backdrop-filter: blur(0px)") ||
          CSS.supports("-webkit-backdrop-filter: blur(0px)")
      );
    }
  }, []);

  // --- Visibility Logic ---
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setIsFadingOut(false);
    } else {
      // If parent sets isVisible to false externally, we animate out
      if (shouldRender) {
        setIsFadingOut(true);
        const timer = setTimeout(() => {
          setShouldRender(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, shouldRender]);

  // Wrapper to handle the animation sequence BEFORE notifying the parent
  const handleCloseClick = () => {
    if (isFadingOut) return; // Prevent double-click
    setIsFadingOut(true);

    // Wait for animation to finish, then fire callback to parent
    setTimeout(() => {
      onClose(); // This tells parent to set isVisible={false}
      setShouldRender(false);
    }, 300);
  };

  // --- Generate Glass Style ---
  const boxGlassStyle = getLegacyBackdropStyle({
    supportsBackdropFilter: supportsBackdrop,
    bodyOpacity: 0.3, // Neutral dark glass opacity
    borderOpacity: 0.2,
    blurStrength: 25,
    isScrolled: true,
  });

  // Prevent rendering entirely if not active (Solves the "Shows on App Load" bug)
  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)", // Dim background slightly
        backdropFilter: "blur(12px)",
        // Logic Update: Only flex if rendering
        display: "flex", 
        justifyContent: "center",
        alignItems: "center",
        zIndex: 5000,
      }}
      className={`sign-up-rectangle-notification-container ${
        isFadingOut ? "fade-out" : "fade-in"
      }`}
    >
      <style jsx>{`
        .sign-up-rectangle-notification-box {
          position: relative;
          width: 245px;
          height: 250px;
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 999;
          direction: ltr;
        }
        /* Noise Texture */
        .sign-up-rectangle-notification-box::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.05;
          pointer-events: none;
          z-index: 0;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        /* --- Face Styles --- */
        .sign-up-rectangle-notification-face {
          position: absolute;
          width: 22%;
          height: 22%;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          top: 11%;
          z-index: 2;
          animation: bounce 1s ease-in infinite;
        }
        .sign-up-rectangle-notification-face.face2 {
          left: 37.5%;
          animation: roll 3s ease-in-out infinite;
        }
        /* --- Eye Styles --- */
        .sign-up-rectangle-notification-eye {
          position: absolute;
          width: 5px;
          height: 5px;
          background: rgba(50, 50, 50, 0.75);
          backdrop-filter: blur(2px);
          border-radius: 50%;
          top: 30%;
          left: 20%;
        }
        .sign-up-rectangle-notification-eye.right {
          left: 68%;
        }
        /* --- Mouth Styles --- */
        .sign-up-rectangle-notification-mouth {
          position: absolute;
          top: 33%;
          left: 41%;
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .sign-up-rectangle-notification-mouth.happy {
          border: 2px solid;
          border-color: transparent rgba(50, 50, 50, 0.75) rgba(50, 50, 50, 0.75)
            transparent;
          transform: rotate(45deg);
        }
        .sign-up-rectangle-notification-mouth.sad {
          top: 39%;
          border: 2px solid;
          border-color: rgba(50, 50, 50, 0.75) transparent transparent
            rgba(50, 50, 50, 0.75);
          transform: rotate(45deg);
        }
        /* --- Shadow Styles --- */
        .sign-up-rectangle-notification-shadow.scale {
          position: absolute;
          width: 21%;
          height: 3%;
          background: rgba(0, 0, 0, 0.75);
          filter: blur(6px);
          backdrop-filter: blur(4px);
          left: 40%;
          top: 33%;
          border-radius: 50%;
          z-index: 1;
          animation: scale 1s ease-in infinite;
        }
        .sign-up-rectangle-notification-shadow.move {
          position: absolute;
          width: 21%;
          height: 3%;
          background: rgba(0, 0, 0, 0.75);
          filter: blur(6px);
          backdrop-filter: blur(4px);
          left: 40%;
          top: 33%;
          border-radius: 50%;
          z-index: 1;
          transform: scale(1.14);
          animation: move 3s ease-in-out infinite;
        }
        /* --- Text Styles --- */
        .sign-up-rectangle-notification-message {
          position: absolute;
          width: 100%;
          text-align: center;
          top: 34%;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          mix-blend-mode: overlay;
        }
        .alert-rect-top {
          font-size: 32px;
          font-weight: 700;
          color: var(--foreground, #ffffff);
          margin: 0;
          opacity: 0.9;
        }
        .rectangle-notification-text {
          color: var(--foreground, #ffffff);
          margin: 2px 0 0px;
          font-size: 17px;
          opacity: 0.8;
          font-weight: 500;
        }
        .rectangle-notification-text1 {
          color: var(--foreground, #ffffff);
          margin: 0px 0 1px;
          font-size: 17px;
          opacity: 0.8;
        }
        /* Button Styles */
        .sign-up-rectangle-notification-button-box {
          position: absolute;
          width: 50%;
          height: 15%;
          top: 196px;
          left: 25%;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: var(--foreground, #ffffff);
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1px;
          text-transform: uppercase;
          border-radius: 20px;
          outline: 0;
          overflow: hidden;
          transition: all 0.5s ease;
          cursor: pointer;
          z-index: 10;
          mix-blend-mode: overlay;
        }
        .sign-up-rectangle-notification-button-box:hover {
          background: var(--foreground, #ffffff);
          color: #000000;
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
          mix-blend-mode: normal;
          transition: all 0.5s ease;
        }
        
        /* Animations */
        .fade-in {
          animation: fadeInAnimation 0.4s ease-out forwards;
        }
        .fade-out {
          animation: fadeOutAnimation 0.3s ease-in forwards;
        }

        @keyframes fadeInAnimation {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOutAnimation {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.95); pointer-events: none; }
        }

        @keyframes bounce {
          50% { transform: translateY(-10px); }
        }
        @keyframes roll {
          0% { transform: rotate(0deg); left: 25%; }
          50% { left: 60%; transform: rotate(168deg); }
          100% { transform: rotate(0deg); left: 25%; }
        }
        @keyframes move {
          0% { left: 25%; }
          50% { left: 60%; }
          100% { left: 25%; }
        }
        @keyframes scale {
          50% { transform: scale(0.9); }
        }
      `}</style>

      {/* Apply computed glass styles here */}
      <div className="sign-up-rectangle-notification-box" style={boxGlassStyle}>
        <div
          className={`sign-up-rectangle-notification-face ${
            type === "success" ? "" : "face2"
          }`}
        >
          <div className="sign-up-rectangle-notification-eye"></div>
          <div className="sign-up-rectangle-notification-eye right"></div>
          <div
            className={`sign-up-rectangle-notification-mouth ${
              type === "success" ? "happy" : "sad"
            }`}
          ></div>
        </div>
        <div
          className={`sign-up-rectangle-notification-shadow ${
            type === "success" ? "scale" : "move"
          }`}
        ></div>
        <div className="sign-up-rectangle-notification-message">
          <h1 className="alert-rect-top">
            {type === "success" ? "You got it!" : "Error!"}
          </h1>
          <p className="rectangle-notification-text">{message}</p>
          {message1 && <p className="rectangle-notification-text1">{message1}</p>}
        </div>
        <button
          className="sign-up-rectangle-notification-button-box"
          onClick={handleCloseClick}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RectangleNotification;