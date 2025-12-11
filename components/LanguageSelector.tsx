"use client";
import React, { useEffect, useState, useCallback, forwardRef } from "react";
import * as WheelPickerPrimitive from "@ncdai/react-wheel-picker";
import "@ncdai/react-wheel-picker/style.css";
import ChronicleButton from "@/components/RefinedChronicleButton";
import { AnimatePresence, motion } from "framer-motion";
import { ModalOverlay } from "./modal-overlay";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface LanguageSelectorHandle {
  open: () => void;
  close: () => void;
}
interface LanguageSelectorProps {
  onClose?: () => void;
}

const ANIMATION_DURATION = 0.3;

const LANGUAGES = [
  { code: "en", label: "English", applyText: "Apply" },
  { code: "he", label: "עברית", applyText: "החל" },
  { code: "it", label: "Italiano", applyText: "Applica" },
  { code: "es", label: "Español", applyText: "Aplicar" },
];

function WheelPicker({
  classNames,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPicker>) {
  return (
    <WheelPickerPrimitive.WheelPicker
      classNames={{
        optionItem: "text-[var(--subtle-foreground)]",
        highlightWrapper:
          "bg-[var(--language-selector-center-line-bg,#39bdff)] text-[hsl(var(--accent-foreground))]",
        ...classNames,
      }}
      {...props}
    />
  );
}

export const LanguageSelector = forwardRef<
  LanguageSelectorHandle,
  LanguageSelectorProps
>(function LanguageSelector({ onClose }, ref) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tempSelectedValue, setTempSelectedValue] = useState(i18n.language);
  const isMobile = useIsMobile();

  React.useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  // Synchronize local selection state with i18n language changes
  useEffect(() => {
    setTempSelectedValue(i18n.language);
  }, [i18n.language]);

  const handleValueChange = useCallback((value: string) => {
    setTempSelectedValue(value);
  }, []);

  // Apply language change immediately and close the selector
  const handleApply = () => {
    if (tempSelectedValue !== i18n.language) {
      i18n.changeLanguage(tempSelectedValue);
    }
    setOpen(false);
    onClose?.();
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  // Button text changes dynamically based on selection
  const applyButtonText =
    LANGUAGES.find((l) => l.code === tempSelectedValue)?.applyText || "Apply";

  const options = LANGUAGES.map((l) => ({
    label: l.label,
    value: l.code,
  }));

  return (
    <AnimatePresence>
      {open && (
        <ModalOverlay onClose={handleClose}>
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
              className="relative rounded-lg shadow-xl p-4 md:p-6 min-w-[240px] max-w-[90vw] border flex flex-col items-center outline-none"            style={{
              backgroundColor: `var(--background)`,
              borderColor: `var(--border-color)`,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0,0,0,0.1)",
            }}
          >
            <span className="mb-4 md:mb-6 font-semibold text-[20px]"
                style={{
                  color: "var(--foreground)",
                }}
            >Language</span>
            <div
              className="w-full rounded-(--border-radius) mb-4 md:mb-7 overflow-hidden flex justify-center"
              style={{
                backgroundColor:
                  "var(--language-selector-list-bg, hsla(0,0%,100%,0.95))",
                border: `1px solid var(--border-color)`,
                color: "var(--foreground)",
              }}
            >
              <WheelPicker
                options={options}
                value={tempSelectedValue}
                onValueChange={handleValueChange}
              />
            </div>
            <ChronicleButton
              onClick={handleApply}
              className="w-full"
              variant="default"
              backgroundColor="var(--foreground)"
              hoverBackgroundColor="var(--accent)"
              textColor="var(--background)"
              hoverTextColor="var(--foreground)"
              borderVisible={false}
              borderRadius="var(--border-radius)"
              fontWeight={700}
              buttonHeight={isMobile ? "2.75rem" : "2.875rem"}
              width="100%"
            >
              {applyButtonText}
            </ChronicleButton>
          </motion.div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
});
