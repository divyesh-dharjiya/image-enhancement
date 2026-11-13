'use client';

import { AdjustPanel } from '@/components/panels/AdjustPanel';
import { BackgroundPanel } from '@/components/panels/BackgroundPanel';
import { EnhancePanel } from '@/components/panels/EnhancePanel';
import { ExportPanel } from '@/components/panels/ExportPanel';
import { CropPanel } from '@/components/panels/CropPanel';
import { type Tab, useEditor } from '@/lib/editor';
import { toolById } from './tools';
import styles from './Inspector.module.css';

function renderPanel(tab: Tab) {
  switch (tab) {
    case 'enhance':
      return <EnhancePanel />;
    case 'adjust':
      return <AdjustPanel />;
    case 'crop':
      return <CropPanel />;
    case 'background':
      return <BackgroundPanel />;
    case 'export':
      return <ExportPanel />;
  }
}

/** Right-hand inspector: the active tool's heading and its controls. */
export function Inspector() {
  const tab = useEditor((s) => s.tab);
  const { title, blurb, icon: Icon } = toolById(tab);

  return (
    <aside className={styles.inspector} aria-label={`${title} settings`}>
      <header className={styles.head}>
        <span className={styles.headIcon} aria-hidden>
          <Icon />
        </span>
        <div>
          <h2>{title}</h2>
          <p>{blurb}</p>
        </div>
      </header>
      {/* Keyed by tab so each tool opens scrolled to the top, with a short fade. */}
      <div key={tab} id="tool-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className={styles.body}>
        {renderPanel(tab)}
      </div>
    </aside>
  );
}
