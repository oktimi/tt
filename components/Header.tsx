import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { name: '足球', href: '/category/足球' },
  { name: '篮球', href: '/category/篮球' },
  { name: '网球', href: '/category/网球' },
  { name: 'F1', href: '/category/F1' },
  { name: '电竞', href: '/category/电竞' },
];

export default function Header() {
  return (
    <header className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Valuo" width={32} height={32} />
            <span className="font-bold text-xl">VALUO</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="text-sm font-medium hover:text-primary transition"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm">搜索</button>
          </div>
        </div>
      </div>
    </header>
  );
}
