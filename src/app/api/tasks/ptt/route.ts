import { NextResponse } from 'next/server';
import { Mongo } from '@/data/db';
import { updatePttArticles } from '@/task/pttTask';

export async function POST() {
  try {
    // Jump crawl index to near current PTT max so next runs pick up recent articles
    await Mongo.updateDocument(
      { name: 'crawlerStatus' },
      { lastCrawlPttIndex: 10900 },
      'configs'
    );
    // Crawl a small batch immediately; scheduler continues from there hourly
    await updatePttArticles(5);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
