"use client";

import RefinedChronicleButton from "@/components/RefinedChronicleButton";
import SilkRefinedChronicleButton from "@/components/SilkRefinedChronicleButton";
import { useTranslation } from "react-i18next";

interface ButtonSectionProps {
  buttonsBelowOneAnother?: boolean;
  mobileButtonHeight?: boolean;
  isRTL?: boolean;
  onButtonClick?: (buttonKey: "explore" | "contact-info") => void;
}

export default function ButtonSection({
  buttonsBelowOneAnother = false,
  mobileButtonHeight = false,
  isRTL = false,
  onButtonClick,
}: ButtonSectionProps) {
  const { t, i18n } = useTranslation();

  const handleClick = (buttonKey: "explore" | "contact-info") => {
    if (onButtonClick) onButtonClick(buttonKey);
  };

  // Define button widths per language
  const getButtonWidth = (lang: string): string => {
    switch (lang) {
      case "he":
        return "9.75rem";
      case "it":
        return "11rem";
      case "es":
        return "12.25rem";
      case "en":
      default:
        return "11.25rem";
    }
  };

  const buttonWidth = buttonsBelowOneAnother ? "100%" : getButtonWidth(i18n.language);

  return (
    <div
      className="flex w-full justify-start items-center mt-8"
      style={{
        gap: buttonsBelowOneAnother ? "12px" : "16px",
        flexDirection: buttonsBelowOneAnother ? "column" : "row",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <RefinedChronicleButton
        backgroundColor="var(--foreground)"
        textColor="var(--background)"
        hoverBackgroundColor="var(--accent)"
        hoverTextColor="var(--foreground)"
        borderVisible={false}
        buttonHeight={mobileButtonHeight ? "2.75rem" : "2.875rem"}
        width={buttonWidth}
        isRTL={isRTL}
        onClick={() => handleClick("explore")}
      >
        {t("explore_projects")}
      </RefinedChronicleButton>

      <SilkRefinedChronicleButton
        backgroundColor="var(--background)"
        textColor="var(--foreground)"
        borderColor="var(--border-color)"
        hoverBackgroundColor="var(--background)"
        hoverBorderColor="var(--border-color)"
        hoverTextColor="var(--foreground)"
        buttonHeight={mobileButtonHeight ? "2.75rem" : "2.875rem"}
        width={buttonWidth}
        isRTL={isRTL}
        onClick={() => handleClick("contact-info")}
      >
        {t("contact_info")}
      </SilkRefinedChronicleButton>
    </div>
  );
}
