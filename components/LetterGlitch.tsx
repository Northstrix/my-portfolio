"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

const LetterGlitch = ({
  glitchColors = ["#802EE8", "#2E68E8"],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  fontSize = 16,
}: {
  glitchColors?: string[];
  glitchSpeed: number;
  centerVignette: boolean;
  outerVignette: boolean;
  smooth: boolean;
  fontSize?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Store dimensions in a ref so we don't query the DOM every frame
  const dimensions = useRef({ width: 0, height: 0 });

  const letters = useRef<
    {
      char: string;
      color: string;
      targetColor: string;
      colorProgress: number;
    }[]
  >([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTime = useRef(Date.now());
  const { i18n } = useTranslation();
  const [effectKey, setEffectKey] = useState(0);

  // Re-trigger effect on language change
  useEffect(() => {
    setEffectKey((k) => k + 1);
    const timeout = setTimeout(() => setEffectKey((k) => k + 1), 500);
    return () => clearTimeout(timeout);
  }, [i18n.language]);

  // Constants
  const charWidth = 10;
  const charHeight = 20;
  
  const lettersAndSymbols = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", 
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
    "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "+", "=",
  ];

  const getRandomChar = useCallback(() =>
    lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)], []);

  const getRandomColor = useCallback(() =>
    glitchColors[Math.floor(Math.random() * glitchColors.length)], [glitchColors]);

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const interpolateColor = (
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    factor: number,
  ) => {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor),
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  };

  const calculateGrid = (width: number, height: number) => {
    const columns = Math.ceil(width / charWidth);
    const rows = Math.ceil(height / charHeight);
    return { columns, rows };
  };

  const initializeLetters = (columns: number, rows: number) => {
    grid.current = { columns, rows };
    const totalLetters = columns * rows;
    letters.current = Array.from({ length: totalLetters }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
    }));
  };

  // --- SAFE DRAWING FUNCTION ---
  const drawLetters = () => {
    // 1. Safety Check: Ensure context and data exist
    if (!context.current || letters.current.length === 0 || !canvasRef.current) return;
    
    const ctx = context.current;
    
    // 2. Performance Fix: Use stored dimensions instead of calling getBoundingClientRect()
    // This prevents the "Cannot read properties of null" error during scroll/unmount
    const { width, height } = dimensions.current;
    
    // If dimensions are invalid, stop
    if (width <= 0 || height <= 0) return;

    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";
    
    letters.current.forEach((letter, index) => {
      const x = (index % grid.current.columns) * charWidth;
      const y = Math.floor(index / grid.current.columns) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };

  const updateLetters = () => {
    if (!letters.current || letters.current.length === 0) return;
    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05));
    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length);
      if (!letters.current[index]) continue;
      letters.current[index].char = getRandomChar();
      letters.current[index].targetColor = getRandomColor();
      if (!smooth) {
        letters.current[index].color = letters.current[index].targetColor;
        letters.current[index].colorProgress = 1;
      } else {
        letters.current[index].colorProgress = 0;
      }
    }
  };

  const handleSmoothTransitions = () => {
    let needsRedraw = false;
    letters.current.forEach((letter) => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05;
        if (letter.colorProgress > 1) letter.colorProgress = 1;
        const startRgb = hexToRgb(letter.color);
        const endRgb = hexToRgb(letter.targetColor);
        if (startRgb && endRgb) {
          letter.color = interpolateColor(
            startRgb,
            endRgb,
            letter.colorProgress,
          );
          needsRedraw = true;
        }
      }
    });
    if (needsRedraw) {
      drawLetters();
    }
  };

  const animate = () => {
    // Safety check inside the loop
    if (!canvasRef.current) return;

    const now = Date.now();
    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime.current = now;
    }
    if (smooth) {
      handleSmoothTransitions();
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  // --- RESIZE LOGIC ---
  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    // Safety check: if DOM nodes are gone, stop
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    
    // If element is hidden (width=0), don't do work
    if (rect.width === 0 || rect.height === 0) return;

    // Cache the dimensions for the draw loop
    dimensions.current = { width: rect.width, height: rect.height };

    const dpr = window.devicePixelRatio || 1;
    
    // Set physical pixel size
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Set CSS size
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Scale context
    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Recalculate grid
    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);
    drawLetters();
  }, [fontSize]); // Added dependency if font size changes logic

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;
    
    context.current = canvas.getContext("2d");
    
    // Initial Setup
    handleResize();
    animate();

    // Use ResizeObserver instead of window.resize
    // This detects if the parent div changes size (e.g., sidebar open/close or scrollbars appearing)
    const resizeObserver = new ResizeObserver(() => {
      // Wrap in requestAnimationFrame to throttle resize events slightly
      requestAnimationFrame(() => handleResize());
    });

    resizeObserver.observe(container);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glitchSpeed, smooth, effectKey, handleResize]);

  return (
    <div
      ref={containerRef} // Add ref here to observe size
      className="relative w-full h-full overflow-hidden"
      style={{
        borderRadius: "inherit",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          borderRadius: "inherit",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
          style={{ borderRadius: "inherit" }}
        />
        {outerVignette && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)",
              borderRadius: "inherit",
              pointerEvents: "none",
            }}
          />
        )}
        {centerVignette && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 62%)",
              borderRadius: "inherit",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LetterGlitch;