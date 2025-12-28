#!/usr/bin/env node

/**
 * Valuo 自动文章生成调度器
 * 随机 1-5 分钟间隔生成文章
 */

const APP_URL = process.env.APP_URL || 'http://localhost:10567';
const CRON_SECRET = process.env.CRON_SECRET || '';

function getRandomInterval() {
  // 1-5 分钟随机间隔 (毫秒)
  const minMinutes = 1;
  const maxMinutes = 5;
  const minutes = Math.random() * (maxMinutes - minMinutes) + minMinutes;
  return Math.floor(minutes * 60 * 1000);
}

async function generateArticle() {
  const url = `${APP_URL}/api/cron/generate${CRON_SECRET ? `?secret=${CRON_SECRET}` : ''}`;

  try {
    console.log(`[${new Date().toISOString()}] 开始生成文章...`);

    const res = await fetch(url, { method: 'GET' });
    const data = await res.json();

    if (data.success) {
      console.log(`[${new Date().toISOString()}] ✅ 文章生成成功:`);
      console.log(`   类型: ${data.type}`);
      console.log(`   联赛: ${data.league}`);
      console.log(`   对阵: ${data.teams}`);
      console.log(`   比分: ${data.score}`);
      console.log(`   图片数: ${data.imageCount}`);
      console.log(`   Slug: ${data.slug}`);
    } else {
      console.error(`[${new Date().toISOString()}] ❌ 生成失败:`, data.error);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ 请求失败:`, error.message);
  }
}

async function scheduleNext() {
  const interval = getRandomInterval();
  const minutes = (interval / 60000).toFixed(1);
  console.log(`[${new Date().toISOString()}] ⏰ 下次生成将在 ${minutes} 分钟后`);

  setTimeout(async () => {
    await generateArticle();
    scheduleNext();
  }, interval);
}

// 启动
console.log('========================================');
console.log('  Valuo 自动文章生成调度器已启动');
console.log(`  目标地址: ${APP_URL}`);
console.log('  间隔: 随机 1-5 分钟');
console.log('========================================');

// 立即生成第一篇
generateArticle().then(() => {
  scheduleNext();
});
