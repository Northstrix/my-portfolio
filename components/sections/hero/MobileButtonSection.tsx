"use client";

import RefinedChronicleButton from "@/components/RefinedChronicleButton";
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
        return "10.25rem";
      case "it":
        return "14rem";
      case "es":
        return "11rem";
      case "en":
      default:
        return "11.75rem";
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

      <RefinedChronicleButton
        backgroundColor="var(--background)"
        textColor="var(--foreground)"
        borderColor="var(--border-color)"
        borderVisible
        hoverBorderVisible
        hoverBackgroundColor="var(--border-color)"
        hoverBorderColor="var(--border-color)"
        hoverTextColor="var(--foreground)"
        buttonHeight={mobileButtonHeight ? "2.75rem" : "2.875rem"}
        width={buttonsBelowOneAnother ? "100%" : "auto"}
        isRTL={isRTL}
        onClick={() => handleClick("contact-info")}
      >
        {t("contact_info")}
      </RefinedChronicleButton>
    </div>
  );
}
