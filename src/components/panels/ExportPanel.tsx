'use client';

import { Columns2, Copy, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Section } from '@/components/ui/Section';
import { Segmented } from '@/components/ui/Segmented';
import { Slider } from '@/components/ui/Slider';
import { fmtMP, fmtSize } from '@/lib/format';
import {
  copyImage,
  downloadComparison,
  downloadImage,
  exportType,
  shareImage,
  type ExportFormat,
  useEditor,
} from '@/lib/editor';
import styles from './panels.module.css';

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WebP' },
];

/** Output format, quality and the sharing options. */
export function ExportPanel() {
  const exFormat = useEditor((s) => s.exFormat);
  const exQuality = useEditor((s) => s.exQuality);
  const work = useEditor((s) => s.work);
  const busy = useEditor((s) => s.busy !== null);
  const hasPhoto = work !== null;
  // Read the export type from the same state that renders it, so the label never disagrees with the file.
  const type = exportType();

  return (
    <div className={styles.stack}>
      <Section title="Format">
        <Segmented block label="Export format" options={FORMATS} value={exFormat} disabled={busy} onChange={(v) => useEditor.setState({ exFormat: v })} />
        {exFormat !== 'image/png' && (
          <Slider
            label="Quality"
            min={0.5}
            max={1}
            step={0.01}
            value={exQuality}
            defaultValue={0.92}
            format={(v) => String(Math.round(v * 100))}
            onChange={(v) => useEditor.setState({ exQuality: v })}
          />
        )}
      </Section>

      <Section title="Save & share" description="Full resolution, with every adjustment applied.">
        {work && (
          <div className={styles.info}>
            <div>
              Output <b>{fmtSize(work.width, work.height)}</b> · {fmtMP(work.width, work.height)}
            </div>
            <div>
              Format <b>{type.split('/')[1].toUpperCase()}</b>
              {type !== exFormat ? ' (keeps the transparent background)' : ''}
            </div>
            <div>Processed on this device. Nothing was uploaded.</div>
          </div>
        )}
        <Button variant="primary" icon={Download} block disabled={!hasPhoto || busy} onClick={() => void downloadImage()}>
          Download full resolution
        </Button>
        <div className={styles.twoUp}>
          <Button variant="secondary" icon={Share2} disabled={!hasPhoto || busy} onClick={() => void shareImage()}>
            Share
          </Button>
          <Button variant="secondary" icon={Copy} disabled={!hasPhoto || busy} onClick={() => void copyImage()}>
            Copy
          </Button>
        </div>
        <Button variant="secondary" icon={Columns2} block disabled={!hasPhoto || busy} onClick={() => void downloadComparison()}>
          Before / after image
        </Button>
      </Section>

      <Notice>Photos never leave this device.</Notice>
    </div>
  );
}
