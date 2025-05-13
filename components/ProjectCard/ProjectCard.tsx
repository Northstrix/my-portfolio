"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import HalomotButton from "@/components/HalomotButton/HalomotButton";
import { Lens } from "./Lens";
import { useState } from "react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  name: string;
  description: string;
  image: string;
  link: string;
  imageAspectRatio: number;
  buttonInscriptions: { openWebAppButton: string };
  onItemClick: (link: string) => void;
  outerRounding: string; // Add this line
  innerRounding: string; // Add this line
  outlineColor: string; // Add this line
  hoverOutlineColor: string; // Add this line
  isRTL: boolean; // Add this line
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  description,
  image,
  link,
  imageAspectRatio,
  buttonInscriptions,
  onItemClick,
  isRTL, // Add this line
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "group/bento hover:shadow-xl transition duration-200 flex flex-col h-full relative",
      )}
      style={{
        backgroundColor: isCardHovered
          ? "var(--lightened-background-adjacent-color)"
          : "var(--background-adjacent-color)",
        padding: "1px",
        borderRadius: "var(--outer-mild-rounding)",
        transition: "background-color 0.3s ease-in-out",
      }}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <div
        className="flex flex-col h-full"
        style={{
          borderRadius: "var(--mild-rounding)",
          backgroundColor: "var(--card-background)",
          padding: "1rem",
        }}
      >
        <Lens
          zoomFactor={1.61}
          lensSize={176}
          onHoverChange={setIsImageHovered}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ paddingTop: `${(1 / imageAspectRatio) * 100}%` }}
          >
            <div
              className="absolute inset-0"
              style={{
                padding: "1px",
                background: isImageHovered
                  ? "var(--lightened-background-adjacent-color)"
                  : "var(--background-adjacent-color)",
                borderRadius: "var(--mild-rounding)",
                transition: "background-color 0.3s ease-in-out",
              }}
            >
              <div
                className="relative h-full w-full overflow-hidden"
                style={{ borderRadius: "var(--mild-rounding)" }}
              >
                <Image src={image} alt={name} fill className="object-cover" />
              </div>
            </div>
          </div>
        </Lens>
        <div className="transition duration-200 flex-grow">
          <div className="font-sans font-bold text-[var(--foreground)] text-[25px] mb-2 mt-4">
            {name}
          </div>
          <div className="font-sans text-[var(--secondary-foreground)] text-[16px]">
            {description}
          </div>
        </div>
        <div className="mt-6">
          <HalomotButton
            text={buttonInscriptions.openWebAppButton}
            onClick={() => onItemClick(link)}
            fillWidth
            gradient={
              isRTL
                ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))"
                : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))"
            }
            href={link}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
