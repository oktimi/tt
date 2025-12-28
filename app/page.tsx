import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pool from '@/lib/db';
import { Clock, TrendingUp, Trophy, Flame } from 'lucide-react';

async function getArticles() {
  try {
    const [rows] = await pool.query(
      `SELECT id, slug, title, league, team_a, team_b, score, image_url, created_at
       FROM articles WHERE status = 'published' ORDER BY created_at DESC LIMIT 12`
    );
    return rows as any[];
  } catch { return []; }
}

async function getMatches() {
  try {
    const [rows] = await pool.query(
      `SELECT id, league, team_a, team_b, score_a, score_b, match_time, status
       FROM matches ORDER BY 
         CASE WHEN status = 'live' THEN 0 WHEN status = 'scheduled' THEN 1 ELSE 2 END,
         match_time DESC LIMIT 10`
    );
    return rows as any[];
  } catch { return []; }
}

async function getFootballStandings() {
  try {
    const [rows] = await pool.query(
      `SELECT team, position, played, won, drawn, lost, points, goal_diff
       FROM football_standings WHERE league = '英超' AND season = '2024-25'
       ORDER BY position LIMIT 6`
    );
    return rows as any[];
  } catch { return []; }
}

async function getBasketballStandings() {
  try {
    const [rows] = await pool.query(
      `SELECT team, position, won, lost, win_pct, streak
       FROM basketball_standings WHERE league = 'NBA' AND season = '2024-25'
       ORDER BY position LIMIT 6`
    );
    return rows as any[];
  } catch { return []; }
}

async function getHotEvents() {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, league, event_type, start_time, image_url, link
       FROM hot_events WHERE is_active = TRUE ORDER BY priority DESC LIMIT 4`
    );
    return rows as any[];
  } catch { return []; }
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}天前` : `${new Date(dateString).getMonth() + 1}/${new Date(dateString).getDate()}`;
}

export default async function Home() {
  const [articles, matches, footballStandings, basketballStandings, hotEvents] = await Promise.all([
    getArticles(),
    getMatches(),
    getFootballStandings(),
    getBasketballStandings(),
    getHotEvents(),
  ]);
  
  const headline = articles[0];
  const subNews = articles.slice(1, 5);
  const newsList = articles.slice(5);
  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'scheduled').slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          
          {/* 热门赛事横幅 */}
          {hotEvents.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5" style={{color: 'var(--color-accent-green)'}} />
                <h2 className="font-bold text-primary">热门赛事</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {hotEvents.map((event) => (
                  <Link key={event.id} href={event.link || '#'} className="card overflow-hidden group">
                    <div className="aspect-16-9">
                      {event.image_url ? (
                        <Image src={event.image_url} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{backgroundColor: 'var(--border)'}}>
                          <Trophy className="w-8 h-8 text-secondary" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <span className="text-xs text-gradient font-medium">{event.league}</span>
                      <p className="text-sm font-medium text-primary line-clamp-1 mt-0.5">{event.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 主内容区 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 左侧 - 新闻 */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 头条 */}
              {headline && (
                <Link href={`/${headline.slug}`} className="group block card overflow-hidden">
                  <div className="aspect-16-9 md:aspect-2-1">
                    {headline.image_url ? (
                      <Image src={headline.image_url} alt={headline.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" priority />
                    ) : (
                      <div className="w-full h-full" style={{backgroundColor: 'var(--border)'}} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      {headline.league && (
                        <span className="inline-block bg-gradient-brand text-black text-xs font-bold px-2 py-0.5 rounded mb-2">{headline.league}</span>
                      )}
                      <h1 className="text-white text-lg md:text-2xl font-bold leading-snug line-clamp-2">{headline.title}</h1>
                      <div className="flex items-center gap-2 mt-2 text-white/60 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{timeAgo(headline.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* 副头条 2x2 */}
              {subNews.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {subNews.map((article) => (
                    <Link key={article.id} href={`/${article.slug}`} className="group card overflow-hidden">
                      <div className="aspect-4-3">
                        {article.image_url ? (
                          <Image src={article.image_url} alt={article.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full" style={{backgroundColor: 'var(--border)'}} />
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1 text-xs">
                          {article.league && <span className="text-gradient font-medium">{article.league}</span>}
                          <span className="text-secondary">{timeAgo(article.created_at)}</span>
                        </div>
                        <h3 className="text-sm font-medium leading-snug line-clamp-2 text-primary">{article.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* 最新资讯列表 */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold flex items-center gap-2 text-primary">
                    <div className="w-1 h-4 bg-gradient-brand rounded-full" />
                    最新资讯
                  </h2>
                  <Link href="/news" className="text-xs link-gradient">更多</Link>
                </div>
                <div className="card divide-y">
                  {newsList.length > 0 ? newsList.map((article) => (
                    <Link key={article.id} href={`/${article.slug}`} className="flex gap-3 p-3 hover-bg transition-colors">
                      <div className="relative w-24 h-16 md:w-28 md:h-18 flex-shrink-0 rounded overflow-hidden">
                        {article.image_url ? (
                          <Image src={article.image_url} alt={article.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full" style={{backgroundColor: 'var(--border)'}} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium leading-snug line-clamp-2 text-primary">{article.title}</h3>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-secondary">
                          {article.league && <span className="text-gradient font-medium">{article.league}</span>}
                          <span>{timeAgo(article.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <div className="p-8 text-center text-secondary">暂无资讯</div>
                  )}
                </div>
              </section>
            </div>

            {/* 右侧边栏 */}
            <aside className="lg:col-span-4 space-y-4">
              
              {/* 实时比分 */}
              <div className="card">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h2 className="font-bold text-sm flex items-center gap-2 text-primary">
                    <TrendingUp className="w-4 h-4" style={{color: 'var(--color-accent-green)'}} />
                    {liveMatches.length > 0 ? '进行中' : '实时比分'}
                  </h2>
                  <Link href="/scores" className="text-xs link-gradient">全部</Link>
                </div>
                <div className="divide-y">
                  {(liveMatches.length > 0 ? liveMatches : matches.slice(0, 5)).map((m) => (
                    <div key={m.id} className="px-4 py-3 hover-bg transition-colors">
                      <div className="flex items-center justify-between text-xs text-secondary mb-1">
                        <span>{m.league}</span>
                        {m.status === 'live' && (
                          <span className="flex items-center gap-1 font-medium" style={{color: 'var(--color-accent-green)'}}>
                            <span className="w-1.5 h-1.5 rounded-full live-pulse" style={{backgroundColor: 'var(--color-accent-green)'}} />
                            进行中
                          </span>
                        )}
                        {m.status === 'finished' && <span>已结束</span>}
                      </div>
                      <div className="flex items-center text-sm text-primary">
                        <span className="flex-1 truncate">{m.team_a}</span>
                        <span className="mx-2 font-bold tabular-nums">{m.status === 'scheduled' ? 'VS' : `${m.score_a}-${m.score_b}`}</span>
                        <span className="flex-1 truncate text-right">{m.team_b}</span>
                      </div>
                    </div>
                  ))}
                  {matches.length === 0 && (
                    <div className="px-4 py-8 text-center text-secondary text-sm">暂无比赛</div>
                  )}
                </div>
              </div>

              {/* 即将开始 */}
              {upcomingMatches.length > 0 && (
                <div className="card">
                  <div className="px-4 py-3 border-b">
                    <h3 className="font-bold text-sm text-primary">即将开始</h3>
                  </div>
                  <div className="divide-y">
                    {upcomingMatches.map((m) => (
                      <div key={m.id} className="px-4 py-2.5">
                        <div className="text-xs text-secondary mb-1">{m.league}</div>
                        <div className="flex items-center text-sm text-primary">
                          <span className="flex-1 truncate">{m.team_a}</span>
                          <span className="mx-2 text-secondary">VS</span>
                          <span className="flex-1 truncate text-right">{m.team_b}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 英超积分榜 */}
              <div className="card">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h3 className="font-bold text-sm text-primary">英超积分榜</h3>
                  <Link href="/league/premier-league/standings" className="text-xs link-gradient">完整</Link>
                </div>
                {footballStandings.length > 0 ? (
                  <div className="text-xs">
                    <div className="flex items-center px-4 py-2 text-secondary border-b" style={{backgroundColor: 'var(--bg)'}}>
                      <span className="w-6">#</span>
                      <span className="flex-1">球队</span>
                      <span className="w-8 text-center">场</span>
                      <span className="w-8 text-center">净</span>
                      <span className="w-8 text-center">分</span>
                    </div>
                    {footballStandings.map((team) => (
                      <div key={team.team} className="flex items-center px-4 py-2 hover-bg text-primary">
                        <span className="w-6 text-secondary">{team.position}</span>
                        <span className="flex-1 truncate">{team.team}</span>
                        <span className="w-8 text-center text-secondary">{team.played}</span>
                        <span className="w-8 text-center" style={{color: team.goal_diff > 0 ? 'var(--color-accent-green)' : team.goal_diff < 0 ? '#ef4444' : 'inherit'}}>
                          {team.goal_diff > 0 ? '+' : ''}{team.goal_diff}
                        </span>
                        <span className="w-8 text-center font-bold">{team.points}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-secondary text-sm">暂无数据</div>
                )}
              </div>

              {/* NBA排行榜 */}
              <div className="card">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h3 className="font-bold text-sm text-primary">NBA排行榜</h3>
                  <Link href="/league/nba/standings" className="text-xs link-gradient">完整</Link>
                </div>
                {basketballStandings.length > 0 ? (
                  <div className="text-xs">
                    <div className="flex items-center px-4 py-2 text-secondary border-b" style={{backgroundColor: 'var(--bg)'}}>
                      <span className="w-6">#</span>
                      <span className="flex-1">球队</span>
                      <span className="w-12 text-center">战绩</span>
                      <span className="w-10 text-center">胜率</span>
                    </div>
                    {basketballStandings.map((team) => (
                      <div key={team.team} className="flex items-center px-4 py-2 hover-bg text-primary">
                        <span className="w-6 text-secondary">{team.position}</span>
                        <span className="flex-1 truncate">{team.team}</span>
                        <span className="w-12 text-center text-secondary">{team.won}-{team.lost}</span>
                        <span className="w-10 text-center">{(team.win_pct * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-secondary text-sm">暂无数据</div>
                )}
              </div>

              {/* 热门联赛 */}
              <div className="card">
                <div className="px-4 py-3 border-b">
                  <h3 className="font-bold text-sm text-primary">热门联赛</h3>
                </div>
                <div className="p-2">
                  {[
                    { name: '英超', href: '/league/premier-league' },
                    { name: '西甲', href: '/league/la-liga' },
                    { name: 'NBA', href: '/league/nba' },
                    { name: 'CBA', href: '/league/cba' },
                  ].map((l) => (
                    <Link key={l.href} href={l.href} className="block px-3 py-2.5 text-sm rounded-md hover-bg transition-colors text-primary">{l.name}</Link>
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
