"use client";
import React, { useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18nConf from "@/next-i18next.config.js";
import { useTranslation } from "react-i18next";
import SimpleNavbar from "@/components/SimpleNavbar/SimpleNavbar";
import UnfoldingSidebar from "@/components/UnfoldingSidebar/UnfoldingSidebar";
import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
import { IconBorderRightPlus, IconFoldDown } from "@tabler/icons-react";
import CreditModal from "@/components/CreditModal/CreditModal";
import WebProjectsContent from "./WebProjectsContent";
import NextJSTemplatesContent from "./NextJSTemplatesContent";
import EmbeddedProjectsContent from "./EmbeddedProjectsContent";
import ArticlesContent from "./ArticlesContent";
import PlaygroundContent from "./PlaygroundContent";
import ContactInfoContent from "./ContactInfoContent";
import EducationContent from "./EducationContent";
import WorkExperienceContent from "./WorkExperienceContent";
import { Container, ContentArea, Section } from "./LandingPage.styles";
import { gsap } from "gsap";
import BioSection from "./BioSection";
import { setDoc, doc, increment, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import Footer from "./Footer";
import LanguageInfoModal from "@/components/LanguageInfoModal/LanguageInfoModal";

interface LandingPageProps {
  isMobile: boolean;
  className: string;
}

const languages = [
  { code: "en", name: "English", flag: "/Flag_of_the_United_States.svg" },
  { code: "he", name: "עברית", flag: "/Flag_of_Israel.svg" },
  { code: "es_ar", name: "Español", flag: "/Flag_of_Argentina.svg" },
  { code: "de", name: "Deutsch", flag: "/Flag_of_Germany.svg" },
  { code: "ru", name: "Русский", flag: "/Flag_of_Russia.svg" },
];

const LandingPage: React.FC<LandingPageProps> = ({ isMobile, className }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLanguageInfoOpen, setIsLanguageInfoOpen] = useState(false);


  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      gsap.fromTo(
        `.${className}`,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.inOut" }
      );
      setIsLanguageInfoOpen(true); // Open the new modal after 1 second
    }, 1000);
    return () => clearTimeout(timer);
  }, [className]);

  const handleProjectClick = async (link: string) => {
    incrementLinkCount(i18n.language, link);
  };

  function sanitizeLink(link: string): string {
    let cleaned = link.replace(/^https?:\/\//, "");
    cleaned = cleaned.replace(/^www\./, "");
    cleaned = cleaned.replace(/\./g, "-"); // Replace all "." with "-"
    return cleaned;
  }

  async function incrementLinkCount(language: string, link: string) {
    const cleanedLink = sanitizeLink(link);
    const safeLink = encodeURIComponent(cleanedLink);
    const fieldName = `${language}:${safeLink}`;
    const docRef = doc(db, "data", "linkCounts");
    try {
      await updateDoc(docRef, { [fieldName]: increment(1) });
    } catch (error: any) {
      if (error.code === "not-found") {
        await setDoc(docRef, { [fieldName]: 1 }, { merge: true });
      } else {
        //console.error("Error incrementing link count:", error);
      }
    }
    return safeLink;
  }

  const openCreditModal = () => setIsCreditModalOpen(true);
  const closeCreditModal = () => setIsCreditModalOpen(false);

  return (
    <I18nextProvider i18n={i18nConf}>
      {isMobile && (
        <>
          <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
            <SimpleNavbar
              logo="/logo.webp"
              appName={t("my-name")}
              onLanguageIconClick={() => setIsLanguageSelectorOpen(true)}
              isRTL={isRTL}
            />
          </div>
          <div className="h-14" />
        </>
      )}
      <Container isRTL={isRTL} className={className} style={{ opacity: isVisible ? 1 : 0 }}>
        {!isMobile && (
          <UnfoldingSidebar
            logo="/logo.webp"
            appName={t("my-name")}
            sections={[
              {
                title: t("about-me-section"),
                components: [
                  { id: "bio", name: t("bio-block") },
                  { id: "education", name: t("education-block") },
                  { id: "work-experience", name: t("work-experience-block") },
                ],
              },
              {
                title: t("projects-section"),
                components: [
                  { id: "web-projects", name: t("web-projects-block") },
                  { id: "nextjs-templates", name: t("nextjs-templates-block") },
                  { id: "embedded-projects", name: t("embedded-projects-block") },
                ],
              },
              {
                title: t("miscellaneous-section"),
                components: [
                  { id: "articles", name: t("articles-block") },
                  { id: "playground", name: t("playground-block") },
                  { id: "contact-info", name: t("contact-info-block") },
                ],
              },
            ]}
            onComponentClick={(componentId) => scrollToSection(componentId)}
            onAppNameClick={() => scrollToSection('bio')}
            onLanguageIconClick={() => setIsLanguageSelectorOpen(true)}
            unfoldIcon={<IconBorderRightPlus />}
            foldIcon={<IconFoldDown />}
            iconColor="var(--foreground)"
            iconHoverColor="var(--foreground)"
            backgroundColor="var(--navbar-background)"
            headerBackgroundColor="var(--navbar-background)"
            textColor="var(--foreground)"
            hoverBackgroundColor="var(--second-theme-color)"
            sidebarWidth="290px"
            collapsedWidth="54px"
            headerHeight="64px"
            rightStripeColor="var(--background-adjacent-color)"
            rightStripeHoverColor="var(--lightened-background-adjacent-color)"
            itemBorderRadius="var(--smooth-rounding)"
            appNameColor="var(--foreground)"
            sectionTitleColor="var(--secondary-foreground)"
            componentFontSize="16px"
            componentHeight="38px"
            isRTL={isRTL}
          />
        )}
        <ContentArea isRTL={isRTL} isMobile={isMobile}>
          <Section id="bio">
            <div style={{ height: isMobile ? "24px" : "5vh" }} />
            <BioSection
              photo="logo.webp"
              name={t("my-name")}
              bio={t("my-bio")}
              contactInfoCallback={() => scrollToSection("contact-info")}
              downloadCVLink="https://github.com/Northstrix/my-portfolio/blob/main/public/Maxim%20Bortnikov's%20CV.pdf"
              isRTL={isRTL}
            />
          </Section>
          <Section id="education">
            <EducationContent isRTL={isRTL} />
          </Section>
          <Section id="work-experience">
            <WorkExperienceContent isRTL={isRTL} />
          </Section>
          <Section id="web-projects">
            <WebProjectsContent isRTL={isRTL} onProjectClick={handleProjectClick} />
          </Section>
          <Section id="nextjs-templates">
            <NextJSTemplatesContent isRTL={isRTL} onProjectClick={handleProjectClick} />
          </Section>
          <Section id="embedded-projects">
            <EmbeddedProjectsContent isRTL={isRTL} onProjectClick={handleProjectClick} />
          </Section>
          <Section id="articles">
            <ArticlesContent isRTL={isRTL} />
          </Section>
          <Section id="playground">
            <PlaygroundContent isRTL={isRTL} />
          </Section>
          <Section id="contact-info">
            <ContactInfoContent isRTL={isRTL} />
          </Section>
          <Footer isRTL={isRTL} languages={languages} onOpenCreditModal={openCreditModal} />
          <LanguageInfoModal
            isOpen={isLanguageInfoOpen}
            onClose={() => setIsLanguageInfoOpen(false)}
            onLanguageIconClick={() => setIsLanguageSelectorOpen(true)}
            languages={languages}
          />
        </ContentArea>
      </Container>
      <LanguageSelector
        isOpen={isLanguageSelectorOpen}
        onClose={() => setIsLanguageSelectorOpen(false)}
        languages={languages}
      />
      <CreditModal isOpen={isCreditModalOpen} onClose={closeCreditModal} />
    </I18nextProvider>
  );
};

export default LandingPage;
