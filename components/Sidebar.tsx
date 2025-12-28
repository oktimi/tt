'use client';
import { Box, Typography } from '@mui/material';
import { Home, Newspaper, TrendingUp, Users, Bookmark, Settings } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { icon: Home, label: '首页', active: true },
  { icon: Newspaper, label: '新闻' },
  { icon: TrendingUp, label: '数据' },
  { icon: Users, label: '球队' },
  { icon: Bookmark, label: '收藏' },
  { icon: Settings, label: '设置' },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 72,
        minHeight: '100vh',
        bgcolor: '#F5F6F5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 3,
        gap: 1,
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Image src="/logo.svg" alt="Valuo" width={36} height={36} />
      </Box>
      {navItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            cursor: 'pointer',
            bgcolor: item.active ? '#D6D8D7' : 'transparent',
            color: item.active ? '#1A1A1A' : '#8E8E8E',
            '&:hover': {
              bgcolor: '#E0E2E1',
            },
          }}
        >
          <item.icon size={22} strokeWidth={1.5} />
        </Box>
      ))}
    </Box>
  );
}
