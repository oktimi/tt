'use client';
import { Box, Typography } from '@mui/material';
import { ListMusic, Heart, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

interface Article {
  id: number;
  title: string;
  author: string;
  image?: string;
}

interface Props {
  articles: Article[];
}

export default function PopularArticles({ articles }: Props) {
  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 2 }}>今日热门</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {articles.map((article) => (
          <Box
            key={article.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: '12px',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#F5F6F5' },
            }}
          >
            {article.image && (
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  bgcolor: '#D6D8D7',
                }}
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  width={64}
                  height={64}
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {article.title}
              </Typography>
              <Typography variant="body2">{article.author}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ p: 1, cursor: 'pointer', color: 'text.secondary' }}>
                <ListMusic size={18} strokeWidth={1.5} />
              </Box>
              <Box sx={{ p: 1, cursor: 'pointer', color: 'text.secondary' }}>
                <Heart size={18} strokeWidth={1.5} />
              </Box>
              <Box sx={{ p: 1, cursor: 'pointer', color: 'text.secondary' }}>
                <MoreHorizontal size={18} strokeWidth={1.5} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
