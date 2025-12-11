"use client";

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import LogoWithLegacyBackdrop from "@/components/NavbarProfileImageWithLegacyBackdrop";
import Icons from "@/components/Icons";

const isRTLCheck = (text: string): boolean =>
  /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text);

export interface SocialIcon {
  name: string;
  icon: React.ReactNode;
  link: string;
  backgroundColor: string;
  foregroundColor: string;
  hoverBackgroundColor?: string;
  hoverForegroundColor?: string;
  id: string;
}

export interface BlogPostHeaderProps {
  featuredImageSrc: string;
  featuredImageWidth: string;
  tagText: string;
  titleText: string;
  authorImageSrc: string;
  authorName: string;
  authorLink: string;
  date: string;
  readTime: string;
  socialIcons: SocialIcon[];
  categoryForeground?: string;
  textColor?: string;
  titleSize?: string;
  tagTextSize?: string;
  imageBorderRadius?: string;
  headerMaxWidth?: string;
  spacing?: string;
  maxImageHeight?: string;
  desktopBreakpoint?: number;
  imageShadowColor?: string;
  isRTL?: boolean;
  onHover?: () => void;
  onClick?: () => void;
  categoryClicked?: (category: string) => void;
  metaFontSize?: string;
  authorImageSize?: string;
  socialIconSize?: string;
  onSocialIconClick?: (metric: string) => void;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({
  featuredImageSrc,
  featuredImageWidth,
  tagText,
  titleText,
  authorImageSrc,
  authorName,
  authorLink,
  date,
  readTime,
  socialIcons,
  categoryForeground = "#404",
  textColor = "#334",
  titleSize = "3em",
  tagTextSize = "1em",
  imageBorderRadius = "var(--border-radius)",
  headerMaxWidth = "1536px",
  spacing = "20px",
  maxImageHeight = "400px",
  desktopBreakpoint = 1200,
  imageShadowColor = "#404",
  isRTL = false,
  onHover,
  onClick,
  categoryClicked,
  metaFontSize = "16px",
  authorImageSize = "40px",
  socialIconSize = "44px", // physical button size, icon itself always fixed to 28px
  onSocialIconClick,
}) => {
  const { t } = useTranslation();
  const [isMobileView, setIsMobileView] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setIsMobileView(containerRef.current.offsetWidth < desktopBreakpoint);
      }
    };
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    handleResize();
    return () => {
      if (containerRef.current) resizeObserver.unobserve(containerRef.current);
    };
  }, [desktopBreakpoint]);

  const handleIconMetric = (
    icon: SocialIcon,
    type: "clicked" | "wheel-clicked" | "dragged"
  ) => {
    if (onSocialIconClick) {
      onSocialIconClick(`${icon.id}-${type}-from-article-card`);
    }
  };

  // Nuance fallback ("N" if image fails)
  const handleNuanceError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    const wrapper = img.parentElement;
    if (wrapper) {
      wrapper.innerHTML = "N";
      wrapper.style.fontSize = "1.25em";
      wrapper.style.fontWeight = "bold";
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.justifyContent = "center";
      wrapper.style.color = "var(--foreground)";
    }
  };

  const renderIcon = (icon: SocialIcon) => {
    if (icon.id === "nuance") return icon.icon; // Original functioning icon 

    const DynamicIcon =
      Icons[icon.name as keyof typeof Icons] || (() => <>{icon.icon}</>);
    return <DynamicIcon size={28} color="currentColor" />;
  };

  // Mobile structure
  const contentOrder = isMobileView ? (
    <Info $isRTL={isRTL} $isMobileView={true}>
      <Title fontSize={titleSize} $isRTL={isRTLCheck(titleText)}>
        {titleText}
      </Title>
      <Tag
        onClick={() => categoryClicked?.(tagText)}
        $isRTL={isRTLCheck(tagText)}
        categoryForeground={categoryForeground}
        fontSize={tagTextSize}
      >
        {tagText}
      </Tag>
      <ImageColumn $isMobileView>
        <div
          style={{
            borderRadius: "var(--border-radius)",
            backgroundColor: "var(--background-adjacent-color)",
            border: "1px solid var(--border-color)",
            overflow: "hidden",
            width: "100%",
            maxHeight: maxImageHeight,
          }}
        >
          <FeaturedImage
            src={featuredImageSrc}
            alt={titleText}
            borderRadius={imageBorderRadius}
            width={featuredImageWidth}
            maxHeight={maxImageHeight}
            shadowColor={imageShadowColor}
            draggable={false}
          />
        </div>
      </ImageColumn>

      <Meta $isMobileView>
        <span style={{ fontSize: metaFontSize, color: "var(--sub-foreground)" }}>
          {date}
        </span>
        <Separator>|</Separator>
        <span style={{ fontSize: metaFontSize, color: "var(--sub-foreground)" }}>
          {readTime}
        </span>
      </Meta>

      <Social $isMobileView $isRTL={isRTL} $isCentered>
        {socialIcons.map((icon) => (
          <SocialButton
            key={icon.name}
            href={icon.link}
            target="_blank"
            rel="noopener noreferrer"
            backgroundColor={
              hoveredIcon === icon.name && icon.hoverBackgroundColor
                ? icon.hoverBackgroundColor
                : icon.backgroundColor
            }
            foregroundColor={
              hoveredIcon === icon.name &&
              (icon.id === "medium" || icon.id === "instructables")
                ? "var(--foreground)"
                : hoveredIcon === icon.name && icon.hoverForegroundColor
                ? icon.hoverForegroundColor
                : icon.foregroundColor
            }
            $isRTL={isRTL}
            $isMobileView={isMobileView}
            size={socialIconSize}
            iconSize="28px"
            onMouseEnter={() => setHoveredIcon(icon.name)}
            onMouseLeave={() => setHoveredIcon(null)}
            onClick={() => handleIconMetric(icon, "clicked")}
            onAuxClick={(e) => {
              if (e.button === 1) handleIconMetric(icon, "wheel-clicked");
            }}
            onDragStart={() => handleIconMetric(icon, "dragged")}
            data-id={icon.id}
          >
            {icon.id === "nuance" ? (
              <div>
                {React.isValidElement(icon.icon) &&
                  React.cloneElement(icon.icon as any, {
                    onError: handleNuanceError,
                  })}
              </div>
            ) : (
              renderIcon(icon)
            )}
          </SocialButton>
        ))}
      </Social>
    </Info>
  ) : (
    <Info $isRTL={isRTL} $isMobileView={false}>
      <Tag
        onClick={() => categoryClicked?.(tagText)}
        $isRTL={isRTLCheck(tagText)}
        categoryForeground={categoryForeground}
        fontSize={tagTextSize}
      >
        {tagText}
      </Tag>
      <Title fontSize={titleSize} $isRTL={isRTLCheck(titleText)}>
        {titleText}
      </Title>
      <Meta $isMobileView={false}>
        <Author
          $isRTL={isRTLCheck(authorName)}
          href={authorLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: metaFontSize, color: "var(--sub-foreground)" }}
        >
          {isRTL ? (
            <>
              {authorName}
              <LogoWithLegacyBackdrop
                size={parseInt(authorImageSize, 10) || 40}
              />
            </>
          ) : (
            <>
              <LogoWithLegacyBackdrop
                size={parseInt(authorImageSize, 10) || 40}
              />
              {authorName}
            </>
          )}
        </Author>
        <Separator>|</Separator>
        <span style={{ fontSize: metaFontSize, color: "var(--sub-foreground)" }}>
          {date}
        </span>
        <Separator>|</Separator>
        <span style={{ fontSize: metaFontSize, color: "var(--sub-foreground)" }}>
          {readTime}
        </span>
      </Meta>

      <Social $isMobileView={false} $isRTL={isRTL} $isCentered={false}>
        {socialIcons.map((icon) => (
          <SocialButton
            key={icon.name}
            href={icon.link}
            target="_blank"
            rel="noopener noreferrer"
            backgroundColor={
              hoveredIcon === icon.name && icon.hoverBackgroundColor
                ? icon.hoverBackgroundColor
                : icon.backgroundColor
            }
            foregroundColor={
              hoveredIcon === icon.name &&
              (icon.id === "medium" || icon.id === "instructables")
                ? "var(--foreground)"
                : hoveredIcon === icon.name && icon.hoverForegroundColor
                ? icon.hoverForegroundColor
                : icon.foregroundColor
            }
            $isRTL={isRTL}
            $isMobileView={isMobileView}
            size={socialIconSize}
            onMouseEnter={() => setHoveredIcon(icon.name)}
            onMouseLeave={() => setHoveredIcon(null)}
            onClick={() => handleIconMetric(icon, "clicked")}
            onAuxClick={(e) => {
              if (e.button === 1) handleIconMetric(icon, "wheel-clicked");
            }}
            onDragStart={() => handleIconMetric(icon, "dragged")}
            data-id={icon.id}
          >
            {icon.id === "nuance" ? (
              <div>
                {React.isValidElement(icon.icon) &&
                  React.cloneElement(icon.icon as any, {
                    onError: handleNuanceError,
                  })}
              </div>
            ) : (
              renderIcon(icon)
            )}
          </SocialButton>
        ))}
      </Social>
    </Info>
  );

  return (
    <HeaderContainer
      ref={containerRef}
      onMouseEnter={onHover}
      onClick={onClick}
      textColor={textColor}
      maxWidth={headerMaxWidth}
      $isMobileView={isMobileView}
      $isRTL={isRTL}
    >
      <Content spacing={spacing} $isMobileView={isMobileView} $isRTL={isRTL}>
        {!isMobileView && (
          <ImageColumn $isMobileView>
            <FeaturedImage
              src={featuredImageSrc}
              alt={titleText}
              borderRadius={imageBorderRadius}
              width={featuredImageWidth}
              maxHeight={maxImageHeight}
              shadowColor={imageShadowColor}
              draggable={false}
            />
          </ImageColumn>
        )}
        {contentOrder}
      </Content>
    </HeaderContainer>
  );
};

// styled-components

const HeaderContainer = styled.div<{
  textColor: string;
  maxWidth: string;
  $isMobileView: boolean;
  $isRTL: boolean;
}>`
  color: ${(props) => props.textColor};
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: ${(props) => props.maxWidth};
  margin: auto;
  direction: ${(props) => (props.$isRTL ? "rtl" : "ltr")};
`;

const Content = styled.div<{ spacing: string; $isMobileView: boolean; $isRTL: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$isMobileView ? "column" : "row")};
  align-items: ${(props) => (props.$isMobileView ? "stretch" : "center")};
  justify-content: center;
  gap: ${(props) => props.spacing};
  width: 100%;
`;

const ImageColumn = styled.div<{ $isMobileView: boolean }>`
  flex: 1;
  max-width: ${(props) => (props.$isMobileView ? "100%" : "50%")};
`;

const FeaturedImage = styled.img<{
  borderRadius: string;
  width: string;
  maxHeight: string;
  shadowColor?: string;
}>`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: ${(props) => props.borderRadius};
  max-height: ${(props) => props.maxHeight};
  box-shadow: 0 4px 8px ${(props) => props.shadowColor || "rgba(0,0,0,0.1)"};
  display: block;
`;

const Info = styled.div<{ $isRTL: boolean; $isMobileView: boolean }>`
  flex: 1;
  text-align: ${(props) =>
    props.$isMobileView ? "center" : props.$isRTL ? "right" : "left"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75em;
`;

const Tag = styled.a<{ $isRTL: boolean; categoryForeground?: string; fontSize: string }>`
  cursor: pointer;
  color: ${(props) => props.categoryForeground || "#404"};
  text-decoration: none;
  font-weight: 600;
  font-size: ${(props) => props.fontSize};
`;

const Title = styled.h1<{ fontSize: string; $isRTL: boolean }>`
  font-size: ${(props) => props.fontSize};
  font-weight: 700;
`;

const Meta = styled.div<{ $isMobileView: boolean }>`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: ${(props) =>
    props.$isMobileView ? "center" : "flex-start"};
`;

const Author = styled.a<{ $isRTL: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
`;

const Separator = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Social = styled.div<{ $isRTL: boolean; $isMobileView: boolean; $isCentered: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$isRTL ? "row-reverse" : "row")};
  margin: 1em 0;
  gap: 0.875em;
  justify-content: ${(props) =>
    props.$isCentered ? "center" : props.$isRTL ? "flex-end" : "flex-start"};
  flex-wrap: wrap;
`;

const SocialButton = styled.a<{
  backgroundColor: string;
  foregroundColor: string;
  $isRTL: boolean;
  $isMobileView: boolean;
  size: string;
  iconSize: string;
}>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  background: ${(props) => props.backgroundColor};
  color: ${(props) => props.foregroundColor};
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease, color 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.backgroundColor};
  }

  svg,
  div {
    fill: currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default BlogPostHeader;
