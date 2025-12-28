import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="surface border-t mt-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-bold text-gradient">瓦罗体育</span>
            <p className="text-sm text-secondary mt-2">专业足球篮球资讯平台</p>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3 text-primary">分类</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/football" className="text-secondary hover:text-primary">足球</Link></li>
              <li><Link href="/category/basketball" className="text-secondary hover:text-primary">篮球</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3 text-primary">联赛</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/league/premier-league" className="text-secondary hover:text-primary">英超</Link></li>
              <li><Link href="/league/nba" className="text-secondary hover:text-primary">NBA</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3 text-primary">关于</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-secondary hover:text-primary">关于我们</Link></li>
              <li><Link href="/contact" className="text-secondary hover:text-primary">联系我们</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-6 pt-6 text-center text-xs text-secondary">
          {new Date().getFullYear()} 瓦罗体育
        </div>
      </div>
    </footer>
  );
}
