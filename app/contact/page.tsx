import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '联系我们 - 瓦罗体育',
  description: '联系瓦罗体育团队',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">联系我们</h1>
          <div className="card p-6 space-y-4 text-text-secondary-light dark:text-text-secondary-dark">
            <p>如有任何问题、建议或合作意向，请通过以下方式联系我们：</p>
            <ul className="list-disc list-inside space-y-2">
              <li>邮箱：contact@valuo.cn</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
