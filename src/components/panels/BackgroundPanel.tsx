'use client';

import { cn } from '@/lib/cn';
import { Notice } from '@/components/ui/Notice';
import { Section } from '@/components/ui/Section';
import { Segmented } from '@/components/ui/Segmented';
import { Slider } from '@/components/ui/Slider';
import type { Look } from '@/lib/gl/compositor';
import { SWATCHES, setBackground, setLook, useEditor } from '@/lib/editor';
import styles from './panels.module.css';

const MODES: { value: Look['bg']; label: string }[] = [
  { value: 'none', label: 'Original' },
  { value: 'blur', label: 'Blur' },
  { value: 'color', label: 'Colour' },
  { value: 'mono', label: 'B&W' },
  { value: 'transparent', label: 'Remove' },
];

/** AI background: blur the surroundings, recolour them, or cut the subject out. */
export function BackgroundPanel() {
  const look = useEditor((s) => s.look);
  const notice = useEditor((s) => s.bgNotice);
  const busy = useEditor((s) => s.busy !== null);
  const hasPhoto = useEditor((s) => s.work !== null);
  const disabled = !hasPhoto || busy;

  return (
    <div className={styles.stack}>
      {!hasPhoto ? (
        <Notice>Open a photo to use the AI background tools.</Notice>
      ) : notice ? (
        <Notice tone={notice.tone}>{notice.text}</Notice>
      ) : null}

      <Section title="Background" description="The subject stays sharp. Only the surroundings change.">
        <Segmented block label="Background mode" options={MODES} value={look.bg} disabled={disabled} onChange={(bg) => void setBackground(bg)} />

        {look.bg === 'blur' && (
          <Slider
            label="Blur strength"
            min={0}
            max={1}
            value={look.bgBlur}
            defaultValue={0.6}
            format={(v) => `${Math.round(v * 100)}`}
            onChange={(bgBlur) => setLook({ bgBlur })}
          />
        )}

        {look.bg === 'color' && (
          <div className={styles.swatches} role="radiogroup" aria-label="Background colour">
            {SWATCHES.map((c) => {
              const active = look.bgColor.join(',') === c.join(',');
              return (
                <button
                  key={c.join(',')}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={`Colour ${c.map((v) => Math.round(v * 255)).join(', ')}`}
                  className={cn(styles.swatch, active && styles.swatchActive)}
                  style={{ background: `rgb(${c.map((v) => Math.round(v * 255)).join(',')})` }}
                  onClick={() => setLook({ bgColor: c })}
                />
              );
            })}
          </div>
        )}
      </Section>

      <Notice>“Remove” exports a transparent PNG, ideal for stickers, shop listings and profile photos.</Notice>
    </div>
  );
}
