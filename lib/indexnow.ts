// IndexNow 推送工具
// 文章发布后调用此函数通知搜索引擎

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';

export async function pushToIndexNow(urls: string[]) {
  if (!INDEXNOW_KEY) return;

  const body = {
    host: 'valuo.cn',
    key: INDEXNOW_KEY,
    urlList: urls,
  };

  // 推送到 Bing
  await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  // 推送到 Yandex
  await fetch('https://yandex.com/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
