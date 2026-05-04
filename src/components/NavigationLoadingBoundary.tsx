'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import MoviePageSkeleton from '@/components/MoviePageSkeleton';
import { NAVIGATION_START_EVENT, type NavigationStartDetail } from '@/lib/navigationEvents';

function closestAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  if (target instanceof Element) return target.closest('a[href]');
  if (target instanceof Node) return target.parentElement?.closest('a[href]') ?? null;
  return null;
}

function isPlainLeftClick(event: MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function shouldShowMovieSkeleton(href: string, currentPathname: string) {
  const url = new URL(href, window.location.href);
  return url.origin === window.location.origin && url.pathname.startsWith('/movie/') && url.pathname !== currentPathname;
}

export default function NavigationLoadingBoundary({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pendingMovieNavigation, setPendingMovieNavigation] = useState(false);

  useEffect(() => {
    setPendingMovieNavigation(false);
  }, [pathname]);

  useEffect(() => {
    if (!pendingMovieNavigation) return;
    const timeout = window.setTimeout(() => setPendingMovieNavigation(false), 15000);
    return () => window.clearTimeout(timeout);
  }, [pendingMovieNavigation]);

  useEffect(() => {
    function startIfMovieNavigation(href: string) {
      if (shouldShowMovieSkeleton(href, window.location.pathname)) {
        setPendingMovieNavigation(true);
      }
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || !isPlainLeftClick(event)) return;
      const anchor = closestAnchor(event.target);
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      startIfMovieNavigation(anchor.href);
    }

    function handleNavigationEvent(event: Event) {
      const href = (event as CustomEvent<NavigationStartDetail>).detail?.href;
      if (href) startIfMovieNavigation(href);
    }

    document.addEventListener('click', handleClick, true);
    window.addEventListener(NAVIGATION_START_EVENT, handleNavigationEvent);
    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener(NAVIGATION_START_EVENT, handleNavigationEvent);
    };
  }, []);

  return pendingMovieNavigation ? <MoviePageSkeleton /> : children;
}
