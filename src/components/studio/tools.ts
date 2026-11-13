import type { LucideIcon } from 'lucide-react';
import { Crop, Layers, Share, SlidersHorizontal, WandSparkles } from 'lucide-react';
import type { Tab } from '@/lib/editor';

export interface Tool {
  id: Tab;
  /** Short label under the rail icon. */
  label: string;
  icon: LucideIcon;
  /** Inspector heading and the one-line explanation under it. */
  title: string;
  blurb: string;
}

export const TOOLS: Tool[] = [
  { id: 'enhance', label: 'Enhance', icon: WandSparkles, title: 'Enhance', blurb: 'One tap restores faces, brings back colour and upscales. Fine-tune each face afterwards.' },
  { id: 'adjust', label: 'Edit', icon: SlidersHorizontal, title: 'Edit', blurb: 'One-tap looks, then light, colour and detail. Live and fully reversible.' },
  { id: 'crop', label: 'Crop', icon: Crop, title: 'Crop and rotate', blurb: 'Rotate, flip and crop to a shape. Every step can be undone.' },
  { id: 'background', label: 'Backdrop', icon: Layers, title: 'Background', blurb: 'Keep the subject sharp. Change everything behind it.' },
  { id: 'export', label: 'Export', icon: Share, title: 'Export', blurb: 'Full resolution, with every edit applied.' },
];

export const toolById = (id: Tab) => TOOLS.find((t) => t.id === id) ?? TOOLS[0];
