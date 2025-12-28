import type { Metadata } from 'next';
import { getTranslations } from '@/lib/i18n';
import './globals.css';

const t = getTranslations('zh');

export const metadata: Metadata = {
  title: `${t.site.name} - ${t.site.tagline}`,
  description: t.site.tagline,
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('valuo-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
