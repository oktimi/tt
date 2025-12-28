import { getTranslations } from '@/lib/i18n';

const t = getTranslations('zh');

interface Match {
  id: number;
  league: string;
  team_a: string;
  team_b: string;
  score_a: number;
  score_b: number;
  match_time: string;
  status: 'scheduled' | 'live' | 'finished';
}

interface ScoreCardProps {
  match: Match;
}

export default function ScoreCard({ match }: ScoreCardProps) {
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  return (
    <div className="card p-4">
      {/* League */}
      <p className="section-title mb-3">{match.league}</p>

      {/* Teams and Score */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-right">
          <p className="font-medium text-slate-900 dark:text-white truncate">
            {match.team_a}
          </p>
        </div>

        <div className="flex-shrink-0 text-center min-w-[80px]">
          {isFinished || isLive ? (
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {match.score_a} - {match.score_b}
            </p>
          ) : (
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
              {t.home.vs}
            </p>
          )}
          
          {isLive && (
            <span className="inline-flex items-center gap-1 mt-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-red-500">
                {t.home.live}
              </span>
            </span>
          )}
        </div>

        <div className="flex-1">
          <p className="font-medium text-slate-900 dark:text-white truncate">
            {match.team_b}
          </p>
        </div>
      </div>
    </div>
  );
}
