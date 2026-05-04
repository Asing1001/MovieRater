import type { Metadata } from 'next';
import Movie from '@/models/movie';
import Theater from '@/models/theater';

export const SITE_URL = 'https://www.mvrater.com';
export const SITE_NAME = 'Movie Rater';
export const DEFAULT_DESCRIPTION = '24小時不斷更新 IMDb、LINE、PTT 電影評價與台灣電影時刻表，快速比較現正上映、即將上映電影與電影院場次。';
export const DEFAULT_OG_IMAGE = '/image/Preview.png';

type JsonLd = Record<string, unknown>;

function isPresent<T>(value: T | null | undefined | ''): value is T {
  return value !== undefined && value !== null && value !== '';
}

function pruneJsonLd<T>(value: T): T | undefined {
  if (Array.isArray(value)) {
    const items = value.map(pruneJsonLd).filter(isPresent);
    return (items.length ? items : undefined) as T | undefined;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, entry]) => [key, pruneJsonLd(entry)] as const)
      .filter(([, entry]) => isPresent(entry));
    return (entries.length ? Object.fromEntries(entries) : undefined) as T | undefined;
  }
  return isPresent(value as T | null | undefined | '') ? value : undefined;
}

export function absoluteUrl(path = '/'): string {
  try {
    return new URL(path).toString();
  } catch {
    return new URL(path.startsWith('/') ? path : `/${path}`, SITE_URL).toString();
  }
}

export function jsonLd(data: JsonLd): string {
  return JSON.stringify(pruneJsonLd(data) ?? {}).replace(/</g, '\\u003c');
}

export function compactText(text?: string | null, maxLength = 160): string {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return DEFAULT_DESCRIPTION;
  return clean.length > maxLength ? clean.slice(0, maxLength - 1).trimEnd() + '…' : clean;
}

export function movieTitle(movie: Pick<Movie, 'chineseTitle' | 'englishTitle'>): string {
  return [movie.chineseTitle, movie.englishTitle].filter(Boolean).join(' ');
}

export function moviePath(movie: Pick<Movie, 'movieBaseId' | 'yahooId'>, fallbackId?: string): string {
  const id = movie.movieBaseId ?? movie.yahooId ?? fallbackId;
  return `/movie/${encodeURIComponent(String(id))}`;
}

export function theaterPath(theaterName: string): string {
  return `/theater/${encodeURIComponent(theaterName)}`;
}

export function posterImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  return absoluteUrl(url.replace('/w280', '/w644'));
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: 'zh_TW',
      title,
      description,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

function personList(names?: string[]) {
  return names?.filter(Boolean).map((name) => ({ '@type': 'Person', name }));
}

function isoDuration(minutes?: string) {
  const totalMinutes = Number.parseInt(minutes ?? '', 10);
  return Number.isFinite(totalMinutes) && totalMinutes > 0 ? `PT${totalMinutes}M` : undefined;
}

function externalMovieLinks(movie: Movie) {
  return [
    movie.imdbID ? `https://www.imdb.com/title/${movie.imdbID}/` : undefined,
    movie.lineUrlHash ? `https://today.line.me/tw/v2/movie/${movie.lineUrlHash}/2` : undefined,
    movie.tomatoURL,
  ].filter(Boolean);
}

function aggregateRating(movie: Movie) {
  const values: number[] = [];
  const imdb = Number.parseFloat(movie.imdbRating ?? '');
  if (Number.isFinite(imdb) && imdb > 0) values.push(Math.min(5, Math.max(1, imdb / 2)));
  const line = Number.parseFloat(movie.lineRating ?? '');
  if (Number.isFinite(line) && line > 0) values.push(Math.min(5, Math.max(1, line / 2)));

  const good = movie.goodRateArticles?.length ?? movie.pttGoodCount ?? 0;
  const normal = movie.normalRateArticles?.length ?? movie.pttNormalCount ?? 0;
  const bad = movie.badRateArticles?.length ?? movie.pttBadCount ?? 0;
  const pttTotal = good + normal + bad;
  if (pttTotal > 0) {
    values.push(Math.min(5, Math.max(1, (good * 10 + normal * 7 + bad * 2) / pttTotal / 2)));
  }

  if (!values.length) return undefined;
  const ratingValue = values.reduce((sum, value) => sum + value, 0) / values.length;
  return {
    '@type': 'AggregateRating',
    ratingValue: ratingValue.toFixed(1),
    ratingCount: values.length + pttTotal,
    bestRating: 5,
    worstRating: 1,
  };
}

export function movieJsonLd(movie: Movie, fallbackId?: string): JsonLd {
  const title = movieTitle(movie);
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: title || movie.chineseTitle,
    alternateName: movie.englishTitle,
    description: compactText(movie.summary),
    image: posterImage(movie.posterUrl),
    url: absoluteUrl(moviePath(movie, fallbackId)),
    datePublished: movie.releaseDate,
    genre: movie.types,
    duration: isoDuration(movie.runTime),
    inLanguage: ['zh-TW', 'en'],
    actor: personList(movie.actors),
    director: personList(movie.directors),
    sameAs: externalMovieLinks(movie),
    aggregateRating: aggregateRating(movie),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'zh-TW',
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function itemListJsonLd(
  items: Array<{ name?: string; url: string; image?: string }>,
  name: string,
  itemType: 'Thing' | 'Movie' | 'MovieTheater' = 'Thing'
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items
      .filter((item) => item.name)
      .slice(0, 50)
      .map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': itemType,
          name: item.name,
          url: absoluteUrl(item.url),
          image: item.image ? posterImage(item.image) : undefined,
        },
      })),
  };
}

export function theaterJsonLd(theater: Theater): JsonLd {
  const lat = Number.parseFloat(theater.location?.lat ?? '');
  const lng = Number.parseFloat(theater.location?.lng ?? '');
  return {
    '@context': 'https://schema.org',
    '@type': 'MovieTheater',
    name: theater.name,
    url: absoluteUrl(theaterPath(theater.name)),
    address: theater.address,
    telephone: theater.phone,
    areaServed: theater.theaterCity ?? theater.region,
    geo: Number.isFinite(lat) && Number.isFinite(lng)
      ? { '@type': 'GeoCoordinates', latitude: lat, longitude: lng }
      : undefined,
  };
}
