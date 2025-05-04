import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maxim Bortnikov',
  description: 'Cybersecurity-oriented web developer with embedded systems expertise.',
  openGraph: {
    images: [
      {
        url: '/logo.webp', // Place this image in /public or /app
        width: 757,
        height: 757,
        alt: 'Maxim Bortnikov',
      },
    ],
  },
};
