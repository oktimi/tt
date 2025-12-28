export type Locale = 'zh' | 'en';

export const defaultLocale: Locale = 'zh';

export const translations = {
  zh: {
    site: {
      name: 'Valuo Sports',
      tagline: '实时比分与AI深度解读',
    },
    nav: {
      home: '首页',
      football: '足球',
      basketball: '篮球',
      tennis: '网球',
      f1: 'F1',
      esports: '电竞',
      search: '搜索',
    },
    home: {
      mediaTitle: '媒体报道',
      mediaSubtitle: '了解我们在各大媒体渠道的最新动态',
      latestNews: '最新资讯',
      liveScores: '实时比分',
      noArticles: '暂无文章',
      noMatches: '暂无比赛',
      live: '进行中',
      vs: 'VS',
    },
    article: {
      home: '首页',
      news: '快讯',
      report: '战报',
      analysis: '深度解读',
    },
    footer: {
      categories: '分类',
      leagues: '联赛',
      about: '关于',
      aboutUs: '关于我们',
      contact: '联系我们',
      followUs: '关注我们',
      weibo: '微博',
      wechat: '微信',
      copyright: '版权所有',
    },
    theme: {
      light: '浅色模式',
      dark: '深色模式',
    },
  },
  en: {
    site: {
      name: 'Valuo Sports',
      tagline: 'Live Scores & AI Analysis',
    },
    nav: {
      home: 'Home',
      football: 'Football',
      basketball: 'Basketball',
      tennis: 'Tennis',
      f1: 'F1',
      esports: 'Esports',
      search: 'Search',
    },
    home: {
      mediaTitle: 'In the News',
      mediaSubtitle: 'Read more about what we are up to in the top media channels',
      latestNews: 'Latest News',
      liveScores: 'Live Scores',
      noArticles: 'No articles',
      noMatches: 'No matches',
      live: 'LIVE',
      vs: 'VS',
    },
    article: {
      home: 'Home',
      news: 'News',
      report: 'Report',
      analysis: 'Analysis',
    },
    footer: {
      categories: 'Categories',
      leagues: 'Leagues',
      about: 'About',
      aboutUs: 'About Us',
      contact: 'Contact',
      followUs: 'Follow Us',
      weibo: 'Weibo',
      wechat: 'WeChat',
      copyright: 'All rights reserved',
    },
    theme: {
      light: 'Light Mode',
      dark: 'Dark Mode',
    },
  },
} as const;

export function getTranslations(locale: Locale = defaultLocale) {
  return translations[locale];
}

export type Translations = typeof translations.zh;
