import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";
import { pipeline } from "@xenova/transformers";


pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

export type LocalSuggestResult = {
  title?: string;
  description?: string;
  dueDateISO?: string | null;
  reminders?: string[];
  notes?: string;
  categoryHint?: string;
};

function dataUrlToUint8(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] || "";
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function extractTextFromDataUrl(dataUrl: string, mimeType?: string): Promise<string> {
  const mt = mimeType || (dataUrl.match(/^data:([^;]+);/)?.[1] ?? "");
  if (mt.startsWith("text/") || dataUrl.startsWith("data:text/")) {
    try {
      return decodeURIComponent(escape(atob(dataUrl.split(",")[1] || "")));
    } catch {
      return atob(dataUrl.split(",")[1] || "");
    }
  }
  if (mt.includes("pdf")) {
    const bytes = dataUrlToUint8(dataUrl);
    const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
    let text = "";
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      text += content.items.map((i: any) => i.str).join(" ") + "\n";
    }
    return text.trim();
  }
  if (mt.startsWith("image/") || dataUrl.startsWith("data:image/")) {
    const worker = await createWorker({
       workerPath: "/tesseract/worker.min.js",
       corePath: "/tesseract/tesseract-core.wasm.js",
       langPath: "/tessdata",
     });
    try {
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const { data } = await worker.recognize(dataUrl);
      return data.text?.trim() || "";
    } finally {
      await worker.terminate();
    }
  }
  return "";
}


// Optional global debug flag (set before pipeline calls)
// Enable remote downloads and browser cache to avoid repeated fetches.
(window as any).TRANSFORMERS_CONFIG = {
  debug: true,
  allow_remote_models: true,
  use_browser_cache: true,
  // Optional: set backend to wasm for widest compatibility
  // backend: "wasm",
};

// Prefer a small, browser-friendly remote model as fallback.
const REMOTE_FALLBACK_MODEL = "Xenova/LaMini-Flan-T5-77M"; // small text-gen capable model
// If you have a locally-hosted model, keep its base path here.
const LOCAL_MODEL_BASE = "/models/phi2-instruct/";

// Quick probe to verify a local model path serves JSON (not an HTML 404).
async function isLocalModelAvailable(base: string): Promise<boolean> {
  try {
    const res = await fetch(base + "config.json", { method: "GET" });
    const ok = res.ok && (res.headers.get("content-type") || "").includes("application/json");
    return ok;
  } catch {
    return false;
  }
}

// Preflight remote availability via HF API; avoids parsing HTML error pages.
async function isRemoteModelAvailable(modelId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://huggingface.co/api/models/${encodeURIComponent(modelId)}`, {
      method: "GET",
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function createGeneratorPipeline() {
  console.log("[LLM] Initializing generator pipeline...");
  const t0 = performance.now();

  const canUseLocal = await isLocalModelAvailable(LOCAL_MODEL_BASE);
  const canUseRemote = await isRemoteModelAvailable(REMOTE_FALLBACK_MODEL);
  const tryOrder = canUseLocal
    ? [LOCAL_MODEL_BASE, ...(canUseRemote ? [REMOTE_FALLBACK_MODEL] : [])]
    : (canUseRemote ? [REMOTE_FALLBACK_MODEL] : []);

  if (tryOrder.length === 0) {
    throw new Error(
      "[LLM] No available model sources: local path not serving JSON and remote is unreachable (CORS/network)."
    );
  }

  let lastErr: any = null;
  for (const modelId of tryOrder) {
    try {
      console.log("[LLM] Loading model:", modelId);
      const gen = await pipeline("text-generation", modelId, {
        quantized: true,
        progress_callback: (p: any) => {
          console.log("[LLM][progress]", p);
        },
      });
      console.log("[LLM] Generator ready in", (performance.now() - t0).toFixed(0), "ms", "using", modelId);
      return gen;
    } catch (err) {
      console.error("[LLM] Failed to init with", modelId, err);
      lastErr = err;
      // continue to next candidate
    }
  }

  throw lastErr ?? new Error("Unable to initialize generator pipeline");
}

let generatorPromise: Promise<any> | null = null;
async function getGenerator() {
  if (!generatorPromise) {
    // Ensure a failed init doesn't poison future calls.
    generatorPromise = createGeneratorPipeline().catch((err) => {
      generatorPromise = null;
      throw err;
    });
  }
  return generatorPromise;
}

function parseFirstJsonObject(s: string): LocalSuggestResult {
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    console.warn("[LLM] No JSON braces found.");
    return {};
  }
  try {
    return JSON.parse(s.slice(start, end + 1));
  } catch (e) {
    console.warn("[LLM] JSON parse error, attempting fix:", e);
    const fixed = s.slice(start, end + 1).replace(/,(\s*[}\]])/g, "$1").replace(/`/g, '"');
    try {
      return JSON.parse(fixed);
    } catch (e2) {
      console.warn("[LLM] Second parse failed:", e2);
      return {};
    }
  }
}

export async function suggestFromTextLocal(text: string): Promise<LocalSuggestResult> {
  if (!text.trim()) {
    console.log("[LLM] Empty text, skipping generation.");
    return {};
  }
  const gen = await getGenerator();

  const prompt = `
You are an extractor. Return ONLY JSON with:
"title", "description", "dueDateISO" (ISO or null), "reminders" (string[]), "notes", "categoryHint".
Keep values short.

Document:
${text.slice(0, 4000)}
`.trim();

  console.log("[LLM] Starting generation. Prompt chars:", prompt.length);
  const tStart = performance.now();

  // Timeout fallback (e.g. 25s)
  const TIMEOUT_MS = 25000;
  const generation = gen(prompt, {
    max_new_tokens: 256,
    temperature: 0.1,
    do_sample: false,
    callback_function: (token: string) => {
      if (token && (token === "{" || token === "}" || token.includes('"title"'))) {
        console.log("[LLM][stream] token:", token);
      }
    },
  });

  let out: any;
  try {
    out = await Promise.race([
      generation,
      new Promise((_r, reject) =>
        setTimeout(() => reject(new Error("LLM generation timeout")), TIMEOUT_MS)
      ),
    ]);
  } catch (err) {
    console.error("[LLM] Generation failed:", err);
    return {};
  }

  const elapsed = performance.now() - tStart;
  console.log("[LLM] Generation finished in", elapsed.toFixed(0), "ms");

  const content = Array.isArray(out)
    ? String(out[0]?.generated_text || "")
    : String((out as any)?.generated_text || out);
  console.log("[LLM] Raw output length:", content.length);
  if (content.length < 10) console.warn("[LLM] Very short output");

  const parsed = parseFirstJsonObject(content);
  console.log("[LLM] Parsed suggestion:", parsed);
  return parsed;
}

export async function analyzeDataUrlLocally(dataUrl: string, mimeType?: string) {
  console.log("[Scan] Step 1: extractText start");
  const t0 = performance.now();
  const rawText = await extractTextFromDataUrl(dataUrl, mimeType);
  console.log("[Scan] Step 1 done. Text chars:", rawText.length, "in", (performance.now() - t0).toFixed(0), "ms");

  console.log("[Scan] Step 2: LLM suggestion start");
  const t1 = performance.now();
  const suggestion = await suggestFromTextLocal(rawText);
  console.log("[Scan] Step 2 done in", (performance.now() - t1).toFixed(0), "ms");

  return { rawText, suggestion };
}