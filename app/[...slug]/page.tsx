import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ChevronRightIcon } from '@/components/Icons';
import db from '@/lib/db';
import { getTranslations } from '@/lib/i18n';

const t = getTranslations('zh');

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
  if (!article) return { title: t.article.home };
  return { title: article.meta_title, description: article.meta_description };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
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
    news: t.article.news,
    report: t.article.report,
    analysis: t.article.analysis,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              {t.article.home}
            </Link>
            <ChevronRightIcon size={14} />
            {article.league && (
              <>
                <Link 
                  href={`/category/${article.league}`} 
                  className="hover:text-primary transition-colors"
                >
                  {article.league}
                </Link>
                <ChevronRightIcon size={14} />
              </>
            )}
            <span className="text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
              {article.title}
            </span>
          </nav>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.league && (
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {article.league}
              </span>
            )}
            {article.type && typeLabels[article.type] && (
              <span className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                {typeLabels[article.type]}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 text-balance">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8 pb-8 border-b border-border-light dark:border-border-dark">
            <time dateTime={article.published_at || article.created_at}>
              {formatDate(article.published_at || article.created_at)}
            </time>
            {article.team_a && article.team_b && (
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-slate-400 rounded-full" />
                {article.team_a} vs {article.team_b}
              </span>
            )}
            {article.score && (
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-slate-400 rounded-full" />
                {article.score}
              </span>
            )}
          </div>

          {/* Featured Image */}
          {article.image_url && (
            <div className="relative aspect-video mb-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={article.image_url}
                alt={article.image_alt || article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
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
                author: { '@type': 'Organization', name: t.site.name },
              }),
            }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
