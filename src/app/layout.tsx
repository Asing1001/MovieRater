import type { Metadata } from 'next';
import { Suspense } from 'react';
import ThemeRegistry from '@/components/ThemeRegistry';
import AppBar from '@/components/AppBar';
import AnalyticsAndAds from '@/components/AnalyticsAndAds';
import NavigationLoadingBoundary from '@/components/NavigationLoadingBoundary';
import { buildMetadata, jsonLd, SITE_URL, websiteJsonLd } from '@/lib/seo';
import Container from '@mui/material/Container';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata({ title: 'Movie Rater', path: '/' }),
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd()) }} />
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
