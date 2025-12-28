import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Valuo Sports - 实时比分与AI深度解读',
  description: '专业体育新闻平台，提供实时比分、AI赛事解读、球员数据对比',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
