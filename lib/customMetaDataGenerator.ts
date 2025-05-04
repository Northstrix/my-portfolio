// ./lib/customMetaDataGenerator.ts

import { Metadata } from "next";

interface PageSEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogType?:
    | "website"
    | "article"
    | "profile"
    | "book"
    | "music.song"
    | "music.album"
    | "music.playlist"
    | "music.radio_station"
    | "video.movie"
    | "video.episode"
    | "video.tv_show"
    | "video.other";
  ogImage?: string;
  twitterCard?: "summary_large_image" | "summary" | "player" | "app";
  keywords?: string[];
}

export function customMetaDataGenerator({
  title = "Maxim Bortnikov",
  description = "Cybersecurity-oriented web developer with embedded systems expertise.",
  canonicalUrl = "https://maxim-bortnikov.netlify.app/",
  ogType = "website",
  keywords = [
    "Maxim",
    "Portfolio",
    "Cybersecurity",
    "Web Developer",
    "Embedded Systems",
    "Python",
    "Automation",
    "IoT",
    "Security",
    "Full Stack",
    "Software Engineer",
    "Projects",
    "Technical Blog",
    "Personal Website"
  ],
  ogImage = "/logo.webp", // Replace with your actual image URL
  twitterCard = "summary_large_image",
}: PageSEOProps): Metadata {
  const siteTitle = "Maxim Portfolio";
  const fullTitle = `${title} | ${siteTitle}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title: fullTitle,
      description,
      type: ogType,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [{ url: ogImage }],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
