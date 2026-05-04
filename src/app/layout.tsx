import type { Metadata } from 'next';
import { Suspense } from 'react';
import ThemeRegistry from '@/components/ThemeRegistry';
import AppBar from '@/components/AppBar';
import AnalyticsAndAds from '@/components/AnalyticsAndAds';
import NavigationLoadingBoundary from '@/components/NavigationLoadingBoundary';
import Container from '@mui/material/Container';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mvrater.com'),
  title: 'Movie Rater',
  description: '24小時不斷更新IMDB, LINE, PTT電影評價、電影時刻表，一目了然讓你不再踩雷！',
  openGraph: {
    type: 'website',
    url: 'https://www.mvrater.com',
    title: 'Movie Rater',
    description: '24小時不斷更新IMDB, LINE, PTT電影評價、電影時刻表，一目了然讓你不再踩雷！',
    images: ['/favicons/android-chrome-384x384.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/favicons/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/favicons/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <AnalyticsAndAds />
        <ThemeRegistry>
          <Suspense>
            <AppBar />
          </Suspense>
          <Container maxWidth="md" sx={{ mt: 1, mb: 4 }}>
            <NavigationLoadingBoundary>{children}</NavigationLoadingBoundary>
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  );
}
