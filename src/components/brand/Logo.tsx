'use client';

import { useId } from 'react';
import { BRAND } from '@/lib/brand';
import styles from './Logo.module.css';

/** A solid M. Same geometry as the app icon (tools/make-assets.mjs in the mobile project) and the mobile app's Logo.tsx. */
const M_PATH = 'M100 400V150Q100 116 132 130L256 232L380 130Q412 116 412 150V400H340V268L256 338L172 268V400Z';

/** The Mitakshi mark: a white M with an iris above its notch ("Mitakshi" means "of the beautiful eyes"), on a navy tile. */
export function LogoMark({ size = 36 }: { size?: number }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={styles.tile} viewBox="0 0 512 512" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563d6" />
          <stop offset="1" stopColor="#0a2358" />
        </linearGradient>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbe9ff" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill={`url(#${id}s)`} />
      <rect width="512" height="512" rx="116" fill={`url(#${id}h)`} />
      <g transform="translate(46 52) scale(0.82)">
        <path d={M_PATH} fill={`url(#${id}m)`} />
        <circle cx="256" cy="136" r="34" fill="#fff" />
        <circle cx="256" cy="136" r="16" fill="#5cc4ff" />
        <circle cx="263" cy="129" r="5.5" fill="#fff" />
      </g>
    </svg>
  );
}

/** Mark, wordmark and the tagline underneath. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={styles.logo}>
      <LogoMark />
      {!compact && (
        <span className={styles.words}>
          <span className={styles.word}>{BRAND.name}</span>
          <span className={styles.tagline}>{BRAND.tagline}</span>
        </span>
      )}
    </span>
  );
}
