/** Every AI model the app uses. All licences permit commercial use except where noted (see README). */

export type ModelKey = 'detector' | 'restorer' | 'sr' | 'matte';

export interface ModelDef {
  url: string;
  label: string;
  /** Other places to download the same file from, tried in order when `url` fails. */
  fallbacks?: { url: string; bytes: number }[];
  /** Large model: streamed once into on-device storage with download progress. */
  large?: { bytes: number };
}

/** Serve self-hosted model files from a CDN by setting NEXT_PUBLIC_ASSET_BASE (e.g. https://cdn.example.com). */
const BASE = (process.env.NEXT_PUBLIC_ASSET_BASE ?? '').replace(/\/$/, '');
const HF = 'https://huggingface.co';

/**
 * Face restoration: CodeFormer, FaceFusion's ONNX export, 377 MB, downloaded once the first time a photo is enhanced
 * and kept on the device. In side-by-side tests on the same photos it gave the most natural colour, skin and eyes
 * (RestoreFormer++ hardened and over-saturated a faded print, GFPGAN 1.4 warped eyes, GPEN-1024 was harsher).
 *
 * LICENCE: CodeFormer's licence (S-Lab, NTU) is NON-COMMERCIAL. Fine for a personal or free app; before selling the app
 * or showing ads, switch `restorer` to RestoreFormer++ (Apache-2.0: restoreformer_plus_plus.onnx, 294 MB,
 * 294_264_232 bytes, same folder on Hugging Face), which needs no other change.
 */
export const RESTORER_SIZE: 256 | 512 = 512;

export const MODELS: Record<ModelKey, ModelDef> = {
  // YuNet face detector (OpenCV Zoo, MIT).
  detector: { url: `${BASE}/models/yunet.onnx`, label: 'Face detector' },
  restorer: {
    url: `${HF}/facefusion/models-3.0.0/resolve/main/codeformer.onnx`,
    label: 'Face restoration engine',
    large: { bytes: 376_951_650 },
  },
  // Real-ESRGAN x4plus (BSD-3-Clause), the full-size network: real hair and skin texture where the compact general-x4v3
  // smears it. Rebuilt by tools/build-sr.mjs (RGBA bytes in and out, 256² tiles, float16 weights): 36 MB.
  sr: { url: `${BASE}/models/esrgan_x4plus_rgba.onnx`, label: 'Upscaler' },
  matte: { url: `${BASE}/models/modnet_fp16.onnx`, label: 'Background engine' },
};

export const modelBytes = (k: ModelKey) => MODELS[k].large?.bytes ?? 0;
