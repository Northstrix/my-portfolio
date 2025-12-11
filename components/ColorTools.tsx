"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import useIsRTL from "@/hooks/useIsRTL";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import ColorCard from "@/components/ColorCard";
import { useWindowSize } from "@/hooks/useWindowSize";
import {
  IconClose,
  IconChevronDown
} from "@/components/Icons";
/* -------------------------------------------------------------------------- */
/*                                LOCALIZATION                                */
/* -------------------------------------------------------------------------- */
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: "Nof Mini",
    subtitle: "Generate palettes & check contrast",
    baseColor: "Base Color",
    mode: "Mode",
    output: "Output",
    contrast: "Contrast",
    contrastRatio: "Contrast Ratio",
    analogous: "Analogous",
    triad: "Triad",
    complementary: "Complementary",
    splitComp: "Split Complementary",
    square: "Square",
    tetradic: "Tetradic",
    monochromatic: "Monochromatic"
  },
  he: {
    title: "נוף מיני",
    subtitle: "יצירת פלטות ובדיקת ניגודיות",
    baseColor: "צבע בסיס",
    mode: "מצב",
    output: "תוצאה",
    contrast: "ניגודיות",
    contrastRatio: "יחס ניגודיות",
    analogous: "אנלוגי",
    triad: "משולש",
    complementary: "משלים",
    splitComp: "משלים מפוצל",
    square: "ריבוע",
    tetradic: "טטרדי",
    monochromatic: "מונוכרומטי"
  },
  it: {
    title: "Nof Mini",
    subtitle: "Genera tavolozze e controlla il contrasto",
    baseColor: "Colore Base",
    mode: "Modalità",
    output: "Output",
    contrast: "Contrasto",
    contrastRatio: "Rapporto Contrasto",
    analogous: "Analogo",
    triad: "Triade",
    complementary: "Complementare",
    splitComp: "Complementare Diviso",
    square: "Quadrato",
    tetradic: "Tetradico",
    monochromatic: "Monocromatico"
  },
  es: {
    title: "Nof Mini",
    subtitle: "Generar paletas y comprobar contraste",
    baseColor: "Color Base",
    mode: "Modo",
    output: "Resultado",
    contrast: "Contraste",
    contrastRatio: "Relación de Contraste",
    analogous: "Análogo",
    triad: "Tríada",
    complementary: "Complementario",
    splitComp: "Complementario Dividido",
    square: "Cuadrado",
    tetradic: "Tetrádico",
    monochromatic: "Monocromático"
  }
};

const minCardWidth = 256;

/* -------------------------------------------------------------------------- */
/*                                MATH LOGIC                                  */
/* -------------------------------------------------------------------------- */
function hsvToHex(h: number, s: number, v: number): string {
  s /= 100; v /= 100;
  let c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c, r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToHsv(hex: string) {
  let c = hex.replace(/^#/, '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
}

function hexToRgb(hex: string) {
  let c = hex.replace(/^#/, '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  return {
    r: parseInt(c.substring(0, 2), 16),
    g: parseInt(c.substring(2, 4), 16),
    b: parseInt(c.substring(4, 6), 16)
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
  return rgbToHex(r * 255 + m * 255, g * 255 + m * 255, b * 255 + m * 255);
}

function generateHarmonies(baseHex: string, mode: string) {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const shift = (deg: number) => hslToHex((hsl.h + deg + 360) % 360, hsl.s, hsl.l);
  switch (mode) {
    case 'analogous': return [shift(-30), baseHex, shift(30)];
    case 'triad': return [baseHex, shift(120), shift(240)];
    case 'complementary': return [baseHex, shift(180)];
    case 'splitComp': return [baseHex, shift(150), shift(210)];
    case 'square': return [baseHex, shift(90), shift(180), shift(270)];
    case 'tetradic': return [baseHex, shift(60), shift(180), shift(240)];
    case 'monochromatic':
      return [
        hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 40)),
        hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 20)),
        baseHex,
        hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 20)),
        hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 40))
      ];
    default: return [baseHex];
  }
}

/* -------------------------------------------------------------------------- */
/*                            CUSTOM COMPONENTS                               */
/* -------------------------------------------------------------------------- */
const FloatingLabelInput = ({ value, onChange, label, isRTL }: { value: string, onChange: (v: string) => void, label: string, isRTL: boolean }) => {
  return (
    <div className="relative mt-2" style={{ width: '100%' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block border border-[#333] text-[var(--foreground)] rounded-lg px-4 pt-3 pb-2 focus:border-[var(--accent)] outline-none bg-transparent peer transition-colors w-full font-mono text-base uppercase shadow-inner"
        placeholder=" "
        maxLength={7}
        style={{ direction: "ltr", textAlign: isRTL ? 'right' : 'left' }}
      />
      <label
        className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2.5 bg-[#1a1a1a] px-2 peer-focus:px-2 peer-focus:text-[var(--foreground)] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 ${isRTL ? 'right-2 origin-top-right' : 'left-2 origin-top-left'}`}
        style={{ borderRadius: '4px', pointerEvents: 'none' }}
      >
        {label}
      </label>
    </div>
  );
};

const FloatingLabelSelect = ({ value, onChange, label, options, isRTL, t }: { value: string, onChange: (v: string) => void, label: string, options: string[], isRTL: boolean, t: any }) => {
  return (
    <div className="relative mt-2" style={{ width: '100%' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block appearance-none border border-[#333] text-[var(--foreground)] rounded-lg px-4 pt-3 pb-2 focus:border-[var(--accent)] outline-none bg-transparent peer transition-colors w-full text-base capitalize shadow-inner cursor-pointer"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-[#1d1d1d] text-[var(--foreground)]">{t(opt)}</option>
        ))}
      </select>
      <label
        className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2.5 bg-[#1a1a1a] px-2 peer-focus:px-2 peer-focus:text-[var(--foreground)] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 ${isRTL ? 'right-2 origin-top-right' : 'left-2 origin-top-left'}`}
        style={{ borderRadius: '4px', pointerEvents: 'none' }}
      >
        {label}
      </label>
      <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 ${isRTL ? 'left-3' : 'right-3'}`}>
        <IconChevronDown size={16} />
      </div>
    </div>
  );
};

const CustomColorPicker = ({ color, onChange, isRTL, t }: { color: string, onChange: (hex: string) => void, isRTL: boolean, t: any }) => {
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(100);
  const [bright, setBright] = useState(100);
  const [inputValue, setInputValue] = useState(color);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      const hsv = hexToHsv(color);
      setHue(prev => Math.abs(prev - hsv.h) < 1 ? prev : hsv.h);
      setSat(hsv.s);
      setBright(hsv.v);
      setInputValue(color);
    }
  }, [color]);

  const updateColor = useCallback((h: number, s: number, v: number) => {
    const safeHue = Math.min(359.9, Math.max(0, h));
    const newHex = hsvToHex(safeHue, s, v);
    onChange(newHex);
  }, [onChange]);

  const handleAreaMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const handleMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min((moveEvent.clientX - rect.left) / rect.width, 1));
      const y = Math.max(0, Math.min(1 - (moveEvent.clientY - rect.top) / rect.height, 1));
      const newSat = isRTL ? (1 - x) * 100 : x * 100;
      const newBright = y * 100;
      setSat(newSat);
      setBright(newBright);
      updateColor(hue, newSat, newBright);
    };
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    handleMove(e.nativeEvent);
  }, [updateColor, hue, isRTL]);

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setHue(val);
    updateColor(val, sat, bright);
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      <div
        ref={containerRef}
        onMouseDown={handleAreaMouseDown}
        className="relative w-full h-32 rounded-lg overflow-hidden cursor-crosshair shadow-inner border border-[var(--foreground)]/10"
        style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
      >
        <div className="absolute inset-0" style={{ background: isRTL ? 'linear-gradient(to left, var(--foreground), transparent)' : 'linear-gradient(to right, var(--foreground), transparent)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #000, transparent)' }} />
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-[var(--foreground)] shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: isRTL ? `${100 - sat}%` : `${sat}%`,
            top: `${100 - bright}%`
          }}
        />
      </div>
      <input
        type="range"
        min="0"
        max="360"
        step="0.1"
        value={hue}
        onChange={handleHueChange}
        className="w-full h-3 rounded-full appearance-none cursor-pointer border border-[var(--foreground)]/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--foreground)] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--foreground)] [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md"
        style={{
          background: isRTL
            ? 'linear-gradient(to left, red, yellow, lime, cyan, blue, magenta, red)'
            : 'linear-gradient(to left, red, magenta, blue, cyan, lime, yellow, red)'
        }}
      />
      <div className="flex flex-col gap-2">
        <FloatingLabelInput value={inputValue} onChange={handleInputChange} label="HEX" isRTL={isRTL} />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */
interface ColorToolsProps {
  onClose: () => void;
  isOpen: boolean;
}

const ColorTools: React.FC<ColorToolsProps> = ({ onClose, isOpen }) => {
  const isRTL = useIsRTL();
  const isMobile = useIsMobile();
  const { i18n } = useTranslation();
    const { width: windowWidth, height: windowHeight } = useWindowSize(); // ✅ Use the hook

  const t = (key: string) => {
    const lang = i18n.language ? i18n.language.split('-')[0] : 'en';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    return dict[key] || TRANSLATIONS['en'][key] || key;
  };

  const [baseColor, setBaseColor] = useState("#802EE9");
  const [harmony, setHarmony] = useState("analogous");
  const colors = useMemo(() => generateHarmonies(baseColor, harmony), [baseColor, harmony]);

  const widthMV = useMotionValue(900);
  const heightMV = useMotionValue(600);
  const resizableRef = useRef<HTMLDivElement>(null);

  const [isStacked, setIsStacked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const vw = Math.min(900, windowWidth - 20);
      const vh = Math.min(600, windowHeight - 20);
      
      widthMV.set(vw);
      heightMV.set(vh);
      
      // Update stack state based on current width
      setIsStacked(vw < 676 || isMobile);
    }
  }, [windowWidth, windowHeight, isMobile]); 

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    isResizing.current = true;
    setIsDragging(true);
    startX.current = e.clientX;
    startWidth.current = widthMV.get();
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const delta = isRTL
      ? e.clientX - startX.current
      : startX.current - e.clientX;

    const ABS_MIN_W = 360;
    const ABS_MAX_W = 1280;
    const maxAllowedW = Math.min(ABS_MAX_W, viewportW - 20);
    const minAllowedW = Math.min(ABS_MIN_W, maxAllowedW);

    let newWidth = startWidth.current + delta;

    // --- Minimum Width Logic: Hard Stop ---
    if (newWidth < minAllowedW) {
      newWidth = minAllowedW;
    }

    // --- Maximum Width Logic: Resistive Extension up to 10% ---
    if (newWidth > maxAllowedW) {
      const excess = newWidth - maxAllowedW;
      const overDragMax = maxAllowedW * 0.10; // 10% over
      
      // Apply damping resistance (move mouse X pixels to get fraction of movement)
      const dampedExcess = excess * 0.2; 
      
      // Clamp the extension to the max allowed overdrag
      const finalExcess = Math.min(overDragMax, dampedExcess);
      
      newWidth = maxAllowedW + finalExcess;
    }

    // --- Height Calculation Logic ---
    const ABS_MIN_H = 436;
    const ABS_MAX_H = 800;
    const maxAllowedH = Math.min(ABS_MAX_H, viewportH - 20);
    const minAllowedH = Math.min(ABS_MIN_H, maxAllowedH);

    // To prevent height from shrinking weirdly when we are in the "spring zone" (width > maxAllowedW),
    // we calculate height based on the clamped width (maxAllowedW). 
    const widthForHeightCalc = Math.min(maxAllowedW, Math.max(minAllowedW, newWidth));
    
    const widthRange = Math.max(1, maxAllowedW - minAllowedW);
    const ratio = (widthForHeightCalc - minAllowedW) / widthRange;
    const heightRange = maxAllowedH - minAllowedH;
    
    let newHeight = maxAllowedH - (ratio * heightRange);
    newHeight = Math.max(minAllowedH, Math.min(maxAllowedH, newHeight));
    
    widthMV.set(newWidth);
    heightMV.set(newHeight);

    // Determine stack state based on the calculated width
    const stacked = newWidth < 676;
    if (stacked !== isStacked) {
      setIsStacked(stacked);
    }

  }, [isRTL, isStacked, widthMV, heightMV, isMobile]);

  const handleMouseUp = useCallback(() => {
    if (!isResizing.current) return;
    isResizing.current = false;
    setIsDragging(false);

    document.body.style.cursor = "auto";
    document.body.style.userSelect = "auto";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    // --- Spring Snap Back Logic (Only for Max) ---
    const currentW = widthMV.get();
    const viewportW = window.innerWidth;
    
    const ABS_MAX_W = 1280;
    const maxAllowedW = Math.min(ABS_MAX_W, viewportW - 20);

if (currentW > maxAllowedW) {
      // Animate width back to max bounds with a bouncy spring
      animate(widthMV, maxAllowedW, {
        type: "spring",
        stiffness: 600, // High tension for a fast snap
        damping: 12,    // Low friction allows it to overshoot and wiggle
        mass: 0.8       // Lighter mass makes it feel snappier
      });
    }

  }, [widthMV]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-[10px]"
          style={{ zIndex: 1996 }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            ref={resizableRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative flex text-[var(--foreground)] overflow-hidden shadow-2xl"
            style={{
              width: widthMV,
              height: heightMV,
              backgroundColor: "#1d1d1d",
              borderRadius: "20px",
              boxShadow: "inset 0 2px 4px rgba(225,225,225, 0.1), 0 20px 50px -12px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {!isMobile && (
              <motion.div
                onMouseDown={handleMouseDown}
                className="h-full w-[10px] cursor-ew-resize z-40 shrink-0 absolute top-0 bottom-0 hover:bg-[var(--foreground)]"
                style={{
                  [isRTL ? 'right' : 'left']: 0,
                  backgroundColor: isDragging ? 'var(--foreground)' : 'var(--accent)',
                  transition: isDragging ? 'none' : "background-color 1s ease"
                }}
              />
            )}
            <div
              className={`flex w-full h-full overflow-hidden ${isStacked ? 'flex-col' : 'flex-row'}`}
              style={{
                paddingLeft: !isMobile && !isRTL ? '10px' : '0',
                paddingRight: !isMobile && isRTL ? '10px' : '0'
              }}
            >

              <div
                className={`bg-black/10 border-[var(--foreground)]/5 flex flex-col gap-6 overflow-y-auto shrink-0 z-10 ${isStacked ? 'w-full border-b p-4' : 'w-[320px] border-r p-6'}`}
                style={{ borderRightWidth: isStacked ? 0 : 1, borderBottomWidth: isStacked ? 1 : 0 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight mb-1 font-[family-name:var(--font-ibm-plex-sans)]">
                      {t('title')}
                    </h3>
                    <p className="text-sm text-gray-500">{t('subtitle')}</p>
                  </div>
                  {isStacked && (
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full bg-[#171717] border border-[#232323] text-gray-400 hover:text-[var(--foreground)] hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all duration-300"
                    >
                      <IconClose />
                    </button>
                  )}
                </div>

                <CustomColorPicker color={baseColor} onChange={setBaseColor} isRTL={isRTL} t={t} />

                <FloatingLabelSelect
                  value={harmony}
                  onChange={setHarmony}
                  label={t('mode')}
                  isRTL={isRTL}
                  t={t}
                  options={['analogous', 'triad', 'complementary', 'splitComp', 'square', 'tetradic', 'monochromatic']}
                />
              </div>

              <div className={`flex-1 overflow-y-auto relative bg-transparent ${isMobile ? 'p-4' : 'p-8'}`}>
                <div className="flex items-center justify-between mb-6">
                  <span className="uppercase tracking-widest font-bold text-xs text-gray-500">{t('output')}</span>
                  {!isMobile && !isStacked && (
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full bg-[#171717] border border-[#232323] text-gray-400 hover:text-[var(--foreground)] hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all duration-300"
                    >
                      <IconClose />
                    </button>
                  )}
                </div>

                <motion.div
                  layout
                  key={isStacked ? "stack" : "grid"}
                  className={`grid gap-4 w-full`}
                  style={{
                    gridTemplateColumns: isStacked
                      ? "1fr"
                      : `repeat(auto-fit, minmax(${minCardWidth}px, 1fr))`,
                  }}
                >
                  {colors.map((hex, i) => (
                    <div key={`${harmony}-${i}-${hex}`} className="w-full">
                      <ColorCard
                        hexColor={hex}
                        isRTL={isRTL}
                        contrastRatioLabelText={t('contrastRatio')}
                        cardBg="rgba(0,0,0,0.2)"
                        cardBorderColor="rgba(255,255,255,0.05)"
                        copyButtonChangeOnCardHover={true}
                        showAABadge={true}
                        showAAABadge={true}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ColorTools;