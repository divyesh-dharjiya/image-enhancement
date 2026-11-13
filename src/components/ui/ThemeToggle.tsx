'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { IconButton } from '@/components/ui/Button';

type Mode = 'dark' | 'light';
const KEY = 'mitakshi-theme';
const COLORS: Record<Mode, string> = { dark: '#0a1020', light: '#f2f6fc' };

/** Light / dark switch. The mode lives on <html data-theme>; the choice is remembered on this device (dark by default). */
export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('dark');
  useEffect(() => {
    setMode(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLORS[next]);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private window: the choice lasts until the tab is closed */
    }
    setMode(next);
  };

  return <IconButton icon={mode === 'dark' ? Sun : Moon} label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggle} />;
}
