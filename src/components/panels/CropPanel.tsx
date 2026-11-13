'use client';

import { useState } from 'react';
import { ArrowLeftRight, ArrowUpDown, Crop, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { Segmented } from '@/components/ui/Segmented';
import { cropTo, flip, rotate, useEditor } from '@/lib/editor';
import styles from './panels.module.css';

const RATIOS = [
  { value: '1', label: '1:1' },
  { value: String(4 / 5), label: '4:5' },
  { value: String(3 / 4), label: '3:4' },
  { value: String(9 / 16), label: '9:16' },
  { value: String(4 / 3), label: '4:3' },
  { value: String(16 / 9), label: '16:9' },
];

/** Rotate, flip and crop to a shape (from the centre). Every step can be undone. */
export function CropPanel() {
  const busy = useEditor((s) => s.busy !== null);
  const hasPhoto = useEditor((s) => s.work !== null);
  const [ratio, setRatio] = useState<string | null>(null);
  const disabled = busy || !hasPhoto;

  return (
    <div className={styles.stack}>
      <Section title="Rotate and flip">
        <div className={styles.actions}>
          <Button variant="secondary" icon={RotateCw} disabled={disabled} onClick={() => void rotate(1)}>
            Rotate
          </Button>
          <Button variant="secondary" icon={ArrowLeftRight} disabled={disabled} onClick={() => void flip('x')}>
            Flip
          </Button>
          <Button variant="secondary" icon={ArrowUpDown} disabled={disabled} onClick={() => void flip('y')}>
            Mirror
          </Button>
        </div>
      </Section>
      <Section title="Crop to" description="Cuts the photo to this shape, from the centre.">
        <Segmented label="Crop shape" options={RATIOS} value={ratio ?? ''} disabled={disabled} onChange={(v) => setRatio(v === ratio ? null : v)} />
        <Button
          variant="primary"
          size="lg"
          block
          icon={Crop}
          disabled={disabled || ratio === null}
          onClick={() => {
            if (ratio !== null) void cropTo(Number(ratio));
            setRatio(null);
          }}
        >
          {ratio === null ? 'Choose a shape' : 'Crop'}
        </Button>
      </Section>
    </div>
  );
}
