'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Menu, X, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const categories = [
  { label: '足球', href: '/category/football' },
  { label: '篮球', href: '/category/basketball' },
];

const leagues = {
  football: [
    { label: '英超', href: '/league/premier-league' },
    { label: '西甲', href: '/league/la-liga' },
    { label: '意甲', href: '/league/serie-a' },
    { label: '德甲', href: '/league/bundesliga' },
    { label: '中超', href: '/league/csl' },
  ],
  basketball: [
    { label: 'NBA', href: '/league/nba' },
    { label: 'CBA', href: '/league/cba' },
  ],
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="瓦罗体育" width={28} height={28} className="dark:invert" />
            <span className="text-xl font-bold text-gradient">瓦罗体育</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-black/5 dark:hover:bg-white/5">
              首页
            </Link>
            
            {/* 足球下拉 */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-black/5 dark:hover:bg-white/5 outline-none">
                足球 <ChevronDown className="w-4 h-4" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="min-w-[160px] bg-surface-light dark:bg-surface-dark border rounded-lg shadow-lg p-1 z-50" sideOffset={4}>
                  <DropdownMenu.Item asChild>
                    <Link href="/category/football" className="block px-3 py-2 text-sm rounded hover:bg-black/5 dark:hover:bg-white/5 outline-none">
                      全部足球
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-border-light dark:bg-border-dark my-1" />
                  {leagues.football.map((l) => (
                    <DropdownMenu.Item key={l.href} asChild>
                      <Link href={l.href} className="block px-3 py-2 text-sm rounded hover:bg-black/5 dark:hover:bg-white/5 outline-none">
                        {l.label}
                      </Link>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* 篮球下拉 */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-black/5 dark:hover:bg-white/5 outline-none">
                篮球 <ChevronDown className="w-4 h-4" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="min-w-[160px] bg-surface-light dark:bg-surface-dark border rounded-lg shadow-lg p-1 z-50" sideOffset={4}>
                  <DropdownMenu.Item asChild>
                    <Link href="/category/basketball" className="block px-3 py-2 text-sm rounded hover:bg-black/5 dark:hover:bg-white/5 outline-none">
                      全部篮球
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-border-light dark:bg-border-dark my-1" />
                  {leagues.basketball.map((l) => (
                    <DropdownMenu.Item key={l.href} asChild>
                      <Link href={l.href} className="block px-3 py-2 text-sm rounded hover:bg-black/5 dark:hover:bg-white/5 outline-none">
                        {l.label}
                      </Link>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <Link href="/scores" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-black/5 dark:hover:bg-white/5">
              比分
            </Link>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Mobile Menu */}
            <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
              <Dialog.Trigger className="md:hidden p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                <Menu className="w-5 h-5" />
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                <Dialog.Content className="fixed top-0 right-0 h-full w-72 bg-surface-light dark:bg-surface-dark z-50 shadow-xl">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <Image src="/logo.svg" alt="瓦罗体育" width={24} height={24} className="dark:invert" />
                      <span className="font-bold text-gradient">瓦罗体育</span>
                    </div>
                    <Dialog.Close className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                      <X className="w-5 h-5" />
                    </Dialog.Close>
                  </div>
                  <nav className="p-4 space-y-1">
                    <Link href="/" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-medium rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                      首页
                    </Link>
                    <div className="pt-2 pb-1 px-3 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">足球</div>
                    {leagues.football.map((l) => (
                      <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                        {l.label}
                      </Link>
                    ))}
                    <div className="pt-4 pb-1 px-3 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">篮球</div>
                    {leagues.basketball.map((l) => (
                      <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                        {l.label}
                      </Link>
                    ))}
                    <div className="pt-4 border-t mt-4">
                      <Link href="/scores" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-medium rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                        比分
                      </Link>
                    </div>
                  </nav>
                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <ThemeToggle />
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>
    </header>
  );
}
