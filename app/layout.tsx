'use client';
import type { ReactNode } from 'react';
import localFont from "next/font/local";
import "./globals.css";
import { I18nextProvider } from 'react-i18next';
import i18n from '../next-i18next.config.js'; // Import your i18n configuration

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <html lang={i18n.language}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </I18nextProvider>
  );
}