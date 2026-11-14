'use client';

import type { LucideIcon } from 'lucide-react';
import { ArrowRight, ChevronsLeftRight, Crop, Download, ImagePlus, Images, Layers, ScanFace, ShieldCheck, SlidersHorizontal, Sparkles, Undo2, Wand2, WifiOff, Zap } from 'lucide-react';
import { pickBatchPhotos, pickPhoto } from '@/lib/editor';
import { cn } from '@/lib/cn';
import styles from './Hero.module.css';

const FEATURES: { icon: LucideIcon; title: string; text: string; tag: string }[] = [
  { icon: Wand2, title: 'Auto fix', text: 'One tap sets the light and colour that suit the photo.', tag: '1 tap' },
  { icon: ScanFace, title: 'Face restore', text: 'Sharp eyes, skin and hair, even on blurry shots.', tag: 'AI' },
  { icon: Sparkles, title: 'HD upscale', text: 'Up to 4× with fine detail rebuilt.', tag: 'AI' },
  { icon: Layers, title: 'Background', text: 'Blur it, recolour it or cut the subject out.', tag: 'AI' },
  { icon: Crop, title: 'Crop and rotate', text: 'Frame the photo just right, then undo freely.', tag: 'Free' },
];

const PERKS: { icon: LucideIcon; text: string }[] = [
  { icon: ShieldCheck, text: 'Private: photos stay on your device' },
  { icon: WifiOff, text: 'Works offline' },
  { icon: Zap, text: 'No watermark, no sign-up' },
];

const SLIDERS: [string, string, number][] = [
  ['Brightness', '+24', 62],
  ['Contrast', '+12', 56],
  ['Clarity', '+30', 70],
];
const LOOKS = ['none', 'warm', 'cool', 'mono'];

const STATS: { value: string; label: string }[] = [
  { value: '4×', label: 'sharper detail' },
  { value: '0', label: 'photos uploaded' },
  { value: '100%', label: 'runs on your device' },
];

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ImagePlus, title: 'Pick a photo', text: 'Drop it here, paste it, or choose it from your files.' },
  { icon: Sparkles, title: 'Tap Enhance', text: 'Faces, detail and colour are fixed in seconds.' },
  { icon: Download, title: 'Save in HD', text: 'Download the full-resolution result. No watermark.' },
];

/** Welcome screen: the proof (a before/after), the one big action, then what else the app does. Shown until the first photo is opened. */
export function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <section className={styles.intro}>
            <span className={styles.eyebrow}>
              <i aria-hidden /> AI photo enhancer · free
            </span>

            <h1 className={styles.title}>
              Restore blurry photos <span className="gradText">with AI</span>
            </h1>

            <p className={styles.lead}>Sharpen faces, upscale to HD, change backgrounds. Free, with no watermark, and your photos never leave your device.</p>

            <div className={styles.actions}>
              <button type="button" className={styles.cta} onClick={pickPhoto}>
                <ImagePlus aria-hidden />
                Choose a photo
              </button>
              <button type="button" className={styles.secondary} onClick={pickBatchPhotos}>
                <Images aria-hidden />
                Enhance an album
              </button>
            </div>
            <p className={styles.hint}>or drop a photo anywhere · paste with Ctrl+V · JPG, PNG, WebP</p>

            <ul className={styles.perks}>
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <Icon aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.preview} aria-hidden>
            <div className={styles.editor}>
              <div className={styles.chrome}>
                <span className={styles.dots}>
                  <i />
                  <i />
                  <i />
                </span>
                <b>night-lake.jpg</b>
                <span className={styles.chromeIcons}>
                  <Undo2 />
                  <Download />
                </span>
              </div>
              <div className={styles.workspace}>
                <div className={styles.rail}>
                  <span className={styles.railOn}>
                    <Sparkles />
                  </span>
                  <span>
                    <SlidersHorizontal />
                  </span>
                  <span>
                    <Crop />
                  </span>
                  <span>
                    <Layers />
                  </span>
                </div>
                <div className={styles.demo}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={cn(styles.scene, styles.after)} src="/demo-sharp.jpg" alt="" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={cn(styles.scene, styles.before)} src="/demo-soft.jpg" alt="" />
                  <span className={styles.demoLine}>
                    <span className={styles.demoKnob}>
                      <ChevronsLeftRight />
                    </span>
                  </span>
                  <span className={cn(styles.tag, styles.tagLeft)}>Before</span>
                  <span className={cn(styles.tag, styles.tagRight)}>After · HD</span>
                </div>
                <div className={styles.panel}>
                  <div className={styles.panelHead}>
                    <b>Adjust</b>
                    <span className={styles.autoPill}>
                      <Wand2 /> Auto
                    </span>
                  </div>
                  {SLIDERS.map(([name, val, pct], i) => (
                    <div key={name} className={styles.slider}>
                      <span>
                        {name} <em>{val}</em>
                      </span>
                      <i style={{ ['--p' as string]: pct + '%', animationDelay: i * 0.6 + 's' }} />
                    </div>
                  ))}
                  <div className={styles.looks}>
                    {LOOKS.map((l) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={l} className={styles['look_' + l]} src="/demo-sharp.jpg" alt="" />
                    ))}
                  </div>
                  <div className={styles.panelBtn}>
                    <Sparkles /> Enhance
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className={styles.stats} aria-label="At a glance">
          {STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </section>

        <section className={styles.more}>
          <h2>Everything in one place</h2>
          <ul className={styles.features}>
            {FEATURES.map(({ icon: Icon, title, text, tag }) => (
              <li key={title} className={styles.feature}>
                <div className={styles.featureTop}>
                  <span className={styles.featureIcon}>
                    <Icon aria-hidden />
                  </span>
                  <span className={styles.featureTag}>{tag}</span>
                </div>
                <strong>{title}</strong>
                <small>{text}</small>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.more}>
          <h2>How it works</h2>
          <ol className={styles.steps}>
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <span className={styles.stepIcon}>
                  <Icon aria-hidden />
                </span>
                <strong>{title}</strong>
                <small>{text}</small>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.privacy}>
          <span className={styles.privacyIcon}>
            <ShieldCheck aria-hidden />
          </span>
          <div>
            <strong>Private by design</strong>
            <small>Your photos are processed on your own device and are never uploaded. There is no account, no tracking and no watermark.</small>
          </div>
          <button type="button" className={styles.cta} onClick={pickPhoto}>
            Try it now
            <ArrowRight aria-hidden />
          </button>
        </section>
      </div>
    </div>
  );
}
