"use client";

import React, { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import useMobileCheck from "@/hooks/useMobileCheck";
import { gsap } from "gsap";

const imageUrls = [
  "/Flag_of_the_United_States.svg",
  "/Flag_of_Israel.svg",
  "/Flag_of_Argentina.svg",
  "/logo.webp",
  "/plum-cave.webp",
  "/namer-ui.webp",
  "/rct.webp",
  "/pha5e-inspired-hero-section.webp",
  "/bwlt.webp",
  "/in-browser-file-encrypter.webp",
  "/plum-cave-hebrew.webp",
  "/shining-yam.webp",
  "/shakhor.webp",
  "/midbar.webp",
  "/eslms.webp",
  "/eslfb.webp",
  "/lantern.webp",
];

const BootlegComponentSwitcher: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const isMobileDevice = useMobileCheck();

  useEffect(() => {
    setIsMobile(isMobileDevice);

    const preloadImages = (urls: string[]) => {
      urls.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    };

    preloadImages(imageUrls);

    const loaderTimeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(loaderTimeout);
  }, [isMobileDevice]);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".landing-page",
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.inOut" },
      );
    }
  }, [loading]);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          <p>Loading...</p>
          <p style={{ marginTop: "2px" }}>Please wait for a while.</p>
        </div>
      ) : (
        <LandingPage isMobile={isMobile} className="landing-page" />
      )}
    </>
  );
};

export default BootlegComponentSwitcher;
