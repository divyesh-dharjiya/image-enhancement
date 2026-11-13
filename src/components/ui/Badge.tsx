import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './ui.module.css';

type Tone = 'default' | 'accent' | 'ok' | 'warn';

/** Small status pill. */
export function Badge({ tone = 'default', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cn(styles.badge, styles[`badge_${tone}`])}>{children}</span>;
}
