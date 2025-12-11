"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Silk from "@/components/Silk";
import useIsRTL from "@/hooks/useIsRTL";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface ProjectCardProps {
  project: Project;
  onCardClick: (metric: string) => void;
  suffix?: string;
}

export default function ProjectCard({ project, onCardClick, suffix = "from-project-card" }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isRTL = useIsRTL();

  const handleInteraction = async (eventType: string) => {
    await onCardClick?.(`${project.id}-${eventType}-${suffix}`);
  };

  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: "block" }}
      onClick={() => handleInteraction("clicked")}
      onAuxClick={(e) => {
        if (e.button === 1) {
          handleInteraction("wheel-clicked");
        }
      }}
      onDragStart={() => handleInteraction("dragged")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block relative rounded-[var(--border-radius)] border border-[var(--border-color)] overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        backgroundColor: isHovered ? "var(--lightened-background-adjacent-color)" : "var(--background-adjacent-color)",
        transition: "background-color 0.3s ease-in-out, border 0.3s ease-in-out",
      }}
    >
      {/* Smooth Silk overlay */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          borderRadius: "var(--border-radius)",
          overflow: "hidden",
          pointerEvents: "none",
          background: "transparent",
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <Silk
          speed={10}
          scale={1}
          noiseIntensity={0.5}
          rotation={0}
          isRTL={isRTL}
        />
      </motion.div>

      <div className="flex flex-col relative z-10 p-4" style={{ padding: "16px" }}>
        <div
          className="relative w-full border border-[var(--border-color)] rounded-[var(--border-radius)] overflow-hidden"
          style={{ aspectRatio: "1280 / 935" }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover rounded-[var(--border-radius)]"
            draggable={false}
          />
        </div>

        <div
          className="pt-4 flex flex-col justify-start relative transition-transform duration-300"
          style={{
            transform: isHovered
              ? isRTL
                ? "translateX(-6px)"
                : "translateX(6px)"
              : "translateX(0)",
            transition: "transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
          }}
        >
          <h3 className="font-headline text-2xl mb-2 font-semibold text-[var(--foreground)]">
            {project.title}
          </h3>
          <p className="font-body text-base text-[var(--sub-foreground)]">
            {project.description}
          </p>
        </div>
      </div>
    </a>
  );
}
