import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pool from '@/lib/db';
import { Clock } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

const categoryMap: Record<string, string> = {
  football: '足球',
  basketball: '篮球',
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const name = categoryMap[slug];
  if (!name) return { title: '分类未找到' };
  return {
    title: `${name}新闻 - 瓦罗体育`,
    description: `瓦罗体育${name}频道，提供最新${name}赛事资讯、战报、深度解读`,
  };
}

async function getArticles(category: string) {
  try {
    // 根据分类查询，这里假设 league 字段包含分类信息
    const [rows] = await pool.query(
      `SELECT id, slug, title, league, team_a, team_b, image_url, created_at
       FROM articles WHERE status = 'published'
       ORDER BY created_at DESC LIMIT 20`
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

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categoryName = categoryMap[slug];
  
  if (!categoryName) notFound();

  const articles = await getArticles(slug);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-brand rounded-full" />
              {categoryName}
            </h1>
            <p className="text-sm text-secondary mt-1">
              最新{categoryName}赛事资讯
            </p>
          </div>

          {/* 文章列表 */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <Link key={article.id} href={`/${article.slug}`} className="group card overflow-hidden">
                  <div className="relative aspect-16-9">
                    {article.image_url ? (
                      <Image src={article.image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full surface" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs">
                      {article.league && <span className="text-gradient font-medium">{article.league}</span>}
                      <span className="text-secondary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(article.created_at)}
                      </span>
                    </div>
                    <h2 className="font-medium leading-snug line-clamp-2 group-hover:text-[#00d2ff] transition-colors">
                      {article.title}
                    </h2>
                    {article.team_a && article.team_b && (
                      <p className="text-sm text-secondary mt-2">
                        {article.team_a} vs {article.team_b}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center text-secondary">
              暂无{categoryName}资讯
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
