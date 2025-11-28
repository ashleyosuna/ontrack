// ...existing code...
import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";
// Replace old import and custom globals with env-based config
import { pipeline, env } from "@xenova/transformers";
// ...existing code...

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

// ...existing code...

// Configure Transformers.js like on the website/docs
env.debug = true;
env.useBrowserCache = true;
// Serve models from Vite's public/ directory
env.allowLocalModels = true;
env.localModelPath = "/models";
// Block remote fetches while your network is restricted
env.allowLocalModels = true;
env.localModelPath = new URL(`${import.meta.env.BASE_URL}models/`, window.location.href).toString();
// Allow during setup; set false after verifying local files
env.allowRemoteModels = true;
// ...existing code...
const MODEL_ID = "flan-t5-small"; // with env.localModelPath, this resolves to /models/LaMini-Flan-T5-77M/

async function createGeneratorPipeline() {
  console.log("[LLM] Initializing generator pipeline...");
  const t0 = performance.now();

  try {
    // T5 models use text2text-generation
    const gen = await pipeline("text2text-generation", MODEL_ID, {
      quantized: true,
      progress_callback: (e: any) => {
        if (
          e &&
          typeof e === "object" &&
          ["initiate", "download", "progress", "done"].includes(e.status) &&
          e.file
        ) {
          if (e.status === "progress") {
            console.log("[LLM][progress]", e.file, e.progress ?? "", e.loaded ?? "", "/", e.total ?? "");
          } else {
            console.log("[LLM][progress]", e.status, e.file);
          }
        } else {
          console.warn("[LLM][progress] unusual:", e);
        }
      },
    });

    console.log("[LLM] Generator ready in", (performance.now() - t0).toFixed(0), "ms");
    return gen;
  } catch (err) {
    console.error("[LLM] Failed to init with", MODEL_ID, err);
    throw err;
  }
}

let generatorPromise: Promise<any> | null = null;
async function getGenerator() {
  if (!generatorPromise) {
    generatorPromise = createGeneratorPipeline().catch((err) => {
      generatorPromise = null;
      throw err;
    });
  }
  return generatorPromise;
}

export async function suggestFromTextLocal(text: string): Promise<LocalSuggestResult> {
  if (!text.trim()) {
    console.log("[LLM] Empty text, skipping generation.");
    return {};
  }
  const gen = await getGenerator();

  const prompt = `
Extract the following fields from the document and return ONLY compact JSON:
"title", "description", "dueDateISO" (ISO 8601 or null), "reminders" (string[]), "notes", "categoryHint".

Document:
${text.slice(0, 4000)}
`.trim();

  console.log("[LLM] Starting generation. Prompt chars:", prompt.length);
  const tStart = performance.now();

  const TIMEOUT_MS = 25000;
  const generation = gen(prompt, {
    max_new_tokens: 256,
    temperature: 0.1,
    do_sample: false,
    // T5 returns the full string; we parse JSON below
  });

  let out: any;
  try {
    out = await Promise.race([
      generation,
      new Promise((_r, reject) => setTimeout(() => reject(new Error("LLM generation timeout")), TIMEOUT_MS)),
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

  const parsed = parseFirstJsonObject(content);
  console.log("[LLM] Parsed suggestion:", parsed);
  return parsed;
}

// ---------- NEW: data URL helper and UploadDocumentForm compatibility wrapper ----------
function dataUrlToBlob(dataUrl: string, fallbackMime?: string): Blob {
  if (!dataUrl.startsWith("data:")) {
    // Not a data URL (might be http(s) or blob:), just return empty with type hint.
    return new Blob([], { type: fallbackMime || "application/octet-stream" });
  }
  const [meta, payload] = dataUrl.split(",", 2);
  const mime = (/^data:([^;]+)/i.exec(meta)?.[1] || fallbackMime || "application/octet-stream");
  const isBase64 = /;base64/i.test(meta);
  if (isBase64) {
    const byteString = atob(payload);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mime });
  }
  const text = decodeURIComponent(payload);
  return new Blob([text], { type: mime });
}

/**
 * Compatibility wrapper for UploadDocumentForm.
 * Takes a DataURL (or http(s)/blob URL), analyzes locally, and returns { suggestion }.
 */
export async function analyzeDataUrlLocally(dataUrl: string, mime?: string): Promise<{ suggestion: LocalSuggestResult }> {
  let blob: Blob;
  if (dataUrl.startsWith("data:")) {
    blob = dataUrlToBlob(dataUrl, mime);
  } else {
    const res = await fetch(dataUrl);
    blob = await res.blob();
  }

  const task = await scanDocument(blob);
  const { rawText, ...suggestion } = task;
  return { suggestion };
}

// ---------- NEW: OCR and PDF extraction utilities ----------
let ocrWorkerPromise: Promise<any> | null = null;
async function getOcrWorker() {
  if (!ocrWorkerPromise) {
    ocrWorkerPromise = (async () => {
      const worker = await createWorker({
        logger: (m: any) => {
          if (m?.status === "recognizing text" && typeof m.progress === "number") {
            // console.log("[OCR]", Math.round(m.progress * 100), "%");
          }
        },
      });
      // @ts-ignore
      await worker.load();
      // @ts-ignore
      await worker.loadLanguage("eng");
      // @ts-ignore
      await worker.initialize("eng");
      return worker;
    })().catch((e) => {
      ocrWorkerPromise = null;
      throw e;
    });
  }
  return ocrWorkerPromise;
}

async function ocrBlobToText(blob: Blob): Promise<string> {
  const worker = await getOcrWorker();
  // @ts-ignore
  const { data } = await worker.recognize(blob);
  return (data?.text || "").trim();
}

function isProbablyPdfBlob(blob: Blob): boolean {
  return (blob as File)?.type === "application/pdf" || ((blob as File)?.name || "").toLowerCase().endsWith(".pdf");
}

function isProbablyImageBlob(blob: Blob): boolean {
  const t = (blob as File)?.type || "";
  return t.startsWith("image/");
}

async function bufferFromInput(input: File | Blob | ArrayBuffer | Uint8Array | string): Promise<ArrayBuffer> {
  if (typeof input === "string") {
    const res = await fetch(input);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    return await res.arrayBuffer();
  }
  if (input instanceof ArrayBuffer) return input;
  if (input instanceof Uint8Array) return input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);
  if (input instanceof Blob) return await input.arrayBuffer();
  throw new Error("Unsupported input type");
}

function isPdfBuffer(buf: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buf, 0, Math.min(5, buf.byteLength));
  // %PDF-
  return bytes.length >= 5 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d;
}

async function pdfExtractText(buf: ArrayBuffer): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({ data: buf });
  const pdf = await loadingTask.promise;
  try {
    let text = "";
    const pageCount = pdf.numPages;
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((it: any) => it.str).join(" ");
      text += (pageText + "\n\n");
    }
    return text.trim();
  } finally {
    // pdfjs doesn't expose explicit close in browser builds; rely on GC.
  }
}

async function renderPageToBlob(page: any, scale = 1.5): Promise<Blob> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D not supported");
  canvas.width = viewport.width | 0;
  canvas.height = viewport.height | 0;
  await page.render({ canvasContext: ctx, viewport }).promise;
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))), "image/png", 0.95);
  });
}

async function pdfOcrFirstPages(buf: ArrayBuffer, maxPages = 3, scale = 1.5): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({ data: buf });
  const pdf = await loadingTask.promise;
  let ocrText = "";
  try {
    const pages = Math.min(pdf.numPages, maxPages);
    for (let i = 1; i <= pages; i++) {
      const page = await pdf.getPage(i);
      const blob = await renderPageToBlob(page, scale);
      const t = await ocrBlobToText(blob);
      ocrText += t + "\n\n";
    }
    return ocrText.trim();
  } finally {
    // rely on GC
  }
}

async function imageExtractText(input: File | Blob | ArrayBuffer | Uint8Array | string): Promise<string> {
  let blob: Blob;
  if (input instanceof Blob) {
    blob = input;
  } else {
    const ab = await bufferFromInput(input);
    blob = new Blob([ab]);
  }
  return await ocrBlobToText(blob);
}

// ---------- NEW: Task scanning orchestration ----------
export interface ScannedTask extends LocalSuggestResult {
  rawText: string;
}

function fallbackTaskFromText(text: string): ScannedTask {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const title = lines[0]?.slice(0, 120) || "Untitled task";
  return {
    title,
    description: lines.slice(1, 6).join("\n").slice(0, 800) || undefined,
    dueDateISO: null,
    reminders: [],
    notes: undefined,
    categoryHint: undefined,
    rawText: text,
  };
}

/**
 * Scan a document (PDF or image), extract text (pdf text layer first, OCR fallback),
 * and return the best-fit task suggested by the local LLM.
 */
export async function scanDocument(input: File | Blob | ArrayBuffer | Uint8Array | string): Promise<ScannedTask> {
  // 1) Normalize and detect
  let isPdf = false;
  let text = "";
  let blobForTypeCheck: Blob | null = null;

  if (input instanceof Blob) {
    blobForTypeCheck = input;
    isPdf = isProbablyPdfBlob(input);
  } else if (typeof input === "string") {
    // Rough detection by URL
    isPdf = input.toLowerCase().endsWith(".pdf");
  } else {
    const buf = input instanceof Uint8Array ? input : (input as ArrayBuffer);
    if (buf) isPdf = input instanceof ArrayBuffer ? isPdfBuffer(buf as ArrayBuffer) : false;
  }

  // 2) Extract text
  try {
    if (isPdf) {
      const buf = await bufferFromInput(input);
      const layerText = await pdfExtractText(buf);
      if (layerText && layerText.length >= 80) {
        text = layerText;
      } else {
        const ocrText = await pdfOcrFirstPages(buf, 3, 1.75);
        text = (layerText + "\n" + ocrText).trim();
      }
    } else if (blobForTypeCheck && isProbablyImageBlob(blobForTypeCheck)) {
      text = await imageExtractText(blobForTypeCheck);
    } else {
      // Try OCR as a catch-all
      text = await imageExtractText(input);
    }
  } catch (e) {
    console.error("[Scan] Text extraction failed:", e);
    text = "";
  }

  const cleaned = (text || "").replace(/\u0000/g, "").trim();
  if (!cleaned) {
    return {
      title: "Untitled task",
      description: undefined,
      dueDateISO: null,
      reminders: [],
      notes: undefined,
      categoryHint: undefined,
      rawText: "",
    };
  }

  // 3) Ask local model for a suggestion
  let suggestion: LocalSuggestResult = {};
  try {
    suggestion = await suggestFromTextLocal(cleaned);
  } catch (e) {
    console.warn("[Scan] Suggestion failed, using fallback:", e);
  }

  // 4) Map to ScannedTask with sensible defaults
  const task: ScannedTask = {
    title: suggestion.title?.trim() || cleaned.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)[0]?.slice(0, 120) || "Untitled task",
    description: suggestion.description || undefined,
    dueDateISO: typeof suggestion.dueDateISO === "string" || suggestion.dueDateISO === null ? suggestion.dueDateISO : null,
    reminders: Array.isArray(suggestion.reminders) ? suggestion.reminders : [],
    notes: suggestion.notes || undefined,
    categoryHint: suggestion.categoryHint || undefined,
    rawText: cleaned,
  };

  return task;
}