'use client';

import type { KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { setTab, useEditor } from '@/lib/editor';
import { TOOLS } from './tools';
import styles from './ToolRail.module.css';

/** Tool picker: a docked vertical rail on desktop, a horizontal dock on phones. */
export function ToolRail() {
  const tab = useEditor((s) => s.tab);

  // Arrow keys move between tools, as in any tab list.
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const i = (TOOLS.findIndex((t) => t.id === tab) + step + TOOLS.length) % TOOLS.length;
    setTab(TOOLS[i].id);
    document.getElementById(`tab-${TOOLS[i].id}`)?.focus();
  };

  return (
    <nav className={styles.rail} role="tablist" aria-label="Tools" onKeyDown={onKeyDown}>
      {TOOLS.map(({ id, label, icon: Icon }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={active}
            aria-controls="tool-panel"
            tabIndex={active ? 0 : -1}
            className={cn(styles.tool, active && styles.active)}
            onClick={() => setTab(id)}
          >
            <span className={styles.icon}>
              <Icon aria-hidden strokeWidth={1.9} />
            </span>
            <span className={styles.label}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
