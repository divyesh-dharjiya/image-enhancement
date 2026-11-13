'use client';

import { Columns2, Eye, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { IconButton } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { actualSize, fitView, setHold, toggleCompare, useEditor, zoomIn, zoomOut } from '@/lib/editor';
import styles from './Stage.module.css';

/** Floating capsule under the photo: zoom, before/after compare and press-and-hold for the original. */
export function ZoomBar() {
  const zoom = useEditor((s) => s.zoom);
  const compare = useEditor((s) => s.compare);
  const busy = useEditor((s) => s.busy !== null);
  // After a crop or rotation the untouched original no longer lines up.
  const geom = useEditor((s) => s.geom);

  return (
    <div className={cn('glass', styles.zoomBar)} data-viewer-ignore>
      <IconButton icon={ZoomOut} label="Zoom out (-)" size="sm" onClick={zoomOut} />
      <button type="button" className={styles.zoomLabel} onClick={actualSize} title="Actual pixels (1)">
        {zoom}%
      </button>
      <IconButton icon={ZoomIn} label="Zoom in (+)" size="sm" onClick={zoomIn} />
      <IconButton icon={Maximize2} label="Fit to screen (0)" size="sm" onClick={fitView} />
      <span className={styles.sep} aria-hidden />
      <button
        type="button"
        className={styles.pill}
        aria-pressed={compare}
        onClick={toggleCompare}
        disabled={busy || geom}
        title="Before / after (C)"
      >
        <Columns2 aria-hidden />
        <span className={styles.compareLabel}>Compare</span>
      </button>
      <button
        type="button"
        className={styles.holdButton}
        aria-label="Hold to see the original"
        title="Hold to see the original (\)"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setHold(true);
        }}
        onPointerUp={() => setHold(false)}
        onPointerCancel={() => setHold(false)}
        onLostPointerCapture={() => setHold(false)}
      >
        <Eye aria-hidden />
      </button>
    </div>
  );
}
