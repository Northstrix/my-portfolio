"use client";

import React, { useState, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import useIsRTL from "@/hooks/useIsRTL";

// Components
import PlaygroundContainer from "@/components/sections/playground/PlaygroundContainer";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/DraggableCard";
import {
  SplashedPushNotifications,
  SplashedPushNotificationsHandle,
  NotificationType,
} from "@/components/SplashedPushNotifications";
import UfoOverlay from "./UfoOverlay";
import RectangleNotification from "@/components/RectangleNotification";
import ColorTools from "@/components/ColorTools";
import OrbBackground from "./OrbBackground";
import BonusCard from "./BonusCard";

// Data Imports
import { quotes, draggableCards } from "@/data/stuff";

// --- Types ---

// 1. Define the Handle type so the parent knows what functions are available
export interface PlaygroundHandle {
  incrementUfoCount: () => void;
}

interface PlaygroundContentProps {
  isRTL?: boolean;
  containerWidth: number;
  setAccentColor?: (color: string) => void;
  // Note: onContactCardClick prop is removed because we use the Ref now
}

// 2. Wrap component in forwardRef
const PlaygroundContent = forwardRef<PlaygroundHandle, PlaygroundContentProps>(
  ({ isRTL: propIsRTL, containerWidth, setAccentColor }, ref) => {
    const hookIsRTL = useIsRTL();
    const isRTL = propIsRTL ?? hookIsRTL;
    const isMobileDevice = useIsMobile();

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const toastRef = useRef<SplashedPushNotificationsHandle>(null);
    const consecutiveClicksRef = useRef(0);

    // States
    const [localAccentColor, setLocalAccentColor] = useState<string>("#802EE8");
    const [activeCard, setActiveCard] = useState(0);
    const [ufoCount, setUfoCount] = useState(0);
    const [showColorTools, setShowColorTools] = useState(false);
    const [showRectNotification, setShowRectNotification] = useState(false);
    const [hasTriggeredRareEvent, setHasTriggeredRareEvent] = useState(false);

    // Extra Card State
    const [extraCard, setExtraCard] = useState<{
      id: number;
      left: string;
      top: string;
    } | null>(null);

    // 3. Expose the specific function to the parent via the ref
    useImperativeHandle(ref, () => ({
      incrementUfoCount: () => {
        setUfoCount((prev) => prev + 1);
      },
    }));

    // --- CALCULATION LOGIC ---
    const { cardWidth, cardHeight, scaleFactor } = useMemo(() => {
      const minBreak = 912;
      const maxBreak = 1200;
      const minCardW = 240;
      const maxCardW = 360;

      let w = maxCardW;

      if (containerWidth >= maxBreak) {
        w = maxCardW;
      } else if (containerWidth <= minBreak) {
        w = minCardW;
      } else {
        const t = (containerWidth - minBreak) / (maxBreak - minBreak);
        w = minCardW + t * (maxCardW - minCardW);
      }

      return {
        cardWidth: w,
        cardHeight: w * 1.4,
        scaleFactor: w / maxCardW,
      };
    }, [containerWidth]);

    const spawnExtraCard = () => {
      if (!extraCard) {
        setExtraCard({
          id: Date.now(),
          left: `calc(50% - ${cardWidth / 2}px)`,
          top: `calc(50% - ${cardHeight / 2}px)`,
        });
      }
    };

    const getRandomToastType = (): NotificationType => {
      const types: NotificationType[] = ["success", "error", "warning", "help"];
      return types[Math.floor(Math.random() * types.length)];
    };

    const handleToast = () => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      const useHebrew = Math.random() > 0.5;
      const title = useHebrew ? randomQuote.hebrewAuthor : randomQuote.author;
      const message = useHebrew ? randomQuote.hebrewQuote : randomQuote.quote;
      const type = getRandomToastType();

      if (useHebrew) {
        toastRef.current?.createRtlNotification(type, title, message);
      } else {
        toastRef.current?.createNotification(type, title, message);
      }
    };

    // --- LOGIC: Trigger Color Change ---
    const triggerRandomAccentChange = () => {
      if (Math.random() < 0.2) {
        const purpleHex = "#802EE8";
        const blueHex = "#2E68E8";
        const targetColor = localAccentColor === blueHex ? purpleHex : blueHex;

        if (typeof document !== "undefined") {
          document.documentElement.style.setProperty("--accent", targetColor);
        }
        setLocalAccentColor(targetColor);
        if (setAccentColor) {
          setAccentColor(targetColor);
        }
      }
    };

    const handleCardClick = (cardId: number) => {
      setActiveCard(cardId);
      triggerRandomAccentChange();

      if (cardId === 0) {
        consecutiveClicksRef.current += 1;
        if (
          consecutiveClicksRef.current > 0 &&
          consecutiveClicksRef.current % 5 === 0
        ) {
          setUfoCount((prev) => prev + 1);
        }
        handleToast();
      } else if (cardId === 1) {
        consecutiveClicksRef.current = 0;
        const rand = Math.random();
        if (rand < 0.12) {
          setShowColorTools(true);
        } else {
          handleToast();
        }
      } else if (cardId === 2) {
        consecutiveClicksRef.current = 0;
        if (hasTriggeredRareEvent) {
          handleToast();
        } else {
          // Rare Event Logic
          if (Math.random() < 0.01) {
            setShowRectNotification(true);
            setHasTriggeredRareEvent(true);
            setTimeout(() => {
              spawnExtraCard();
            }, 300);
          } else {
            handleToast();
          }
        }
      }
    };

    return (
      <>
        <div
          ref={containerRef}
          className="flex flex-col w-full relative justify-start items-stretch"
        >
          <div
            style={{
              width: "100%",
              height: isMobileDevice ? "auto" : "calc(100vh - 215px)",
              minHeight: isMobileDevice ? "auto" : "calc(100vh - 215px)",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Layer 0: Orbs */}
            <OrbBackground />

            {/* Layer 1: Background Draggable Cards */}
            {!isMobileDevice && (
              <div className="absolute top-[1px] left-[1px] z-[1] w-[calc(100%-2px)] h-[calc(100%-2px)] overflow-hidden rounded-[var(--moderate-rounding)] pointer-events-none">
                <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center pointer-events-auto">
                  {draggableCards.map((item, index) => (
                    <DraggableCardBody key={index} className={item.className}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="pointer-events-none relative z-10 min-h-[300px] min-w-[410px] object-cover rounded-[var(--outer-moderate-rounding)]"
                      />
                      <h3 className="mt-4 text-center text-2xl font-bold text-[var(--background-adjacent-color)]">
                        {item.title}
                      </h3>
                    </DraggableCardBody>
                  ))}
                </DraggableCardContainer>
              </div>
            )}

            {/* Layer 2: Main Interactive Fan */}
            <div className="relative z-10 w-full h-full pointer-events-none flex items-center justify-center">
              <PlaygroundContainer
                isRTL={isRTL}
                onCardClick={handleCardClick}
                activeCard={activeCard}
                containerWidth={containerWidth}
                shaderKey={0}
              />
            </div>

            {/* Layer 3: Extra Draggable Bonus Card */}
            {extraCard && (
              <BonusCard
                zIndex={1997}
                width={cardWidth}
                height={cardHeight}
                scaleFactor={scaleFactor}
                style={{ left: extraCard.left, top: extraCard.top }}
              />
            )}
          </div>
        </div>

        {/* Overlays */}
        {ufoCount > 0 && <UfoOverlay count={ufoCount} />}
        <SplashedPushNotifications ref={toastRef} />
        <ColorTools
          isOpen={showColorTools}
          onClose={() => setShowColorTools(false)}
        />
        <RectangleNotification
          message="This notification appears"
          message1="with 1% probability."
          isVisible={showRectNotification}
          onClose={() => setShowRectNotification(false)}
        />
      </>
    );
  }
);

PlaygroundContent.displayName = "PlaygroundContent";

export default PlaygroundContent;