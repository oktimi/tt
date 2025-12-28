import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import ScoreCard from '@/components/ScoreCard';
import pool from '@/lib/db';
import { getTranslations } from '@/lib/i18n';

const t = getTranslations('zh');

async function getArticles() {
  try {
    const [rows] = await pool.query(
      `SELECT id, slug, title, league, team_a, team_b, score, image_url, created_at
       FROM articles WHERE status = 'published'
       ORDER BY created_at DESC LIMIT 10`
    );
    return rows as any[];
  } catch {
    return [];
  }
}

async function getMatches() {
  try {
    const [rows] = await pool.query(
      `SELECT id, league, team_a, team_b, score_a, score_b, match_time, status
       FROM matches ORDER BY match_time DESC LIMIT 6`
    );
    return rows as any[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [articles, matches] = await Promise.all([getArticles(), getMatches()]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          {/* Decorative lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 w-px h-24 bg-gradient-to-b from-transparent via-border-light dark:via-border-dark to-transparent" />
            <div className="absolute bottom-0 left-1/2 w-px h-24 bg-gradient-to-t from-transparent via-border-light dark:via-border-dark to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="section-title mb-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-sm" />
              {t.home.mediaTitle}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              {t.site.name}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t.home.mediaSubtitle}
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="divider-horizontal" />
        </div>

        {/* Content Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Articles */}
              <div className="lg:col-span-2">
                <h2 className="section-title mb-6">{t.home.latestNews}</h2>
                
                {articles.length > 0 ? (
                  <div className="space-y-4">
                    {articles.map((article, index) => (
                      <ArticleCard 
                        key={article.id} 
                        article={article}
                        variant={index === 0 ? 'featured' : 'default'}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <p className="text-slate-500 dark:text-slate-400">
                      {t.home.noArticles}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar - Scores */}
              <div>
                <h2 className="section-title mb-6">{t.home.liveScores}</h2>
                
                {matches.length > 0 ? (
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <ScoreCard key={match.id} match={match} />
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <p className="text-slate-500 dark:text-slate-400">
                      {t.home.noMatches}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
