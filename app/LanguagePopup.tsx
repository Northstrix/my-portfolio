'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface LanguagePopupProps {
  onClose: () => void;
}

const LanguagePopup: React.FC<LanguagePopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTopContainers, setShowTopContainers] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setShowTopContainers(true);
    }, 2000); // Show popup after 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const flags = [
    { src: "/Flag_of_the_United_States.svg", label: "English", lang: 'en' },
    { src: "/Flag_of_Israel.svg", label: "Hebrew", lang: 'he' },
    { src: "/Flag_of_Argentina.svg", label: "Spanish", lang: 'es' },
    { src: "/Flag_of_Germany.svg", label: "German", lang: 'de' },
    { src: "/Flag_of_Russia.svg", label: "Russian", lang: 'ru' },
  ];

  const message: Record<string, string> = {
    en: "Click on the flag to change language",
    he: "לחץ על הדגל כדי לשנות שפה",
    es: "Haz clic en la bandera para cambiar el idioma",
    de: "Klicken Sie auf die Flagge, um die Sprache zu ändern",
    ru: "Нажмите на флаг, чтобы изменить язык",
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px', // Positioned 10px above the bottom
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      outline: '3px solid #eeeeee',
      animation: showTopContainers ? 'animate__animated animate__backInUp' : '', // Animation class
      width: '80%', // Adjust width as needed
      maxWidth: '564px', // Max width for the popup
      backgroundColor: '#444444', // Background color
      borderRadius: 'var(--sectionmBorderRadius)', // Rounded corners
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--color-text-main)', fontSize: '16px' }}>
        {Object.keys(message).map(lang => (
          <div key={lang} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', justifyContent: lang === 'he' ? 'flex-end' : 'flex-start' }}>
            {lang !== 'he' && (
              <>
                <div style={{ width: '30px', height: '20px', position: 'relative', marginRight: '10px' }}>
                  <Image
                    src={flags.find(flag => flag.lang === lang)?.src || ''}
                    alt={flags.find(flag => flag.lang === lang)?.label || ''}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <span style={{ color: 'var(--color-text-main)', fontSize:'20px' }}>
                  {message[lang]}
                </span>
              </>
            )}
            {lang === 'he' && (
              <>
                <span style={{ marginRight: '10px', color: 'var(--color-text-main)', fontSize:'20px' }}>
                  {message[lang]}
                </span>
                <div style={{ width: '30px', height: '20px', position: 'relative' }}>
                  <Image
                    src={flags.find(flag => flag.lang === lang)?.src || ''}
                    alt={flags.find(flag => flag.lang === lang)?.label || ''}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </h2>
      <button
        onClick={onClose}
        style={{
          display: 'block',
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: 'var(--navbar-glow-color-on-hover)', // Use CSS variable for primary color
          color: '#fff',
          borderRadius: 'var(--sectionmBorderRadius)', // Rounded corners for button
          borderWidth:'none',
          cursor:'pointer',
          width:'100%', // Full-width button
          transition:'background-color 0.3s ease-in-out'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--sharedFilesDefaultColor)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--navbar-glow-color-on-hover)"}
      >
        OK
      </button>
    </div>
  );
};

export default LanguagePopup;