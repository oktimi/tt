'use client';
import { Paper, Typography, Slider, Box, Button } from '@mui/material';
import { useState } from 'react';

export default function AiWinRatePredictor({ matchId }: { matchId?: string }) {
  const [homeRate, setHomeRate] = useState(50);

  return (
    <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'white' }}>
      <Typography variant="h3" gutterBottom>AI 胜率预测</Typography>
      <Box sx={{ px: 2 }}>
        <Slider
          value={homeRate}
          onChange={(_, v) => setHomeRate(v as number)}
          valueLabelDisplay="on"
          sx={{ color: 'white' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>主队: {homeRate}%</Typography>
          <Typography>客队: {100 - homeRate}%</Typography>
        </Box>
      </Box>
      <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
        查看详细分析
      </Button>
    </Paper>
  );
}
