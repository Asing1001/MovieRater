import { describe, expect, it } from 'vitest';
import { briefSummary } from '@/lib/movies';
import { cleanMovieSummary } from '@/lib/text';

describe('movie summary text', () => {
  it('removes HTML line breaks and tags from LINE descriptions', () => {
    expect(cleanMovieSummary('第一行<br/>第二行<br>第三行<p>第四行</p>')).toBe('第一行 第二行 第三行 第四行');
  });

  it('decodes common HTML entities in descriptions', () => {
    expect(cleanMovieSummary('Tom &amp; Jerry &#39;Movie&#39; &quot;Soon&quot;')).toBe(
      'Tom & Jerry \'Movie\' "Soon"'
    );
  });

  it('returns shortened clean text for movie cards', () => {
    const summary = '1234567890<br/>'.repeat(8);

    expect(briefSummary(summary)).not.toContain('<br');
    expect(briefSummary(summary)).toHaveLength(73);
  });
});
