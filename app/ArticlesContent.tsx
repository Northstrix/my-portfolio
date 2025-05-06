"use client";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import StructuredBlock from '@/components/StructuredBlock/StructuredBlock';
import { addRTLProps, headlineProps, textProps, contentProps, maxSectionWidth } from './LandingPage.styles';
import BlogPostHeader from '@/components/BlogPostHeader/BlogPostHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedium } from '@fortawesome/free-brands-svg-icons';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

// Requirement for a custom Nuance "svg" icon
interface ArticlesContentProps {
  isRTL: boolean;
  onArticleClick?: (link: string) => void;
}

interface NuanceIconProps {
  size?: string;
  backgroundColor?: string;
}

const NuanceIconContainer = styled.div<{ backgroundColor?: string; size?: string }>`
  background-color: ${props => props.backgroundColor || 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '1em'};
  height: ${props => props.size || '1em'};
  border-radius: 50%;
  overflow: hidden;
  &:hover {
    outline: none;
  }
`;

const NuanceIconImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NuanceIcon: React.FC<NuanceIconProps> = ({ size, backgroundColor }) => {
  return (
    <NuanceIconContainer backgroundColor={backgroundColor} size={size}>
      <NuanceIconImage src="https://nuance.xyz/assets/images/loaders/nuance-loader.gif" alt="Nuance Logo" />
    </NuanceIconContainer>
  );
};

const TEXT_SIZES = {
  rtl: {
    desktop: {
      minWidth: 1100,
      maxWidth: 1492,
      minMetaFontSize: 16,
      maxMetaFontSize: 18,
      minAuthorImageSize: 34,
      maxAuthorImageSize: 46,
      minSocialIconSize: 34,
      maxSocialIconSize: 46,
      minTitleSize: 20,
      maxTitleSize: 41,
      minTagTextSize: 16,
      maxTagTextSize: 20,
    },
    mobile: {
      minWidth: 320,
      maxWidth: 1100,
      minMetaFontSize: 10.4,
      maxMetaFontSize: 17,
      minAuthorImageSize: 32,
      maxAuthorImageSize: 50,
      minSocialIconSize: 32,
      maxSocialIconSize: 50,
      minTitleSize: 22,
      maxTitleSize: 40,
      minTagTextSize: 11,
      maxTagTextSize: 20,
    },
  },
  ltr: {
    desktop: {
      minWidth: 1100,
      maxWidth: 1492,
      minMetaFontSize: 16,
      maxMetaFontSize: 18,
      minAuthorImageSize: 34,
      maxAuthorImageSize: 46,
      minSocialIconSize: 34,
      maxSocialIconSize: 46,
      minTitleSize: 20,
      maxTitleSize: 40,
      minTagTextSize: 16,
      maxTagTextSize: 20,
    },
    mobile: {
      minWidth: 320,
      maxWidth: 1100,
      minMetaFontSize: 12,
      maxMetaFontSize: 16,
      minAuthorImageSize: 32,
      maxAuthorImageSize: 50,
      minSocialIconSize: 32,
      maxSocialIconSize: 50,
      minTitleSize: 22,
      maxTitleSize: 32,
      minTagTextSize: 11,
      maxTagTextSize: 18,
    },
  },
};

const ArticlesContent: React.FC<ArticlesContentProps> = ({ isRTL, onArticleClick }) => {
  const { t } = useTranslation();
  const [metaFontSizeFirst, setMetaFontSizeFirst] = useState(TEXT_SIZES[isRTL ? 'rtl' : 'ltr'].desktop.maxMetaFontSize);
  const [authorImageSizeFirst, setAuthorImageSizeFirst] = useState(TEXT_SIZES[isRTL ? 'rtl' : 'ltr'].desktop.maxAuthorImageSize);
  const [socialIconSizeFirst, setSocialIconSizeFirst] = useState(TEXT_SIZES[isRTL ? 'rtl' : 'ltr'].desktop.maxSocialIconSize);
  const [titleSizeFirst, setTitleSizeFirst] = useState(TEXT_SIZES[isRTL ? 'rtl' : 'ltr'].desktop.maxTitleSize);
  const [tagTextSizeFirst, setTagTextSizeFirst] = useState(TEXT_SIZES[isRTL ? 'rtl' : 'ltr'].desktop.maxTagTextSize);
  const [metaFontSizeSecond, setMetaFontSizeSecond] = useState(TEXT_SIZES[isRTL ? 'rtl' : 'ltr'].desktop.maxMetaFontSize);
  const [authorImageSizeSecond, setAuthorImageSizeSecond] = useState(TEXT_SIZES[isRTL ? 'rtl' : 'ltr'].desktop.maxAuthorImageSize);
  const [socialIconSizeSecond, setSocialIconSizeSecond] = useState(TEXT_SIZES[isRTL ? 'rtl' : 'ltr'].desktop.maxSocialIconSize);
  const [titleSizeSecond, setTitleSizeSecond] = useState(TEXT_SIZES[isRTL ? 'rtl' : 'ltr'].desktop.maxTitleSize);
  const [tagTextSizeSecond, setTagTextSizeSecond] = useState(TEXT_SIZES[isRTL ? 'rtl' : 'ltr'].desktop.maxTagTextSize);
  const componentRef = useRef<HTMLDivElement>(null);
  const blogPostsRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    if (blogPostsRef.current) {
      const width = blogPostsRef.current.offsetWidth;
      const desktopBreakpoint = 1100;
      const isMobile = width < desktopBreakpoint;
      const sizes = isMobile ? TEXT_SIZES[isRTL ? 'rtl' : 'ltr'].mobile : TEXT_SIZES[isRTL ? 'rtl' : 'ltr'].desktop;
      const { minWidth, maxWidth, minMetaFontSize, maxMetaFontSize, minAuthorImageSize, maxAuthorImageSize, minSocialIconSize, maxSocialIconSize, minTitleSize, maxTitleSize, minTagTextSize, maxTagTextSize } = sizes;
      const calculatedMetaFontSize = ((maxMetaFontSize - minMetaFontSize) / (maxWidth - minWidth)) * (width - minWidth) + minMetaFontSize;
      const calculatedAuthorImageSize = ((maxAuthorImageSize - minAuthorImageSize) / (maxWidth - minWidth)) * (width - minWidth) + minAuthorImageSize;
      const calculatedSocialIconSize = ((maxSocialIconSize - minSocialIconSize) / (maxWidth - minWidth)) * (width - minWidth) + minSocialIconSize;
      const calculatedTitleSize = ((maxTitleSize - minTitleSize) / (maxWidth - minWidth)) * (width - minWidth) + minTitleSize;
      const calculatedTagTextSize = ((maxTagTextSize - minTagTextSize) / (maxWidth - minWidth)) * (width - minWidth) + minTagTextSize;

      setMetaFontSizeFirst(Math.min(calculatedMetaFontSize, maxMetaFontSize));
      setAuthorImageSizeFirst(Math.min(calculatedAuthorImageSize, maxAuthorImageSize));
      setSocialIconSizeFirst(Math.min(calculatedSocialIconSize, maxSocialIconSize));
      setTitleSizeFirst(Math.min(calculatedTitleSize, maxTitleSize));
      setTagTextSizeFirst(Math.min(calculatedTagTextSize, maxTagTextSize));

      setMetaFontSizeSecond(Math.min(calculatedMetaFontSize, maxMetaFontSize));
      setAuthorImageSizeSecond(Math.min(calculatedAuthorImageSize, maxAuthorImageSize));
      setSocialIconSizeSecond(Math.min(calculatedSocialIconSize, maxSocialIconSize));
      setTitleSizeSecond(Math.min(calculatedTitleSize, maxTitleSize));
      setTagTextSizeSecond(Math.min(calculatedTagTextSize, maxTagTextSize));
    }
  }, [isRTL]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    if (blogPostsRef.current) {
      resizeObserver.observe(blogPostsRef.current);
    }
    handleResize(); // Initial check
    return () => {
      if (blogPostsRef.current) {
        resizeObserver.unobserve(blogPostsRef.current);
      }
    };
  }, [handleResize]);

  return (
    <div ref={componentRef} style={{ display: 'flex', flexDirection: 'column', gap: '0px', justifyContent: 'flex-start', alignItems: 'stretch', width: '100%', maxWidth: maxSectionWidth }}>
      <StructuredBlock {...addRTLProps(headlineProps, isRTL)}>
        {t("articles-block")}
      </StructuredBlock>
      <StructuredBlock {...addRTLProps(textProps, isRTL)}>
        {t("articles-section-text")}
      </StructuredBlock>
      <StructuredBlock {...addRTLProps(contentProps, isRTL)}>
        <div ref={blogPostsRef}>
          <BlogPostHeader
            featuredImageSrc="https://github.com/Northstrix/In-Browser-File-Encrypter/raw/main/V1.0/Media/Main.png?raw=true"
            featuredImageWidth="47%"
            tagText={isRTL ? "פיתוח ווב" : "Web Development"}
            tagTextSize={`${tagTextSizeFirst}px`}
            titleText={isRTL ? "איך בניתי אפליקציית ווב ללא ניסיון בג'אווהסקריפט" : "How I Built a Web App with No JavaScript Experience"}
            authorImageSrc="/logo.webp"
            authorImageSize={`${authorImageSizeFirst}px`}
            authorName={t('my-name')}
            authorLink="https://github.com/Northstrix/"
            date={isRTL ? "8 באוגוסט 2024" : "Aug 8, 2024"}
            readTime={isRTL ? "17 דקות קריאה" : "17 min read"}
            socialIcons={[
              { name: 'Medium', icon: <FontAwesomeIcon icon={faMedium} size={`${socialIconSizeFirst}px` as any} />, link: 'https://medium.com/system-weakness/how-i-built-a-web-app-with-no-javascript-experience-d8bf3ed14f6f', backgroundColor: 'var(--foreground)', foregroundColor: 'var(--background)' },
              { name: 'Nuance', icon: <NuanceIcon backgroundColor="#fff" size={`${socialIconSizeFirst}px`} />, link: 'https://nuance.xyz/northstrix/10780-434go-diaaa-aaaaf-qakwq-cai/how-i-built-a-web-app-with-no-javascript-experience', backgroundColor: '#000', foregroundColor: '#fff' },
            ]}
            categoryForeground="var(--second-theme-color)"
            textColor="var(--foreground)"
            titleSize={`${titleSizeFirst}px`}
            spacing="20px"
            headerMaxWidth="100%"
            desktopBreakpoint={1100}
            isRTL={isRTL}
            metaFontSize={`${metaFontSizeFirst}px`}
            socialIconSize={`${socialIconSizeFirst}px`}
            onSocialIconClick={onArticleClick}
          />
          <div style={{ height: '32px' }}></div>
          <BlogPostHeader
            featuredImageSrc="https://raw.githubusercontent.com/Northstrix/Lantern/refs/heads/main/V1.1/Pictures/IMG_0645.jpg"
            featuredImageWidth="47%"
            tagText={isRTL ? "בקרת תאורה" : "Lightning Control"}
            tagTextSize={`${tagTextSizeSecond}px`}
            titleText={isRTL ? "בקר פסי LED RGB כתובתיים" : "DIY Addressable RGB LED Strip Controller"}
            authorImageSrc="/logo.webp"
            authorImageSize={`${authorImageSizeSecond}px`}
            authorName={t('my-name')}
            authorLink="https://github.com/Northstrix/"
            date={isRTL ? "17 ביוני 2024" : "Jun 17, 2024"}
            readTime={isRTL ? "10 דקות קריאה" : "10 min read"}
            socialIcons={[
              { name: 'Medium', icon: <FontAwesomeIcon icon={faMedium} size={`${socialIconSizeSecond}px` as any} />, link: 'https://medium.com/@Northstrix/diy-addressable-rgb-led-strip-controller-7ec61abfaf5e', backgroundColor: 'var(--foreground)', foregroundColor: 'var(--background)' },
              { name: 'Instructables', icon: <FontAwesomeIcon icon={faTools} size={`${socialIconSizeSecond}px` as any} />, link: 'https://www.instructables.com/DIY-Addressable-RGB-LED-Strip-Controller/', backgroundColor: '#fc6800', foregroundColor: '#fff' },
            ]}
            categoryForeground="var(--first-theme-color)"
            textColor="var(--foreground)"
            titleSize={`${titleSizeSecond}px`}
            spacing="20px"
            maxImageHeight="520px"
            imageShadowColor="#F78702"
            desktopBreakpoint={1100}
            isRTL={isRTL}
            metaFontSize={`${metaFontSizeSecond}px`}
            socialIconSize={`${socialIconSizeSecond}px`}
            onSocialIconClick={onArticleClick}
          />
        </div>
      </StructuredBlock>
    </div>
  );
};

export default ArticlesContent;
