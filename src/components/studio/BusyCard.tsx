'use client';

import { X } from 'lucide-react';
import { IconButton } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { useEditor } from '@/lib/editor';
import styles from './Stage.module.css';

const R = 19;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** Progress capsule shown while a long job runs (AI, export, batch): a ring, the step and Cancel. */
export function BusyCard() {
  const busy = useEditor((s) => s.busy);
  if (!busy) return null;

  // No progress yet means "starting": spin a short arc instead of showing 0%.
  const known = busy.progress > 0.001;
  const p = known ? Math.min(1, busy.progress) : 0.25;

  return (
    <div className={styles.busy} role="status" aria-live="polite" data-viewer-ignore>
      <div className={cn('glass', styles.busyCard)}>
        <span className={cn(styles.ring, !known && styles.ringSpin)} aria-hidden>
          <svg viewBox="0 0 44 44" width="44" height="44">
            <circle cx="22" cy="22" r={R} fill="none" strokeWidth="3" className={styles.ringTrack} />
            <circle
              cx="22"
              cy="22"
              r={R}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className={styles.ringFill}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - p)}
            />
          </svg>
        </span>
        <div className={styles.busyText}>
          <strong>{busy.title}</strong>
          <span>{busy.sub}</span>
        </div>
        {busy.cancel && (
          <IconButton
            icon={X}
            label="Cancel"
            size="sm"
            onClick={() => {
              busy.cancel?.();
              useEditor.setState((s) => (s.busy ? { busy: { ...s.busy, sub: 'Cancelling…' } } : {}));
            }}
          />
        )}
      </div>
    </div>
  );
}
