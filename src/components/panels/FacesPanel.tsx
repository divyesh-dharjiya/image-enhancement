'use client';

import { useEffect, useRef } from 'react';
import type { FaceInfo } from '@/lib/ai/protocol';
import { Section } from '@/components/ui/Section';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { setFaceEnabled, setFaceStrength, useEditor } from '@/lib/editor';
import styles from './panels.module.css';

/** Draws one 128 px preview (before or after) of a restored face. */
function FaceThumb({ bitmap, label }: { bitmap: ImageBitmap; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  }, [bitmap]);
  return (
    <figure className={styles.thumb}>
      <canvas ref={ref} width={128} height={128} aria-label={label} />
      <figcaption>{label}</figcaption>
    </figure>
  );
}

function FaceCard({ index, info, strength, enabled }: { index: number; info: FaceInfo; strength: number; enabled: boolean }) {
  return (
    <article className={`${styles.faceCard} ${enabled ? '' : styles.faceOff}`}>
      <div className={styles.thumbs}>
        <FaceThumb bitmap={info.before} label="Before" />
        <FaceThumb bitmap={info.after} label="After" />
      </div>
      <Switch
        label={`Face ${index + 1}`}
        description={`${Math.round(info.box[2])} × ${Math.round(info.box[3])} px · ${Math.round(info.score * 100)}% confidence`}
        checked={enabled}
        onChange={(on) => setFaceEnabled(index, on)}
      />
      <Slider
        label="Strength"
        min={0}
        max={1}
        defaultValue={1}
        value={strength}
        disabled={!enabled}
        format={(v) => `${Math.round(v * 100)}%`}
        onChange={(v) => setFaceStrength(index, v)}
      />
    </article>
  );
}

/** Each restored face, with its own on/off switch and strength (handy for group photos). Shown inside Enhance. */
export function FaceList() {
  const faces = useEditor((s) => s.faces);
  if (!faces || faces.faces.length < 2) return null;
  return (
    <Section title={`${faces.faces.length} faces`} description="Each face is restored on its own. Turn one off or soften it independently.">
      {faces.faces.map((info, i) => (
        <FaceCard key={i} index={i} info={info} strength={faces.strengths[i]} enabled={faces.enabled[i]} />
      ))}
    </Section>
  );
}
