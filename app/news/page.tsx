import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pool from '@/lib/db';
import { Clock, TrendingUp } from 'lucide-react';

export const metadata = {
  title: '体育新闻 - 瓦罗体育',
  description: '最新体育新闻、足球篮球赛事资讯、战报、深度解读',
};

export const revalidate = 60;

async function getLatestNews() {
  try {
    const [rows] = await pool.query(
      `SELECT id, slug, title, league, team_a, team_b, image_url, type, created_at
       FROM articles WHERE status = 'published'
       ORDER BY created_at DESC LIMIT 30`
    );
    return rows as any[];
  } catch {
    return [];
  }
}

async function getHotNews() {
  try {
    const [rows] = await pool.query(
      `SELECT id, slug, title, league, image_url FROM articles 
       WHERE status = 'published' 
       ORDER BY created_at DESC LIMIT 5`
    );
    return rows as any[];
  } catch {
    return [];
  }
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}天前` : `${new Date(dateString).getMonth() + 1}/${new Date(dateString).getDate()}`;
}

const typeLabels: Record<string, string> = {
  news: '快讯',
  report: '战报',
  analysis: '深度',
};

export default async function NewsPage() {
  const [articles, hotNews] = await Promise.all([
    getLatestNews(),
    getHotNews(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-brand rounded-full" />
              体育新闻
            </h1>
            <p className="text-sm text-secondary mt-1">最新足球篮球赛事资讯</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              {articles.length > 0 ? (
                <div className="space-y-4">
                  {articles.map((article, i) => (
                    <Link 
                      key={article.id} 
                      href={`/${article.slug}`} 
                      className={`group card overflow-hidden ${i === 0 ? 'block' : 'flex gap-4 p-3'}`}
                    >
                      {i === 0 ? (
                        <div className="relative aspect-2-1">
                          {article.image_url ? (
                            <Image src={article.image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" priority />
                          ) : (
                            <div className="w-full h-full surface" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              {article.league && <span className="bg-gradient-brand text-black text-xs font-bold px-2 py-0.5 rounded">{article.league}</span>}
                              {article.type && <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded">{typeLabels[article.type] || article.type}</span>}
                            </div>
                            <h2 className="text-white text-lg font-bold leading-snug line-clamp-2">{article.title}</h2>
                            <div className="flex items-center gap-2 mt-2 text-white/60 text-xs">
                              <Clock className="w-3 h-3" />
                              <span>{timeAgo(article.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="relative w-28 h-20 flex-shrink-0 rounded overflow-hidden">
                            {article.image_url ? (
                              <Image src={article.image_url} alt={article.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full surface" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {article.league && <span className="text-gradient text-xs font-medium">{article.league}</span>}
                              {article.type && <span className="text-secondary text-xs">{typeLabels[article.type] || article.type}</span>}
                            </div>
                            <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#00d2ff] transition-colors">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-xs text-secondary">
                              <Clock className="w-3 h-3" />
                              <span>{timeAgo(article.created_at)}</span>
                              {article.team_a && article.team_b && (
                                <>
                                  <span>·</span>
                                  <span>{article.team_a} vs {article.team_b}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center text-secondary">暂无新闻</div>
              )}
            </div>

            <aside className="lg:col-span-4 space-y-4">
              <div className="card">
                <div className="flex items-center gap-2 px-4 py-3 border-b">
                  <TrendingUp className="w-4 h-4 text-[#7fff00]" />
                  <h2 className="font-bold text-sm">热门资讯</h2>
                </div>
                <div className="divide-y">
                  {hotNews.length > 0 ? hotNews.map((item, i) => (
                    <Link key={item.id} href={`/${item.slug}`} className="flex items-start gap-3 p-3 hover-bg">
                      <span className="flex-shrink-0 w-5 h-5 rounded bg-gradient-brand text-black text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-sm line-clamp-2">{item.title}</span>
                    </Link>
                  )) : (
                    <div className="p-4 text-center text-secondary text-sm">暂无数据</div>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="px-4 py-3 border-b">
                  <h2 className="font-bold text-sm">快速导航</h2>
                </div>
                <div className="p-2">
                  {[
                    { name: '足球', href: '/category/football' },
                    { name: '篮球', href: '/category/basketball' },
                    { name: '英超', href: '/league/premier-league' },
                    { name: 'NBA', href: '/league/nba' },
                    { name: '比分', href: '/scores' },
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
