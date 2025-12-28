import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '关于我们 - 瓦罗体育',
  description: '瓦罗体育是专业的足球篮球资讯平台',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">关于瓦罗体育</h1>
          <div className="card p-6 space-y-4 text-text-secondary-light dark:text-text-secondary-dark">
            <p>瓦罗体育是一个专注于足球和篮球的专业体育资讯平台。</p>
            <p>我们提供实时比分、赛事战报、深度解读等内容，致力于为体育爱好者提供最及时、最专业的资讯服务。</p>
            <p>如有任何问题或建议，欢迎联系我们。</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
