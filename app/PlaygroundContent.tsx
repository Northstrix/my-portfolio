"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import StructuredBlock from '@/components/StructuredBlock/StructuredBlock';
import { addRTLProps, headlineProps, textProps, contentProps, maxSectionWidth } from './LandingPage.styles';
import PlaygroundContainer from '@/components/PlaygroundContainer/PlaygroundContainer';
import { quotes, INSCRIPTION, INSCRIPTION2, INSCRIPTION3, INSCRIPTION4, textOptions, items } from '@/app/playgroundConstants';
import useMobileCheckForPlayground from '@/hooks/useMobileCheckForPlayground';
import { DraggableCardBody, DraggableCardContainer } from "@/components/DraggableCard/DraggableCard";
import HalomotButton from '@/components/HalomotButton/HalomotButton';
import { ToastContainer, toast } from "react-toastify";
import RectangleNotification from '@/components/RectangleNotification/RectangleNotification';
import ModalContainer from '@/components/ModalCard/ModalContainer'; // Import the ModalContainer

interface PlaygroundContentProps {
  isRTL: boolean;
}

const PlaygroundContent: React.FC<PlaygroundContentProps> = ({ isRTL }) => {
  const { t, i18n } = useTranslation();
  const [activeCard, setActiveCard] = useState(0);
  const [activeInscription, setActiveInscription] = useState(INSCRIPTION);
  const [swapColors, setSwapColors] = useState(false);
  const [firstCardRevealCanvas, setFirstCardRevealCanvas] = useState(false);
  const [secondCardText, setSecondCardText] = useState(['H', 'a', 'l', 'b', 's', 'c', 'h', 'a', 't', 't', 'e', 'n']);
  const containerRef = useRef<HTMLDivElement>(null);
  const [textSize, setTextSize] = useState(INSCRIPTION.maxSize);
  const isMobileDevice = useMobileCheckForPlayground();
  const [activeNotification, setActiveNotification] = useState<{ type: 'success' | 'error'; message: string; message1?: string } | null>(null);
  const [isToastRTL, setIsToastRTL] = useState(false);
  const [shouldShowDesktopButton, setShouldShowDesktopButton] = useState(false);
  const [showModalCard, setShowModalCard] = useState(false);

  useEffect(() => {
    const checkButtonVisibility = () => {
      const isDesktopHeight = window.innerHeight > 896;
      setShouldShowDesktopButton(isDesktopHeight);
    };
    checkButtonVisibility();
    const stabilizationTimer = setTimeout(checkButtonVisibility, 1000);
    window.addEventListener('resize', checkButtonVisibility);
    return () => {
      clearTimeout(stabilizationTimer);
      window.removeEventListener('resize', checkButtonVisibility);
    };
  }, []);

  const reversedTextOptions = textOptions.map(option => [...option].reverse());

  useEffect(() => {
    const updateText = () => {
      const isHebrew = i18n.language === 'he';
      setSecondCardText(isHebrew ? reversedTextOptions[activeCard] : textOptions[activeCard]);
    };
    updateText();
    const timeout = setTimeout(updateText, 100);
    return () => clearTimeout(timeout);
  }, [i18n.language, activeCard]);

  const showRectangleNotification = (type: 'success' | 'error', message: string, message1?: string) => {
    setActiveNotification({ type, message, message1 });
  };

  const closeRectangleNotification = () => {
    setActiveNotification(null);
  };

  const revealLock = useRef(false);

  const handleCardClick = (index?: number) => {
    if (revealLock.current) return;
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    const randomNumber = randomValues[0];
    const action = randomNumber % 1000;

    if (action <= 74) {
      setActiveCard(activeCard === 0 ? 1 : 0);
    } else if (action <= 164) {
      if (activeCard === 0) {
        revealLock.current = true;
        setTimeout(() => {
          setFirstCardRevealCanvas(prev => !prev);
          revealLock.current = false;
        }, 500);
      } else {
        const currentIndex = textOptions.findIndex(opt => JSON.stringify(opt) === JSON.stringify(secondCardText));
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * textOptions.length);
        } while (newIndex === currentIndex);
        setSecondCardText(i18n.language === 'he' ? reversedTextOptions[newIndex] : textOptions[newIndex]);
      }
    } else if (action <= 208) {
      const currentIndex = textOptions.findIndex(opt => JSON.stringify(opt) === JSON.stringify(secondCardText));
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * textOptions.length);
      } while (newIndex === currentIndex);
      setSecondCardText(i18n.language === 'he' ? reversedTextOptions[newIndex] : textOptions[newIndex]);
      setActiveCard(1);
    } else if (action <= 218) {
      toast.dismiss();
      showRectangleNotification('success', 'This notification appears', 'with 1% probability.');
    } else if (action <= 318) {
      let newInscription;
      do {
        newInscription = [INSCRIPTION, INSCRIPTION2, INSCRIPTION3, INSCRIPTION4][Math.floor(Math.random() * 4)];
      } while (newInscription === activeInscription);
      setActiveInscription(newInscription);
    } else if (action <= 418) {
      setSwapColors(!swapColors);
    } else if (action <= 438) {
      setShowModalCard(true);
    } else {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      const randomLang = Math.floor(Math.random() * 2);
      const randomToastType = Math.floor(Math.random() * 4);
      const toastTypes = [toast.success, toast.info, toast.warn, toast.error];
      const toastMessage = randomLang === 0 ? `${quote.quote} - ${quote.author}` : `${quote.hebrewQuote} - ${quote.hebrewAuthor}`;
      setIsToastRTL(randomLang === 1);
      setTimeout(() => {
        toastTypes[randomToastType](toastMessage);
      }, 4);
    }
  };

  useEffect(() => {
    const updateTextSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const size = activeInscription.minSize + ((activeInscription.maxSize - activeInscription.minSize) * Math.min(Math.max(width - activeInscription.minWidth, 0), activeInscription.maxWidth - activeInscription.minWidth)) / (activeInscription.maxWidth - activeInscription.minWidth);
        setTextSize(size);
      }
    };
    updateTextSize();
    const resizeObserver = new ResizeObserver(updateTextSize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeInscription]);

  const textShadow = swapColors ? `-1px -1px 0 var(--card-background), 1px -1px 0 var(--card-background), -1px 1px 0 var(--card-background), 1px 1px 0 var(--card-background)` : `-1px -1px 0 var(--refresh-inscription-color), 1px -1px 0 var(--refresh-inscription-color), -1px 1px 0 var(--refresh-inscription-color), 1px 1px 0 var(--refresh-inscription-color)`;
  const oneOfThree = [INSCRIPTION, INSCRIPTION2, INSCRIPTION3].includes(activeInscription);

  return (
    <>
      <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: "0px", justifyContent: "flex-start", alignItems: "stretch", width: "100%", maxWidth: maxSectionWidth, position: "relative" }}>
        <StructuredBlock {...addRTLProps(headlineProps, isRTL)}>
          {t("playground-block")}
        </StructuredBlock>
        <StructuredBlock {...addRTLProps(textProps, isRTL)}>
          {t("playground-block-section-text")}
        </StructuredBlock>
        <StructuredBlock {...addRTLProps(contentProps, isRTL)}>
          <div style={{ width: "100%", height: isMobileDevice ? "auto" : "calc(100vh - 169px)", minHeight: isMobileDevice ? "auto" : "calc(100vh - 169px)", boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", overflow: "hidden" }}>
            {oneOfThree && (
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-40%, -56%)", color: swapColors ? "var(--refresh-inscription-color)" : "var(--card-background)", textShadow: textShadow, fontSize: `${textSize}px`, fontWeight: 800, zIndex: 1, padding: '1rem', textAlign: 'right', width: '80%', lineHeight: '1.2', whiteSpace: 'pre-line', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeInscription.text}
              </div>
            )}
            {activeInscription === INSCRIPTION4 && (
              <div style={{ position: "absolute", top: "50%", right: "50%", transform: "translate(40%, -56%)", color: swapColors ? "var(--refresh-inscription-color)" : "var(--card-background)", textShadow: textShadow, fontSize: `${textSize}px`, fontWeight: 800, zIndex: 1, padding: '1rem', textAlign: 'left', width: '80%', lineHeight: '1.2', whiteSpace: 'pre-line', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeInscription.text}
              </div>
            )}
            {!isMobileDevice && (
              <div style={{ position: "absolute", top: "1px", left: "1px", borderRadius: 'var(--moderate-rounding)', color: "var(--card-background)", zIndex: 1, width: 'calc(100% - 2px)', height: 'calc(100% - 2px)', lineHeight: '1.2', whiteSpace: 'pre-line', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip z-[2]">
                  {items.map((item, index) => (
                    <DraggableCardBody key={index} className={item.className}>
                      <img src={item.image} alt={item.title} className="pointer-events-none relative z-10 min-h-[300px] min-w-[410px] object-cover rounded-[var(--outer-moderate-rounding)]" />
                      <h3 className="mt-4 text-center text-2xl font-bold text-[var(--background-adjacent-color)]">
                        {item.title}
                      </h3>
                    </DraggableCardBody>
                  ))}
                </DraggableCardContainer>
              </div>
            )}
            <PlaygroundContainer
              isRTL={isRTL}
              outerRounding={"var(--outer-moderate-rounding)"}
              innerRounding={"var(--moderate-rounding)"}
              hoverOutlineColor={"1px solid var(--lightened-background-adjacent-color)"}
              onCardClick={handleCardClick}
              activeCard={activeCard}
              firstCardRevealCanvas={firstCardRevealCanvas}
              secondCardText={secondCardText}
            />
            {!isMobileDevice && shouldShowDesktopButton && (
              <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", zIndex: 3 }}>
                <HalomotButton text={"Click Me"} fixedWidth="164px" onClick={() => handleCardClick(2)} gradient={isRTL ? 'linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))' : 'linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))'} />
              </div>
            )}
          </div>
        </StructuredBlock>
      </div>
      {activeNotification && (
        <RectangleNotification type={activeNotification.type} message={activeNotification.message} message1={activeNotification.message1} onClose={closeRectangleNotification} />
      )}
      {showModalCard && (
        <ModalContainer onClose={() => setShowModalCard(false)} />
      )}
      <ToastContainer
        position={isRTL ? "bottom-left" : "bottom-right"}
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={isToastRTL}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{ background: "var(--navbar-background)", color: "var(--foreground)", border: "1px solid var(--lightened-background-adjacent-color)", borderRadius: "6" }}
      />
    </>
  );
};

export default PlaygroundContent;
