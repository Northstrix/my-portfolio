"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ContactCard from './ModalCard';
import { Balatro } from './Balatro'; // Correct the import path for Balatro

interface ModalContainerProps {
  onClose: () => void;
}

const ModalContainer: React.FC<ModalContainerProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = false;
  const [dynamicHeight, setDynamicHeight] = useState('auto');
  const [dynamicPadding, setDynamicPadding] = useState('24px');
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const headlineRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const balatroContainerRef = useRef<HTMLDivElement | null>(null);

  const calculateDimensions = () => {
    setIsMobile(window.innerWidth < 768);

    if (headlineRef.current && textRef.current && balatroContainerRef.current) {
      const headlineHeight = headlineRef.current.getBoundingClientRect().height || 0;
      const textHeight = textRef.current.getBoundingClientRect().height || 0;
      const balatroContentHeight = balatroContainerRef.current.getBoundingClientRect().height || 0;
      const spacerHeight = isMobile ? 14 : 27;
      const availableHeight = window.innerHeight - (69 + headlineHeight + textHeight + spacerHeight);
      setDynamicHeight(`${availableHeight}px`);
      const calculatedPaddingTopBottom = Math.max((availableHeight - balatroContentHeight) / 2, 24);
      const calculatedPadding = `${Math.max(calculatedPaddingTopBottom, 24)}px 24px`;
      setDynamicPadding(calculatedPadding);
    } else {
      console.warn('One or more refs are null. Ensure all elements are rendered before calculations.');
    }
  };

  useEffect(() => {
    calculateDimensions();
    const timeoutId = setTimeout(() => {
      calculateDimensions();
    }, 1000);
    const handleResize = () => {
      calculateDimensions();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{zIndex: 9998}}>
            <Balatro />
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: "rgba(21, 20, 25, 0.1)", backdropFilter: "blur(11px) saturate(100%)", display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>

      </div>
      <div style={{ width: '100%', display: 'inline-block',  zIndex: 9999 }}>
      <div style={{ display: 'flex', flexDirection: 'column', margin: '10px', color: 'var(--foreground)' }}>
          <ContactCard
            isRTL={isRTL}
            outerRounding="var(--outer-moderate-rounding)"
            innerRounding="var(--moderate-rounding)"
            onCardClick={onClose}
            firstCardRevealCanvas={true}
            secondCardText={['ר', 'ו', 'פ', 'י', 'ש']}
            firstArray={["One must still have chaos within oneself", "to be able to give birth to a dancing star."]}
            secondArray={["– Friedrich Nietzsche"]}
            isHovered={isHovered}
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default ModalContainer;
