import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pool from '@/lib/db';
import { TrendingUp, Calendar } from 'lucide-react';

export const metadata = {
  title: '实时比分 - 瓦罗体育',
  description: '足球篮球实时比分、赛程、赛果',
};

async function getMatches() {
  try {
    const [rows] = await pool.query(
      `SELECT id, league, team_a, team_b, score_a, score_b, match_time, status
       FROM matches ORDER BY 
         CASE WHEN status = 'live' THEN 0 WHEN status = 'scheduled' THEN 1 ELSE 2 END,
         match_time DESC
       LIMIT 50`
    );
    return rows as any[];
  } catch {
    return [];
  }
}

function formatMatchTime(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export default async function ScoresPage() {
  const matches = await getMatches();
  
  const liveMatches = matches.filter(m => m.status === 'live');
  const scheduledMatches = matches.filter(m => m.status === 'scheduled');
  const finishedMatches = matches.filter(m => m.status === 'finished');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-gradient-brand rounded-full" />
            实时比分
          </h1>

          <div className="space-y-6">
            {/* 进行中 */}
            {liveMatches.length > 0 && (
              <section>
                <h2 className="font-bold text-sm flex items-center gap-2 mb-3 text-accent-green">
                  <TrendingUp className="w-4 h-4" />
                  进行中
                </h2>
                <div className="card divide-y divide-border-light dark:divide-border-dark">
                  {liveMatches.map((m) => (
                    <div key={m.id} className="px-4 py-4">
                      <div className="flex items-center justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        <span>{m.league}</span>
                        <span className="flex items-center gap-1 text-accent-green font-medium">
                          <span className="w-1.5 h-1.5 bg-accent-green rounded-full live-pulse" />
                          进行中
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="flex-1 font-medium">{m.team_a}</span>
                        <span className="mx-4 text-xl font-bold tabular-nums">{m.score_a} - {m.score_b}</span>
                        <span className="flex-1 text-right font-medium">{m.team_b}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 未开始 */}
            {scheduledMatches.length > 0 && (
              <section>
                <h2 className="font-bold text-sm flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4" />
                  赛程
                </h2>
                <div className="card divide-y divide-border-light dark:divide-border-dark">
                  {scheduledMatches.map((m) => (
                    <div key={m.id} className="px-4 py-4">
                      <div className="flex items-center justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        <span>{m.league}</span>
                        <span>{formatMatchTime(m.match_time)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="flex-1 font-medium">{m.team_a}</span>
                        <span className="mx-4 text-lg font-medium text-text-secondary-light dark:text-text-secondary-dark">VS</span>
                        <span className="flex-1 text-right font-medium">{m.team_b}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 已结束 */}
            {finishedMatches.length > 0 && (
              <section>
                <h2 className="font-bold text-sm flex items-center gap-2 mb-3 text-text-secondary-light dark:text-text-secondary-dark">
                  已结束
                </h2>
                <div className="card divide-y divide-border-light dark:divide-border-dark">
                  {finishedMatches.map((m) => (
                    <div key={m.id} className="px-4 py-4">
                      <div className="flex items-center justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        <span>{m.league}</span>
                        <span>已结束</span>
                      </div>
                      <div className="flex items-center">
                        <span className="flex-1 font-medium">{m.team_a}</span>
                        <span className="mx-4 text-xl font-bold tabular-nums">{m.score_a} - {m.score_b}</span>
                        <span className="flex-1 text-right font-medium">{m.team_b}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {matches.length === 0 && (
              <div className="card p-12 text-center text-text-secondary-light dark:text-text-secondary-dark">
                暂无比赛数据
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
