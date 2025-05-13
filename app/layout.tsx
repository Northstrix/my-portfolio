import type { Metadata } from "next";
// Remove these imports:
// import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import "./globals.css";

// Delete all font constant declarations:
// const geistSans = Geist({...});
// const geistMono = Geist_Mono({...});
// const openSans = Open_Sans({...});

export const metadata: Metadata = {
  title: "Maxim Bortnikov",
  description: "Cybersecurity-oriented web developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.webp" type="image/webp" sizes="any" />
      </head>
      <body className="bg-[var(--background)] antialiased">{children}</body>
    </html>
  );
}
