'use client';

import { useEffect, useRef } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Viewer } from '@/lib/viewer';
import { ensureCompositor, rt, scheduleRender } from '@/lib/editor/runtime';
import { useEditor } from '@/lib/editor';
import { BusyCard } from './BusyCard';
import { Hero } from './Hero';
import { ZoomBar } from './ZoomBar';
import styles from './Stage.module.css';

/**
 * The canvas area. It fills the window behind the floating panels and hosts the GPU-rendered
 * picture, the before/after split handle, and the pan/zoom viewer.
 */
export function Stage() {
  const stageRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);

  const hasPhoto = useEditor((s) => s.work !== null);

  // Attach the GPU compositor and the viewer once the canvases exist.
  useEffect(() => {
    const stage = stageRef.current!;
    const art = artRef.current!;
    const split = splitRef.current!;
    const canvas = canvasRef.current!;
    const comp = ensureCompositor(canvas);

    const viewer = new Viewer(stage, art, split, {
      onSplit: (uv) => {
        comp.setSplit(uv);
        scheduleRender();
      },
      onZoom: (percent) => useEditor.setState({ zoom: percent }),
    });
    rt.viewer = viewer;
    return () => {
      viewer.destroy();
      if (rt.viewer === viewer) rt.viewer = null;
    };
  }, []);

  // The panels appear with the first photo and change the clear area, so re-centre the picture.
  useEffect(() => {
    if (hasPhoto) rt.viewer?.fit(true);
  }, [hasPhoto]);

  return (
    <section
      ref={stageRef}
      className={cn(styles.stage, hasPhoto && styles.withPanels)}
      aria-label="Preview"
    >
      <div ref={artRef} className={styles.art} style={{ visibility: hasPhoto ? 'visible' : 'hidden' }}>
        <canvas ref={canvasRef} className={styles.layer} aria-label="Edited photo" />
      </div>

      <div ref={splitRef} className={styles.split} data-viewer-ignore>
        <div className={styles.splitLine} />
        <div className={styles.splitKnob}>
          <ChevronsLeftRight aria-hidden />
        </div>
        <span className={cn(styles.splitTag, styles.tagLeft)}>Before</span>
        <span className={cn(styles.splitTag, styles.tagRight)}>After</span>
      </div>

      {!hasPhoto && <Hero />}
      <BusyCard />
      {hasPhoto && <ZoomBar />}
    </section>
  );
}
