// Copies ONNX Runtime Web's WASM engine (+ its thread glue) into public/ort so it is served
// from our own origin. Runs automatically before `build` (dev loads them from node_modules).
import { copyFile, mkdir } from 'node:fs/promises';

const src = 'node_modules/onnxruntime-web/dist';
const dst = 'public/ort';
await mkdir(dst, { recursive: true });
for (const f of ['ort-wasm-simd-threaded.asyncify.mjs', 'ort-wasm-simd-threaded.asyncify.wasm']) {
  await copyFile(`${src}/${f}`, `${dst}/${f}`);
}
console.log('onnxruntime-web engine copied to public/ort');
