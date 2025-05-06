"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { CanvasRevealEffect } from "./CanvasRevealEffect";

interface ModalCardProps {
  isRTL: boolean;
  outerRounding: string;
  innerRounding: string;
  onCardClick: () => void;
  firstCardRevealCanvas: boolean;
  secondCardText: string[];
  firstArray: string[];
  secondArray: string[];
  isHovered: boolean; // Ensure this prop is passed correctly
}

const ModalCard: React.FC<ModalCardProps> = ({
  isRTL,
  outerRounding,
  innerRounding,
  onCardClick,
  firstCardRevealCanvas,
  secondCardText,
  firstArray,
  secondArray,
  isHovered: isHoveredProp // Rename to avoid conflict with local state
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [textSize, setTextSize] = useState(24);
  const [mirrorTextSize, setMirrorTextSize] = useState(24);
  const [firstArrayTextSize, setFirstArrayTextSize] = useState(24);
  const [secondArrayTextSize, setSecondArrayTextSize] = useState(24);
  const [letterSpacing, setLetterSpacing] = useState(0.32);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      if (containerRef.current) {
        setIsMobile(containerRef.current.offsetWidth < 624);
      }
    };

    const updateTextSize = () => {
      if (cardRef.current) {
        const width = cardRef.current.offsetWidth;
        const minWidth = 200;
        const maxWidth = isMobile ? 580 : 624;
        const minTextSize = isMobile ? 8 : 7;
        const maxTextSize = isMobile ? 24 : 14;
        const calculatedTextSize = ((maxTextSize - minTextSize) / (maxWidth - minWidth)) * (width - minWidth) + minTextSize;
        const cappedTextSize = Math.min(calculatedTextSize, maxTextSize);
        setTextSize(cappedTextSize);
        setMirrorTextSize(cappedTextSize);
        setFirstArrayTextSize(cappedTextSize);
        setSecondArrayTextSize(cappedTextSize * 1.2);
      }
    };

    const handleResize = () => {
      updateLayout();
      setTimeout(updateTextSize, 60);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    updateLayout();
    updateTextSize();

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [isMobile]);

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  return (
    <motion.div
      ref={containerRef}
      style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}
    >
      <div
        className="flex flex-col h-full"
        style={{
          borderRadius: innerRounding,
          backgroundColor: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div className="flex flex-col items-center w-full" style={{ maxWidth: '600px' }}>
          <div
            className="relative w-full mx-auto"
            style={{ aspectRatio: isMobile ? '412/600' : '16/9' }}
          >
            <AnimatePresence>
              <motion.div
                key="card-1"
                initial={{ opacity: 0, scale: 0.84, rotate: randomRotateY() }}
                animate={{ opacity: 1, scale: 1, rotate: 0, zIndex: 30, y: 0 }}
                exit={{ opacity: 0, scale: 0.84, rotate: randomRotateY() }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute inset-0 origin-center cursor-pointer"
                onMouseEnter={() => {
                  setIsCardHovered(true);
                }}
                onMouseLeave={() => {
                  setIsCardHovered(false);
                }}
              >
                <div className="absolute inset-0 w-full h-full">
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      ref={cardRef}
                      style={{ maxWidth: '100%', width: '100%' }}
                      data-component-id="card-2"
                      onClick={onCardClick}
                    >
                      <div
                        style={{
                          borderRadius: isCardHovered ? '0' : outerRounding,
                          padding: '1px',
                          background: isCardHovered ? 'var(--background-adjacent-color)' : 'white',
                          display: 'inline-block',
                          width: '100%',
                          aspectRatio: isMobile ? '412/600' : '16/9',
                          transition: 'background 0.3s ease-in-out, border-radius 0.3s ease-in-out',
                          position: 'relative'
                        }}
                      >
                        {isCardHovered && firstCardRevealCanvas && (
                          <CanvasRevealEffect
                            animationSpeed={5.1}
                            containerClassName="absolute inset-0"
                            colors={[[236, 72, 153], [232, 121, 249]]}
                            dotSize={7}
                            replaceBackground
                          />
                        )}
                        <div
                          style={{
                            padding: '29px',
                            borderRadius: isCardHovered ? '0' : innerRounding,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            color: 'var(--foreground)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            id="card-2-text"
                            style={{
                              position: 'absolute',
                              top: '9px',
                              right: '16px',
                              display: 'flex',
                              flexDirection: 'row',
                              zIndex: 2,
                              color: isCardHovered ? 'var(--foreground)' : 'var(--background)',
                              fontWeight: 'bold',
                              fontSize: `${textSize}px`,
                              transition: 'color 0.3s ease-in-out'
                            }}
                          >
                            {secondCardText.map((letter, index) => (
                              <div
                                key={`card-2-letter-${index}`}
                                style={{
                                  transform: letterSpacing < 0 && index > 0 ? `translateX(${letterSpacing * index}px)` : 'none',
                                  marginLeft: letterSpacing >= 0 ? `${Math.abs(letterSpacing)}px` : '0',
                                  letterSpacing: `${letterSpacing}px`
                                }}
                              >
                                {letter}
                              </div>
                            ))}
                          </div>
                          <div
                            id="card-2-mirror"
                            style={{
                              position: 'absolute',
                              bottom: '9px',
                              left: '16px',
                              display: 'flex',
                              flexDirection: 'row',
                              transform: 'scale(-1, -1)',
                              zIndex: 2,
                              color: isCardHovered ? 'var(--foreground)' : 'var(--background)',
                              fontWeight: 'bold',
                              fontSize: `${mirrorTextSize}px`,
                              transition: 'color 0.3s ease-in-out'
                            }}
                          >
                            {secondCardText.map((letter, index) => (
                              <div
                                key={`card-2-mirror-letter-${index}`}
                                style={{
                                  transform: letterSpacing < 0 && index > 0 ? `translateX(${letterSpacing * index}px)` : 'none',
                                  marginLeft: letterSpacing >= 0 ? `${Math.abs(letterSpacing)}px` : '0',
                                  letterSpacing: `${letterSpacing}px`
                                }}
                              >
                                {letter}
                              </div>
                            ))}
                          </div>
                          <div
                            style={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: isMobile ? 'column' : 'row',
                              alignItems: 'center',
                              position: 'relative',
                              width: '100%',
                              gap: isMobile ? '48px' : ''
                            }}
                          >
                            <div
                              style={{
                                transform: !isMobile ? 'translateX(-23px)' : 'translateY(20px)',
                                position: 'relative',
                                height: isMobile ? 'auto' : '100%',
                                width: isMobile ? '100%' : '50%',
                                aspectRatio: '1/1',
                                padding: '15px'
                              }}
                            >
                              <Image
                                src="/modal-card-image.webp"
                                alt=""
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'center' }}
                                priority
                                sizes="412px 16 9"
                              />
                            </div>
                            <div
                              style={{
                                transform: !isMobile ? 'translateX(-20px)' : 'none',
                                display: isMobile ? '' : 'flex',
                                textAlign: isMobile ? 'center' : 'left',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                width: isMobile ? '100%' : '50%',
                                padding: '0px'
                              }}
                            >
                              {firstArray.map((item, index) => (
                                <div
                                  key={`first-array-${index}`}
                                  style={{
                                    marginBottom: '5px',
                                    fontSize: `${firstArrayTextSize}px`,
                                    fontWeight: 'bold',
                                    color: isCardHovered ? 'var(--foreground)' : 'var(--background)',
                                    textAlign: 'left',
                                    transition: 'color 0.3s ease-in-out'
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                              {secondArray.map((item, index) => (
                                <div
                                  key={`second-array-${index}`}
                                  style={{
                                    marginTop: '12px',
                                    fontSize: `${secondArrayTextSize}px`,
                                    fontWeight: 'bold',
                                    color: isCardHovered ? 'var(--foreground)' : 'var(--background)',
                                    textAlign: 'right',
                                    transition: 'color 0.3s ease-in-out'
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModalCard;
