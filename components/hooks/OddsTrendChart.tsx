'use client';
import { Paper, Typography, Box } from '@mui/material';

export default function OddsTrendChart({ matchId }: { matchId?: string }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h3" gutterBottom color="primary">赔率变动趋势</Typography>
      <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography color="text.secondary">图表加载中... (需集成 Echarts)</Typography>
      </Box>
    </Paper>
  );
}
