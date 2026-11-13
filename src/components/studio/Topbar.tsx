'use client';

import { Download, FolderOpen, LayoutGrid, Undo2, WandSparkles } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button, IconButton } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { autoEnhance, downloadImage, openBatch, pickPhoto, undo, useEditor } from '@/lib/editor';
import { fmtSize } from '@/lib/format';
import styles from './Topbar.module.css';

/** Top bar: the brand, the open photo, and the main actions. */
export function Topbar() {
  const historyDepth = useEditor((s) => s.historyDepth);
  const busy = useEditor((s) => s.busy !== null);
  const work = useEditor((s) => s.work);
  const name = useEditor((s) => s.name);
  const autoOn = useEditor((s) => s.activeFilter === 'auto');

  return (
    <header className={styles.bar}>
      <Logo />

      {work && (
        <div className={styles.file} title={name}>
          <span className={styles.fileDot} aria-hidden />
          <b>{name}</b>
          <span>{fmtSize(work.width, work.height)}</span>
        </div>
      )}

      <div className={styles.right}>
        <Button variant={autoOn ? 'primary' : 'secondary'} icon={WandSparkles} className={styles.compact} onClick={autoEnhance} disabled={!work || busy} aria-pressed={autoOn} aria-label={autoOn ? 'Auto fix is on: click to reset every adjustment' : 'Auto fix: set light and colour for this photo'} title={autoOn ? 'Auto fix is on: click again to reset' : 'Auto fix: set light and colour for this photo'}>
          <span className={styles.label}>{autoOn ? 'Auto on' : 'Auto'}</span>
        </Button>
        <IconButton icon={Undo2} label="Undo (Ctrl+Z)" onClick={() => void undo()} disabled={!historyDepth || busy} />
        <ThemeToggle />
        <span className={styles.divider} aria-hidden />
        <Button
          variant="ghost"
          icon={FolderOpen}
          className={styles.compact}
          onClick={pickPhoto}
          disabled={busy}
          aria-label="Open photo (Ctrl+O)"
          title="Open photo (Ctrl+O)"
        >
          <span className={styles.label}>Open</span>
        </Button>
        <Button
          variant="secondary"
          icon={LayoutGrid}
          className={styles.compact}
          onClick={openBatch}
          disabled={busy}
          aria-label="Batch enhance"
          title="Batch enhance"
        >
          <span className={styles.label}>Batch</span>
        </Button>
        <Button
          variant="primary"
          icon={Download}
          className={styles.compact}
          onClick={() => void downloadImage()}
          disabled={!work || busy}
          aria-label="Download full resolution (Ctrl+S)"
          title="Download full resolution (Ctrl+S)"
        >
          <span className={styles.label}>Download</span>
        </Button>
      </div>
    </header>
  );
}
