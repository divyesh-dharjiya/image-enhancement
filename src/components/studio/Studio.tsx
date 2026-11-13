'use client';

import { useEffect } from 'react';
import { ImageDown } from 'lucide-react';
import { useGlobalEvents } from '@/hooks/useGlobalEvents';
import { cn } from '@/lib/cn';
import { initEngine, useEditor } from '@/lib/editor';
import { BatchModal } from '@/components/batch/BatchModal';
import { Toaster } from '@/components/ui/Toaster';
import { Inspector } from './Inspector';
import { Stage } from './Stage';
import { ToolRail } from './ToolRail';
import { Topbar } from './Topbar';
import styles from './Studio.module.css';

/**
 * The whole application: a top bar over three docked columns, the tool rail, the stage and the
 * inspector. Without a photo, the stage shows the welcome screen across the full width.
 */
export function Studio() {
  useGlobalEvents();
  useEffect(() => {
    void initEngine();
  }, []);
  const dragging = useEditor((s) => s.dragging);
  const hasPhoto = useEditor((s) => s.work !== null);

  return (
    <div className={cn(styles.app, !hasPhoto && styles.empty)}>
      {/* Stage stays first so it never remounts (it owns the GPU canvas and the viewer). */}
      <Stage />
      <Topbar />
      {hasPhoto && <ToolRail />}
      {hasPhoto && <Inspector />}

      {dragging && (
        <div className={styles.dropOverlay} aria-hidden>
          <div className={styles.dropCard}>
            <span className={styles.dropIcon}>
              <ImageDown />
            </span>
            <strong>Drop to enhance</strong>
            <span>One photo opens in the editor. Several go to Batch.</span>
          </div>
        </div>
      )}
      <BatchModal />
      <Toaster />
    </div>
  );
}
