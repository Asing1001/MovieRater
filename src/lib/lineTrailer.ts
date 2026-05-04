type TrailerLike = {
  lineTrailerHash?: string | null;
  lineTrailerMediaHash?: string | null;
  lineTrailerThumbnailHash?: string | null;
};

const LINE_OBS_HASH_PATTERN = /^0h[A-Za-z0-9_-]{20,}$/;

export function isLineObsHash(hash?: string | null) {
  return Boolean(hash && LINE_OBS_HASH_PATTERN.test(hash));
}

export function lineTrailerArticleHash(movie: TrailerLike) {
  const hash = movie.lineTrailerHash;
  return hash && !isLineObsHash(hash) ? hash : null;
}

export function lineTrailerArticleUrl(movie: TrailerLike) {
  const hash = lineTrailerArticleHash(movie);
  return hash ? `https://today.line.me/tw/v3/article/${hash}` : null;
}

export function lineTrailerVideoHash(movie: TrailerLike) {
  return movie.lineTrailerMediaHash ?? (isLineObsHash(movie.lineTrailerHash) ? movie.lineTrailerHash : null);
}

export function lineTrailerVideoUrl(movie: TrailerLike) {
  const hash = lineTrailerVideoHash(movie);
  return hash ? `https://today-obs.line-scdn.net/${hash}` : null;
}

export function lineImageUrl(hash?: string | null, width = 1200) {
  return hash ? `https://obs.line-scdn.net/${hash}/w${width}` : null;
}
