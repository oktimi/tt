'use client';
import { Box, Typography } from '@mui/material';
import { Play, Bookmark } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  author?: string;
  views?: string;
  shares?: string;
  image: string;
}

export default function HeroBanner({ title, subtitle, author, views, shares, image }: Props) {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        minHeight: 380,
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 4,
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.3)' }} />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          sx={{
            fontSize: '48px',
            fontWeight: 700,
            lineHeight: 1.1,
            color: 'white',
            maxWidth: 400,
            mb: 3,
          }}
        >
          {title}
        </Typography>
        {author && (
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', mb: 1 }}>
            {subtitle} {author}
          </Typography>
        )}
        {(views || shares) && (
          <Box sx={{ display: 'flex', gap: 3 }}>
            {views && (
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                ● 阅读 {views}
              </Typography>
            )}
            {shares && (
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                ✓ 分享 {shares}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          gap: '2px',
          bgcolor: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          overflow: 'hidden',
          width: 'fit-content',
        }}
      >
        <Box
          sx={{
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'white',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
          }}
        >
          <Play size={18} fill="white" />
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>立即阅读</Typography>
        </Box>
        <Box
          sx={{
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'white',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
          }}
        >
          <Bookmark size={18} />
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>稍后阅读</Typography>
        </Box>
      </Box>
    </Box>
  );
}
