import { describe, expect, it } from 'vitest';
import {
  isLineObsHash,
  lineTrailerArticleUrl,
  lineTrailerVideoHash,
  lineTrailerVideoUrl,
} from '@/lib/lineTrailer';

describe('line trailer helpers', () => {
  const mediaHash = '0h2biJ93VBbU1UM3KZJnUSGmxlYTxnVXdEdgIne3E7MXgpHy0YOlQ-LiNkM2EpUCIfdFIlfyU0MHwtVy0ZPQ';

  it('uses short trailer hashes as LINE TODAY article links', () => {
    expect(lineTrailerArticleUrl({ lineTrailerHash: '9mqB9Mx' })).toBe('https://today.line.me/tw/v3/article/9mqB9Mx');
  });

  it('does not turn OBS media hashes into article links', () => {
    expect(isLineObsHash(mediaHash)).toBe(true);
    expect(lineTrailerArticleUrl({ lineTrailerHash: mediaHash })).toBeNull();
  });

  it('uses the explicit media hash before falling back to legacy lineTrailerHash media values', () => {
    expect(lineTrailerVideoHash({ lineTrailerHash: mediaHash })).toBe(mediaHash);
    expect(lineTrailerVideoUrl({ lineTrailerHash: '9mqB9Mx', lineTrailerMediaHash: mediaHash })).toBe(
      `https://today-obs.line-scdn.net/${mediaHash}`
    );
  });
});
