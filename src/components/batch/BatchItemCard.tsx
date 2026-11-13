'use client';

import { CircleCheck, CircleAlert, Download, X } from 'lucide-react';
import { IconButton } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { downloadBatchItem, removeBatchItem, type BatchItem } from '@/lib/editor';
import styles from './Batch.module.css';

/** One photo in the batch: its thumbnail, status, progress and per-photo actions. */
export function BatchItemCard({ item, locked }: { item: BatchItem; locked: boolean }) {
  const shown = item.resultUrl ?? item.url;
  const percent = Math.round(item.progress * 100);
  return (
    <article className={cn(styles.item, styles[`item_${item.status}`])}>
      <div className={styles.thumb}>
        {/* eslint-disable-next-line @next/next/no-img-element -- object URLs, not optimisable */}
        <img src={shown} alt={item.name} />
        {item.status === 'done' && (
          <span className={styles.done} aria-label="Done">
            <CircleCheck aria-hidden />
          </span>
        )}
        {item.status === 'error' && (
          <span className={styles.failed} aria-label="Failed">
            <CircleAlert aria-hidden />
          </span>
        )}
        {item.status === 'working' && (
          <span className={styles.working}>
            {item.stage || 'Working…'} {percent}%
          </span>
        )}
        {item.status === 'working' && <div className={styles.bar} style={{ transform: `scaleX(${item.progress})` }} />}
      </div>
      <div className={styles.meta}>
        <b title={item.name}>{item.name}</b>
        <span>
          {item.status === 'queued' ? 'Waiting' : item.status === 'working' ? 'Enhancing…' : item.detail}
        </span>
      </div>
      <div className={styles.itemActions}>
        {item.status === 'done' && <IconButton icon={Download} label="Download this photo" size="sm" onClick={() => downloadBatchItem(item)} />}
        {!locked && <IconButton icon={X} label="Remove" size="sm" onClick={() => removeBatchItem(item.id)} />}
      </div>
    </article>
  );
}
