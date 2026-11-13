'use client';

import { type CSSProperties, useId } from 'react';
import { cn } from '@/lib/cn';
import styles from './ui.module.css';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Used for the "changed" indicator and for double-click reset. */
  defaultValue?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  ends?: [string, string];
  disabled?: boolean;
}

/** Labelled range slider with a live value, double-click reset and a changed indicator. */
export function Slider({ label, value, min, max, step = 0.01, defaultValue, onChange, format, ends, disabled }: SliderProps) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  // Signed sliders (e.g. Warmth) fill from their zero point, so "+20" and "-20" read at a glance.
  const zero = min < 0 && max > 0 ? (-min / (max - min)) * 100 : 0;
  const changed = defaultValue !== undefined && Math.abs(value - defaultValue) > 0.005;
  const text = format ? format(value) : String(Math.round(value * 100));

  return (
    <div className={cn(styles.slider, changed && styles.changed, disabled && styles.disabled)}>
      <div className={styles.sliderHead}>
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className={styles.sliderValue}>
          {text}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        className={styles.range}
        style={{ '--lo': `${Math.min(zero, pct)}%`, '--hi': `${Math.max(zero, pct)}%` } as CSSProperties}
        title={defaultValue !== undefined ? 'Double-click to reset' : undefined}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        onDoubleClick={() => defaultValue !== undefined && onChange(defaultValue)}
      />
      {ends && (
        <div className={styles.ends}>
          <span>{ends[0]}</span>
          <span>{ends[1]}</span>
        </div>
      )}
    </div>
  );
}
