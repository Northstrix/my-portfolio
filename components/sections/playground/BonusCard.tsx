"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

// --- Configuration for the Electric Border ---
const BASE_CONFIG = {
  // Visuals
  color: "#FBE75F",    // Electric Yellow
  lineWidth: 4,       // Requested 10px width
  borderRadius: 24,    // Matches card rounded corners
  
  // Positioning
  // Negative value moves the border INSIDE the card edges
  borderDistance: 0,   
  
  // Animation Physics (High Dynamism)
  octaves: 8,          // High detail
  lacunarity: 1.2,
  gain: 0.5,
  amplitude: 0.016,     // Increased for more "jumpy" electricity
  frequency: 12.5,      // Higher frequency for more jagged lines
  speed: 5.2,          // Faster animation speed
};

// --- Noise Math Helpers ---
const random = (x: number) => (Math.sin(x * 12.9898) * 43758.5453) % 1;

const noise2D = (x: number, y: number) => {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;
  const a = random(i + j * 57);
  const b = random(i + 1 + j * 57);
  const c = random(i + (j + 1) * 57);
  const d = random(i + 1 + (j + 1) * 57);
  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);
  return (
    a * (1 - ux) * (1 - uy) +
    b * ux * (1 - uy) +
    c * (1 - ux) * uy +
    d * ux * uy
  );
};

const octavedNoise = (
  x: number,
  time: number,
  seed: number,
  config: typeof BASE_CONFIG
) => {
  let y = 0;
  let amplitude = config.amplitude;
  let frequency = config.frequency;
  for (let i = 0; i < config.octaves; i++) {
    let octaveAmplitude = amplitude;
    if (i === 0) octaveAmplitude *= 1.0;
    y +=
      octaveAmplitude *
      noise2D(frequency * x + seed * 100, time * frequency * 0.3);
    frequency *= config.lacunarity;
    amplitude *= config.gain;
  }
  return y;
};

interface BonusCardProps {
  zIndex: number;
  width: number;
  height: number;
  scaleFactor: number;
  style: React.CSSProperties;
  constraintRef?: React.RefObject<Element>;
}

const BonusCard: React.FC<BonusCardProps> = ({
  zIndex,
  width,
  height,
  scaleFactor,
  style,
  constraintRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // --- Tilt Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseX = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 200, damping: 25 });

  // Rotation Range
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);

  // --- Holographic Glare Calculations ---
  const bgX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const bgY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
  
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // --- Electric Border Canvas Effect ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let lastFrameTime = 0;

    // Displacement range for the "chaos"
    const displacementRange = 50 * scaleFactor; 
    
    // Resize canvas: Card Size + Padding
    canvas.width = width + (displacementRange * 3);
    canvas.height = height + (displacementRange * 3);

    const draw = (currentTime: number) => {
      const deltaTime = (currentTime - lastFrameTime) / 1000;
      lastFrameTime = currentTime;
      time += deltaTime * BASE_CONFIG.speed;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = BASE_CONFIG.color;
      ctx.lineWidth = BASE_CONFIG.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      // Outer Glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = BASE_CONFIG.color;

      // Calculate path geometry
      // The "Distance" moves the base path in/out relative to the card dimensions
      const dist = BASE_CONFIG.borderDistance * scaleFactor;
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      const w = width + (dist * 2); 
      const h = height + (dist * 2);
      const left = cx - w / 2;
      const top = cy - h / 2;
      
      const radius = BASE_CONFIG.borderRadius * scaleFactor;

      const perimeter =
        2 * (w - 2 * radius + (h - 2 * radius)) + 2 * Math.PI * radius;
      
      const sampleCount = Math.floor(perimeter / 2); // Higher detail for dynamic look

      const getPoint = (t: number) => {
        const straightW = w - 2 * radius;
        const straightH = h - 2 * radius;
        const cornerArc = (Math.PI * radius) / 2;
        const total = 2 * straightW + 2 * straightH + 4 * cornerArc;
        const d = t * total;
        let acc = 0;

        if (d <= acc + straightW) return { x: left + radius + d, y: top };
        acc += straightW;
        if (d <= acc + cornerArc) {
          const p = (d - acc) / cornerArc;
          const angle = -Math.PI / 2 + p * (Math.PI / 2);
          return {
            x: left + w - radius + radius * Math.cos(angle),
            y: top + radius + radius * Math.sin(angle),
          };
        }
        acc += cornerArc;
        if (d <= acc + straightH)
          return { x: left + w, y: top + radius + (d - acc) };
        acc += straightH;
        if (d <= acc + cornerArc) {
          const p = (d - acc) / cornerArc;
          const angle = 0 + p * (Math.PI / 2);
          return {
            x: left + w - radius + radius * Math.cos(angle),
            y: top + h - radius + radius * Math.sin(angle),
          };
        }
        acc += cornerArc;
        if (d <= acc + straightW)
          return { x: left + w - radius - (d - acc), y: top + h };
        acc += straightW;
        if (d <= acc + cornerArc) {
          const p = (d - acc) / cornerArc;
          const angle = Math.PI / 2 + p * (Math.PI / 2);
          return {
            x: left + radius + radius * Math.cos(angle),
            y: top + h - radius + radius * Math.sin(angle),
          };
        }
        acc += cornerArc;
        if (d <= acc + straightH)
          return { x: left, y: top + h - radius - (d - acc) };
        acc += straightH;
        const p = (d - acc) / cornerArc;
        const angle = Math.PI + p * (Math.PI / 2);
        return {
          x: left + radius + radius * Math.cos(angle),
          y: top + radius + radius * Math.sin(angle),
        };
      };

      ctx.beginPath();
      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount;
        const point = getPoint(progress);
        
        // Generate Noise
        const xNoise = octavedNoise(progress * 10, time, 0, BASE_CONFIG);
        const yNoise = octavedNoise(progress * 10, time, 1, BASE_CONFIG);
        
        // Apply chaos displacement
        const dx = point.x + xNoise * 60 * scaleFactor;
        const dy = point.y + yNoise * 60 * scaleFactor;

        if (i === 0) ctx.moveTo(dx, dy);
        else ctx.lineTo(dx, dy);
      }
      ctx.closePath();
      ctx.stroke();
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [width, height, scaleFactor]);

  const fontSize = 24 * scaleFactor;
  const borderRadius = 24 * scaleFactor;

  return (
    <motion.div
      drag
      dragConstraints={constraintRef} // Bounce boundaries
      dragElastic={0.15} // Bouncy feeling at edges
      dragMomentum={false} 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "backOut" }}
      style={{
        ...style,
        width: width,
        height: height,
        zIndex,
        perspective: 1200,
        position: "absolute",
        cursor: "grab",
      }}
      whileTap={{ cursor: "grabbing" }}
      className="select-none" // Prevents text selection while dragging
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
        }}
        className="group relative"
      >
        {/* LAYER 1: Electric Border (Canvas) */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
          style={{
            width: width + (150 * scaleFactor),
            height: height + (150 * scaleFactor),
          }}
        >
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* LAYER 2: Main Card Body */}
        <div
          className="absolute inset-0 bg-white overflow-hidden shadow-2xl z-20 pointer-events-none"
          style={{ borderRadius: borderRadius }}
        >
          {/* A. Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <Image
              src="/fourth-playground-card-image.jpg"
              alt="Bonus Card"
              fill
              className="object-cover"
              draggable={false} // CRITICAL: Prevents ghost dragging of image
              priority
            />
          </div>

          {/* B. Holographic Foil Overlay */}
          <motion.div 
            className="absolute inset-0 z-10 pointer-events-none opacity-40 mix-blend-color-dodge"
            style={{
                background: "linear-gradient(135deg, transparent 35%, rgba(255, 0, 128, 0.4) 45%, rgba(0, 255, 255, 0.4) 55%, transparent 65%)",
                backgroundSize: "200% 200%",
                backgroundPositionX: bgX,
                backgroundPositionY: bgY,
            }}
          />
          
          {/* C. Subtle Texture */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '3px 3px' }}
          />

          {/* D. Content Layer */}
          <div
            className="absolute inset-0 z-30 pointer-events-none p-6 font-serif font-black"
            style={{ fontSize: fontSize }}
          >
            {/* Top Text: Journey (Japanese) */}
            <div
              className="absolute top-6 left-6 flex flex-col leading-none"
              style={{ 
                  color: isHovered ? "#FDFF6D" : "#f4f6e1",
                  textShadow: isHovered ? "0 0 15px rgba(253, 255, 109, 0.8)" : "0 0 0px transparent",
                  transition: "color 1.76s ease, text-shadow 1.76s ease"
              }}
            >
              <span>旅</span>
            </div>

            {/* Bottom Text: Journey (Japanese) - Mirrored */}
            <div
              className="absolute bottom-6 right-6 flex flex-col leading-none rotate-180 transition-colors duration-300"
              style={{ 
                  color: isHovered ? "#FDFF6D" : "#f4f6e1",
                  textShadow: isHovered ? "0 0 15px rgba(253, 255, 109, 0.8)" : "none"
               }}
            >
              <span>旅</span>
            </div>
          </div>
        </div>

        {/* LAYER 3: 3D Surface Glare */}
        <motion.div
            className="absolute inset-0 z-40 pointer-events-none rounded-[22px]"
            style={{
                background: useMotionTemplate`
                    radial-gradient(
                        circle at ${shineX} ${shineY}, 
                        rgba(255, 255, 255, 0.4) 0%, 
                        transparent 50%
                    )
                `,
                mixBlendMode: "overlay"
            }}
        />

        {/* LAYER 4: Edge Highlight */}
        <div 
            className="absolute inset-0 z-40 pointer-events-none rounded-[22px] border border-white/40"
            style={{
                boxShadow: "inset 0 0 12px rgba(255,255,255,0.2)"
            }}
        />

      </motion.div>
    </motion.div>
  );
};

export default BonusCard;