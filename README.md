# Mitakshi: AI Photo Studio

**Live demo:** https://image-enhancement-liard.vercel.app

Mitakshi is an AI photo enhancer that runs **entirely in the browser** on the user's own GPU. Photos are never uploaded, so there are no server or API costs, no queues and no watermarks. It is built with Next.js and React and can be exported as a static site that deploys anywhere.

## Run it

```bash
npm install --legacy-peer-deps
npm run dev              # http://localhost:3000
```

This needs a WebGPU browser (Chrome or Edge 113+, recent Safari) for full speed. Other browsers fall back to a slower CPU path.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run build` / `npm start` | Production build (`.next/`) and serve it on http://localhost:3000 |
| `npm run export` | Static site in `out/` (about 130 MB, mostly the AI engine and models) |
| `npm run typecheck` | Type-check the project |
| `npm run models` | Re-download the self-hosted models into `public/models` |

`dev`, `build` and `export` first copy the ONNX Runtime engine into `public/ort` (`tools/copy-ort.mjs`).

## Features

| Feature | What it does | Model (licence) |
| --- | --- | --- |
| **AI Enhance** | One tap: restores faces, upscales to 2× / 4× (up to 16 MP) and, with **Auto edit** on (the default), sets light and colour for the result | CodeFormer + Real-ESRGAN x4plus (BSD-3) |
| **Smart scan** | Detects faces on open and turns on the right steps | YuNet (MIT) |
| **Per-face control** | Every face restored separately, with on/off and strength per face; ideal for group photos | CodeFormer |
| **Natural ↔ Enhanced** | One slider to dial back the "AI face" look | CodeFormer |
| **Auto fix** | One tap sets brightness, contrast, colour balance and detail from the photo's own histogram | GPU shader |
| **Crop & rotate** | Rotate, flip, mirror and crop to 1:1, 4:5, 3:4, 9:16, 4:3 or 16:9; every step can be undone | Canvas |
| **AI Background** | Blur (lens-style bokeh), solid colour, black & white, or remove (transparent PNG) | MODNet (Apache-2.0) |
| **Batch + ZIP** | Enhance a whole album in one go and download everything as a ZIP | all of the above |
| **Adjust** | Brightness, contrast, highlights, shadows, fade · warmth, tint, vibrance, saturation · sharpen, clarity, noise reduction · vignette, film grain, all live | GPU shader |
| **Filters** | One tap: Auto, Vivid, Vintage, Film, Warm, Cool, Matte, Drama, B&W, Noir, Fresh (each fully editable afterwards) | GPU shader |
| **Compare & export** | Before/after slider, undo, full-resolution JPEG/PNG/WebP, share, copy, before/after image | |
| **Private & offline** | Installable app. AI engines download once and are stored on the device | |

## Measured speed (Intel Iris Xe integrated laptop GPU)

| Job | Time |
| --- | --- |
| AI Enhance, 2 faces + 2× (700 × 464 → 1400 × 928), after the one-time 377 MB face engine download | about 1 minute (faces ≈ 20 s, upscaling ≈ 40 s) |
| Face restoration only, engine already loaded | a few seconds per face |
| Batch, 2 photos (faces, original size) | 25 s |

Discrete NVIDIA, AMD and Apple GPUs are several times faster.

## Project structure

```
Image Enhancement/
├─ src/
│  ├─ app/            Next.js App Router entry: layout.tsx, page.tsx, globals.css (design tokens)
│  ├─ components/
│  │  ├─ studio/      Page shell: Topbar, ToolRail, Stage (photo, zoom bar, progress), Inspector, Hero
│  │  ├─ panels/      One file per tool: Enhance, Adjust, Crop, Background, Export
│  │  ├─ batch/       Batch dialog
│  │  ├─ brand/       Logo
│  │  └─ ui/          Shared primitives (Button, Slider, Switch, Segmented, ...)
│  ├─ hooks/          Global keyboard and paste/drop events
│  └─ lib/
│     ├─ brand.ts     Product name and tagline (one place to rename the app)
│     ├─ editor/      App state and actions: Zustand store, undo history, render loop, enhance,
│     │               geometry, background, export and batch flows
│     ├─ ai/          Web Worker with ONNX Runtime Web, model registry and on-device model storage
│     ├─ gl/          WebGL2 compositor (tone, clarity, background effects, before/after split)
│     └─ viewer.ts, zip.ts, imageio.ts, ...
├─ public/            Self-hosted models, service worker, manifest, icon, static-host headers
├─ tools/             Model download, ONNX Runtime copy, and Node QA scripts
├─ next.config.mjs, package.json, tsconfig.json
└─ README.md
```

## How it works

- `src/lib/ai/worker.ts`: all AI runs in one Web Worker with ONNX Runtime Web (WebGPU first, WASM fallback). It keeps a small LRU of loaded engines, uses cooperative cancel, and has a GPU-reset watchdog (it restarts the engine and retries on the CPU if the OS resets the GPU).
- `src/lib/ai/models.ts`: large engines stream into on-device storage (OPFS) once, with download progress. Small ones are self-hosted and cached by the service worker.
- `src/lib/ai/faces.ts`: YuNet detection, FFHQ alignment, CodeFormer restoration (512² crops, fidelity 0.7) and feathered paste-back. `models.ts` narrows CodeFormer's 64-bit strength input to 32-bit as the file loads, so it runs on the browser's GPU.
- `src/lib/ai/tasks.ts`: tiled super-resolution and MODNet matting.
- `src/lib/gl/compositor.ts`: one WebGL2 pass for tone, clarity, background effects (bokeh blur, colour, B&W, cut-out) and the before/after split. It is live and non-destructive.
- `src/lib/viewer.ts`: pan, pinch and wheel zoom, and the before/after split handle. `src/lib/zip.ts` is a dependency-free ZIP writer.

## Deploy

Use **Vercel** or any Node host with `npm run build` and `npm start`: the required headers come from `next.config.mjs`. For a static host, run `npm run export` and upload `out/` to **Netlify** or **Cloudflare Pages**; `out/_headers` (from `public/_headers`) sets the same headers. Both need `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless` to run the multi-threaded WASM path.

- **Cloudflare Pages** limits files to 25 MB, and two files are larger (the 26 MB WASM engine and the 36 MB upscaler `esrgan_x4plus_rgba.onnx`). Host `out/models` and `out/ort` on a CDN with CORS enabled, and export with `NEXT_PUBLIC_ASSET_BASE=https://your-cdn npm run export` (see `.env.example`).
- One engine is downloaded on first use, the face engine (CodeFormer, 377 MB, from FaceFusion's Hugging Face repository). The upscaler (Real-ESRGAN x4plus, 36 MB) is self-hosted in `public/models` and rebuilt with `node tools/build-sr.mjs real_esrgan_x4.onnx public/models/esrgan_x4plus_rgba.onnx --net-in=input --net-out=output --sharp=0`. To avoid depending on Hugging Face, mirror the face file to your own storage and change the URLs in `src/lib/ai/registry.ts`.

## Licences

Licences: **CodeFormer is NON-COMMERCIAL** (S-Lab licence): fine for a personal or free app, but before selling the app or showing ads switch the face engine to RestoreFormer++ (Apache-2.0, 294 MB), a one-entry change in `src/lib/ai/registry.ts` (the comment there has the file name and size). Real-ESRGAN (BSD-3-Clause), YuNet (MIT), MODNet (Apache-2.0) and ONNX Runtime (MIT) allow commercial use. The face model was trained on public datasets that carry their own terms, so review them once before a commercial launch. Model files come from the publishers or well-known mirrors (FaceFusion, Qualcomm AI Hub, Xenova).

## QA scripts

`tools/test-modnet.ts` and `tools/test-zip.ts` run the same code paths in Node against real images (for example `npx tsx tools/test-zip.ts out.zip photo.jpg`). `tools/prepare-models.mjs` re-downloads the self-hosted models.

## Colour and speed

- Navy and sky blue in two modes: dark is the default and light is one click away (the sun / moon button in the top bar; the choice is remembered on this device). The tokens are in `:root` (dark) and `:root[data-theme="light"]` of `globals.css`, set before first paint by a small script in `layout.tsx`; the mobile app's `src/theme.ts` mirrors them. The logo geometry is shared with the mobile app: keep `Logo.tsx` in both in sync.
- The upscaler is `tools/build-sr.mjs` output: the Qualcomm export rebuilt with RGBA bytes in and out (scaling and rounding run inside ONNX Runtime), 256² tiles and float16 weights (2.4 MB instead of 5 MB).
- Progress is one bar for the whole job with a time-left estimate. Faces are capped at the 8 largest, and output size starts at 4× Ultra for every photo (capped at 16 MP; pick Original or 2× HD for a faster result).
