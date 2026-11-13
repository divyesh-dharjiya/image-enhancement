import { cn } from '@/lib/cn';
import styles from './ui.module.css';

interface SwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** On/off option shown as a labelled card. */
export function Switch({ label, description, checked, onChange, disabled }: SwitchProps) {
  return (
    <label className={cn(styles.switchRow, disabled && styles.disabled)}>
      <span className={styles.switchText}>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <input type="checkbox" className={styles.switchInput} checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className={styles.track} aria-hidden>
        <span className={styles.thumb} />
      </span>
    </label>
  );
}
