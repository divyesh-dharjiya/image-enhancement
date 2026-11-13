/**
 * Portrait matting check (MODNet): prints I/O, runs on a photo, saves the alpha matte composited
 * on a flat colour. Usage: npx tsx tools/test-modnet.ts <model.onnx> <photo> <out.jpg>
 */
import * as ort from 'onnxruntime-web';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const [model, photo, out] = process.argv.slice(2);
ort.env.wasm.numThreads = 4;
ort.env.logLevel = 'fatal';
const s = await ort.InferenceSession.create(await readFile(model), { executionProviders: ['wasm'] });
console.log('in', s.inputNames, s.inputMetadata?.map((m) => m.shape), 'out', s.outputNames, s.outputMetadata?.map((m) => m.shape));
const W = 512, H = 512;
const rgb = await sharp(await readFile(photo)).resize(W, H, { fit: 'fill' }).removeAlpha().raw().toBuffer();
const n = W * H;
const x = new Float32Array(3 * n);
for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) x[c * n + i] = (rgb[i * 3 + c] / 255 - 0.5) / 0.5;
const t = performance.now();
const r = await s.run({ [s.inputNames[0]]: new ort.Tensor('float32', x, [1, 3, H, W]) });
const a = r[s.outputNames[0]];
const d = a.data as Float32Array;
let mn = Infinity, mx = -Infinity;
for (const v of d) { mn = Math.min(mn, v); mx = Math.max(mx, v); }
console.log(`ran ${Math.round(performance.now() - t)} ms, dims ${a.dims}, range [${mn.toFixed(3)}, ${mx.toFixed(3)}]`);
const px = Buffer.alloc(n * 3);
for (let i = 0; i < n; i++) {
  const al = Math.min(1, Math.max(0, d[i]));
  px[i * 3] = rgb[i * 3] * al + 40 * (1 - al);
  px[i * 3 + 1] = rgb[i * 3 + 1] * al + 200 * (1 - al);
  px[i * 3 + 2] = rgb[i * 3 + 2] * al + 120 * (1 - al);
}
await sharp(px, { raw: { width: W, height: H, channels: 3 } }).jpeg({ quality: 85 }).toFile(out);
