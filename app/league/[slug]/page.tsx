import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pool from '@/lib/db';
import { Clock, TrendingUp } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

const leagueMap: Record<string, { name: string; category: string }> = {
  'premier-league': { name: '英超', category: '足球' },
  'la-liga': { name: '西甲', category: '足球' },
  'serie-a': { name: '意甲', category: '足球' },
  'bundesliga': { name: '德甲', category: '足球' },
  'csl': { name: '中超', category: '足球' },
  'nba': { name: 'NBA', category: '篮球' },
  'cba': { name: 'CBA', category: '篮球' },
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const league = leagueMap[slug];
  if (!league) return { title: '联赛未找到' };
  return {
    title: `${league.name}新闻 - 瓦罗体育`,
    description: `${league.name}最新赛事资讯、比分、战报、深度解读`,
  };
}

async function getArticlesByLeague(leagueName: string) {
  try {
    const [rows] = await pool.query(
      `SELECT id, slug, title, league, team_a, team_b, score, image_url, created_at
       FROM articles WHERE status = 'published' AND league = ?
       ORDER BY created_at DESC LIMIT 20`,
      [leagueName]
    );
    return rows as any[];
  } catch {
    return [];
  }
}

async function getMatchesByLeague(leagueName: string) {
  try {
    const [rows] = await pool.query(
      `SELECT id, league, team_a, team_b, score_a, score_b, match_time, status
       FROM matches WHERE league = ?
       ORDER BY match_time DESC LIMIT 10`,
      [leagueName]
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

export default async function LeaguePage({ params }: Props) {
  const { slug } = await params;
  const league = leagueMap[slug];
  
  if (!league) notFound();

  const [articles, matches] = await Promise.all([
    getArticlesByLeague(league.name),
    getMatchesByLeague(league.name),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          {/* 页面标题 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-secondary mb-2">
              <Link href="/" className="hover:text-primary">首页</Link>
              <span>/</span>
              <Link href={`/category/${league.category === '足球' ? 'football' : 'basketball'}`} className="hover:text-primary">
                {league.category}
              </Link>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-brand rounded-full" />
                {league.name}
              </h1>
              <Link href={`/league/${slug}/standings`} className="text-sm px-4 py-2 rounded-lg bg-gradient-brand text-black font-medium hover:opacity-90 transition-opacity">
                查看积分榜
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 文章列表 */}
            <div className="lg:col-span-8">
              {articles.length > 0 ? (
                <div className="space-y-4">
                  {articles.map((article, i) => (
                    <Link key={article.id} href={`/${article.slug}`} className={`group card overflow-hidden ${i === 0 ? 'block' : 'flex gap-4 p-3'}`}>
                      {i === 0 ? (
                        <>
                          <div className="relative aspect-[2/1]">
                            {article.image_url ? (
                              <Image src={article.image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" priority />
                            ) : (
                              <div className="w-full h-full surface" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h2 className="text-white text-lg font-bold leading-snug line-clamp-2">{article.title}</h2>
                              <div className="flex items-center gap-2 mt-2 text-white/60 text-xs">
                                <Clock className="w-3 h-3" />
                                <span>{timeAgo(article.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </>
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
                <div className="card p-12 text-center text-secondary">
                  暂无{league.name}资讯
                </div>
              )}
            </div>

            {/* 侧边栏 */}
            <aside className="lg:col-span-4 space-y-4">
              {/* 比分 */}
              <div className="card">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h2 className="font-bold text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#7fff00]" />
                    {league.name}比分
                  </h2>
                </div>
                <div className="divide-y">
                  {matches.length > 0 ? matches.map((m) => (
                    <div key={m.id} className="px-4 py-3">
                      <div className="flex items-center justify-between text-xs text-secondary mb-1">
                        <span>{m.league}</span>
                        {m.status === 'live' && (
                          <span className="flex items-center gap-1 text-[#7fff00] font-medium">
                            <span className="w-1.5 h-1.5 bg-[#7fff00] rounded-full live-pulse" />
                            进行中
                          </span>
                        )}
                        {m.status === 'finished' && <span>已结束</span>}
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="flex-1 truncate">{m.team_a}</span>
                        <span className="mx-2 font-bold tabular-nums">{m.status === 'scheduled' ? 'VS' : `${m.score_a}-${m.score_b}`}</span>
                        <span className="flex-1 truncate text-right">{m.team_b}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="px-4 py-8 text-center text-secondary text-sm">暂无比赛</div>
                  )}
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
