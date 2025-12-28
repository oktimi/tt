'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box } from '@mui/material';
import AiWinRatePredictor from './hooks/AiWinRatePredictor';
import PlayerComparisonTable from './hooks/PlayerComparisonTable';
import OddsTrendChart from './hooks/OddsTrendChart';

const HOOK_REGEX = /\[HOOK:(\w+)(?:\?(.+))?\]/g;

function parseHookParams(paramStr: string): Record<string, string> {
  if (!paramStr) return {};
  return Object.fromEntries(paramStr.split('&').map(p => p.split('=')));
}

function renderHook(type: string, params: Record<string, string>) {
  switch (type) {
    case 'WINRATE':
      return <AiWinRatePredictor matchId={params.matchId} />;
    case 'COMPARE':
      return <PlayerComparisonTable type={params.type} id={params.id} />;
    case 'ODDS':
      return <OddsTrendChart matchId={params.matchId} />;
    default:
      return null;
  }
}

export default function MarkdownRenderer({ content }: { content: string }) {
  // 提取钩子标签
  const hooks: { type: string; params: Record<string, string>; placeholder: string }[] = [];
  let processedContent = content.replace(HOOK_REGEX, (match, type, paramStr) => {
    const placeholder = `__HOOK_${hooks.length}__`;
    hooks.push({ type, params: parseHookParams(paramStr), placeholder });
    return placeholder;
  });

  return (
    <Box>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => <Typography variant="h1" gutterBottom>{children}</Typography>,
          h2: ({ children }) => <Typography variant="h2" gutterBottom sx={{ mt: 3 }}>{children}</Typography>,
          h3: ({ children }) => <Typography variant="h3" gutterBottom sx={{ mt: 2 }}>{children}</Typography>,
          p: ({ children }) => {
            const text = String(children);
            const hookMatch = hooks.find(h => text.includes(h.placeholder));
            if (hookMatch) {
              return <Box sx={{ my: 2 }}>{renderHook(hookMatch.type, hookMatch.params)}</Box>;
            }
            return <Typography paragraph>{children}</Typography>;
          },
          table: ({ children }) => (
            <Paper sx={{ my: 2, overflow: 'auto' }}>
              <Table size="small">{children}</Table>
            </Paper>
          ),
          thead: ({ children }) => <TableHead>{children}</TableHead>,
          tbody: ({ children }) => <TableBody>{children}</TableBody>,
          tr: ({ children }) => <TableRow>{children}</TableRow>,
          th: ({ children }) => <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>{children}</TableCell>,
          td: ({ children }) => <TableCell>{children}</TableCell>,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </Box>
  );
}
