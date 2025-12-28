'use client';
import { Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const mockData = [
  { stat: '场均得分', player1: '28.5', player2: '25.3' },
  { stat: '场均篮板', player1: '7.2', player2: '6.8' },
  { stat: '场均助攻', player1: '8.1', player2: '10.2' },
  { stat: '投篮命中率', player1: '52%', player2: '48%' },
];

export default function PlayerComparisonTable({ type, id }: { type?: string; id?: string }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h3" gutterBottom color="primary">球员数据对比</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>数据项</TableCell>
            <TableCell align="center">球员 A</TableCell>
            <TableCell align="center">球员 B</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockData.map((row) => (
            <TableRow key={row.stat}>
              <TableCell>{row.stat}</TableCell>
              <TableCell align="center">{row.player1}</TableCell>
              <TableCell align="center">{row.player2}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
