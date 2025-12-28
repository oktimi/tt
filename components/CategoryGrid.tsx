'use client';
import { Box, Typography } from '@mui/material';
import { Wallet, Eye, Briefcase, Users, Compass, Grid3X3 } from 'lucide-react';

const categories = [
  { icon: Wallet, name: '足球', count: '120+' },
  { icon: Eye, name: '篮球', count: '220+' },
  { icon: Briefcase, name: '网球', count: '100+' },
  { icon: Users, name: '电竞', count: '100+' },
  { icon: Compass, name: '综合', count: '420+', active: true },
  { icon: Grid3X3, name: '更多', count: '10,000+' },
];

export default function CategoryGrid() {
  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: '16px', overflow: 'hidden' }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h2">分类</Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {categories.map((cat, index) => (
          <Box
            key={index}
            sx={{
              p: 2.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              borderTop: '0.5px solid',
              borderLeft: index % 3 !== 0 ? '0.5px solid' : 'none',
              borderColor: 'divider',
              bgcolor: cat.active ? 'action.selected' : 'transparent',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            <cat.icon size={24} strokeWidth={1.5} color="#1A1A1A" />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{cat.name}</Typography>
            <Typography variant="body2">{cat.count}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
