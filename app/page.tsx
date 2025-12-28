import { Box } from '@mui/material';
import Sidebar from '@/components/Sidebar';
import HeroBanner from '@/components/HeroBanner';
import RecommendTags from '@/components/RecommendTags';
import PopularArticles from '@/components/PopularArticles';
import CategoryGrid from '@/components/CategoryGrid';
import TopWriters from '@/components/TopWriters';
import pool from '@/lib/db';

async function getArticles() {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, author, image_url as image FROM articles ORDER BY created_at DESC LIMIT 5'
    );
    return rows as any[];
  } catch {
    return [];
  }
}

async function getFeaturedArticle() {
  try {
    const [rows] = await pool.query(
      'SELECT title, author, image_url FROM articles ORDER BY created_at DESC LIMIT 1'
    );
    const articles = rows as any[];
    if (articles.length > 0) {
      return {
        title: articles[0].title,
        author: articles[0].author,
        image: articles[0].image_url,
      };
    }
  } catch {}
  return {
    title: '探索体育世界的无限可能',
    author: 'Valuo Sports',
    image: 'https://images.unsplash.com/photo-1461896836934- voices-of-the-game?w=1200',
  };
}

export default async function Home() {
  const articles = await getArticles();
  const featured = await getFeaturedArticle();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', gap: 3, p: 3 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <HeroBanner
            title={featured.title}
            subtitle="作者"
            author={featured.author}
            views="80,342"
            shares="932"
            image={featured.image}
          />
          <RecommendTags />
          <PopularArticles
            articles={articles.length > 0 ? articles : [
              { id: 1, title: '为每一个问题找到解决方案', author: '体育评论员' },
              { id: 2, title: '深度解析本赛季战术变化', author: '战术分析师' },
            ]}
          />
        </Box>
        <Box sx={{ width: 280, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <CategoryGrid />
          <TopWriters />
        </Box>
      </Box>
    </Box>
  );
}
