import { notFound } from 'next/navigation';
import { Container, Box, Typography, Chip, Stack } from '@mui/material';
import db from '@/lib/db';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface Props {
  params: Promise<{ slug: string[] }>;
}

// ISR: 60秒重新验证
export const revalidate = 60;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const fullSlug = slug.join('/');

  const [rows] = await db.execute('SELECT meta_title, meta_description FROM articles WHERE slug = ? AND status = "published"', [fullSlug]);
  const article = (rows as any[])[0];

  if (!article) return { title: '文章未找到' };

  return {
    title: article.meta_title,
    description: article.meta_description,
  };
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip label={article.league} color="primary" size="small" />
        <Chip label={typeLabels[article.type]} variant="outlined" size="small" />
      </Stack>

      {article.image_url && (
        <Box
          component="img"
          src={article.image_url}
          alt={article.image_alt}
          sx={{ width: '100%', borderRadius: 2, mb: 3 }}
        />
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
        {new Date(article.published_at).toLocaleDateString('zh-CN')} · {article.team_a} vs {article.team_b}
        {article.score && ` · ${article.score}`}
      </Typography>

      <MarkdownRenderer content={article.content} />

      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsEvent',
            name: `${article.team_a} vs ${article.team_b}`,
            startDate: article.match_date,
            location: { '@type': 'Place', name: article.league },
            competitor: [
              { '@type': 'SportsTeam', name: article.team_a },
              { '@type': 'SportsTeam', name: article.team_b },
            ],
          }),
        }}
      />
    </Container>
  );
}
