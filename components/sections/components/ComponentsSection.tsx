"use client";

import React, { useState, useRef, useEffect } from "react";
import { componentsMetadata } from "@/data/component-meta";
import InflectedCard from "@/components/InflectedCard";
import FallbackDemo from "@/components/FallbackDemo";
import useIsRTL from "@/hooks/useIsRTL";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import SectionText from "@/components/SectionText";
import LimitedWidthWrapper from "@/components/limited-width-wrapper";
import { CornerRightUp } from "@/components/Icons";

interface ComponentsSectionProps {
  metricEvent: (metric: string) => void;
  maxWidth: string;
  paddingDesktop: string;
  paddingMobile: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export default function ComponentsSection({
  metricEvent,
  maxWidth,
  paddingDesktop,
  paddingMobile,
  scrollContainerRef,
}: ComponentsSectionProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isRTL = useIsRTL();
  const sectionRef = useRef<HTMLElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const breakpoints = { twoCols: 912, threeCols: 1388 };

  useEffect(() => {
    const updateWidth = () => {
      if (sectionRef.current) setContainerWidth(sectionRef.current.clientWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  let columns = 1;
  if (containerWidth >= breakpoints.twoCols && containerWidth < breakpoints.threeCols) {
    columns = 2;
  } else if (containerWidth >= breakpoints.threeCols) {
    columns = 3;
  }

  const getComponentUrl = (id: string) => `https://namer-ui.vercel.app/components/${id}`;
  const handleImageError = (id: string) =>
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));

  const handleInflectedMetric = (
    id: string,
    type: string,
    part: "body" | "image" | "button",
    suffix = "from-inflected-card"
  ) => {
    if (part === "body") return;
    metricEvent(`${id}-${part}-${type}-${suffix}`);
  };

  const renderCard = (meta: (typeof componentsMetadata)[number]) => {
    const slug = meta.id;
    const componentUrl = getComponentUrl(slug);
    const isImagePreview = !!meta.isPreviewImage;
    const imagePath = isImagePreview ? `/previews/${slug}.webp` : undefined;
    const imageFailed = imagePath && imageErrorMap[slug];
    const DemoComp = meta.demo;
    const hasDemo = typeof DemoComp === "function";

    let mediaNode: React.ReactNode;
    if (isImagePreview && !imageFailed) {
      mediaNode = (
        <img
          src={imagePath}
          alt={t(meta.title)}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            borderRadius: 16,
          }}
          onError={() => handleImageError(slug)}
        />
      );
    } else if (hasDemo) {
      mediaNode = (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DemoComp />
        </div>
      );
    } else {
      mediaNode = <FallbackDemo />;
    }

    return (
      <InflectedCard
        key={slug}
        id={slug}
        title={t(meta.title)}
        description={t(meta.description)}
        fontSizes={{ title: "22px", description: "17px" }}
        margins={{ title: "0 0 0.24em 0", description: "0 0 0.3em 0" }}
        maxWidth="100%"
        mirrored={isRTL}
        buttonIcon={CornerRightUp}
        titleAlignment="left"
        descriptionAlignment="left"
        buttonIconColor="var(--foreground)"
        buttonIconHoverColor="var(--background)"
        buttonBackgroundColor="var(--accent)"
        buttonBackgroundHoverColor="var(--foreground)"
        imageHoverZoom={1.2}
        titleColor="var(--foreground)"
        descriptionColor="var(--middle-foreground)"
        titleLineClamp={1}
        descriptionLineClamp={2}
        url={componentUrl}
        mediaNode={mediaNode}
        onClick={({ part, type }, id) => handleInflectedMetric(id, type, part)}
      />
    );
  };

  const gridGap = isMobile ? 16 : 24;

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden flex flex-col transition duration-300 ease-in-out ${
        isMobile ? "justify-start min-h-0 py-14" : "py-20"
      }`}
    >
      <LimitedWidthWrapper
        expandToFull={false}
        maxWidth={maxWidth}
        paddingDesktop={paddingDesktop}
        paddingMobile={paddingMobile}
      >
        <SectionText
          id="components-section-text"
          title={t("components_block")}
          description={t("components_section_text")}
          scrollContainerRef={scrollContainerRef}
          isRTL={isRTL}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gridGap}px`,
            width: "100%",
          }}
        >
          {componentsMetadata.map((meta) => renderCard(meta))}
        </div>
      </LimitedWidthWrapper>
    </section>
  );
}
