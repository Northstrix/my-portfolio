"use client";

import { I18nextProvider } from "react-i18next";
import i18nConf from "@/next-i18next.config.js";
import useIsRTL from "@/hooks/useIsRTL";
import Content from "./Content";

export default function Page() {
  const isRTL = useIsRTL();

  return (
    <I18nextProvider i18n={i18nConf}>
      <div dir={isRTL ? "rtl" : "ltr"}>
        {/* Only sets direction, then includes Content component */}
        <Content />
      </div>
    </I18nextProvider>
  );
}