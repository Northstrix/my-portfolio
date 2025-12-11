"use client";
import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

// User Icon
export const User: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 21.4,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="256" height="256" fill="none" stroke="none" />
    <circle cx="128" cy="96" r="64" />
    <path d="M32,216c19.37-33.47,54.55-56,96-56s76.63,22.53,96,56" />
  </svg>
);

// FolderKanban Icon (custom new icon using your specified base and lines)
export const FolderKanban: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2, // applied uniformly to all paths
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Folder outline */}
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    {/* Three vertical lines inside folder */}
    <path d="M8 10v4" />
    <path d="M12 10v2" />
    <path d="M16 10v6" />
  </svg>
);

// Puzzle Icon
export const Puzzle: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 21.4,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="256" height="256" fill="none" stroke="none" />
    <path
        d="M64,216a8,8,0,0,1-8-8V165.31a28,28,0,1,1,0-50.62V72a8,8,0,0,1,8-8h46.69a28,28,0,1,1,50.61,0H208a8,8,0,0,1,8,8v42.69a28,28,0,1,0,0,50.62V208a8,8,0,0,1-8,8Z"
        transform="translate(256, 0) scale(-1, 1)"
    />
  </svg>
);

// Circuitry Icon
export const Circuitry: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 21.4,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="256" height="256" fill="none" stroke="none" />
    <circle cx="168" cy="104" r="16" />
    <circle cx="88" cy="168" r="16" />
    <polyline points="152 216 152 160 88 96 88 40" />
    <line x1="88" y1="152" x2="88" y2="96" />
    <rect x="40" y="40" width="176" height="176" rx="8" />
    <polyline points="136 40 136 72 156.69 92.69" />
  </svg>
);

// GraduationCap Icon
export const GraduationCap: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 21.4,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="256" height="256" fill="none" stroke="none" />
    <polygon points="8 96 128 32 248 96 128 160 8 96" />
    <polyline points="128 96 184 125.87 184 240" />
    <path d="M216,113.07v53.22a8,8,0,0,1-2,5.31c-11.3,12.59-38.9,36.4-86,36.4s-74.68-23.81-86-36.4a8,8,0,0,1-2-5.31V113.07" />
  </svg>
);

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

// ShootingStar Icon
export const ShootingStar: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 21.4,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="256" height="256" fill="none" stroke="none" />
    <path d="M164,129.66l35.78,21.53a5.46,5.46,0,0,0,8.19-5.86l-9.73-40.19,31.84-26.88A5.38,5.38,0,0,0,227,68.78l-41.79-3.31-16.1-38.14a5.51,5.51,0,0,0-10.12,0l-16.1,38.14-41.79,3.31a5.38,5.38,0,0,0-3.13,9.48l31.84,26.88L120,145.33a5.46,5.46,0,0,0,8.19,5.86Z" />
    <line x1="82.45" y1="117.55" x2="24" y2="176" />
    <line x1="93.26" y1="178.74" x2="40" y2="232" />
    <line x1="166.28" y1="177.72" x2="112" y2="232" />
  </svg>
);

// Info Icon
export const Info: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 21.4,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="256" height="256" fill="none" stroke="none" />
    <circle cx="128" cy="128" r="96" />
    <path d="M120 120a8 8 0 0 1 8 8v40a8 8 0 0 0 8 8" />
    <circle cx="124" cy="84" r="12" />
  </svg>
);


// Link Icon
export const LinkIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 21.4,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="256" height="256" fill="none" stroke="none" />
    <path d="M141.38,64.68l11-11a46.62,46.62,0,0,1,65.94,0h0a46.62,46.62,0,0,1,0,65.94L193.94,144,183.6,154.34a46.63,46.63,0,0,1-66-.05h0A46.48,46.48,0,0,1,104,120.06" />
    <path d="M114.62,191.32l-11,11a46.63,46.63,0,0,1-66-.05h0a46.63,46.63,0,0,1,.06-65.89L72.4,101.66a46.62,46.62,0,0,1,65.94,0h0A46.45,46.45,0,0,1,152,135.94" />
  </svg>
);

// Medium Icon
export const Medium: React.FC<IconProps> = ({ size = 28, color = "currentColor", strokeWidth = 2, ...props }) => (
  <svg
    viewBox="0 0 640 640"
    width={size}
    height={size}
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    style={{ transition: "fill 0.3s ease" }}
    {...props}
  >
    <path d="M465.4 96C508.8 96 544 131.2 544 174.6L544 258.4C542.1 258.3 540.2 258.2 538.3 258.2L537.9 258.2C527.9 258.2 515.6 260.6 506.8 265C496.8 269.6 488.1 276.5 480.8 285.6C469 300.2 461.9 319.9 460.2 342C460.1 342.7 460.1 343.3 460 344C459.9 344.7 459.9 345.2 459.9 345.9C459.8 347.1 459.8 348.3 459.8 349.5C459.8 351.4 459.7 353.3 459.8 355.3C461 405.4 488 445.5 536.1 445.5C538.8 445.5 541.4 445.4 544 445.1L544 465.5C544 508.9 508.8 544.1 465.4 544.1L174.6 544C131.2 544 96 508.8 96 465.4L96 174.6C96 131.2 131.2 96 174.6 96L465.4 96zM178.3 202.9L178.6 203C191.8 206 198.4 210.4 198.4 226.4L198.4 413.6C198.4 429.6 191.7 434 178.5 437L178.2 437.1L178.2 439.9L231 439.9L231 437.1L230.7 437C217.5 434 210.8 429.6 210.8 413.6L210.8 237.3L296.9 439.8L301.8 439.8L390.4 231.6L390.4 418.2C389.3 430.8 382.6 434.7 370.7 437.4L370.4 437.5L370.4 440.2L462.3 440.2L462.3 437.5L462 437.4C450.1 434.7 443.3 430.8 442.1 418.2L442 226.4L442.1 226.4C442.1 210.4 448.8 206 462 203L462.3 202.9L462.3 200.2L390.1 200.2L323.1 357.6L256.1 200.2L178.3 200.2L178.3 202.9zM544 404.3C518.9 396.9 501 369.2 502.8 336.5L502.8 336.5L543.9 336.5L543.9 404.3zM537.6 268.7C539.9 268.7 542 269 544 269.6L544 327L503.8 327C505.3 293.4 517.4 269.1 537.6 268.7z"/>
  </svg>
);

// CornerRightUp Icon
export const CornerRightUp: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m10 9 5-5 5 5" />
    <path d="M4 20h7a4 4 0 0 0 4-4V4" />
  </svg>
);

export const IconClose = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const IconChevronDown = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// ThumbsUp Icon
export const ThumbsUp: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 21.4,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="256" height="256" fill="none" stroke="none" />
    <path d="M32,104H80V208H32a8,8,0,0,1-8-8V112A8,8,0,0,1,32,104Z" />
    <path d="M80,104l40-80a32,32,0,0,1,32,32V80h64a16,16,0,0,1,15.87,18l-12,96A16,16,0,0,1,204,208H80" />
  </svg>
);


export default {
  User,
  FolderKanban,
  Puzzle,
  Circuitry,
  GraduationCap,
  ShootingStar,
  Info,
  LinkIcon,
  Medium,
  CornerRightUp,
  IconClose,
  IconChevronDown,
  ThumbsUp
};
