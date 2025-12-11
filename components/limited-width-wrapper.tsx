"use client";
import { useState, useEffect, ReactNode } from "react";

export default function LimitedWidthWrapper({
  children,
  expandToFull = false,
  maxWidth = "1448px",
  paddingDesktop = "24px",
  paddingMobile = "10px",
}: {
  children: ReactNode;
  expandToFull?: boolean;
  maxWidth?: string;
  paddingDesktop?: string;
  paddingMobile?: string;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className="mx-auto w-full"
      style={{
        maxWidth: expandToFull ? "100%" : maxWidth,
        paddingLeft: isMobile ? paddingMobile : paddingDesktop,
        paddingRight: isMobile ? paddingMobile : paddingDesktop,
        transition: "max-width 0.5s ease-in-out, padding 0.3s ease-in-out",
      }}
    >
      {children}
    </div>
  );
}
