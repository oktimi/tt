'use client';
import { Box, Typography, Avatar } from '@mui/material';

const topWriters = [
  { name: '张三', followers: '2,234,112', avatar: '' },
  { name: '李四', followers: '2,044,153', avatar: '' },
  { name: '王五', followers: '1,255,323', avatar: '' },
];

export default function TopWriters() {
  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: '16px', p: 3 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>热门作者</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {topWriters.map((writer, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: '#D6D8D7' }}>
              {writer.name[0]}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{writer.name}</Typography>
              <Typography variant="body2">{writer.followers} 关注者</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
