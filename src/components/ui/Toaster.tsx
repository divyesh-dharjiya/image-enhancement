'use client';

import { CircleCheck, CircleAlert, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { type ToastKind, useToasts } from '@/lib/toast';
import styles from './ui.module.css';

const ICONS = { info: Info, ok: CircleCheck, error: CircleAlert } satisfies Record<ToastKind, typeof Info>;

/** Short messages as glass capsules near the bottom of the window. */
export function Toaster() {
  const items = useToasts((s) => s.items);
  const dismiss = useToasts((s) => s.dismiss);
  return (
    <div className={styles.toasts} aria-live="polite">
      {items.map((t) => {
        const Icon = ICONS[t.kind];
        return (
          <div key={t.id} className={cn('glass', styles.toast, styles[`toast_${t.kind}`])} role={t.kind === 'error' ? 'alert' : 'status'}>
            <Icon aria-hidden />
            <span className={styles.toastText}>{t.text}</span>
            <button type="button" className={styles.toastClose} aria-label="Dismiss" onClick={() => dismiss(t.id)}>
              <X aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
