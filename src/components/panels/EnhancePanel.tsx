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
  const cached = useEditor((s) => s.cached);
  const hasPhoto = work !== null;
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
    downloadLabel = bytes ? `${fmtMB(bytes)} of AI engines on first run (saved on this device)` : 'All required engines are on this device';
  }

  return (
    <div className={styles.stack}>
      <div className={styles.badges}>
        <Badge tone={backend === 'webgpu' ? 'ok' : backend ? 'warn' : 'default'}>
          {backend === 'webgpu' ? 'AI engine · GPU' : backend ? 'AI engine · CPU (slower)' : 'AI engine · starting…'}
        </Badge>
        <Badge tone="accent">Private</Badge>
      </div>

      <Button variant="primary" size="lg" block icon={Sparkles} disabled={!hasPhoto || busy} onClick={() => void runEnhance()}>
        AI Enhance
      </Button>

      {hasPhoto && (
        <div className={styles.chips}>
          {scan ? (
            <>
              <span className={styles.chip}>
                Faces <b>{scan.faces || 'none'}</b>
              </span>
              <span className={styles.chip}>
                Type <b>{scan.grayscale ? 'Black & white' : 'Colour'}</b>
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

      <Section title="What the AI does" description="One step at a time keeps it fast and the downloads small. Run Enhance again for the other.">
        <Switch
          label="Restore faces"
          description="Rebuilds eyes, skin and hair detail, one face at a time"
          checked={opts.faces}
          disabled={busy}
          onChange={(faces) => setOpts(faces ? { faces, colorize: false } : { faces })}
        />
        <Switch
          label="Colorize old photo"
          description="Adds natural colour to black & white and sepia prints"
          checked={opts.colorize}
          disabled={busy}
          onChange={(colorize) => setOpts(colorize ? { colorize, faces: false } : { colorize })}
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
        {slow && <Notice tone="warn">This photo is already large and this browser has no GPU acceleration: upscaling takes minutes. Original size is much faster.</Notice>}
        {work && (
          <div className={styles.info}>
            <div>
              Result <b>{resultLabel}</b>
            </div>
            <div>{downloadLabel}</div>
          </div>
        )}
      </Section>

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

      {work && work !== original && (
        <Button variant="secondary" icon={RotateCcw} block onClick={() => void revert()} disabled={busy}>
          Revert to the original photo
        </Button>
      )}

      {!hasPhoto && <Notice>Open a photo to start. Everything runs on this device, so nothing is uploaded.</Notice>}
    </div>
  );
}
