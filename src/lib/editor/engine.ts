import { GPULostError, getAI } from '@/lib/ai/client';
import type { ModelKey } from '@/lib/ai/registry';
import { toast } from '@/lib/toast';
import { useEditor } from './store';

/** Add model keys to the "already on this device" list. */
export function markCached(keys: ModelKey[]) {
  useEditor.setState((s) => ({ cached: [...new Set([...s.cached, ...keys])] }));
}

/** Start the AI worker and read which engines are already stored. Safe to call more than once. */
export async function initEngine() {
  try {
    navigator.storage?.persist?.().catch(() => {});
    const r = await getAI().init();
    useEditor.setState((s) => ({ backend: r.backend, cached: [...new Set([...s.cached, ...r.cached])] }));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Run an AI job. If the OS resets the graphics chip mid-job, restart the engine with a fresh
 * device and retry once with the heavy steps on the CPU.
 */
export async function withRecovery<T>(job: (safe: boolean) => Promise<T>): Promise<T> {
  try {
    return await job(false);
  } catch (e) {
    if (!(e instanceof GPULostError)) throw e;
    toast('The graphics chip was reset by the system. Retrying in safe mode…', 'info', 6000);
    getAI().restart();
    await initEngine();
    return job(true);
  }
}

export const cancelJob = () => getAI().cancel();
