'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { MenuIcon, CloseIcon } from './Icons';
import { getTranslations } from '@/lib/i18n';

const t = getTranslations('zh');

const navItems = [
  { label: t.nav.football, href: '/category/football' },
  { label: t.nav.basketball, href: '/category/basketball' },
  { label: t.nav.tennis, href: '/category/tennis' },
  { label: t.nav.f1, href: '/category/f1' },
  { label: t.nav.esports, href: '/category/esports' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.svg" 
              alt={t.site.name} 
              width={32} 
              height={32}
              className="dark:invert"
            />
            <span className="font-semibold text-lg tracking-tight">
              VALUO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center border-l border-dashed border-border-light dark:border-border-dark">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link px-5 py-2 border-r border-dashed border-border-light dark:border-border-dark"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <CloseIcon className="text-slate-600 dark:text-slate-400" />
              ) : (
                <MenuIcon className="text-slate-600 dark:text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border-light dark:border-border-dark">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-link px-4 py-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
