import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './ui.module.css';

interface SectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A titled group of controls inside a panel. */
export function Section({ title, description, action, className, children }: SectionProps) {
  return (
    <section className={cn(styles.section, className)}>
      <header className={styles.sectionHead}>
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        {action}
      </header>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}
