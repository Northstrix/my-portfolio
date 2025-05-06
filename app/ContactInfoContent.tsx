"use client";
import React, { useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import StructuredBlock from '@/components/StructuredBlock/StructuredBlock';
import { addRTLProps, headlineProps, textProps, maxSectionWidth } from './LandingPage.styles';
import ContactContainer from '@/components/ContactContainer/ContactContainer'

interface ContactInfoContentProps {
  isRTL: boolean;
}

const ContactInfoContent: React.FC<ContactInfoContentProps> = ({ isRTL }) => {
  const { t } = useTranslation();
  const componentRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    if (componentRef.current) {
      // Handle resize logic if needed
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    if (componentRef.current) {
      resizeObserver.observe(componentRef.current);
    }
    handleResize(); // Initial check
    return () => {
      if (componentRef.current) {
        resizeObserver.unobserve(componentRef.current);
      }
    };
  }, [handleResize]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', justifyContent: 'flex-start', alignItems: 'stretch', width: '100%', maxWidth: maxSectionWidth }}>
      <StructuredBlock {...addRTLProps(headlineProps, isRTL)}>
        {t("contact-info-block")}
      </StructuredBlock>
      <StructuredBlock {...addRTLProps(textProps, isRTL)}>
        {t("contact-info-section-text")}
      </StructuredBlock>
      <ContactContainer/>
    </div>
  );
};

export default ContactInfoContent;
