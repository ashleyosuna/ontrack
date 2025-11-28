import { useState, useEffect, useRef, SetStateAction } from "react";
import { Task, Category, Reminder, Template } from "../types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ArrowLeft, Bell, Plus } from "lucide-react";
import { FilePreview } from "./FilePreview";
import { analyzeDataUrlLocally } from "../utils/scanDocuments";
import * as chrono from "chrono-node";
import { pipeline, env } from "@xenova/transformers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Camera, Upload, X } from "lucide-react";
import type { DocumentAttachment } from "../types";
import { storage } from "../utils/storage";

interface UploadDocumentProps {
  tasks: Task[];
  onCreateTask: (task: Omit<Task, "id" | "createdAt">) => string;
  onSaveAsTask: (taskId: string, attachment: string) => void;
  onCancel: () => void;
  defaultCategoryId?: string;
  onNavigateToTasks?: (taskId: string) => void;
}

export function UploadDocumentForm({
  onCreateTask,
  onSaveAsTask,
  onCancel,
  defaultCategoryId,
  onNavigateToTasks,
}: UploadDocumentProps) {

  const [mode, setMode] = useState<"upload" | "camera">("upload"); // NEW
  const [capturing, setCapturing] = useState(false); // NEW (camera active)
  const videoRef = useRef<HTMLVideoElement | null>(null); // NEW
  const streamRef = useRef<MediaStream | null>(null); // NEW
  // XXX change document handler here
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [uploadDataUrl, setUploadDataUrl] = useState<string | null>(null);
  const [cameraName, setCameraName] = useState("");
  const [cameraDataUrl, setCameraDataUrl] = useState<string | null>(null);
  const activeDataUrl = mode === "upload" ? uploadDataUrl : cameraDataUrl;
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const changeMode = (mode: SetStateAction<"upload" | "camera">) => {
    // if (mode === "upload") setUploadDataUrl(activeDataUrl);
    // if (mode === "camera") setCameraDataUrl(activeDataUrl);
    setMode(mode);
  }

  const startCamera = async () => {
    try {
      setCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCapturing(false);
      alert("Unable to access camera. Please allow camera permissions or use Upload.");
    }
  };

  const stopCamera = () => {
    setCapturing(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch {}
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCameraDataUrl(dataUrl);
    setCameraName(`Photo ${new Date().toLocaleString()}`);
    stopCamera();
  };

  const readAsDataURL = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(r.error);
      r.readAsDataURL(f);
    })

  const replaceFile = () => inputRef.current?.click();

  const onReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      e.currentTarget.value = "";
      return;
    }
    const dataUrl = await readAsDataURL(f);
    setUploadFile(f);
    setUploadDataUrl(dataUrl);
    // Update name based on file
    setUploadName(f.name.replace(/\.[a-z0-9]+$/i, ""));
    e.currentTarget.value = ""; // allow re-selecting same file later
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeDataUrl) return;

    setAnalyzing(true);
    setAnalyzeError(null);

    try {
      const mime =
        mode === "upload"
          ? (uploadFile?.type || undefined)
          : "image/jpeg";

      const { suggestion } = await analyzeDataUrlLocally(activeDataUrl, mime);

      const currentTitle =
        mode === "upload" ? uploadName.trim() : cameraName.trim();

      const finalTitle =
        currentTitle ||
        suggestion.title?.trim() ||
        (mode === "upload"
          ? (uploadFile?.name?.replace(/\.[a-z0-9]+$/i, "") || "")
          : cameraName) ||
        "Untitled";

      if (!description.trim() && suggestion.description)
        setDescription(suggestion.description);
      if (!notes.trim() && suggestion.notes) setNotes(suggestion.notes);

      // Persist attachment
      let persistedPath: string;
      try {
        persistedPath = await storage.persistAttachment(activeDataUrl);
      } catch {
        // Fallback: keep raw data URL if persistence fails
        persistedPath = activeDataUrl;
      }

      // Derive filename + extension
      const ext =
        mode === "upload"
          ? (uploadFile?.name.match(/\.[a-z0-9]+$/i)?.[0] || "")
          : ".jpg";
      const attachment: DocumentAttachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        uri: persistedPath,
        mimeType: mime,
        fileName: finalTitle + ext,
        sizeBytes: mode === "upload" ? uploadFile?.size : undefined,
        previewUri: mime?.startsWith("image/") ? activeDataUrl : undefined,
        addedAt: new Date(),
      };

      const newTaskID = onCreateTask({
        title: finalTitle,
        description: (description || suggestion.description || "").trim(),
        date: suggestion.dueDateISO
          ? new Date(suggestion.dueDateISO)
          : new Date(),
        categoryId: defaultCategoryId || "",
        notes: (notes || suggestion.notes || "").trim(),
        attachments: [attachment], // FIX: pass object, not raw string
        reminders: [],
        completed: false,
      });

      onNavigateToTasks && onNavigateToTasks(newTaskID);
    } catch (err: any) {
      setAnalyzeError(err?.message || "Local analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    // Stop camera if user leaves camera mode or unmounts
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (mode === "camera") {
      // leaving upload -> clear upload selection for clarity
      void startCamera();
    } else {
      // leaving camera -> clear captured photo and stop stream
      stopCamera();
    }
  }, [mode]);


  return (
    <div className="space-y-5 relative">
      {/* Header */}
      <Button
        onClick={() => {
          stopCamera();
          onCancel();
        }}
        variant="outline"
        size="icon"
        className="absolute top-0 left-0"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* When no asset yet: let user choose Upload or Camera */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 border-purple-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mode selector */}
          <div className="space-y-2">
            <Label className="text-[#312E81]">Add document</Label>
            <div className="grid grid-cols-2 rounded-lg overflow-hidden border border-[#D6D3F5]">
              <button
                type="button"
                onClick={() => changeMode("upload")}
                className={
                  (mode === "upload"
                    ? "bg-[#312E81] text-white"
                    : "bg-white text-[#312E81]") +
                  " px-4 py-2 text-sm font-medium transition-colors"
                }
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => changeMode("camera")}
                className={
                  (mode === "camera"
                    ? "bg-[#312E81] text-white"
                    : "bg-white text-[#312E81]") +
                  " px-4 py-2 text-sm font-medium transition-colors"
                }
              >
                Camera
              </button>
            </div>
          </div>

          {/* Upload mode */}
          {mode === "upload" && (
            <div className= {uploadDataUrl ? "flex items-center justify-between space-y-2" : "space-y-2"}>
              <Label className="text-[#312E81]">
                {uploadDataUrl ? "Replace File" : "Upload File"}
              </Label>
              <Input
                id="file"
                type="file"
                accept=".txt,.md,.pdf,.doc,.docx,.png,.jpeg,.jpg,.gif,image/*"
                onChange={onReplace}
                className= {!uploadDataUrl ? 
                  "h-60 border-dashed border-2 border-[#312E81] rounded-lg text-sm py-14 px-6 cursor-pointer" :
                  "max-w-xs"
                }
                />
              {!uploadDataUrl && (<p className="text-sm text-[#4C4799] text-center">
                Tap to select a document
              </p>)}
            </div>
          )}

          {/* Camera mode */}
          {mode === "camera" && !cameraDataUrl && (
            <div className="space-y-3">
              <Label className="text-[#312E81]">Camera</Label>
              <div className="relative rounded-lg overflow-hidden border border-[#312E81] bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-[320px] object-contain"
                  playsInline
                  muted
                />
              </div>
              <div className="flex gap-3">
                {capturing ? (
                  <>
                    <Button
                      type="button"
                      onClick={takePhoto}
                      className="flex-1 bg-[#312E81] text-white"
                    >
                      Capture
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        // restart stream
                        stopCamera();
                        void startCamera();
                      }}
                    >
                      Retake
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={startCamera}
                    className="flex-1 bg-[#312E81] text-white"
                  >
                    Start Camera
                  </Button>
                )}
              </div>
            </div>
          )}
        {!activeDataUrl && (
          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="button"
              disabled={!activeDataUrl}
              className="h-12 bg-[#312E81] text-white hover:bg-[#4338CA]"
              onClick={() => {
                // If a file is already selected via upload, do nothing here.
                // If using camera, user must press Capture first (sets attachmentDataUrl).
              }}
            >
              Continue
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                stopCamera();
                onCancel();
              }}
              className="h-12"
            >
              Cancel
            </Button>
          </div>
        )}
        </form>

      {/* When we have a file/photo: show same preview + form */}
      {activeDataUrl && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Replace or Retake */}
            <div className="flex items-center justify-between">
              {mode === "camera" && (
                <Label className="text-[#312E81]">
                Retake Photo
              </Label>)}
              <div className="flex gap-2">
                {mode === "camera" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCameraDataUrl(null);
                      changeMode("camera");
                    }}
                  >
                    Retake
                  </Button>
                )}
              </div>
            </div>
            <div>
              <Label className="text-[#312E81]">{mode === "camera" ? "Photo Preview" : "Document Preview" }</Label>
              <FilePreview
                file={mode === "upload" ? uploadFile || undefined : undefined}
                dataUrl={mode === "upload" ? uploadDataUrl || undefined : cameraDataUrl || undefined}
                filename={(mode === "upload" ? uploadName : cameraName) || undefined}
                height={384}
                className="bg-white/60 space-y-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#312E81]">
                Document Name *
              </Label>
              <Input
                id="name"
                value={mode === "upload" ? uploadName : cameraName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (mode === "upload") setUploadName(e.target.value)
                    else setCameraName(e.target.value)
                  }
                }
                placeholder="e.g., Lease Agreement 2025"
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#312E81]">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                placeholder="Add details..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-[#312E81]">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNotes(e.target.value)
                }
                placeholder="Additional notes..."
                rows={3}
              />
            </div>

            {/* Submit XXX please add onclick functionality*/}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={(mode === "camera" && !cameraName.trim()) || (mode === "upload" && !uploadName) || !activeDataUrl}
                className="h-12 bg-[#312E81] text-white hover:bg-[#4338CA]"
              >
                {mode === "camera" ? "Save Photo" : "Save Document"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleSubmit();
                  stopCamera();
                  onCancel();
                }}
                className="h-12"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

interface MiniUploadCardProps {
  title?: string;
  accept?: string;
  onAdd: (attachment: DocumentAttachment) => void;
}

export function MiniUploadCard({
  title = "Attach a document",
  accept = ".txt,.md,.pdf,.doc,.docx,.png,.jpg,.jpeg,image/*",
  onAdd,
}: MiniUploadCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Camera state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const readAsDataURL = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(r.error);
      r.readAsDataURL(f);
    });

  async function saveDataUrlAsAttachment(
    dataUrl: string,
    opts?: { fileName?: string; mimeType?: string; sizeBytes?: number }
  ) {
    const savedPath = await storage.persistAttachment(dataUrl);
    const att: DocumentAttachment = {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      uri: savedPath,
      mimeType: opts?.mimeType || (dataUrl.split(";")[0].replace("data:", "") || undefined),
      fileName: opts?.fileName || "attachment",
      sizeBytes: opts?.sizeBytes,
      previewUri: (opts?.mimeType || dataUrl).startsWith("image/") ? dataUrl : undefined,
      addedAt: new Date(),
    };
    onAdd(att);
  }

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const file = el.files?.[0];
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const dataUrl = await readAsDataURL(file);
      await saveDataUrlAsAttachment(dataUrl, {
        fileName: file.name,
        mimeType: file.type || undefined,
        sizeBytes: file.size,
      });
    } catch (e) {
      console.error(e);
      setErr("Failed to attach file. Try again.");
    } finally {
      setBusy(false);
      el.value = "";
    }
  };

  async function startCamera() {
    try {
      setErr(null);
      setCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        // @ts-ignore
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (e) {
      console.error(e);
      setErr("Unable to access camera.");
      setCapturing(false);
    }
  }

  function stopCamera() {
    setCapturing(false);
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      // @ts-ignore
      videoRef.current.srcObject = null;
    }
  }

  function timestampName(prefix = "photo", ext = "jpg") {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${prefix}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.${ext}`;
  }

  async function takePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setBusy(true);
    try {
      await saveDataUrlAsAttachment(dataUrl, {
        fileName: timestampName("photo", "jpg"),
        mimeType: "image/jpeg",
      });
      setCameraOpen(false);
    } catch (e) {
      console.error(e);
      setErr("Failed to capture photo.");
    } finally {
      setBusy(false);
    }
  }

  // Cleanup on dialog close
  useEffect(() => {
    if (cameraOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraOpen]);

  return (
    <>
      <Card className="p-3 border-dashed border-2 border-gray-300 bg-white/70">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <Label className="text-sm text-[#312E81]">{title}</Label>
            {err && <span className="text-xs text-red-600 mt-1">{err}</span>}
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={onPick}
            />
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              title="Upload from files"
            >
              <Upload className="mr-2 h-4 w-4" />
              {busy ? "Uploading..." : "Upload"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={busy}
              onClick={() => setCameraOpen(true)}
              title="Use camera"
            >
              <Camera className="mr-2 h-4 w-4" />
              Camera
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Take a photo</DialogTitle>
          </DialogHeader>
          <div className="relative bg-black rounded overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-auto"
              style={{ background: "#000" }}
            />
            {!capturing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/80 text-sm">Starting camera…</span>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setCameraOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
            <Button type="button" onClick={takePhoto} disabled={!capturing || busy}>
              {busy ? "Saving…" : "Capture"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}