"use client";

import { useState } from "react";
import useIsRTL from "@/hooks/useIsRTL";
import RefinedChronicleButton from "@/app/the-actual-components/refined-chronicle-button/RefinedChronicleButton";
import {
  FolderKanban,
} from "@/components/Icons";

const HEBREW_TRANSLITERATION = "ריפיינד";

export default function RefinedChronicleButtonPreview() {
  const isRTL = useIsRTL();
  
  const buttonText = isRTL ? HEBREW_TRANSLITERATION : "Refined";

  return (
    <div className="flex items-center justify-center w-full h-screen bg-[#fff]">
      <RefinedChronicleButton
        backgroundColor="var(--background)"
        textColor="var(--foreground)"
        hoverTextColor="var(--background)"
        borderColor="var(--sub-foreground)"
        borderVisible
        hoverBorderVisible
        hoverBorderColor="#00a7fa"
        hoverBackgroundColor="#00a7fa"
        borderWidth={1}
        borderRadius={8}
        isRTL={isRTL}
      >
        <FolderKanban /> {buttonText}
      </RefinedChronicleButton>
    </div>
  );
}
