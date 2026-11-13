'use client';

import { RotateCcw, WandSparkles } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Section } from '@/components/ui/Section';
import { Slider } from '@/components/ui/Slider';
import type { Look } from '@/lib/gl/compositor';
import { applyFilter, autoEnhance, FILTERS, resetAdjustments, setLook, TONE, TONE_GROUPS, useEditor } from '@/lib/editor';
import styles from './panels.module.css';

/** Light, colour, detail and effects sliders, plus one-tap filters. Everything is live and reversible. */
export function AdjustPanel() {
  const look = useEditor((s) => s.look);
  const activeFilter = useEditor((s) => s.activeFilter);
  const busy = useEditor((s) => s.busy !== null);
  const hasPhoto = useEditor((s) => s.work !== null);
  const disabled = !hasPhoto || busy;

  return (
    <div className={styles.stack}>
      <Button variant="primary" size="lg" block icon={WandSparkles} disabled={disabled} onClick={autoEnhance}>
        Auto fix
      </Button>

      <Section title="Filters" description="One tap, then fine-tune below.">
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              disabled={disabled}
              aria-pressed={activeFilter === f.id}
              className={cn(styles.filter, activeFilter === f.id && styles.filterActive)}
              onClick={() => applyFilter(f.id)}
            >
              <span className={styles.swatch} style={{ background: f.swatch }} aria-hidden />
              <span>{f.name}</span>
            </button>
          ))}
        </div>
      </Section>

      {TONE_GROUPS.map((group) => (
        <Section key={group} title={group}>
          {TONE.filter((t) => t.group === group).map((t) => (
            <Slider
              key={t.key}
              label={t.label}
              min={t.min}
              max={t.max}
              defaultValue={0}
              value={look[t.key]}
              disabled={disabled}
              format={(v) => `${v > 0 && t.min < 0 ? '+' : ''}${Math.round(v * 100)}`}
              onChange={(v) => setLook({ [t.key]: v } as Partial<Look>)}
            />
          ))}
        </Section>
      ))}

      <Button variant="secondary" icon={RotateCcw} block disabled={disabled} onClick={resetAdjustments}>
        Reset all adjustments
      </Button>
      <Notice>Adjustments are live and non-destructive. They apply to the download and combine with AI Enhance and Background.</Notice>
    </div>
  );
}
