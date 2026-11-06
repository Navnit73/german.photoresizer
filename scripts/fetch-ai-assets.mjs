#!/usr/bin/env node
/**
 * Self-hosting of AI assets (no third-party requests from the visitor's browser):
 *  - copies the ONNX Runtime Web WASM files from node_modules → public/vendor/ort/
 *  - downloads the background-removal models (fp16) once → public/models/<id>/
 *
 * Runs automatically before `npm run dev` and `npm run build` (pre-scripts).
 * Already present files are skipped. Both folders are gitignored.
 * Set SKIP_AI_ASSETS=1 to skip (e.g. when NEXT_PUBLIC_MODEL_HOST points to your own CDN).
 */
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const pub = path.join(root, "public");

if (process.env.SKIP_AI_ASSETS === "1") {
  console.log("[ai-assets] skipped (SKIP_AI_ASSETS=1)");
  process.exit(0);
}

// 1) ONNX Runtime Web
const ortSrc = path.join(root, "node_modules/onnxruntime-web/dist");
const ortDst = path.join(pub, "vendor/ort");
fs.mkdirSync(ortDst, { recursive: true });
for (const f of fs.readdirSync(ortSrc).filter((f) => /^ort-wasm-simd-threaded.*\.(wasm|mjs)$/.test(f))) {
  const src = path.join(ortSrc, f);
  const dst = path.join(ortDst, f);
  if (!fs.existsSync(dst) || fs.statSync(dst).size !== fs.statSync(src).size) fs.copyFileSync(src, dst);
}
console.log(`[ai-assets] ONNX Runtime → public/vendor/ort/`);

// 2) Models (keep in sync with MODELS in src/lib/image/segment.ts)
const MODELS = {
  "Xenova/modnet": ["config.json", "preprocessor_config.json", "onnx/model_fp16.onnx"],
  "onnx-community/BiRefNet_lite-ONNX": ["config.json", "preprocessor_config.json", "onnx/model_fp16.onnx"],
};

async function download(model, file) {
  const dst = path.join(pub, "models", model, file);
  const url = `https://huggingface.co/${model}/resolve/main/${file}`;
  const head = await fetch(url, { method: "HEAD", redirect: "follow" });
  if (!head.ok) throw new Error(`${url}: HTTP ${head.status}`);
  const size = Number(head.headers.get("content-length") ?? 0);
  if (fs.existsSync(dst) && (!size || fs.statSync(dst).size === size)) return false;
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok || !res.body) throw new Error(`${url}: HTTP ${res.status}`);
  const tmp = `${dst}.part`;
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(tmp));
  if (size && fs.statSync(tmp).size !== size) throw new Error(`${file}: incomplete download`);
  fs.renameSync(tmp, dst);
  return true;
}

let fetched = 0;
for (const [model, files] of Object.entries(MODELS)) {
  for (const file of files) {
    try {
      if (await download(model, file)) {
        fetched++;
        console.log(`[ai-assets] downloaded ${model}/${file}`);
      }
    } catch (e) {
      const dst = path.join(pub, "models", model, file);
      if (fs.existsSync(dst)) {
        console.warn(`[ai-assets] could not verify ${model}/${file} (${e.message}) – using existing file`);
      } else {
        console.error(`[ai-assets] FAILED ${model}/${file}: ${e.message}`);
        process.exitCode = 1;
      }
    }
  }
}
console.log(`[ai-assets] models ready in public/models/ (${fetched} new file(s))`);
