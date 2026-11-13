'use client';

import { Columns2, Copy, Download, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Section } from '@/components/ui/Section';
import { Segmented } from '@/components/ui/Segmented';
import { Slider } from '@/components/ui/Slider';
import { MODELS, modelBytes, type ModelKey } from '@/lib/ai/registry';
import { fmtMB, fmtMP, fmtSize } from '@/lib/format';
import {
  copyImage,
  deleteEngines,
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

const LARGE_MODELS = (Object.keys(MODELS) as ModelKey[]).filter((k) => MODELS[k].large);

/** Output format, quality and the sharing options, plus control over the stored AI engines. */
export function ExportPanel() {
  const exFormat = useEditor((s) => s.exFormat);
  const exQuality = useEditor((s) => s.exQuality);
  const work = useEditor((s) => s.work);
  const busy = useEditor((s) => s.busy !== null);
  const cached = useEditor((s) => s.cached);
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

      <Section title="On-device storage" description="The large AI engines are saved here after first use, so they load instantly next time.">
        <div className={styles.storage}>
          {LARGE_MODELS.map((k) => {
            const has = cached.includes(k);
            return (
              <div key={k} className={styles.storageRow}>
                <span>
                  <b>{MODELS[k].label}</b>
                  <small>{fmtMB(modelBytes(k))}</small>
                </span>
                <span className={has ? styles.saved : styles.notSaved}>{has ? 'Saved' : 'Not downloaded'}</span>
              </div>
            );
          })}
        </div>
        <Button
          variant="danger"
          icon={Trash2}
          block
          disabled={busy}
          onClick={() => {
            if (window.confirm('Delete the downloaded AI engines from this device? They download again when needed.')) void deleteEngines();
          }}
        >
          Delete downloaded engines
        </Button>
      </Section>

      <Notice>Photos never leave this device. Only the engines are stored locally.</Notice>
    </div>
  );
}
