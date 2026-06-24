"use client";
import React from 'react';
import HalomotButton from "@/components/HalomotButton";
import { GithubIcon } from "./GitHubIcon";
import useIsRTL from "@/hooks/useIsRTL";
import useMobileButtonHeight from "@/hooks/useMobileButtonHeight";

interface FooterBadgeItem {
  id: string;
  link: string;
  image: string;
  subText?: string;
  topText?: string;
  isMobile?: boolean;
  isRTL?: boolean;
  suffix?: string;
}

export default function FooterBadgesGroup({
  badges,
  isRTL,
  metricEvent,
}: {
  badges: FooterBadgeItem[];
  isRTL?: boolean;
  metricEvent: (metric: string) => void;
}) {
  const isRightToLeft = useIsRTL();
  const mobileButtonHeight = useMobileButtonHeight();
  const buttonHeight = mobileButtonHeight ? "2.75rem" : "2.875rem";

  const handleInteraction = async (
    id: string,
    eventType: string,
    suffix = "from-footer-badge"
  ): Promise<void> => {
    await metricEvent?.(`${id}-${eventType}-${suffix}`);
  };

  const githubGradient = isRightToLeft
    ? "linear-gradient(225deg, #802EE9, #2E68E8)"
    : "linear-gradient(135deg, #802EE9, #2E68E8)";

  return (
    <div
      className="flex flex-col items-center"
      style={{ textAlign: isRTL ? "right" : "left" }}
    >
      <div className="inline-flex flex-col items-stretch gap-4 md:gap-6 min-w-max w-full">
        {/* GitHub Button */}
        <div className="w-full">
          <HalomotButton
            text="GitHub"
            fillWidth
            buttonHeight={buttonHeight}
            gradient={githubGradient}
            backgroundColor="var(--footer-background)"
            icon={<GithubIcon />}
            href="https://github.com/Northstrix/my-portfolio"
            onClick={() => handleInteraction("github-button", "clicked")}
            onAuxClick={(e) => {
              if (e.button === 1)
                handleInteraction("github-button", "wheel-clicked");
            }}
            onDragStart={() => handleInteraction("github-button", "dragged")}
          />
        </div>

        {/* Standard Badges */}
        {badges.map((b) => (
          <a
            key={b.id}
            href={b.link}
            target="_blank"
            rel="noopener noreferrer"
            dir={isRTL ? "rtl" : "ltr"}
            onClick={() => handleInteraction(b.id, "clicked", b.suffix)}
            onAuxClick={(e) => {
              if (e.button === 1)
                handleInteraction(b.id, "wheel-clicked", b.suffix);
            }}
            onDragStart={() => handleInteraction(b.id, "dragged", b.suffix)}
            onMouseEnter={() => handleInteraction(b.id, "hovered", b.suffix)}
            className={`badge-card flex flex-col justify-between rounded-[var(--border-radius)] select-none cursor-pointer border border-[var(--border-color)] bg-[var(--footer-background)] hover:bg-[var(--hovered-footer-badge-background)] hover:border-[var(--hovered-footer-badge-border-color)] transition-all duration-300 ease-in-out px-6 pt-4 pb-6 w-full min-h-[${
              mobileButtonHeight ? "2.75rem" : "2.875rem"
            }]`}
          >
            <span className="text-[var(--sub-foreground)] text-[12px] mb-2 select-none">
              {b.subText}
            </span>
            <div
              className="flex items-center gap-3"
              style={{
                justifyContent: isRTL ? "flex-end" : "flex-start",
              }}
            >
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  minWidth: '32px',
                  minHeight: '32px',
                  boxSizing: 'border-box',
                  background: b.id === 'namer-ui-badge' ? 'linear-gradient(135deg, #4776cb, #a19fe5, #6cc606)' : b.id === 'merucav-badge' ? '#fafafa' : 'transparent',
                  borderRadius: 'var(--border-radius)',
                  padding: '0px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={b.image}
                  alt={b.topText}
                  width={32}
                  height={32}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  draggable={false}
                />
              </span>

              {/* Flip Animation Text Wrapper */}
              <span className="flip-wrapper">
                <span>
                  <em className="flip-text">
                    <span className="font-bold text-base text-[var(--foreground)] select-none whitespace-nowrap">
                      {b.topText}
                    </span>
                  </em>
                </span>
                <span>
                  <em className="flip-text">
                    <span className="font-bold text-base text-[var(--foreground)] select-none whitespace-nowrap">
                      {b.topText}
                    </span>
                  </em>
                </span>
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Styled JSX scoped flip animations */}
      <style jsx>{`
        .flip-wrapper {
          position: relative;
          display: block;
          perspective: 108px;
        }
        .flip-wrapper span {
          display: block;
        }
        .flip-wrapper span:nth-of-type(2) {
          position: absolute;
          top: 0;
          left: 0;
        }
        .flip-text {
          font-style: normal;
          display: inline-block;
          font-size: inherit;
          font-weight: inherit;
          line-height: inherit;
          will-change: transform, opacity;
          transition: transform 0.55s cubic-bezier(0.645, 0.045, 0.355, 1),
            opacity 0.35s linear 0.2s;
        }
        .flip-wrapper span:nth-of-type(1) .flip-text {
          transform-origin: top;
          opacity: 1;
          transform: rotateX(0deg);
        }
        .flip-wrapper span:nth-of-type(2) .flip-text {
          opacity: 0;
          transform: rotateX(-90deg) scaleX(0.9) translate3d(0, 10px, 0);
          transform-origin: bottom;
        }
        .badge-card:hover .flip-wrapper span:nth-of-type(1) .flip-text {
          opacity: 0;
          transform: rotateX(90deg) scaleX(0.9) translate3d(0, -10px, 0);
        }
        .badge-card:hover .flip-wrapper span:nth-of-type(2) .flip-text {
          opacity: 1;
          transform: rotateX(0deg) scaleX(1) translateZ(0);
          transition: transform 0.75s cubic-bezier(0.645, 0.045, 0.355, 1),
            opacity 0.35s linear 0.3s;
        }
      `}</style>
    </div>
  );
}