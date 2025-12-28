import {
  Box, Container, Grid, Card, CardContent, CardMedia, CardActionArea,
  Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar,
  Chip, Paper, Divider, AppBar, Toolbar, IconButton, Drawer,
} from '@mui/material';
import { Menu, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import pool from '@/lib/db';

async function getArticles() {
  try {
    const [rows] = await pool.query(
      `SELECT id, slug, title, league, team_a, team_b, score, image_url, created_at
       FROM articles WHERE status = 'published'
       ORDER BY created_at DESC LIMIT 10`
    );
    return rows as any[];
  } catch {
    return [];
  }
}

async function getMatches() {
  try {
    const [rows] = await pool.query(
      `SELECT id, league, team_a, team_b, score_a, score_b, match_time, status
       FROM matches ORDER BY match_time DESC LIMIT 5`
    );
    return rows as any[];
  } catch {
    return [];
  }
}

async function getLeagues() {
  try {
    const [rows] = await pool.query(
      `SELECT league, COUNT(*) as count FROM articles
       WHERE status = 'published' GROUP BY league ORDER BY count DESC`
    );
    return rows as any[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [articles, matches, leagues] = await Promise.all([
    getArticles(),
    getMatches(),
    getLeagues(),
  ]);

  const featured = articles[0];
  const restArticles = articles.slice(1);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Image src="/logo.svg" alt="Valuo" width={32} height={32} />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>Valuo Sports</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton><Search size={20} /></IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* 主内容区 */}
          <Grid item xs={12} md={8}>
            {/* 头条文章 */}
            {featured && (
              <Card sx={{ mb: 3 }}>
                <CardActionArea component={Link} href={`/${featured.slug}`}>
                  {featured.image_url && (
                    <CardMedia
                      component="img"
                      height="300"
                      image={featured.image_url}
                      alt={featured.title}
                    />
                  )}
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      {featured.league && <Chip label={featured.league} size="small" />}
                      {featured.score && <Chip label={featured.score} size="small" variant="outlined" />}
                    </Box>
                    <Typography variant="h5" gutterBottom>{featured.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {featured.team_a} vs {featured.team_b}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}

            {/* 文章列表 */}
            <Typography variant="h6" gutterBottom>最新文章</Typography>
            <Grid container spacing={2}>
              {restArticles.map((article) => (
                <Grid item xs={12} sm={6} key={article.id}>
                  <Card>
                    <CardActionArea component={Link} href={`/${article.slug}`}>
                      {article.image_url && (
                        <CardMedia
                          component="img"
                          height="140"
                          image={article.image_url}
                          alt={article.title}
                        />
                      )}
                      <CardContent>
                        {article.league && <Chip label={article.league} size="small" sx={{ mb: 1 }} />}
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {article.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {articles.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">暂无文章，请先生成内容</Typography>
              </Paper>
            )}
          </Grid>

          {/* 侧边栏 */}
          <Grid item xs={12} md={4}>
            {/* 赛事列表 */}
            <Paper sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ p: 2, pb: 1 }}>近期赛事</Typography>
              <List disablePadding>
                {matches.map((match, index) => (
                  <Box key={match.id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemText
                        primary={`${match.team_a} vs ${match.team_b}`}
                        secondary={
                          <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{match.league}</span>
                            <span>
                              {match.status === 'finished'
                                ? `${match.score_a} - ${match.score_b}`
                                : match.status === 'live' ? '进行中' : '未开始'}
                            </span>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
                {matches.length === 0 && (
                  <ListItem>
                    <ListItemText secondary="暂无赛事" />
                  </ListItem>
                )}
              </List>
            </Paper>

            {/* 分类 */}
            <Paper>
              <Typography variant="h6" sx={{ p: 2, pb: 1 }}>分类</Typography>
              <Box sx={{ p: 2, pt: 0, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {leagues.map((league) => (
                  <Chip
                    key={league.league}
                    label={`${league.league} (${league.count})`}
                    clickable
                    component={Link}
                    href={`/category/${league.league}`}
                  />
                ))}
                {leagues.length === 0 && (
                  <Typography variant="body2" color="text.secondary">暂无分类</Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
