"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import StructuredBlock from "@/components/StructuredBlock/StructuredBlock";
import {
  addRTLProps,
  contentProps,
} from "@/app/LandingPage.styles";
import ContactCard from "./ContactCard";

const ContactContainer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = false;
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [dynamicHeight, setDynamicHeight] = useState("auto");
  const [dynamicPadding, setDynamicPadding] = useState("24px");
  const [isMobile, setIsMobile] = useState(false);
  const tagRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const balatroContainerRef = useRef<HTMLDivElement>(null);

  // Function to calculate dimensions
  const calculateDimensions = () => {
    if (sectionRef.current) {
      setIsMobile(sectionRef.current.offsetWidth < 768); // Mobile threshold
    }
    if (headlineRef.current && textRef.current && balatroContainerRef.current) {
      const headlineHeight =
        headlineRef.current.getBoundingClientRect().height || 0;
      const textHeight = textRef.current.getBoundingClientRect().height || 0;
      const balatroContentHeight =
        balatroContainerRef.current.getBoundingClientRect().height || 0;
      const spacerHeight = isMobile ? 14 : 27;
      const availableHeight =
        window.innerHeight - (69 + headlineHeight + textHeight + spacerHeight);
      setDynamicHeight(`${availableHeight}px`);
      const calculatedPaddingTopBottom = Math.max(
        (availableHeight - balatroContentHeight) / 2,
        24,
      );
      const calculatedPadding = `${Math.max(calculatedPaddingTopBottom, 24)}px 24px`;
      setDynamicPadding(calculatedPadding);
    } else {
      console.warn(
        "One or more refs are null. Ensure all elements are rendered before calculations.",
      );
    }
  };

  // Effect to handle initial calculation, delayed calculation, and resize events
  useEffect(() => {
    calculateDimensions();
    const timeoutId = setTimeout(() => {
      calculateDimensions();
    }, 1000);
    const handleResize = () => {
      calculateDimensions();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <StructuredBlock {...addRTLProps(contentProps, isRTL)}>
        <div
          style={{
            borderRadius: "var(--outer-moderate-rounding)",
            padding: "1px",
            width: "100%",
            display: "inline-block",
            background: isCardHovered
              ? "var(--lightened-background-adjacent-color)"
              : "var(--background-adjacent-color)",
            transition: "background 0.3s ease-in-out",
          }}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          <div
            style={{
              backgroundColor: "var(--card-background)",
              borderRadius: "var(--moderate-rounding)",
              display: "flex",
              flexDirection: "column",
              color: "var(--foreground)",
            }}
          >
            <ContactCard
              isRTL={isRTL}
              outerRounding="var(--outer-moderate-rounding)"
              innerRounding="var(--moderate-rounding)"
              onCardClick={() => {}}
              activeCard={0}
              firstCardRevealCanvas={false}
              secondCardText={["ר", "ש", "ק"]}
              emails={[
                "maxim.bortnikov_fvrr@outlook.com",
                "maxim.bort.devel@gmail.com",
                "Northstrix@emailthing.xyz",
                "Telegram: @maxim_brt",
              ]}
            />
          </div>
        </div>
      </StructuredBlock>
    </>
  );
};

export default ContactContainer;
