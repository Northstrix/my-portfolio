"use client";

import { useTranslation } from "react-i18next";

export default function useIsRTL() {
  const { i18n } = useTranslation();
  return i18n.language === "he";
}