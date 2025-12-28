'use client';
import { Box, Typography } from '@mui/material';
import { Globe, MessageCircle, Flame, Grid3X3 } from 'lucide-react';

const tags = [
  { icon: Globe, label: '全球热点' },
  { icon: MessageCircle, label: '热议话题' },
  { icon: Flame, label: '快速上升' },
  { icon: Grid3X3, label: '分类' },
];

export default function RecommendTags() {
  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 2 }}>推荐</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {tags.map((tag, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              py: 1.5,
              px: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            <tag.icon size={18} strokeWidth={1.5} color="#8E8E8E" />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{tag.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
