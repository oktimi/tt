'use client';

import { useEffect, useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark, mounted]);

  if (!mounted) return <div className="w-[52px] h-7" />;

  return (
    <div className="flex items-center gap-2">
      <Sun className="w-4 h-4 text-secondary" />
      <Switch.Root
        checked={dark}
        onCheckedChange={setDark}
        className="w-11 h-6 rounded-full relative cursor-pointer outline-none"
        style={{ backgroundColor: dark ? 'var(--color-accent-blue)' : 'var(--border)' }}
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transition-transform duration-100 translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
      <Moon className="w-4 h-4 text-secondary" />
    </div>
  );
}
