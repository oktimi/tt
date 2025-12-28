import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400 py-8 mt-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-3">分类</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/足球" className="hover:text-white">足球</Link></li>
              <li><Link href="/category/篮球" className="hover:text-white">篮球</Link></li>
              <li><Link href="/category/网球" className="hover:text-white">网球</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">联赛</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/league/NBA" className="hover:text-white">NBA</Link></li>
              <li><Link href="/league/英超" className="hover:text-white">英超</Link></li>
              <li><Link href="/league/西甲" className="hover:text-white">西甲</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">关于</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">关于我们</Link></li>
              <li><Link href="/contact" className="hover:text-white">联系我们</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">关注我们</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">微博</a></li>
              <li><a href="#" className="hover:text-white">微信</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          © 2025 Valuo Sports. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
