import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ServiceWorker } from '@/components/ServiceWorker';
import { BRAND } from '@/lib/brand';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
// Headings use the same family in its heavier weights (the same as the Android app).
const head = Inter({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-head', display: 'swap' });

export const metadata: Metadata = {
  title: `${BRAND.name} · ${BRAND.tagline}`,
  description:
    'Restore photos privately on your device: face restoration, 4× HD upscaling, colorization, one-tap Auto fix, crop, AI backgrounds and batch processing.',
  applicationName: BRAND.name,
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a1020',
  colorScheme: 'dark light',
};

const THEME_SCRIPT = `try{var t=localStorage.getItem('mitakshi-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${sans.variable} ${head.variable}`} suppressHydrationWarning>
      <body>
        {/* Sets the saved light / dark choice before the first paint (dark is the default), so the page never flashes. */}
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
