'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from './Icons';
import { getTranslations } from '@/lib/i18n';

const t = getTranslations('zh');
const STORAGE_KEY = 'valuo-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label={t.theme.dark}
      >
        <MoonIcon className="text-slate-400" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label={theme === 'dark' ? t.theme.light : t.theme.dark}
    >
      {theme === 'dark' ? (
        <SunIcon className="text-slate-400 hover:text-slate-200" />
      ) : (
        <MoonIcon className="text-slate-600 hover:text-slate-900" />
      )}
    </button>
  );
}
