"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HalomotButton from "@/components/HalomotButton/HalomotButton";

export interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  languages: Language[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  isOpen,
  onClose,
  languages,
}) => {
  const { t, i18n } = useTranslation();
  const [componentWidth, setComponentWidth] = useState("402px");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 442) {
        setComponentWidth("352px");
      } else {
        setComponentWidth("402px");
      }
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isOpen) return null;

  const handleLanguageSelect = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(21, 20, 25, 0.7)",
        backdropFilter: "blur(3px) saturate(90%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          borderRadius: "var(--outer-moderate-rounding)",
          padding: "1px",
          background: "var(--background-adjacent-color)",
          display: "inline-block",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--card-background)",
            padding: "20px",
            borderRadius: "var(--moderate-rounding)",
            width: componentWidth,
            maxHeight: "calc(100vh - 20px)",
            display: "flex",
            flexDirection: "column",
            color: "var(--foreground)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "24px",
              fontSize: "32px",
              fontWeight: "bold",
            }}
          >
            Language
          </h2>
          <div style={{ overflowY: "auto", flexGrow: 1, marginBottom: "20px" }}>
            {languages.map((lang) => (
              <div
                key={lang.code}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1px",
                  borderRadius: "var(--moderate-rounding)",
                  cursor: "pointer",
                  backgroundColor:
                    i18n.language === lang.code
                      ? "var(--lightened-background-adjacent-color)"
                      : "transparent",
                  padding: "20px",
                  transform: lang.code === "he" ? "scaleX(-1)" : "none",
                }}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                <img
                  src={lang.flag}
                  alt={lang.name}
                  width={123}
                  height="auto"
                  style={{
                    marginRight: "10px",
                    borderRadius: "var(--flag-rounding)",
                    transform: lang.code === "he" ? "scaleX(-1)" : "none",
                  }}
                />
                <span
                  style={{
                    transform: lang.code === "he" ? "scaleX(-1)" : "none",
                    wordBreak: "keep-all",
                    whiteSpace: "normal",
                    fontSize: "clamp(16px, 3vw, 20px)",
                    lineHeight: "1.2",
                  }}
                >
                  {lang.name}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "4px",
              justifyContent: "center",
            }}
          >
            <HalomotButton
              text={t("ok_button")}
              onClick={onClose}
              gradient={
                i18n.language === "he"
                  ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))"
                  : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))"
              }
            />
          </div>
          <div style={{ height: "10px" }}></div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
