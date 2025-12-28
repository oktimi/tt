import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pool from '@/lib/db';
import { Trophy, ChevronRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

const leagueMap: Record<string, { name: string; category: string; type: 'football' | 'basketball' }> = {
  'premier-league': { name: '英超', category: '足球', type: 'football' },
  'la-liga': { name: '西甲', category: '足球', type: 'football' },
  'serie-a': { name: '意甲', category: '足球', type: 'football' },
  'bundesliga': { name: '德甲', category: '足球', type: 'football' },
  'csl': { name: '中超', category: '足球', type: 'football' },
  'nba': { name: 'NBA', category: '篮球', type: 'basketball' },
  'cba': { name: 'CBA', category: '篮球', type: 'basketball' },
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const league = leagueMap[slug];
  if (!league) return { title: '联赛未找到' };
  return {
    title: `${league.name}积分榜 - 瓦罗体育`,
    description: `${league.name}最新积分榜、排名、战绩数据`,
  };
}

async function getFootballStandings(leagueName: string) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM football_standings 
       WHERE league = ? 
       ORDER BY position ASC`,
      [leagueName]
    );
    return rows as any[];
  } catch {
    return [];
  }
}

async function getBasketballStandings(leagueName: string) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM basketball_standings 
       WHERE league = ? 
       ORDER BY conference, position ASC`,
      [leagueName]
    );
    return rows as any[];
  } catch {
    return [];
  }
}

export const revalidate = 300;

export default async function StandingsPage({ params }: Props) {
  const { slug } = await params;
  const league = leagueMap[slug];
  
  if (!league) notFound();

  const standings = league.type === 'football' 
    ? await getFootballStandings(league.name)
    : await getBasketballStandings(league.name);

  // Group basketball standings by conference
  const groupedStandings = league.type === 'basketball' 
    ? standings.reduce((acc: Record<string, any[]>, team) => {
        const conf = team.conference || '全联盟';
        if (!acc[conf]) acc[conf] = [];
        acc[conf].push(team);
        return acc;
      }, {})
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          {/* 面包屑 */}
          <nav className="flex items-center gap-1 text-sm text-secondary mb-4 flex-wrap">
            <Link href="/" className="hover:text-primary">首页</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/league/${slug}`} className="hover:text-primary">{league.name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span>积分榜</span>
          </nav>

          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#7fff00]" />
              {league.name}积分榜
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              {league.type === 'football' ? (
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="px-4 py-3 font-medium">#</th>
                          <th className="px-4 py-3 font-medium">球队</th>
                          <th className="px-4 py-3 font-medium text-center">场</th>
                          <th className="px-4 py-3 font-medium text-center">胜</th>
                          <th className="px-4 py-3 font-medium text-center">平</th>
                          <th className="px-4 py-3 font-medium text-center">负</th>
                          <th className="px-4 py-3 font-medium text-center">进</th>
                          <th className="px-4 py-3 font-medium text-center">失</th>
                          <th className="px-4 py-3 font-medium text-center">净</th>
                          <th className="px-4 py-3 font-medium text-center">积分</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {standings.length > 0 ? standings.map((team, i) => (
                          <tr key={team.id} className={`hover-bg ${i < 4 ? 'bg-[#7fff00]/5' : ''}`}>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                                i < 4 ? 'bg-gradient-brand text-black' : 'surface'
                              }`}>
                                {team.position}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium">{team.team}</td>
                            <td className="px-4 py-3 text-center text-secondary">{team.played}</td>
                            <td className="px-4 py-3 text-center">{team.won}</td>
                            <td className="px-4 py-3 text-center text-secondary">{team.drawn}</td>
                            <td className="px-4 py-3 text-center text-secondary">{team.lost}</td>
                            <td className="px-4 py-3 text-center">{team.goals_for}</td>
                            <td className="px-4 py-3 text-center text-secondary">{team.goals_against}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={team.goal_diff > 0 ? 'text-[#7fff00]' : team.goal_diff < 0 ? 'text-red-500' : ''}>
                                {team.goal_diff > 0 ? '+' : ''}{team.goal_diff}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center font-bold">{team.points}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={10} className="px-4 py-12 text-center text-secondary">暂无积分数据</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedStandings && Object.keys(groupedStandings).length > 0 ? (
                    Object.entries(groupedStandings).map(([conference, teams]) => (
                      <div key={conference} className="card overflow-hidden">
                        <div className="px-4 py-3 border-b">
                          <h2 className="font-bold text-sm">{conference}</h2>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b text-left">
                                <th className="px-4 py-3 font-medium">#</th>
                                <th className="px-4 py-3 font-medium">球队</th>
                                <th className="px-4 py-3 font-medium text-center">胜</th>
                                <th className="px-4 py-3 font-medium text-center">负</th>
                                <th className="px-4 py-3 font-medium text-center">胜率</th>
                                <th className="px-4 py-3 font-medium text-center">胜差</th>
                                <th className="px-4 py-3 font-medium text-center">连胜/负</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {teams.map((team: any, i: number) => (
                                <tr key={team.id} className={`hover-bg ${i < 6 ? 'bg-[#7fff00]/5' : ''}`}>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                                      i < 6 ? 'bg-gradient-brand text-black' : 'surface'
                                    }`}>
                                      {team.position}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 font-medium">{team.team}</td>
                                  <td className="px-4 py-3 text-center">{team.won}</td>
                                  <td className="px-4 py-3 text-center text-secondary">{team.lost}</td>
                                  <td className="px-4 py-3 text-center">{(team.win_pct * 100).toFixed(1)}%</td>
                                  <td className="px-4 py-3 text-center text-secondary">{team.games_behind}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={team.streak?.startsWith('W') ? 'text-[#7fff00]' : 'text-red-500'}>
                                      {team.streak || '-'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="card p-12 text-center text-secondary">暂无排名数据</div>
                  )}
                </div>
              )}
            </div>

            <aside className="lg:col-span-4 space-y-4">
              <div className="card">
                <div className="px-4 py-3 border-b">
                  <h2 className="font-bold text-sm">{league.name}导航</h2>
                </div>
                <div className="p-2">
                  <Link href={`/league/${slug}`} className="block px-3 py-2.5 text-sm rounded-md hover-bg">
                    {league.name}新闻
                  </Link>
                  <Link href={`/league/${slug}/standings`} className="block px-3 py-2.5 text-sm rounded-md bg-gradient-brand/10 text-gradient font-medium">
                    积分榜
                  </Link>
                  <Link href="/scores" className="block px-3 py-2.5 text-sm rounded-md hover-bg">
                    比分直播
                  </Link>
                </div>
              </div>

              <div className="card">
                <div className="px-4 py-3 border-b">
                  <h2 className="font-bold text-sm">其他联赛</h2>
                </div>
                <div className="p-2">
                  {Object.entries(leagueMap)
                    .filter(([key]) => key !== slug)
                    .slice(0, 5)
                    .map(([key, val]) => (
                      <Link key={key} href={`/league/${key}/standings`} className="block px-3 py-2.5 text-sm rounded-md hover-bg">
                        {val.name}积分榜
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
