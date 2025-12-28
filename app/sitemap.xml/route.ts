import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [rows] = await db.execute(
    'SELECT slug, updated_at FROM articles WHERE status = "published" ORDER BY updated_at DESC'
  );
  const articles = rows as any[];

  const baseUrl = 'https://valuo.cn';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${articles.map(a => `
  <url>
    <loc>${baseUrl}/${a.slug}</loc>
    <lastmod>${new Date(a.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
