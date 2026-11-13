import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
import styles from './ui.module.css';

type Tone = 'info' | 'ok' | 'warn';

const ICONS: Record<Tone, LucideIcon> = { info: Info, ok: CircleCheck, warn: TriangleAlert };

/** Inline status message with an icon. */
export function Notice({ tone = 'info', children }: { tone?: Tone; children: ReactNode }) {
  const Icon = ICONS[tone];
  return (
    <div className={cn(styles.notice, styles[`notice_${tone}`])} role="status">
      <Icon aria-hidden className={styles.noticeIcon} />
      <span>{children}</span>
    </div>
  );
}
