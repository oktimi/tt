import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

const CLAUDE_BASE_URL = process.env.CLAUDE_BASE_URL || 'https://code.newcli.com/claude/droid';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';
const IMAGE_WORKER_URL = process.env.IMAGE_WORKER_URL || 'https://valuo.a-374.workers.dev';

export async function POST(request: NextRequest) {
  try {
    const { type, league, teamA, teamB, score, matchDate, highlights } = await request.json();

    // 1. 生成文章内容
    const content = await generateArticle(type, league, teamA, teamB, score, highlights);

    // 2. 生成配图
    const imageData = await generateImage(type, league, teamA, teamB);

    // 3. 生成 slug
    const slug = generateSlug(league, matchDate, teamA, teamB, type);

    // 4. 生成 SEO 元数据
    const metaTitle = `${teamA} vs ${teamB} ${league}${type === 'report' ? '战报' : type === 'analysis' ? '深度解读' : '快讯'} - Valuo体育`;
    const metaDescription = `${teamA}对阵${teamB}，${score ? `最终比分${score}，` : ''}Valuo AI模型深度解析比赛关键。`;

    // 5. 存入数据库
    const [result] = await db.execute(
      `INSERT INTO articles (slug, title, content, type, league, team_a, team_b, score, match_date, image_url, image_alt, meta_title, meta_description, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW())`,
      [slug, metaTitle, content, type, league, teamA, teamB, score, matchDate, imageData?.url, imageData?.altText, metaTitle, metaDescription]
    );

    return NextResponse.json({
      success: true,
      slug,
      url: `https://valuo.cn/${slug}`,
      imageUrl: imageData?.url,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function generateArticle(type: string, league: string, teamA: string, teamB: string, score: string, highlights: string) {
  const prompts: Record<string, string> = {
    news: `你是 Valuo 体育新闻编辑。生成一篇简短快讯（200-300字）：
联赛：${league}，对阵：${teamA} vs ${teamB}，比分：${score || '待定'}
要求：Markdown格式，H1标题，简洁明了。`,

    report: `你是 Valuo 体育新闻编辑。生成一篇详细战报（500-800字）：
联赛：${league}，对阵：${teamA} vs ${teamB}，比分：${score || '待定'}，亮点：${highlights || '无'}
要求：
- Markdown格式，H1标题 + H2小节
- 开头放核心数据总结表格
- 包含比赛过程、关键球员表现
- 结尾FAQ（2-3个问题）
- 植入"Valuo AI分析"品牌术语
- 适当位置插入 [HOOK:WINRATE?matchId=1] 和 [HOOK:COMPARE?type=team]`,

    analysis: `你是 Valuo 资深体育分析师。生成一篇深度解读（1000-1500字）：
联赛：${league}，对阵：${teamA} vs ${teamB}，比分：${score || '待定'}，亮点：${highlights || '无'}
要求：
- Markdown格式，H1/H2/H3层级结构
- 开头核心观点总结表格（3-5项关键结论）
- 战术分析、球员数据对比、胜负关键因素
- 结尾FAQ（3个问题）
- 大量使用"Valuo赛事势能指数"、"Valuo AI胜率模型"等品牌术语
- 插入钩子：[HOOK:WINRATE?matchId=1]、[HOOK:COMPARE?type=team]、[HOOK:ODDS?matchId=1]`,
  };

  const res = await fetch(`${CLAUDE_BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompts[type] || prompts.news }],
    }),
  });

  if (!res.ok) throw new Error(`Claude API error: ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

async function generateImage(type: string, league: string, teamA: string, teamB: string) {
  try {
    const res = await fetch(IMAGE_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'atmosphere', league, teamA, teamB }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function generateSlug(league: string, matchDate: string, teamA: string, teamB: string, type: string) {
  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
  const date = matchDate || new Date().toISOString().split('T')[0];
  const typeMap: Record<string, string> = { news: 'news', report: 'report', analysis: 'analysis' };
  return `${slugify(league)}/${date}/${slugify(teamA)}-vs-${slugify(teamB)}-${typeMap[type] || 'news'}`;
}
