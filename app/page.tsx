import { Container, Typography, Box, Paper, Grid2 as Grid } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <SportsSoccerIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h1" color="primary">Valuo 体育</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h2" gutterBottom>最新赛事</Typography>
            <Typography color="text.secondary">
              实时比分、AI深度解读、球员数据对比
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h3">热门比赛</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
