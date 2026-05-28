import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import GrainOverlay from '@/components/GrainOverlay';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AZ — Photography',
    template: '%s — AZ Photography',
  },
  description: 'Cinematic photography by Aarnav. Projects, experimental work, black & white, and visual essays.',
  keywords: ['photography', 'cinematic', 'film', 'documentary', 'fine art', 'portfolio'],
  authors: [{ name: 'Aarnav' }],
  creator: 'Aarnav',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AZ Photography',
    title: 'AZ — Photography',
    description: 'Cinematic photography portfolio.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AZ — Photography',
    description: 'Cinematic photography portfolio.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#070707] text-[#eeeae3] antialiased">
        <SmoothScrollProvider>
          <GrainOverlay />
          <Navigation />
          <main className="relative z-10">{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
