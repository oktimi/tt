import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import db from '@/lib/db';
import { Clock, ChevronRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const fullSlug = slug.join('/');
  const [rows] = await db.execute(
    'SELECT meta_title, meta_description FROM articles WHERE slug = ? AND status = "published"',
    [fullSlug]
  );
  const article = (rows as any[])[0];
  if (!article) return { title: '文章未找到 - 瓦罗体育' };
  return { title: `${article.meta_title} - 瓦罗体育`, description: article.meta_description };
}

function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

const typeLabels: Record<string, string> = {
  news: '快讯',
  report: '战报',
  analysis: '深度解读',
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const fullSlug = slug.join('/');

  const [rows] = await db.execute(
    'SELECT * FROM articles WHERE slug = ? AND status = "published"',
    [fullSlug]
  );
  const article = (rows as any[])[0];
  if (!article) notFound();

  const [relatedRows] = await db.execute(
    `SELECT id, slug, title, image_url FROM articles 
     WHERE status = 'published' AND league = ? AND id != ? 
     ORDER BY created_at DESC LIMIT 4`,
    [article.league, article.id]
  );
  const related = relatedRows as any[];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 文章 */}
            <article className="lg:col-span-8">
              {/* 面包屑 */}
              <nav className="flex items-center gap-1 text-sm text-secondary mb-4 flex-wrap">
                <Link href="/" className="hover:text-primary">首页</Link>
                <ChevronRight className="w-4 h-4" />
                {article.league && (
                  <>
                    <span>{article.league}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
                <span className="truncate max-w-[150px]">正文</span>
              </nav>

              {/* 标签 */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {article.league && (
                  <span className="bg-gradient-brand text-black text-xs font-bold px-2 py-0.5 rounded">
                    {article.league}
                  </span>
                )}
                {article.type && typeLabels[article.type] && (
                  <span className="surface text-secondary text-xs px-2 py-0.5 rounded">
                    {typeLabels[article.type]}
                  </span>
                )}
              </div>

              {/* 标题 */}
              <h1 className="text-xl md:text-2xl font-bold leading-tight mb-3">{article.title}</h1>

              {/* 元信息 */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-secondary mb-4 pb-4 border-b">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(article.published_at || article.created_at)}
                </span>
                {article.team_a && article.team_b && (
                  <>
                    <span>·</span>
                    <span>{article.team_a} vs {article.team_b}</span>
                  </>
                )}
                {article.score && (
                  <>
                    <span>·</span>
                    <span className="text-gradient font-bold">{article.score}</span>
                  </>
                )}
              </div>

              {/* 头图 */}
              {article.image_url && (
                <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                  <Image src={article.image_url} alt={article.image_alt || article.title} fill className="object-cover" priority />
                </div>
              )}

              {/* 正文 */}
              <div className="card p-4 md:p-6">
                <MarkdownRenderer content={article.content} />
              </div>

              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'NewsArticle',
                    headline: article.title,
                    image: article.image_url,
                    datePublished: article.published_at || article.created_at,
                    author: { '@type': 'Organization', name: '瓦罗体育' },
                  }),
                }}
              />
            </article>

            {/* 侧边栏 */}
            <aside className="lg:col-span-4 space-y-4">
              {related.length > 0 && (
                <div className="card">
                  <div className="px-4 py-3 border-b">
                    <h3 className="font-bold text-sm">相关报道</h3>
                  </div>
                  <div className="divide-y">
                    {related.map((r) => (
                      <Link key={r.id} href={`/${r.slug}`} className="flex gap-3 p-3 hover-bg transition-colors">
                        {r.image_url && (
                          <div className="relative w-16 h-12 flex-shrink-0 rounded overflow-hidden">
                            <Image src={r.image_url} alt={r.title} fill className="object-cover" />
                          </div>
                        )}
                        <span className="text-sm line-clamp-2 hover:text-[#00d2ff] transition-colors">{r.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="card">
                <div className="px-4 py-3 border-b">
                  <h3 className="font-bold text-sm">热门联赛</h3>
                </div>
                <div className="p-2">
                  {[
                    { name: '英超', href: '/league/premier-league' },
                    { name: '西甲', href: '/league/la-liga' },
                    { name: 'NBA', href: '/league/nba' },
                    { name: 'CBA', href: '/league/cba' },
                  ].map((l) => (
                    <Link key={l.href} href={l.href} className="block px-3 py-2.5 text-sm rounded-md hover-bg">
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
