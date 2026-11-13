'use client';

import { FileArchive, ImagePlus, Sparkles, X } from 'lucide-react';
import { Button, IconButton } from '@/components/ui/Button';
import { Segmented } from '@/components/ui/Segmented';
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/cn';
import { addBatchFiles, clearBatch, closeBatch, downloadBatchZip, pickFiles, runBatch, useEditor } from '@/lib/editor';
import { BatchItemCard } from './BatchItemCard';
import styles from './Batch.module.css';

const SCALES = [
  { value: '1', label: 'Original' },
  { value: '2', label: '2×' },
  { value: '4', label: '4×' },
];

/** Enhance a whole album: settings, a grid of photos with live progress, and ZIP download. */
export function BatchModal() {
  const open = useEditor((s) => s.batchOpen);
  const items = useEditor((s) => s.batchItems);
  const running = useEditor((s) => s.batchRunning);
  const scale = useEditor((s) => s.batchScale);
  const faces = useEditor((s) => s.batchFaces);
  const color = useEditor((s) => s.batchColor);
  if (!open) return null;

  const done = items.filter((i) => i.status === 'done').length;
  const pending = items.some((i) => i.status === 'queued' || i.status === 'error');
  const summary = items.length
    ? `${done} of ${items.length} done${running ? ' · working…' : ''}`
    : 'No photos yet';

  return (
    <div className={styles.overlay} role="presentation">
      <div className={cn('glass', styles.modal)} role="dialog" aria-modal="true" aria-labelledby="batch-title">
        <header className={styles.head}>
          <div>
            <h2 id="batch-title">Batch enhance</h2>
            <p>Enhance a whole album with one tap, then download the photos one by one or as a single ZIP.</p>
          </div>
          <IconButton icon={X} label="Close" onClick={closeBatch} />
        </header>

        <div className={styles.options}>
          <div className={styles.optionCard}>
            <Switch label="Restore faces" checked={faces} disabled={running} onChange={(batchFaces) => useEditor.setState(batchFaces ? { batchFaces, batchColor: false } : { batchFaces })} />
          </div>
          <div className={styles.optionCard}>
            <Switch label="Auto-colorize B&W" checked={color} disabled={running} onChange={(batchColor) => useEditor.setState(batchColor ? { batchColor, batchFaces: false } : { batchColor })} />
          </div>
          <Segmented
            label="Output size"
            options={SCALES}
            value={String(scale)}
            disabled={running}
            onChange={(v) => useEditor.setState({ batchScale: Number(v) as 1 | 2 | 4 })}
          />
        </div>

        <div className={styles.grid}>
          {items.map((item) => (
            <BatchItemCard key={item.id} item={item} locked={running} />
          ))}
          <button type="button" className={styles.addTile} onClick={() => pickFiles(addBatchFiles, true)} disabled={running}>
            <ImagePlus aria-hidden />
            <span>Add photos</span>
            <small>or drop several here</small>
          </button>
        </div>

        <footer className={styles.foot}>
          <span className={styles.summary}>{summary}</span>
          <div className={styles.footActions}>
            <Button variant="ghost" onClick={clearBatch} disabled={running || items.length === 0}>
              Clear
            </Button>
            <Button variant="secondary" icon={FileArchive} onClick={() => void downloadBatchZip()} disabled={running || done === 0}>
              Download ZIP
            </Button>
            <Button variant="primary" icon={Sparkles} onClick={() => void runBatch()} disabled={running || !pending}>
              {running ? 'Working…' : 'Enhance all'}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
