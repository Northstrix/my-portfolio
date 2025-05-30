"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { IconThumbUp } from "@tabler/icons-react";
import HalomotButton from "@/components/HalomotButtonWithLoader/HalomotButtonWithLoader";
import styled from "styled-components";
import { setDoc, doc, increment, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import confetti from "canvas-confetti";
import {
  addRTLProps,
  footerContentProps,
  maxSectionWidth,
} from "./LandingPage.styles";
import StructuredBlock from "@/components/StructuredBlock/StructuredBlock";

interface FooterProps {
  isRTL: boolean;
  languages: { code: string; name: string; flag: string }[];
  onOpenCreditModal: () => void; // Add this prop
}

const Footer: React.FC<FooterProps> = ({
  isRTL,
  languages,
  onOpenCreditModal,
}) => {
  const { t, i18n } = useTranslation();
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopVersionBottomThreshold = 768;

  useEffect(() => {
    const fetchLikeCount = async () => {
      let totalLikes = 0;
      for (const language of languages) {
        const docRef = doc(db, "data", "likeCounts");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fieldName = `${language.code}:like`;
          totalLikes += docSnap.data()[fieldName] || 0;
        }
      }
      setLikeCount(totalLikes);
    };
    fetchLikeCount();
  }, [languages]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setIsMobileView(
          containerRef.current.offsetWidth < desktopVersionBottomThreshold,
        );
      }
    };
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    handleResize(); // Initial check
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [desktopVersionBottomThreshold]);

  const handleLikeClick = async () => {
    if (isLiked) return;
    setIsLoading(true);
    const success = await incrementLikeCount(i18n.language);
    setIsLoading(false);
    if (success) {
      setIsLiked(true);
      confetti({ particleCount: 144, spread: 76, origin: { y: 0.7 } });
    }
  };

  async function incrementLikeCount(language: string): Promise<boolean> {
    const fieldName = `${language}:like`;
    const docRef = doc(db, "data", "likeCounts");
    try {
      await updateDoc(docRef, { [fieldName]: increment(1) });
      setLikeCount((prevCount) => prevCount + 1);
      return true;
    } catch (error: any) {
      if (error.code === "not-found") {
        await setDoc(docRef, { [fieldName]: 1 }, { merge: true });
        setLikeCount(1);
        return true;
      } else {
        console.error("Error incrementing like count:", error);
        return false;
      }
    }
  }

  return (
    <div ref={containerRef}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0px",
          justifyContent: "flex-start",
          alignItems: "stretch",
          width: "100%",
          maxWidth: maxSectionWidth,
          margin: "0 auto",
        }}
      >
        <FooterContainer isRTL={isRTL}>
          <StructuredBlock {...addRTLProps(footerContentProps, isRTL)}>
            <FooterContent isRTL={isRTL} isMobile={isMobileView}>
              {isMobileView ? (
                // Mobile: stack vertically, both full width
                <>
                  <HalomotButton
                    text={
                      isLoading
                        ? t("liking-portfolio")
                        : `${likeCount} ${t("likes")}`
                    }
                    onClick={handleLikeClick}
                    icon={<IconThumbUp stroke={2.25} />}
                    bgColor={isLiked ? "none" : "var(--background)"}
                    fillWidth={true}
                    isLoading={isLoading}
                    isRTL={isRTL}
                    gradient={
                      i18n.language === "he"
                        ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))"
                        : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))"
                    }
                  />
                  <CreditInscription
                    isRTL={isRTL}
                    isMobile={isMobileView}
                    onClick={onOpenCreditModal}
                  >
                    {t("credit-inscription")}
                  </CreditInscription>
                </>
              ) : (
                // Desktop: two columns, opposite alignment
                <>
                  {/* LTR: button left, credit right. RTL: credit left, button right */}
                  {isRTL ? (
                    <>
                      <CreditInscription
                        isRTL={isRTL}
                        isMobile={isMobileView}
                        onClick={onOpenCreditModal}
                      >
                        {t("credit-inscription")}
                      </CreditInscription>
                      <HalomotButtonContainer>
                        <HalomotButton
                          text={
                            isLoading
                              ? t("liking-portfolio")
                              : `${likeCount} ${t("likes")}`
                          }
                          onClick={handleLikeClick}
                          icon={<IconThumbUp stroke={2.25} />}
                          bgColor={isLiked ? "none" : "var(--background)"}
                          fillWidth={true}
                          isLoading={isLoading}
                          isRTL={isRTL}
                          gradient={
                            i18n.language === "he"
                              ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))"
                              : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))"
                          }
                        />
                      </HalomotButtonContainer>
                    </>
                  ) : (
                    <>
                      <HalomotButtonContainer>
                        <HalomotButton
                          text={
                            isLoading
                              ? t("liking-portfolio")
                              : `${likeCount} ${t("likes")}`
                          }
                          onClick={handleLikeClick}
                          icon={<IconThumbUp stroke={2.25} />}
                          bgColor={isLiked ? "none" : "var(--background)"}
                          fillWidth={true}
                          isLoading={isLoading}
                          isRTL={isRTL}
                          gradient={
                            i18n.language === "he"
                              ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))"
                              : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))"
                          }
                        />
                      </HalomotButtonContainer>
                      <CreditInscription
                        isRTL={isRTL}
                        isMobile={isMobileView}
                        onClick={onOpenCreditModal}
                      >
                        {t("credit-inscription")}
                      </CreditInscription>
                    </>
                  )}
                </>
              )}
            </FooterContent>
          </StructuredBlock>
        </FooterContainer>
      </div>
    </div>
  );
};

// Styled components
const FooterContainer = styled.footer<{ isRTL: boolean }>`
  background-color: var(--background);
  border-top: 1px solid var(--background-adjacent-color);
`;

const FooterContent = styled.div<{ isRTL: boolean; isMobile: boolean }>`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? "column" : "row")};
  justify-content: ${({ isMobile }) => (isMobile ? "center" : "space-between")};
  align-items: center;
  padding: 16px 0 96px 0;
  width: 100%;
  gap: ${({ isMobile }) => (isMobile ? "12px" : "0")};
`;

const HalomotButtonContainer = styled.div`
  width: 364px;
  min-width: 0;
  display: flex;
  align-items: center;
`;

const CreditInscription = styled.p<{ isRTL: boolean; isMobile: boolean }>`
  margin-top: ${({ isRTL, isMobile }) =>
    isMobile ? "12px" : isRTL ? "0" : "12px"};
  color: var(--refresh-inscription-color);
  text-align: ${({ isMobile, isRTL }) =>
    isMobile ? "center" : isRTL ? "left" : "right"};
  width: ${({ isMobile }) => (isMobile ? "100%" : "40%")};
  cursor: pointer;
  order: 2;
`;

export default Footer;
