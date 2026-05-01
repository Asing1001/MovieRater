import type { Metadata } from 'next';
import { Suspense } from 'react';
import ThemeRegistry from '@/components/ThemeRegistry';
import AppBar from '@/components/AppBar';
import AnalyticsAndAds from '@/components/AnalyticsAndAds';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
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
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}>
              {children}
            </Suspense>
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  );
}
