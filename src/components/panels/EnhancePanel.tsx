'use client';

import { Sparkles, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Section } from '@/components/ui/Section';
import { Segmented } from '@/components/ui/Segmented';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { modelsFor, revert, runEnhance, setFidelity, useEditor } from '@/lib/editor';
import { FaceList } from './FacesPanel';
import { MODELS, modelBytes } from '@/lib/ai/registry';
import { clamp, fmtMB, fmtMP, fmtSize } from '@/lib/format';
import styles from './panels.module.css';

const SCALES = [
  { value: '1', label: 'Original' },
  { value: '2', label: '2× HD' },
  { value: '4', label: '4× Ultra' },
];

/** AI Enhance: what the AI should do, the output size, and the face strength. */
export function EnhancePanel() {
  const backend = useEditor((s) => s.backend);
  const busy = useEditor((s) => s.busy !== null);
  const work = useEditor((s) => s.work);
  const original = useEditor((s) => s.original);
  const scan = useEditor((s) => s.scan);
  const opts = useEditor((s) => s.opts);
  const faceCount = useEditor((s) => s.faces?.faces.length ?? 0);
  const fidelity = useEditor((s) => s.fidelity);
  const autoEdit = useEditor((s) => s.autoEdit);
  const cached = useEditor((s) => s.cached);
  const hasPhoto = work !== null;
  // Something was done to the photo (Undo has a step): offer Enhance again and the way back.
  const edited = useEditor((s) => s.historyDepth > 0);
  const slow = !!work && opts.scale > 1 && (work.width * work.height) / 1e6 > 2 && backend !== 'webgpu';

  const setOpts = (patch: Partial<typeof opts>) => useEditor.setState((s) => ({ opts: { ...s.opts, ...patch } }));

  // Predicted output size and the engines that still need downloading.
  let resultLabel = '';
  let downloadLabel = '';
  if (work) {
    const W = work.width;
    const H = work.height;
    const k = opts.scale > 1 ? clamp(Math.sqrt(16e6 / (W * H * opts.scale * opts.scale)), 0, 1) : 1;
    const ow = Math.round(W * k) * opts.scale;
    const oh = Math.round(H * k) * opts.scale;
    resultLabel = `${fmtSize(ow, oh)} · ${fmtMP(ow, oh)}`;
    const need = modelsFor(opts).filter((m) => MODELS[m].large && !cached.includes(m));
    const bytes = need.reduce((sum, m) => sum + modelBytes(m), 0);
    downloadLabel = bytes ? `${fmtMB(bytes)} one-time download, then works offline` : 'Ready offline';
  }

  return (
    <div className={styles.stack}>
      {hasPhoto && (
        <div className={styles.chips}>
          {scan ? (
            <>
              <span className={styles.chip}>
                Faces <b>{scan.faces || 'none'}</b>
              </span>
              {original && (
                <span className={styles.chip}>
                  Size <b>{fmtMP(original.width, original.height)}</b>
                </span>
              )}
            </>
          ) : (
            <span className={styles.chip}>Scanning photo…</span>
          )}
        </div>
      )}

      {/* The choices come first and the button after them, so it always runs what is shown above it. */}
      <Section title="What to fix">
        <Switch
          label="Restore faces"
          description="Sharp eyes, skin and hair"
          checked={opts.faces}
          disabled={busy}
          onChange={(faces) => setOpts({ faces })}
        />
        <Switch
          label="Auto edit"
          description="Sets light and colour for this photo"
          checked={autoEdit}
          disabled={busy}
          onChange={(on) => useEditor.setState({ autoEdit: on })}
        />
      </Section>

      <Section title="Output size">
        <Segmented
          block
          label="Output size"
          options={SCALES}
          value={String(opts.scale)}
          disabled={busy}
          onChange={(v) => setOpts({ scale: Number(v) as 1 | 2 | 4 })}
        />
      </Section>

      <Button variant="primary" size="lg" block icon={Sparkles} disabled={!hasPhoto || busy || (!opts.faces && opts.scale === 1 && !autoEdit)} onClick={() => void runEnhance()}>
        {edited ? 'Enhance again' : 'AI Enhance'}
      </Button>
      {work && (
        <div className={styles.info}>
          <div>
            Result <b>{resultLabel}</b>
          </div>
          <div>{downloadLabel}</div>
          <div className={styles.engine}>
            <Badge tone={backend === 'webgpu' ? 'ok' : backend ? 'warn' : 'default'}>
              {backend === 'webgpu' ? 'Runs on your GPU' : backend ? 'Runs on your CPU (slower)' : 'Starting the AI engine…'}
            </Badge>
            <Badge tone="accent">Private</Badge>
          </div>
        </div>
      )}
      {slow && <Notice tone="warn">This photo is already large and this browser has no GPU acceleration: upscaling takes minutes. Original size is much faster.</Notice>}

      {faceCount > 0 && (
        <Section title="Face enhancement" description="Blend between the natural photo and the restored faces.">
          <Slider
            label="Strength"
            value={fidelity}
            min={0}
            max={1}
            defaultValue={0.75}
            format={(v) => `${Math.round(v * 100)}%`}
            ends={['Natural', 'Enhanced']}
            onChange={setFidelity}
          />
        </Section>
      )}

      <FaceList />

      {edited && (
        <Button variant="secondary" icon={RotateCcw} block onClick={() => void revert()} disabled={busy}>
          Revert to the original photo
        </Button>
      )}

      {!hasPhoto && <Notice>Open a photo to start. Everything runs on this device, so nothing is uploaded.</Notice>}
    </div>
  );
}
