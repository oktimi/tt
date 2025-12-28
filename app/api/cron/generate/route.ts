import { NextResponse } from 'next/server';
import db from '@/lib/db';

const CLAUDE_BASE_URL = process.env.CLAUDE_BASE_URL || 'https://code.newcli.com/claude/droid';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';
const IMAGE_WORKER_URL = process.env.IMAGE_WORKER_URL || 'https://valuo.a-374.workers.dev';
const CRON_SECRET = process.env.CRON_SECRET || '';

type ArticleType = 'news' | 'report' | 'analysis';

// 示例比赛数据池
const SAMPLE_MATCHES = [
  { league: '英超', teamA: '曼城', teamB: '阿森纳' },
  { league: '英超', teamA: '利物浦', teamB: '曼联' },
  { league: '英超', teamA: '切尔西', teamB: '热刺' },
  { league: '西甲', teamA: '皇家马德里', teamB: '巴塞罗那' },
  { league: '西甲', teamA: '马德里竞技', teamB: '塞维利亚' },
  { league: '意甲', teamA: 'AC米兰', teamB: '国际米兰' },
  { league: '意甲', teamA: '尤文图斯', teamB: '那不勒斯' },
  { league: '德甲', teamA: '拜仁慕尼黑', teamB: '多特蒙德' },
  { league: '法甲', teamA: '巴黎圣日耳曼', teamB: '马赛' },
  { league: 'NBA', teamA: '湖人', teamB: '勇士' },
  { league: 'NBA', teamA: '凯尔特人', teamB: '热火' },
  { league: 'NBA', teamA: '雄鹿', teamB: '76人' },
  { league: 'CBA', teamA: '广东宏远', teamB: '辽宁本钢' },
  { league: 'CBA', teamA: '北京首钢', teamB: '上海久事' },
];

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

function buildUserPrompt(type: ArticleType, input: { league: string; teamA: string; teamB: string; score?: string; highlights?: string; matchId?: string; imageUrls: string[] }): string {
  const { league, teamA, teamB, score, highlights, matchId, imageUrls } = input;
  const imageInstructions = imageUrls.length > 0
    ? `\n\n【图片插入要求】
请在文章适当位置插入以下图片（使用 Markdown 图片语法）：
${imageUrls.map((url, i) => `- 图片${i + 1}: ![${teamA} vs ${teamB} 精彩瞬间${i + 1}](${url})`).join('\n')}
图片应自然融入文章内容，不要集中放在一起。`
    : '';

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
- 优先引用术语：**Valuo 闪电公式™**${imageInstructions}`;

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
- 文末加入"本文由 Valuo AI 战术引擎™ 生成"${imageInstructions}`;

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
- 所有预测性结论必须标注"基于 Valuo 模型分析"${imageInstructions}`;
  }
}

async function generateImage(type: string, league: string, teamA: string, teamB: string): Promise<{ url: string; altText: string } | null> {
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

async function generateMultipleImages(league: string, teamA: string, teamB: string, count: number): Promise<{ url: string; altText: string }[]> {
  const images: { url: string; altText: string }[] = [];
  for (let i = 0; i < count; i++) {
    const img = await generateImage('atmosphere', league, teamA, teamB);
    if (img) images.push(img);
  }
  return images;
}

async function generateArticle(type: ArticleType, input: { league: string; teamA: string; teamB: string; score?: string; highlights?: string; matchId?: string; imageUrls: string[] }) {
  const systemPrompt = SYSTEM_PROMPTS[type];
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

function generateSlug(league: string, matchDate: string, teamA: string, teamB: string, type: string) {
  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
  const date = matchDate || new Date().toISOString().split('T')[0];
  return `${slugify(league)}/${date}/${slugify(teamA)}-vs-${slugify(teamB)}-${type}`;
}

function generateScore(league: string): string {
  if (['NBA', 'CBA'].includes(league)) {
    const scoreA = Math.floor(Math.random() * 40) + 90;
    const scoreB = Math.floor(Math.random() * 40) + 90;
    return `${scoreA}-${scoreB}`;
  }
  const scoreA = Math.floor(Math.random() * 5);
  const scoreB = Math.floor(Math.random() * 5);
  return `${scoreA}-${scoreB}`;
}

export async function GET(request: Request) {
  // 验证 cron secret
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  if (CRON_SECRET && secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 随机选择比赛
    const match = SAMPLE_MATCHES[Math.floor(Math.random() * SAMPLE_MATCHES.length)];
    const { league, teamA, teamB } = match;

    // 随机选择文章类型
    const types: ArticleType[] = ['news', 'report', 'analysis'];
    const type = types[Math.floor(Math.random() * types.length)];

    // 生成比分
    const score = generateScore(league);
    const matchDate = new Date().toISOString().split('T')[0];
    const matchId = `${Date.now()}`;

    // 生成随机数量的图片 (1-3张)
    const imageCount = Math.floor(Math.random() * 3) + 1;
    const images = await generateMultipleImages(league, teamA, teamB, imageCount);
    const imageUrls = images.map(img => img.url);

    // 封面图（第一张）
    const coverImage = images[0] || null;

    // 生成文章内容（包含内嵌图片）
    const content = await generateArticle(type, {
      league, teamA, teamB, score,
      highlights: '精彩对决',
      matchId,
      imageUrls
    });

    // 生成 slug
    const slug = generateSlug(league, matchDate, teamA, teamB, type);

    // 生成 SEO 元数据
    const typeLabels: Record<string, string> = { news: '快讯', report: '战报', analysis: '深度解读' };
    const metaTitle = `${teamA} vs ${teamB} ${league}${typeLabels[type]} | Valuo 体育`;
    const metaDescription = `${teamA}对阵${teamB}，最终比分${score}，Valuo AI 战术引擎™ 深度解析比赛关键。`;

    // 检查是否已存在相同 slug
    const [existing] = await db.execute(
      'SELECT id FROM articles WHERE slug = ?',
      [slug]
    );

    if ((existing as any[]).length > 0) {
      // 添加时间戳避免重复
      const uniqueSlug = `${slug}-${Date.now()}`;
      await db.execute(
        `INSERT INTO articles (slug, title, content, type, league, team_a, team_b, score, match_date, image_url, image_alt, meta_title, meta_description, status, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW())`,
        [uniqueSlug, metaTitle, content, type, league, teamA, teamB, score, matchDate, coverImage?.url, coverImage?.altText, metaTitle, metaDescription]
      );

      return NextResponse.json({
        success: true,
        slug: uniqueSlug,
        type,
        league,
        teams: `${teamA} vs ${teamB}`,
        score,
        imageCount: images.length,
      });
    }

    // 存入数据库
    await db.execute(
      `INSERT INTO articles (slug, title, content, type, league, team_a, team_b, score, match_date, image_url, image_alt, meta_title, meta_description, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW())`,
      [slug, metaTitle, content, type, league, teamA, teamB, score, matchDate, coverImage?.url, coverImage?.altText, metaTitle, metaDescription]
    );

    return NextResponse.json({
      success: true,
      slug,
      type,
      league,
      teams: `${teamA} vs ${teamB}`,
      score,
      imageCount: images.length,
    });

  } catch (error: any) {
    console.error('Cron generate error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
