const htmlEntities: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
};

export function cleanMovieSummary(summary?: string | null): string {
  return (summary ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?(?:p|div|section|article|li|ul|ol|h[1-6])[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp);|&#39;/g, (entity) => htmlEntities[entity] ?? entity)
    .replace(/\s+/g, ' ')
    .trim();
}
