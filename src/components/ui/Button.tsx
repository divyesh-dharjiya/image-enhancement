import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import styles from './ui.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  block?: boolean;
}

/** Primary actions use the brand gradient; secondary and ghost are for everything else. */
export function Button({ variant = 'secondary', size = 'md', icon: Icon, block, className, children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={cn(styles.button, styles[variant], styles[size], block && styles.block, className)} {...rest}>
      {Icon && <Icon className={styles.icon} aria-hidden strokeWidth={2} />}
      {children}
    </button>
  );
}

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  size?: 'sm' | 'md';
}

/** Square icon-only button. `label` becomes the accessible name and the tooltip. */
export function IconButton({ icon: Icon, label, active, size = 'md', className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : active}
      className={cn(styles.iconButton, styles[`icon_${size}`], active && styles.iconActive, className)}
      {...rest}
    >
      <Icon aria-hidden strokeWidth={2} />
    </button>
  );
}
