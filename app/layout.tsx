import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '瓦罗体育 - 足球篮球实时比分与深度解读',
  description: '瓦罗体育提供足球、篮球实时比分、赛事战报、AI深度解读',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
