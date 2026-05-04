'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import MovieListPageSkeleton from '@/components/MovieListPageSkeleton';
import MoviePageSkeleton from '@/components/MoviePageSkeleton';
import TheaterPageSkeleton from '@/components/TheaterPageSkeleton';
import TheatersPageSkeleton from '@/components/TheatersPageSkeleton';
import UpcomingPageSkeleton from '@/components/UpcomingPageSkeleton';
import { NAVIGATION_START_EVENT, type NavigationStartDetail } from '@/lib/navigationEvents';

type PendingNavigation = 'movie-list' | 'movie' | 'theater' | 'theaters' | 'upcoming' | null;

function closestAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  if (target instanceof Element) return target.closest('a[href]');
  if (target instanceof Node) return target.parentElement?.closest('a[href]') ?? null;
  return null;
}

function isPlainLeftClick(event: MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function getPendingNavigation(href: string, currentPathname: string): PendingNavigation {
  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname === currentPathname) return null;
  if (url.pathname === '/' || url.pathname === '/search') return 'movie-list';
  if (url.pathname === '/upcoming') return 'upcoming';
  if (url.pathname === '/theaters') return 'theaters';
  if (url.pathname.startsWith('/movie/')) return 'movie';
  if (url.pathname.startsWith('/theater/')) return 'theater';
  return null;
}

export default function NavigationLoadingBoundary({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pendingNavigation, setPendingNavigation] = useState<PendingNavigation>(null);

  useEffect(() => {
    setPendingNavigation(null);
  }, [pathname]);

  useEffect(() => {
    if (!pendingNavigation) return;
    const timeout = window.setTimeout(() => setPendingNavigation(null), 15000);
    return () => window.clearTimeout(timeout);
  }, [pendingNavigation]);

  useEffect(() => {
    function startIfKnownNavigation(href: string) {
      setPendingNavigation(getPendingNavigation(href, window.location.pathname));
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || !isPlainLeftClick(event)) return;
      const anchor = closestAnchor(event.target);
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      startIfKnownNavigation(anchor.href);
    }

    function handleNavigationEvent(event: Event) {
      const href = (event as CustomEvent<NavigationStartDetail>).detail?.href;
      if (href) startIfKnownNavigation(href);
    }

    document.addEventListener('click', handleClick, true);
    window.addEventListener(NAVIGATION_START_EVENT, handleNavigationEvent);
    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener(NAVIGATION_START_EVENT, handleNavigationEvent);
    };
  }, []);

  if (pendingNavigation === 'movie-list') return <MovieListPageSkeleton />;
  if (pendingNavigation === 'movie') return <MoviePageSkeleton />;
  if (pendingNavigation === 'theater') return <TheaterPageSkeleton />;
  if (pendingNavigation === 'theaters') return <TheatersPageSkeleton />;
  if (pendingNavigation === 'upcoming') return <UpcomingPageSkeleton />;
  return children;
}
