"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlaygroundCard from "@/components/PlaygroundCard/PlaygroundCard";
import SecondPlaygroundCard from "@/components/PlaygroundCard/SecondPlaygroundCard";

interface PlaygroundCardAreaProps {
  isRTL: boolean;
  onCardClick: (index: number) => void;
  activeCard: number;
  firstCardRevealCanvas: boolean;
  secondCardText: string[];
}

const PlaygroundCardArea: React.FC<PlaygroundCardAreaProps> = ({
  isRTL,
  onCardClick,
  activeCard,
  firstCardRevealCanvas,
  secondCardText,
}) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      component: PlaygroundCard,
      props: {
        componentWidth: "412px",
        aspectRatio: "3/4",
        outerRounding: "var(--outer-moderate-rounding)",
        innerRounding: "var(--moderate-rounding)",
        backgroundColor: firstCardRevealCanvas ? "var(--background)" : "#FFF",
        adjacentColor: firstCardRevealCanvas
          ? "var(--background-adjacent-color)"
          : "var(--refresh-inscription-color)",
        foregroundColor: "#000",
        imageHeightPercentage: 70,
        imageSrc: "/playground-card-image.webp",
        imageAlt: "",
        outlineColor: "var(--refresh-inscription-color)",
        hoverOutlineColor: firstCardRevealCanvas
          ? "var(--lightened-background-adjacent-color)"
          : "var(--secondary-foreground)",
        textArray: ["洪", "秀", "全"],
        minWidth: 200,
        maxWidth: 400,
        minTextSize: 16,
        maxTextSize: 24,
        verticalPadding: "20px",
        horizontalPadding: "20px",
        manualLetterSpacing: -2,
        componentId: "card-1",
        swapCard: () => onCardClick(0),
        revealCanvas: firstCardRevealCanvas,
      },
    },
    {
      component: SecondPlaygroundCard,
      props: {
        componentWidth: "412px",
        aspectRatio: "3/4",
        outerRounding: "var(--outer-moderate-rounding)",
        innerRounding: "var(--moderate-rounding)",
        backgroundColor: "var(--foreground)",
        adjacentColor: "var(--background-adjacent-color)",
        foregroundColor: "var(--foreground)",
        hoverOutlineColor: "var(--background-adjacent-color)",
        outlineColor: "var(--refresh-inscription-color)",
        imageHeightPercentage: 62,
        imageSrc: "/second-playground-card-image.webp",
        imageAlt: "",
        textArray: secondCardText,
        minWidth: 200,
        maxWidth: 400,
        minTextSize: 16,
        maxTextSize: 24,
        verticalPadding: "15px",
        horizontalPadding: "15px",
        manualLetterSpacing: 0,
        componentId: "card-2",
        swapCard: () => onCardClick(1),
      },
    },
  ];

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  return (
    <div
      className="flex flex-col items-center w-full"
      style={{ maxWidth: "512px" }}
    >
      <div
        className="relative w-full max-w-[412px] mx-auto"
        style={{ aspectRatio: "3/4" }}
      >
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={`card-${index}`}
              initial={{ opacity: 0, scale: 0.84, rotate: randomRotateY() }}
              animate={{
                opacity: index === activeCard ? 1 : 0.5,
                scale: index === activeCard ? 1 : 0.9,
                rotate: 0,
                zIndex:
                  index === activeCard
                    ? 30
                    : hoveredCard === index
                      ? 25
                      : 20 - index,
                y: index === activeCard ? 0 : 10,
              }}
              exit={{ opacity: 0, scale: 0.84, rotate: randomRotateY() }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 origin-center cursor-pointer"
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 overflow-hidden">
                  <card.component {...card.props} key={`card-${index}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlaygroundCardArea;
