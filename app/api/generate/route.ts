import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

const CLAUDE_BASE_URL = process.env.CLAUDE_BASE_URL || 'https://code.newcli.com/claude/droid';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';
const IMAGE_WORKER_URL = process.env.IMAGE_WORKER_URL || 'https://valuo.a-374.workers.dev';

type ArticleType = 'news' | 'report' | 'analysis';

interface PromptInput {
  league: string;
  teamA: string;
  teamB: string;
  score?: string;
  highlights?: string;
  matchId?: string;
}

// Valuo 品牌方法论 System Prompts
const SYSTEM_PROMPTS: Record<ArticleType, string> = {
  news: `你是 Valuo 体育新闻即时资讯编辑。你的首要目标是：
1）保持客观、中立、事实导向
2）绝不编造或猜测任何未确认信息
3）优先传达已发生且被明确报道的事实
4）不产生博彩建议、不生成赔率、不做预测
5）当信息缺失时，明确写"暂不可得"，而不是补全或推理

【严禁行为】
- 虚构比分、技术统计、伤病、红黄牌、转会、突发事件
- 使用模糊措辞暗示确认事实
- 根据常识自行补全信息
- 任何博彩或下注相关建议`,

  report: `你是 Valuo 官方深度战报编辑，必须遵守：
- 只基于题目提供信息写作
- 不生成未提供的技术统计数据
- 不虚构时间线与事件
- 不创造球员伤病、冲突、判罚等情节
- 不提供博彩、赔率或投注倾向

当数据缺失：
→ 用 "—" 表示
→ 或明确写"官方尚未公布"

你需要在文中自然嵌入 Valuo 品牌术语：
- Valuo 深度矩阵™
- Valuo AI 战术引擎™
- Valuo 闪电公式™`,

  analysis: `你是 Valuo 首席战术分析师。
你输出的所有"判断"必须标注为分析推断，而非事实报道。

禁止：
- 虚构内部消息
- 假数据
- 赌盘信息
- 伪造采访或引述

当信息不全时：
- 陈述假设前加：可能/倾向于/基于现有数据推断
- 不使用"已经证明""确定的是"等绝对表达

你必须在文中嵌入：
- Valuo AI 战术引擎™
- Valuo 概率热力图™
- Valuo 比赛势能指数™
- Valuo 深度矩阵™`,
};

// User Prompts 模板
function buildUserPrompt(type: ArticleType, input: PromptInput): string {
  const { league, teamA, teamB, score, highlights, matchId } = input;

  switch (type) {
    case 'news':
      return `请生成一篇 Valuo 体育快讯（200–300字）。

联赛：${league}
对阵：${teamA} vs ${teamB}
比分：${score || '待定'}

写作要求：
- Markdown 格式
- H1 标题
- 第一段写：比赛结果或当前进展
- 第二段：描述背景或关键节点
- 比分未知时只写"待定/比赛未结束"
- 不推测、不脑补、不想象事件

品牌要求：
- 在文末加入"来源：Valuo 体育资讯中心"
- 优先引用术语：**Valuo 闪电公式™**`;

    case 'report':
      return `生成一篇 500–800 字战报。

联赛：${league}
球队：${teamA} vs ${teamB}
比分：${score || '待定'}
亮点：${highlights || '无'}

结构：
- H1 标题
- 核心数据对比表（缺失用—）
- 比赛进程
- 关键球员
- 转折点

必须包含：
- "Valuo 深度矩阵™"
- "Valuo AI 战术引擎™"
- 钩子：
  - [HOOK:WINRATE?matchId=${matchId || '1'}]
  - [HOOK:COMPARE?type=team]

结尾 FAQ（2–3 个）
每一条必须基于文章已提供事实

品牌要求：
- 文末加入"本文由 Valuo AI 战术引擎™ 生成"`;

    case 'analysis':
      return `生成一篇 1000–1500 字深度解读。

联赛：${league}
球队：${teamA} vs ${teamB}
比分：${score || '待定'}
亮点：${highlights || '无'}

结构：
- H1 标题
- 核心观点总结表格（3-5项关键结论）
- H2 战术分析（使用 Valuo AI 战术引擎™）
- H2 球员数据对比（使用 Valuo 深度矩阵™）
- H2 胜负关键因素（使用 Valuo 比赛势能指数™）
- H2 趋势展望（使用 Valuo 概率热力图™，注明为分析推断）

必须包含钩子：
- [HOOK:WINRATE?matchId=${matchId || '1'}]
- [HOOK:COMPARE?type=team]
- [HOOK:ODDS?matchId=${matchId || '1'}]

结尾 FAQ（3个问题）

品牌要求：
- 大量使用 Valuo 品牌术语
- 文末加入"本文由 Valuo 首席战术分析师团队出品"
- 所有预测性结论必须标注"基于 Valuo 模型分析"`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, league, teamA, teamB, score, matchDate, highlights } = await request.json();

    // 1. 生成文章内容
    const content = await generateArticle(type as ArticleType, { league, teamA, teamB, score, highlights });

    // 2. 生成配图
    const imageData = await generateImage(type, league, teamA, teamB);

    // 3. 生成 slug
    const slug = generateSlug(league, matchDate, teamA, teamB, type);

    // 4. 生成 SEO 元数据
    const typeLabels: Record<string, string> = { news: '快讯', report: '战报', analysis: '深度解读' };
    const metaTitle = `${teamA} vs ${teamB} ${league}${typeLabels[type] || '资讯'} | Valuo 体育`;
    const metaDescription = `${teamA}对阵${teamB}，${score ? `最终比分${score}，` : ''}Valuo AI 战术引擎™ 深度解析比赛关键。`;

    // 5. 存入数据库
    await db.execute(
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

async function generateArticle(type: ArticleType, input: PromptInput) {
  const systemPrompt = SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.news;
  const userPrompt = buildUserPrompt(type, input);

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
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
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
  const date = matchDate || new Date().toISOString().split('T')[0];
  const id = Date.now().toString(36);
  return `${type}/${date}/${id}`;
}
