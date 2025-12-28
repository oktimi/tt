import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRightIcon } from './Icons';

interface Article {
  id: number;
  slug: string;
  title: string;
  league?: string;
  team_a?: string;
  team_b?: string;
  image_url?: string;
  created_at: string;
}

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <Link 
      href={`/${article.slug}`}
      className="group block card overflow-hidden hover:border-slate-300 dark:hover:border-slate-600 transition-all"
    >
      <div className={`flex ${isFeatured ? 'flex-col md:flex-row' : 'flex-row'} gap-4 p-4`}>
        {/* Image */}
        {article.image_url && (
          <div className={`relative ${isFeatured ? 'w-full md:w-64 h-40' : 'w-32 h-20'} flex-shrink-0 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800`}>
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Source / League */}
            {article.league && (
              <p className="section-title mb-2">{article.league}</p>
            )}

            {/* Date */}
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
              {formatDate(article.created_at)}
            </p>

            {/* Title */}
            <h3 className={`font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 ${isFeatured ? 'text-lg' : 'text-sm'}`}>
              {article.title}
            </h3>

            {/* Teams */}
            {article.team_a && article.team_b && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {article.team_a} vs {article.team_b}
              </p>
            )}
          </div>

          {/* Arrow indicator */}
          <div className="flex justify-end mt-2">
            <ArrowUpRightIcon className="text-slate-400 group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
