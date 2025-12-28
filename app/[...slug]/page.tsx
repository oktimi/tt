import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import db from '@/lib/db';

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
  if (!article) return { title: '文章未找到' };
  return { title: article.meta_title, description: article.meta_description };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const fullSlug = slug.join('/');

  const [rows] = await db.execute(
    'SELECT * FROM articles WHERE slug = ? AND status = "published"',
    [fullSlug]
  );
  const article = (rows as any[])[0];
  if (!article) notFound();

  const typeLabels: Record<string, string> = {
    news: '快讯',
    report: '战报',
    analysis: '深度解读',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* 面包屑 */}
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">首页</Link>
            <span className="mx-2">/</span>
            <Link href={`/category/${article.league}`} className="hover:text-primary">
              {article.league}
            </Link>
          </nav>

          {/* 标签 */}
          <div className="flex gap-2 mb-4">
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
              {article.league}
            </span>
            <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded">
              {typeLabels[article.type]}
            </span>
          </div>

          {/* 标题 */}
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

          {/* 元信息 */}
          <div className="text-gray-500 text-sm mb-6">
            {new Date(article.published_at || article.created_at).toLocaleDateString('zh-CN')}
            {article.team_a && article.team_b && (
              <span> · {article.team_a} vs {article.team_b}</span>
            )}
            {article.score && <span> · {article.score}</span>}
          </div>

          {/* 头图 */}
          {article.image_url && (
            <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
              <Image
                src={article.image_url}
                alt={article.image_alt || article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* 正文 */}
          <MarkdownRenderer content={article.content} />

          {/* JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'NewsArticle',
                headline: article.title,
                image: article.image_url,
                datePublished: article.published_at || article.created_at,
                author: { '@type': 'Organization', name: 'Valuo Sports' },
              }),
            }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
