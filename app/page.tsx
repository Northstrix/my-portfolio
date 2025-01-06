'use client'

import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import styles from '@/app/page.module.css';
import "@fontsource/alef";
import 'animate.css';
import FileContainer from '@/app/FileContainer';
import React, { CSSProperties, FC } from "react";
import MagicButton from '@/app/MagicButton';
import RectangleNotification from '@/app/RectangleNotification';
import notificationStyles from '@/app/notification-styles.module.css';
import LinkComponent from '@/app/LinkComponent';
import ContactInfo from '@/app/ContactInfo';
import LanguagePopup from '@/app/LanguagePopup';

interface Container {
  id:string;
  title:string;
  color:string;
  fileSize:string;
  description:string;
  imageUrl: string;
  link: string;
  metadataIntegrity: boolean;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fontSize, setFontSize] = useState('16px');
  const [margin, setMargin] = useState('1em');
  const isRTL = i18n.language === 'he';
  const [hoveredLink, setHoveredLink] = useState<string | null>(null); 
  const [showTop, setshowTop] = useState(false);
  const [showBio, setshowBio] = useState(false);
  const [showTopContainers, setshowTopContainers] = useState(false);
  const [containers, setContainers] = useState<Container[]>([]);
  const [columns, setColumns] = useState<number>(0);
  const [activeNotification, setActiveNotification] = useState<{ type: 'success' | 'error'; message: string; message1?: string } | null>(null);
  const notificationContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  const handleClose = () => setShowPopup(false);
  type NotificationType = 'help' | 'success' | 'warning' | 'error';
  const originalColors = {
    '--color-primary': '#5c3fcd',
    '--navbar-glow-color-on-hover': '#6c52d2',
    '--scrollbarHandleColorHovered': '#6c52d2',
    '--sharedFilesDefaultColor': '#834cd0',
    '--magic-button-shadow': 'hsl(260, 97%, 61%, 0.75)',
    '--magic-button-border': 'hsl(260, 97%, 50%, 0.5)',
    '--magic-button-top': '270',
    '--magic-button-bottom': '260'
  };
  
  const newColors = {
    '--color-primary': '#2c7cd7',
    '--navbar-glow-color-on-hover': '#448bf8',
    '--scrollbarHandleColorHovered': '#246abb',
    '--sharedFilesDefaultColor': '#5b99f9',
    '--magic-button-shadow': 'hsl(210, 100%, 50%, 0.75)', // Change to blue
    '--magic-button-border': 'hsl(210, 100%, 40%, 0.5)', // Change to blue
    '--magic-button-top': '210', // Adjusted for blue
    '--magic-button-bottom': '200' // Adjusted for blue
  };
  
  // Function to toggle colors
  let isOriginal = true; // Track the current state
  
  const toggleColors = () => {
    const root = document.documentElement; // Get the root element (usually <html>)
  
    if (isOriginal) {
      // Switch to new colors
      for (const [key, value] of Object.entries(newColors)) {
        root.style.setProperty(key, value);
      }
    } else {
      // Switch back to original colors
      for (const [key, value] of Object.entries(originalColors)) {
        root.style.setProperty(key, value);
      }
    }
  
    // Toggle the state
    isOriginal = !isOriginal;
  };

  const setTimerAnimation = (timerLeft: HTMLElement, timerRight: HTMLElement, duration: number, uniqueId: number) => {
    const notificationStylesheet = document.createElement("style");
    notificationStylesheet.type = "text/css";
    notificationStylesheet.innerHTML = `
      @keyframes timerShrink-${uniqueId} {
          from { width: 100%; }
          to { width: 0; }
      }
    `;
    document.head.appendChild(notificationStylesheet);

    // Start animations with full width
    timerLeft.style.animation = `timerShrink-${uniqueId} ${duration}ms linear forwards`;
    timerRight.style.animation = `timerShrink-${uniqueId} ${duration}ms linear forwards`;
};

const removeNotification = (notif: HTMLElement) => {
    notif.style.animation = 'slideOutWithBounce 0.6s ease forwards'; 

    setTimeout(() => {
       notif.remove();
    }, 600); 
};

// Dynamically create keyframes for animations in JavaScript
React.useEffect(() => {
    const notificationStylesheet = document.createElement("style");
    notificationStylesheet.type = "text/css";
    
    notificationStylesheet.innerHTML = `
        @keyframes slideInWithBounce {
          0% { transform: translateX(150%); opacity: 0; }
          60% { transform: translateX(-12%); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOutWithBounce {
          0% { transform: translateX(0); opacity: 1; }
          40% { transform: translateX(-12%); opacity: 1; }
          100% { transform: translateX(150%); opacity: 0; }
        }
    `;
    
    document.head.appendChild(notificationStylesheet);
    
    return () => {
        document.head.removeChild(notificationStylesheet); 
    };
}, []);

const quotes: { author: string; quote: string; hebrewQuote: string; hebrewAuthor: string }[] = [
  {
    author: "Louise Bourgeois",
    quote: "Art is a guaranty of sanity.",
    hebrewQuote: "אומנות היא ערבות לשפיות",
    hebrewAuthor: "לואיז בורז'ואה"
  },
  {
    author: "James Matthew Barrie",
    quote: "Would you like an adventure now, or would you like to have your tea first?",
    hebrewQuote: "האם תרצי את ההרפתקה שלך עכשיו, או שמא נשתה תה לפני כן?",
    hebrewAuthor: "ג'יימס מתיו בארי"
  },
  {
    author: "Lao Tzu",
    quote: "When I let go of what I am, I become what I might be.",
    hebrewQuote: "כשאני מרפה ממי שאני, אני הופך למה שאפשרי עבורי להיות",
    hebrewAuthor: "לאו צה"
  },
  {
    author: "Anaïs Nin",
    quote: "We don't see things as they are, we see them as we are.",
    hebrewQuote: "אנחנו לא רואים את הדברים כפי שהם, אנחנו רואים אותם כפי שאנחמו",
    hebrewAuthor: "אנאיס נין"
  },
  {
    author: "Virginia Woolf",
    quote: "Nothing has really happened until it's been described (in words).",
    hebrewQuote: "דבר לא באמת התרחש עד אשר תוצר במילים",
    hebrewAuthor: "וירג'יניה וולף"
  },
  {
    author: "Leonardo da Vinci",
    quote: "The noblest pleasure is the joy of understanding.",
    hebrewQuote: "העונג הנעלה מכל הוא האושר שבהבנה",
    hebrewAuthor: "לאונרדו דה וינצ'י"
  },
  {
    author: "Oscar Wilde",
    quote: "There are only two tragedies in life:\nOne is not getting what one wants, and the other is getting it.",
    hebrewQuote: "יש רק שתי טרגדיות בעולם הזה.\nהאחת היא לא לקבל את מה שרוצים והשנייה היא לקבל.",
    hebrewAuthor: "אוסקר ווילד"
  },
  {
    author: "Oscar Wilde",
    quote: "Life imitates art far more than art imitates life.",
    hebrewQuote: "החיים מחקים את האמנות יותר מאשר האמנות מחקה את החיים",
    hebrewAuthor: "אוסקר ווילד"
  }
];

const messageTypes = ['help', 'success', 'warning', 'error'];

  // Function to display a random quote
  const displayRandomQuote = () => {
    // Randomly choose between English (0) and Hebrew (1)
    const languageIndex = Math.floor(Math.random() * 2);
    
    // Select a random quote from the quotes array
    const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomQuoteIndex];

    // Randomly choose a message type from the defined messageTypes array
    const randomMessageType = messageTypes[Math.floor(Math.random() * messageTypes.length)] as NotificationType;

    // Create notification based on the selected language and message type
    if (languageIndex === 0) {
      createNotification(randomMessageType, selectedQuote.author, selectedQuote.quote);
    } else {
      createRTLNotification(randomMessageType, selectedQuote.hebrewAuthor, selectedQuote.hebrewQuote);
    }
  };

  const createNotification = (type: NotificationType, notificationTitle: string, notificationContent: string) => {
    if (notificationContainerRef.current) {
        const notif = document.createElement('div');
        notif.classList.add(notificationStyles.toast, notificationStyles[type]); // Ensure notificationStyles is properly imported

        // Create title and content
        const title = document.createElement('h3');
        title.textContent = notificationTitle;
        title.style.margin = '0';

        const content = document.createElement('p');
        content.textContent = notificationContent;
        content.style.margin = '0.25rem 0';

        // Create timer and close button
        const timerContainer = document.createElement('div');
        timerContainer.classList.add(notificationStyles.timer);

        const closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        closeButton.classList.add(notificationStyles.closeButton);
        closeButton.onclick = () => { removeNotification(notif); };

        // Append elements to notification
        notif.appendChild(closeButton);
        notif.appendChild(title);
        notif.appendChild(content);
        notif.appendChild(timerContainer);

        // Create timer divs
        const timerLeft = document.createElement('div');
        timerLeft.classList.add(notificationStyles.timerLeft);

        const timerRight = document.createElement('div');
        timerRight.classList.add(notificationStyles.timerRight);

        // Append timer halves in swapped order
        timerContainer.appendChild(timerRight);
        timerContainer.appendChild(timerLeft);

        // Append notification to container
        notificationContainerRef.current.appendChild(notif);

        // Trigger animations for appearance
        notif.style.animation = 'slideInWithBounce 0.6s ease forwards';
        
        const duration = 5000; // Set duration to 5 seconds

        // Generate a unique ID for this notification (only once)
        const uniqueId = Date.now();

        // Set initial animation for both sides of the timer with uniqueId
        setTimerAnimation(timerLeft, timerRight, duration, uniqueId);

        // Set timeout to remove notification after duration
        let timeoutId: NodeJS.Timeout;
        
        timeoutId = setTimeout(() => removeNotification(notif), duration);
        
        let remainingTime = duration; // Track remaining time

        // Pause timer on hover and store remaining time
        notif.addEventListener("mouseenter", () => {
            clearTimeout(timeoutId);  // Stop the timeout
            
            const computedWidth = parseFloat(getComputedStyle(timerLeft).width);
            const totalWidth = parseFloat(getComputedStyle(timerContainer).width);
            const elapsedTime = (computedWidth / totalWidth) * duration; // Calculate elapsed time
            
            remainingTime = duration - elapsedTime; // Calculate remaining time
            (timerLeft as HTMLElement).style.animationPlayState = "paused";
            (timerRight as HTMLElement).style.animationPlayState = "paused";
        });

        // Resume timer on mouse leave with restored remaining time
        notif.addEventListener("mouseleave", () => {
            if (remainingTime > 0) {
                setTimerAnimation(timerLeft, timerRight, duration, uniqueId);
                timeoutId = setTimeout(() => removeNotification(notif), duration - remainingTime);
                (timerLeft as HTMLElement).style.animationPlayState = "running";
                (timerRight as HTMLElement).style.animationPlayState = "running";
            }
        });
    }
};

const createRTLNotification = (type: NotificationType, notificationTitle: string, notificationContent: string) => {
  if (notificationContainerRef.current) {
      const notif = document.createElement('div');
      notif.classList.add(notificationStyles.toast, notificationStyles[type]); // Ensure notificationStyles is properly imported

      // Create title and content
      const title = document.createElement('h3');
      title.textContent = notificationTitle;
      title.style.margin = '0';
      title.style.textAlign = 'left';
      title.style.direction = 'rtl';

      const content = document.createElement('p');
      content.textContent = notificationContent;
      content.style.margin = '0.25rem 0';

      // Create timer and close button
      const timerContainer = document.createElement('div');
      timerContainer.classList.add(notificationStyles.timer);

      const closeButton = document.createElement('button');
      closeButton.textContent = '✖';
      closeButton.classList.add(notificationStyles.closeButton);
      closeButton.onclick = () => { removeNotification(notif); };

      // Append elements to notification
      notif.appendChild(closeButton);
      notif.appendChild(title);
      notif.appendChild(content);
      notif.appendChild(timerContainer);

      // Create timer divs
      const timerLeft = document.createElement('div');
      timerLeft.classList.add(notificationStyles.timerLeft);

      const timerRight = document.createElement('div');
      timerRight.classList.add(notificationStyles.timerRight);

      // Append timer halves in swapped order
      timerContainer.appendChild(timerRight);
      timerContainer.appendChild(timerLeft);

      // Append notification to container
      notificationContainerRef.current.appendChild(notif);

      // Trigger animations for appearance
      notif.style.animation = 'slideInWithBounce 0.6s ease forwards';
      
      const duration = 5000; // Set duration to 5 seconds

      // Generate a unique ID for this notification (only once)
      const uniqueId = Date.now();

      // Set initial animation for both sides of the timer with uniqueId
      setTimerAnimation(timerLeft, timerRight, duration, uniqueId);

      // Set timeout to remove notification after duration
      let timeoutId: NodeJS.Timeout;
      
      timeoutId = setTimeout(() => removeNotification(notif), duration);
      
      let remainingTime = duration; // Track remaining time

      // Pause timer on hover and store remaining time
      notif.addEventListener("mouseenter", () => {
          clearTimeout(timeoutId);  // Stop the timeout
          
          const computedWidth = parseFloat(getComputedStyle(timerLeft).width);
          const totalWidth = parseFloat(getComputedStyle(timerContainer).width);
          const elapsedTime = (computedWidth / totalWidth) * duration; // Calculate elapsed time
          
          remainingTime = duration - elapsedTime; // Calculate remaining time
          (timerLeft as HTMLElement).style.animationPlayState = "paused";
          (timerRight as HTMLElement).style.animationPlayState = "paused";
      });

      // Resume timer on mouse leave with restored remaining time
      notif.addEventListener("mouseleave", () => {
          if (remainingTime > 0) {
              setTimerAnimation(timerLeft, timerRight, duration, uniqueId);
              timeoutId = setTimeout(() => removeNotification(notif), duration - remainingTime);
              (timerLeft as HTMLElement).style.animationPlayState = "running";
              (timerRight as HTMLElement).style.animationPlayState = "running";
          }
      });
  }
};

  const filesData = [
    {
      name: t('project-1-name'),
      description: t('project-1-description'),
      imageUrl: t('project-1-image'),
      link: t('project-1-link'),
      color: "#9525a5"
    },
    {
      name: t('project-2-name'),
      description: t('project-2-description'),
      imageUrl: t('project-2-image'),
      link: t('project-2-link'),
      color: "#28bf12"
    },
    {
      name: t('project-3-name'),
      description: t('project-3-description'),
      imageUrl: t('project-3-image'),
      link: t('project-3-link'),
      color: "#2196f3"
    },
    {
      name: t('project-4-name'),
      description: t('project-4-description'),
      imageUrl: t('project-4-image'),
      link: t('project-4-link'),
      color: "#a031eb"
    },
    {
      name: t('project-5-name'),
      description: t('project-5-description'),
      imageUrl: t('project-5-image'),
      link: t('project-5-link'),
      color: "#ff5613"
    },
    {
      name: t('project-6-name'),
      description: t('project-6-description'),
      imageUrl: t('project-6-image'),
      link: t('project-6-link'),
      color: "#feea00"
    },
    {
      name: t('project-7-name'),
      description: t('project-7-description'),
      imageUrl: t('project-7-image'),
      link: t('project-7-link'),
      color: "#e7013f"
    },
    {
      name: t('project-8-name'),
      description: t('project-8-description'),
      imageUrl: t('project-8-image'),
      link: t('project-8-link'),
      color: "#532ac9"
    },
  ];

  const initializeContainers = () => {
    const newContainers = filesData.map((file, index) => {
      const fileSizeString = "1234"; // You might want to replace this with actual file size logic
  
      // Set metadata integrity for the third file to false
      const metadataIntegrity = true;
  
      return {
        id: `file-${index}`, // Unique ID for each container
        title: file.name,
        color: file.color, // Use the custom color from filesData
        fileSize: `SIZE: ${fileSizeString}`,
        description: file.description,
        metadataIntegrity,
        imageUrl: file.imageUrl, // Add the image URL
        link: file.link, // Add the link
      };
    });
  
    // Update state with the new containers
    setContainers(newContainers);
  };

// Singleton for managing the flip operation
const FlipManager = (() => {
  let isFlipping = false;

  return {
    flip: (callback: () => void) => {
      if (!isFlipping) {
        isFlipping = true;
        callback();
        setTimeout(() => {
          isFlipping = false;
        }, 1);
      }
    }
  };
})();

const flipRandomContainerIntegrity = () => {
  FlipManager.flip(() => {
    setContainers(prevContainers => {
      if (prevContainers.length === 0) {
        createNotification('help', 'No Action', 'There are no containers to modify.');
        return prevContainers;
      }

      const randomIndex = Math.floor(Math.random() * prevContainers.length);
      const targetContainer = prevContainers[randomIndex];
      
      // Flip the integrity
      const newState = !targetContainer.metadataIntegrity;
      const updatedContainers = prevContainers.map((container, index) => 
        index === randomIndex ? { ...container, metadataIntegrity: newState } : container
      );

      return updatedContainers;
    });
  });
};

  useEffect(() => {
    initializeContainers();
  }, [i18n.language]);

  interface GlowTextProps {
    children: React.ReactNode;
    className?: string;
    style?: CSSProperties;
  }
  
  const GlowText: FC<GlowTextProps> = ({
    children,
    className = "",
    style = {}
  }) => {
    return (
      <span
        className={`filter select-none ${className}`}
        style={{
          ...style,
          width: 'fit-content',
          fontSize: fontSize,
          fontWeight: 600,
          color: 'var(--name-color)',
          filter:
            `drop-shadow(0 0 calc((var(--active, 100) / 100) * 5px) hsl(0 0% 100% / 0.6))
                   drop-shadow(0 0 calc((var(--active, 100) / 100) * 10px) hsl(0 0% 100% / 0.4))
                   drop-shadow(0 calc((var(--active, 100) / 100) * 6px) calc((var(--active, 100) / 100) * 15px) hsl(0 0% 100% / 0.3))
                   drop-shadow(0 calc((var(--active, 100) / 100) * 8px) calc((var(--active, 100) / 100) * 20px) hsl(0 0% 100% / 0.2))
                   drop-shadow(0 calc((var(--active, 100) / 100) * 10px) calc((var(--active, 100) / 100) * 30px) hsl(0 0% 100% / 0.1))`,
        }}
      >
        {children}
      </span>
    );
  }

  const showRectangleNotification = (type: 'success' | 'error', message: string, message1?: string) => {
    setActiveNotification({ type, message, message1 });
  };

  const closeRectangleNotification = () => {
      setActiveNotification(null);
  };

  const calculateColumns = () => {
    const pageWidth = window.innerWidth;
    
    if (pageWidth > 880) {
      setColumns(2);
    } else {
      setColumns(1);
    }
  
    //console.log('Columns:', pageWidth > 880 ? 2 : 1);
    //console.log('Page width:', pageWidth);
  };

useEffect(() => {
    calculateColumns(); // Calculate on mount
    
    window.addEventListener('resize', calculateColumns); // Add resize event listener
    
    return () => window.removeEventListener('resize', calculateColumns); // Cleanup listener on unmount
}, []);

  useEffect(() => {
    const buttonTimer = setTimeout(() => {
      setshowTop(true);
    }, 200);
    return () => clearTimeout(buttonTimer);
  }, []);

  useEffect(() => {
    const buttonTimer = setTimeout(() => {
      setshowBio(true);
    }, 800);
    return () => clearTimeout(buttonTimer);
  }, []);

  useEffect(() => {
    const buttonTimer = setTimeout(() => {
      setshowTopContainers(true);
    }, 1400);
    return () => clearTimeout(buttonTimer);
  }, []);

  useEffect(() => {
    const updateFontSize = () => {
      const maxWidth = 900;
      const currentWidth = Math.min(window.innerWidth, maxWidth);
      
      // Calculate baseSize with smooth transition between 376px and 780px
      let baseSize;
      if (currentWidth <= 376) {
        baseSize = 1;
      } else if (currentWidth >= 780) {
        baseSize = 1.184;
      } else {
        // Linear interpolation between 1 and 1.18
        const t = (currentWidth - 376) / (780 - 376);
        baseSize = 1 + (1.16 - 1) * t;
      }
  
      const sizeFactor = (() => {
        switch (i18n.language) {
          case 'en':
          case 'de':
          case 'es':
            return 0.88;
          case 'he':
            return 0.98;
          case 'ru':
            return 0.76;
          default:
            return 1;
        }
      })();
      setFontSize(`calc(${currentWidth}px * ${0.067 * baseSize * sizeFactor})`);
    };
  
    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    return () => window.removeEventListener('resize', updateFontSize);
  }, [i18n.language]);

  useEffect(() => {
    const updateMargin = () => {
      const currentWidth = window.innerWidth;
  
      if (currentWidth <= 375) {
        setMargin('0.65em'); // Set to half of 1em
      } else if (currentWidth > 375 && currentWidth < 901) {
        const t = (currentWidth - 375) / (901 - 375);
        const calculatedMargin = 0.65 + (0.65 * t);
        setMargin(`${calculatedMargin}em`);
      } else {
        setMargin('1.3em');
      }
    };
  
    updateMargin(); // Set initial margin
    window.addEventListener('resize', updateMargin); // Update on resize
    return () => window.removeEventListener('resize', updateMargin); // Cleanup
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let particleCount: number;

    class Particle {
      x: number;
      y: number;
      speed: number;
      opacity: number;
      fadeDelay: number;
      fadeStart: number;
      fadingOut: boolean;

      constructor() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.opacity = 1;
        this.fadeDelay = 0;
        this.fadeStart = 0;
        this.fadingOut = false;
        this.reset();
      }

      reset() {
        if (canvas) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.speed = Math.random() / 5 + 0.1;
          this.opacity = 1;
          this.fadeDelay = Math.random() * 600 + 100;
          this.fadeStart = Date.now() + this.fadeDelay;
          this.fadingOut = false;
        }
      }

      update() {
        this.y -= this.speed;
        if (this.y < 0) {
          this.reset();
        }
        if (!this.fadingOut && Date.now() > this.fadeStart) {
          this.fadingOut = true;
        }
        if (this.fadingOut) {
          this.opacity -= 0.008;
          if (this.opacity <= 0) {
            this.reset();
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(${255 - (Math.random() * 255/2)}, 255, 255, ${this.opacity})`;
        ctx.fillRect(this.x, this.y, 0.4, Math.random() * 2 + 1);
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    }

    function calculateParticleCount() {
      if (canvas) {
        return Math.floor((canvas.width * canvas.height) / 6000);
      } else {
        return 10000;
      }
    }

    function onResize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particleCount = calculateParticleCount();
      initParticles();
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particleCount = calculateParticleCount();

    window.addEventListener('resize', onResize);
    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const BentoGrid = ({ className, children, style }: { className?: string; children?: React.ReactNode; style?: React.CSSProperties }) => {
    const { i18n } = useTranslation();
  
    const combinedStyle: React.CSSProperties = {
      ...style,
      transform: i18n.language === 'he' ? 'scaleX(-1)' : 'none',
    };
  
    return (
      <div className={`grid gap-[36px] mx-auto ${className}`} style={combinedStyle}>
        {children}
      </div>
    );
  };

  // BentoGridItem Component
  const BentoGridItem = ({ children }: { children?: React.ReactNode }) => {
    const { i18n } = useTranslation();
  
    const itemStyle: React.CSSProperties = {
      width: "388px",
      height: "378px",
      transform: i18n.language === 'he' ? 'scaleX(-1)' : 'none',
    };
  
    return (
      <div className="flex justify-center items-center" style={itemStyle}>
        {children}
      </div>
    );
  };

  const handleMagicButtonClick = async () => {
    // Generate a cryptographically secure random number between 0 and 100
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0] % 100;
  
    // Determine which action to take based on the random value
    if (randomValue < 48) {
      // 48% probability
      flipRandomContainerIntegrity();
      createNotification('help', 'Look up!', `The state of one of the project containers has been changed.`);
    } else if (randomValue < 96) {
      // 48% probability (48 to 96)
      displayRandomQuote();
    } else if (randomValue < 99) {
      // 3% probability (96 to 99)
      toggleColors();
    } else {
      // 1% probability (99 to 100)
      showRectangleNotification('success', 'This notification appears', 'with 1% probability.');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <canvas id="particleCanvas" ref={canvasRef} className={styles.fullscreenCanvas}></canvas>
      <div className={styles.contentContainer}>
        <div className={`${styles.contentContainer} max-w-[900px] w-full mx-auto px-4 text-center overflow-x-hidden overflow-y-auto`}>
        <header className={`${styles.header} flex justify-between items-center ${showTop ? 'animate__animated animate__jackInTheBox' : 'opacity-0'}`}>
          {isRTL ? (
            <>
              <nav className={`flex ${i18n.language === 'he' ? 'flex-row-reverse' : ''}`}>
                {['bio', 'projects', 'playground', 'link', 'contact'].map((item) => (
                  <div key={item}
                      onMouseEnter={() => setHoveredLink(item)}
                      onMouseLeave={() => setHoveredLink(null)}>
                    <a 
                      onClick={() => scrollToSection(item)} // Use click event for scrolling
                      className={`mr-4 ${i18n.language === 'he' ? 'ml-4' : ''}`} 
                      style={{ color: hoveredLink === item ? 'var(--navbar-hovered-text-color)' : 'inherit', cursor: 'pointer' }}
                    >
                      {t(`${item}-inscription`)}
                    </a>
                  </div>
                ))}
              </nav>
              <a 
                href="/"  // Changed to use href for navigation
                className={`text-${i18n.language === 'he' ? 'right' : 'left'}`} 
                onMouseEnter={() => setHoveredLink('username')}
                onMouseLeave={() => setHoveredLink(null)}
                style={{ color: hoveredLink === 'username' ? 'var(--navbar-hovered-text-color)' : 'inherit', cursor: 'pointer' }}
              >
                {t('username')}
              </a>
            </>
          ) : (
            <>
              <a 
                href="/"  // Changed to use href for navigation
                className={`text-${i18n.language === 'he' ? 'right' : 'left'}`} 
                onMouseEnter={() => setHoveredLink('username')}
                onMouseLeave={() => setHoveredLink(null)}
                style={{ color: hoveredLink === 'username' ? 'var(--navbar-hovered-text-color)' : 'inherit', cursor: 'pointer' }}
              >
                {t('username')}
              </a>
              <nav className={`flex ${i18n.language === 'he' ? 'flex-row-reverse' : ''}`}>
                {['bio', 'projects', 'playground', 'link', 'contact'].map((item) => (
                  <div key={item}
                      onMouseEnter={() => setHoveredLink(item)}
                      onMouseLeave={() => setHoveredLink(null)}>
                    <a 
                      onClick={() => scrollToSection(item)} // Use click event for scrolling
                      className={`mr-4 ${i18n.language === 'he' ? 'ml-4' : ''}`} 
                      style={{ color: hoveredLink === item ? 'var(--navbar-hovered-text-color)' : 'inherit', cursor: 'pointer' }}
                    >
                      {t(`${item}-inscription`)}
                    </a>
                  </div>
                ))}
              </nav>
            </>
          )}
        </header>
  
          <main style={{ marginTop: '3.41em' }}>
          <section id="bio">
            <div className={`flex items-center ${i18n.language === 'he' ? 'flex-row-reverse' : ''}`}>
              <div className={`${showTop ? ('animate__animated animate__zoomIn') : 'opacity-0'} ${styles.profileImageContainer}`} style={{ width: 'var(--image-size)', height: 'var(--image-size)', flexShrink: 0, marginLeft: margin, marginRight: margin, marginTop: margin, marginBottom: margin }}>
                <img 
                  src="/portfolio-photo.webp" 
                  alt="Profile" 
                  style={{ width: 'var(--image-size)', height: 'var(--image-size)', objectFit: 'cover' }}
                />
              </div>

              <div className={`${styles.hero} flex justify-center items-center h-screen ${showTop ? 'animate__animated animate__zoomIn' : 'opacity-0'}`}>
                <div className={styles.heroT + " flex flex-col justify-center items-center"}>
                    <GlowText className="text-2xl sm:text-3xl lg:text-4xl font-medium">
                      {t('name')}
                    </GlowText>
                  </div>
                </div>
              </div>
  
            <div style={{
              width: '100%',
              transform: isRTL ? 'scaleX(-1)' : 'none',
            }}>
              <div className={`${showBio ? ('animate__animated animate__zoomIn') : 'opacity-0'} ${styles.heroP}`} style={{ 
                marginBottom: '1.8em',
                marginLeft: margin, 
                marginRight: margin,
                transform: isRTL ? 'scaleX(-1)' : 'none', // This reverses the text back to normal if RTL
              }}>
                <h1 style={{ 
                  direction: isRTL ? 'rtl' : 'ltr', 
                  textAlign: isRTL ? 'right' : 'left'  
                }}>
                  {t('bio')}
                </h1>
              </div>
            </div>

            <div className={`${styles.languageContainer} flex justify-center items-center h-screen ${showTopContainers ? 'animate__animated animate__rollIn' : 'opacity-0'}`}>
            
            {isRTL ? (
              <> 
                <div className={`${styles.knowledgeContainer} ${styles.knowledgeWide}`}>
                  <h2 className={`${styles.inscription} ${isRTL ? styles.right : styles.left}`} style={{ direction: isRTL ? 'rtl' : 'ltr'}}>
                    {t('tech-container-header')}
                  </h2>
                  <div className={styles.knowledgeItems}>
                    {/* Icons for programming languages */}
                    {[
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", label: "Next.js" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", label: "TypeScript" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg", label: "C#" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", label: "Python" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", label: "Firebase" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", label: "React" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", label: "MongoDB" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg", label: "SQLite" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", label: "Java" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", label: "Embedded C" }
                    ].map((item, index) => (
                      <div key={index} className={styles.knowledgeItem}>
                        <div className={styles.subContainer}>
                          <img src={item.src} alt={item.label} />
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.languageSelectorContainer}>
                  <h2 className={`${styles.inscription} ${isRTL ? styles.right : styles.left}`} style={{ direction: isRTL ? 'rtl' : 'ltr'}}>
                  {t('language-container-header')}
                  </h2>
                  <div className={styles.languageButtons}>
                    <div className={styles.knowledgeItemsFlags}>
                      {[
                        { src: "/Flag_of_the_United_States.svg", label: t('english'), lang: 'en' },
                        { src: "/Flag_of_Israel.svg", label: t('hebrew'), lang: 'he' },
                        { src: "/Flag_of_Argentina.svg", label: t('spanish'), lang: 'es' },
                        { src: "/Flag_of_Germany.svg", label: t('german'), lang: 'de' },
                        { src: "/Flag_of_Russia.svg", label: t('russian'), lang: 'ru' },
                      ].map((item, index) => (
                        <div key={index} className={styles.knowledgeItem}>
                          <div 
                            className={styles.subContainer1} 
                            onClick={() => changeLanguage(item.lang)} // Call language change on click
                          >
                            <img 
                              src={item.src} 
                              alt={item.label} 
                              style={{ borderRadius: 'var(--flagRounding)' }} // Rounding the flag images
                            />
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.languageSelectorContainer}>
                  <h2 className={`${styles.inscription} ${isRTL ? styles.right : styles.left}`}>
                  {t('language-container-header')}
                  </h2>
                  <div className={styles.languageButtons}>
                    <div className={styles.knowledgeItemsFlags}>
                      {[
                        { src: "/Flag_of_the_United_States.svg", label: t('english'), lang: 'en' },
                        { src: "/Flag_of_Israel.svg", label: t('hebrew'), lang: 'he' },
                        { src: "/Flag_of_Argentina.svg", label: t('spanish'), lang: 'es' },
                        { src: "/Flag_of_Germany.svg", label: t('german'), lang: 'de' },
                        { src: "/Flag_of_Russia.svg", label: t('russian'), lang: 'ru' },
                      ].map((item, index) => (
                        <div key={index} className={styles.knowledgeItem}>
                          <div 
                            className={styles.subContainer1} 
                            onClick={() => changeLanguage(item.lang)} // Call language change on click
                          >
                            <img 
                              src={item.src} 
                              alt={item.label} 
                              style={{ borderRadius: 'var(--flagRounding)' }} // Rounding the flag images
                            />
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`${styles.knowledgeContainer} ${styles.knowledgeWide}`}>
                  <h2 className={`${styles.inscription} ${isRTL ? styles.right : styles.left}`}>
                    {t('tech-container-header')}
                  </h2>
                  <div className={styles.knowledgeItems}>
                    {/* Icons for programming languages */}
                    {[
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", label: "Next.js" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", label: "TypeScript" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg", label: "C#" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", label: "Python" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", label: "Firebase" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", label: "React" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", label: "MongoDB" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg", label: "SQLite" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", label: "Java" },
                      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", label: "Embedded C" }
                    ].map((item, index) => (
                      <div key={index} className={styles.knowledgeItem}>
                        <div className={styles.subContainer}>
                          <img src={item.src} alt={item.label} />
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            </div>
            </section>
            <section id="projects">
            <div style={{
              width: '100%',
              transform: isRTL ? 'scaleX(-1)' : 'none',
            }}>
              <div className={styles.heroS} style={{ 
                marginTop: '0.84em', 
                paddingLeft: '0.65em',
                paddingRight: '0.65em',
                transform: isRTL ? 'scaleX(-1)' : 'none', // This reverses the text back to normal if RTL
              }}>
                <h1 style={{ 
                  direction: isRTL ? 'rtl' : 'ltr', 
                  textAlign: isRTL ? 'right' : 'left'  
                }}>
                  {t('projects-inscription')}
                </h1>
              </div>
            </div>
            <div className={`flex justify-between items-center ${showTop ? 'animate__animated animate__jackInTheBox' : 'opacity-0'}`}>
            <BentoGrid className={`mt-9`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
                {containers.map(file => (
                  <BentoGridItem key={file.id}>
                    <FileContainer
                      id={file.id}
                      title={file.title}
                      color={file.color}
                      description={file.description}
                      metadataIntegrity={file.metadataIntegrity}
                      imageUrl={file.imageUrl}
                      link={file.link}
                    />
                  </BentoGridItem>
                ))}
              </BentoGrid>
            </div>
            </section>
            <section id="playground">
              <div style={{
                width: '100%',
                transform: isRTL ? 'scaleX(-1)' : 'none',
              }}>
                <div className={styles.heroS} style={{ 
                  marginTop: '0.84em', 
                  paddingLeft: '0.65em',
                  paddingRight: '0.65em',
                  transform: isRTL ? 'scaleX(-1)' : 'none', // This reverses the text back to normal if RTL
                }}>
                  <h1 style={{ 
                    direction: isRTL ? 'rtl' : 'ltr', 
                    textAlign: isRTL ? 'right' : 'left'  
                  }}>
                    {t('playground-inscription')}
                  </h1>
                </div>
              </div>
              <div style={{ marginTop: '1.21em' }}>
                <div style={{
                  width: '100%',
                  transform: isRTL ? 'scaleX(-1)' : 'none',
                }}>
                  <div className={`${showTop ? ('animate__animated animate__zoomIn') : 'opacity-0'} ${styles.heroP}`} style={{ 
                    marginBottom: '1.8em',
                    marginLeft: margin, 
                    marginRight: margin,
                    transform: isRTL ? 'scaleX(-1)' : 'none', // This reverses the text back to normal if RTL
                  }}>
                    <h1 style={{ 
                      direction: isRTL ? 'rtl' : 'ltr', 
                      textAlign: isRTL ? 'right' : 'left'  
                    }}>
                      {t('playground-text')}
                    </h1>
                  </div>
                </div>
                <div className="flex justify-center items-center w-full">
                  <MagicButton onButtonClick={handleMagicButtonClick}/>
                </div>
              </div>
            </section>
            <section id="link">
              <div style={{
                width: '100%',
                transform: isRTL ? 'scaleX(-1)' : 'none',
              }}>
                <div className={styles.heroS} style={{ 
                  marginTop: '0.84em', 
                  paddingLeft: '0.65em',
                  paddingRight: '0.65em',
                  transform: isRTL ? 'scaleX(-1)' : 'none', // This reverses the text back to normal if RTL
                }}>
                  <h1 style={{ 
                    direction: isRTL ? 'rtl' : 'ltr', 
                    textAlign: isRTL ? 'right' : 'left'  
                  }}>
                    {t('link-inscription')}
                  </h1>
                </div>
              </div>
              <div style={{ marginTop: '1.21em' }}>
                <div style={{
                  width: '100%',
                  transform: isRTL ? 'scaleX(-1)' : 'none',
                }}>
                  <div className={`${showTop ? ('animate__animated animate__zoomIn') : 'opacity-0'} ${styles.heroP}`} style={{ 
                    marginBottom: '1.8em',
                    marginLeft: margin, 
                    marginRight: margin,
                    transform: isRTL ? 'scaleX(-1)' : 'none', // This reverses the text back to normal if RTL
                  }}>
                    <h1 style={{ 
                      direction: isRTL ? 'rtl' : 'ltr', 
                      textAlign: isRTL ? 'right' : 'left'  
                    }}>
                      {t('link-text')}
                    </h1>
                  </div>
                </div>
                <LinkComponent/>
              </div>
            </section>
            <section id="contact">
              <div style={{
                width: '100%',
                transform: isRTL ? 'scaleX(-1)' : 'none',
              }}>
                <div className={styles.heroS} style={{ 
                  marginTop: '0.84em', 
                  paddingLeft: '0.65em',
                  paddingRight: '0.65em',
                  transform: isRTL ? 'scaleX(-1)' : 'none', // This reverses the text back to normal if RTL
                }}>
                  <h1 style={{ 
                    direction: isRTL ? 'rtl' : 'ltr', 
                    textAlign: isRTL ? 'right' : 'left'  
                  }}>
                    {t('contact-inscription')}
                  </h1>
                </div>
              </div>
              <div style={{ marginTop: '1.21em', marginBottom: '1.84em' }}>
                <div style={{
                  width: '100%',
                  transform: isRTL ? 'scaleX(-1)' : 'none',
                }}>
                  <div className={`${showTop ? ('animate__animated animate__zoomIn') : 'opacity-0'} ${styles.heroP}`} style={{ 
                    marginBottom: '1.8em',
                    marginLeft: margin, 
                    marginRight: margin,
                    transform: isRTL ? 'scaleX(-1)' : 'none', // This reverses the text back to normal if RTL
                  }}>
                    <h1 style={{ 
                      direction: isRTL ? 'rtl' : 'ltr', 
                      textAlign: isRTL ? 'right' : 'left'  
                    }}>
                      {t('contact-text')}
                    </h1>
                  </div>
                </div>
                <ContactInfo/>
              </div>
            </section>
            <div ref={notificationContainerRef} className={notificationStyles.notificationContainer}></div>
          </main>
          {activeNotification && (
            <RectangleNotification 
                type={activeNotification.type}
                message={activeNotification.message}
                message1={activeNotification.message1}
                isVisible={!!activeNotification}
                onClose={closeRectangleNotification}
            />
          )}
          <div>
            {showPopup && <LanguagePopup onClose={handleClose} />}
            {/* Rest of your page content */}
          </div>
        </div>
      </div>
    </div>
  );
}