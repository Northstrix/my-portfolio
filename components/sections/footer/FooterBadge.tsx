"use client";
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
            className={`flex flex-col justify-between rounded-[var(--border-radius)] select-none cursor-pointer border border-[var(--border-color)] bg-[var(--footer-background)] hover:bg-[var(--hovered-footer-badge-background)] hover:border-[var(--hovered-footer-badge-border-color)] transition-all duration-300 ease-in-out px-6 pt-4 pb-6 w-full min-h-[${
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
              <img
                src={b.image}
                alt={b.topText}
                width={32}
                height={32}
                style={{ objectFit: "contain", display: "inline-block" }}
                draggable={false}
              />
              <span className="font-bold text-base text-[var(--foreground)] select-none whitespace-nowrap">
                {b.topText}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
