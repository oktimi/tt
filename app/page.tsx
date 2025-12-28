import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pool from '@/lib/db';

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
  const featured = articles[0];
  const secondary = articles.slice(1, 3);
  const rest = articles.slice(3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* 头条区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* 主头条 */}
            {featured ? (
              <Link href={`/${featured.slug}`} className="lg:col-span-2 group">
                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {featured.image_url && (
                    <Image
                      src={featured.image_url}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {featured.league && (
                      <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-1 rounded mb-2">
                        {featured.league}
                      </span>
                    )}
                    <h1 className="text-white text-2xl lg:text-3xl font-bold leading-tight">
                      {featured.title}
                    </h1>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="lg:col-span-2 aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">暂无头条文章</p>
              </div>
            )}

            {/* 副头条 */}
            <div className="flex flex-col gap-4">
              {secondary.map((article) => (
                <Link key={article.id} href={`/${article.slug}`} className="group flex-1">
                  <div className="relative h-full min-h-[140px] bg-gray-200 rounded-lg overflow-hidden">
                    {article.image_url && (
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {article.league && (
                        <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-1 rounded mb-1">
                          {article.league}
                        </span>
                      )}
                      <h2 className="text-white text-sm font-bold leading-tight line-clamp-2">
                        {article.title}
                      </h2>
                    </div>
                  </div>
                </Link>
              ))}
              {secondary.length === 0 && (
                <div className="flex-1 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-sm">暂无文章</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 文章列表 */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">最新资讯</h2>
              <div className="space-y-4">
                {rest.map((article) => (
                  <Link
                    key={article.id}
                    href={`/${article.slug}`}
                    className="flex gap-4 group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative w-40 h-24 flex-shrink-0">
                      {article.image_url ? (
                        <Image
                          src={article.image_url}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 py-2 pr-4">
                      {article.league && (
                        <span className="text-primary text-xs font-bold">{article.league}</span>
                      )}
                      <h3 className="font-bold text-sm group-hover:text-primary transition line-clamp-2">
                        {article.title}
                      </h3>
                      {article.team_a && article.team_b && (
                        <p className="text-gray-500 text-xs mt-1">
                          {article.team_a} vs {article.team_b}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
                {rest.length === 0 && (
                  <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                    暂无更多文章
                  </div>
                )}
              </div>
            </div>

            {/* 侧边栏 - 比分 */}
            <div>
              <h2 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">实时比分</h2>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {matches.map((match, index) => (
                  <div
                    key={match.id}
                    className={`p-4 ${index > 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    <div className="text-xs text-gray-500 mb-2">{match.league}</div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{match.team_a}</span>
                      <span className="font-bold text-lg">
                        {match.status === 'finished'
                          ? `${match.score_a} - ${match.score_b}`
                          : match.status === 'live'
                          ? 'LIVE'
                          : 'VS'}
                      </span>
                      <span className="font-medium text-sm">{match.team_b}</span>
                    </div>
                    {match.status === 'live' && (
                      <div className="text-center mt-1">
                        <span className="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded animate-pulse">
                          进行中
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {matches.length === 0 && (
                  <div className="p-8 text-center text-gray-500">暂无比赛</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
