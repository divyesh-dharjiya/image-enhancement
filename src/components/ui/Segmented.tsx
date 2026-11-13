import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import styles from './ui.module.css';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

interface SegmentedProps<T extends string> {
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  block?: boolean;
}

/** A row of mutually exclusive choices. */
export function Segmented<T extends string>({ label, options, value, onChange, disabled, block }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn(styles.segmented, block && styles.blockFill)}>
      {options.map((o) => {
        const Icon = o.icon;
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            className={cn(styles.segment, active && styles.segmentActive)}
            onClick={() => onChange(o.value)}
          >
            {Icon && <Icon className={styles.icon} aria-hidden />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
