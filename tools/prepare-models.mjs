// Re-downloads the self-hosted models into public/models from their original sources:
//   • YuNet face detector (OpenCV Zoo, MIT)            – via FaceFusion's mirror
//   • MODNet portrait matting fp16 (Apache-2.0)        – Xenova/modnet
// The 4× upscaler (Real-ESRGAN x4plus, BSD-3-Clause) is committed as public/models/esrgan_x4plus_rgba.onnx; rebuild it
// with tools/build-sr.mjs (see its header). The face engine (CodeFormer) is downloaded by the app on first use.
// Run:  node tools/prepare-models.mjs
import { mkdir, stat, writeFile } from 'node:fs/promises';

const out = 'public/models';
await mkdir(out, { recursive: true });
const files = {
  'yunet.onnx': 'https://huggingface.co/facefusion/models-3.4.0/resolve/main/yunet_2023_mar.onnx',
  'modnet_fp16.onnx': 'https://huggingface.co/Xenova/modnet/resolve/main/onnx/model_fp16.onnx',
};
for (const [name, url] of Object.entries(files)) {
  if (await stat(`${out}/${name}`).then(() => true, () => false)) continue;
  console.log('↓', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await writeFile(`${out}/${name}`, Buffer.from(await res.arrayBuffer()));
}
console.log('models ready in', out);
