import { useState, useEffect, useRef, SetStateAction } from "react";
import { Task, Category, Reminder, Template } from "../types";
import { CategoryIcon } from "./CategoryIcon";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ArrowLeft, Bell, Plus } from "lucide-react";
import { format } from "date-fns";
import { AddReminderDialog } from "./AddReminderDialog";
import { FilePreview } from "./FilePreview";
import * as chrono from "chrono-node";

interface UploadDocumentProps {
  tasks: Task[];
  onCreateTask: (task: Omit<Task, "id" | "createdAt">) => void;
  onAttachToTask: (taskId: string, attachment: string) => void;
  onCancel: () => void;
  onChangeToCamera: (mode: "document-camera") => void;
  defaultCategoryId?: string;
}

export function UploadDocumentForm({
  onCreateTask,
  onAttachToTask,
  onCancel,
  onChangeToCamera,
  defaultCategoryId,
}: UploadDocumentProps) {

  const [mode, setMode] = useState<"upload" | "camera">("upload"); // NEW
  const [capturing, setCapturing] = useState(false); // NEW (camera active)
  const videoRef = useRef<HTMLVideoElement | null>(null); // NEW
  const streamRef = useRef<MediaStream | null>(null); // NEW
  const [name, setName] = useState("");
  const [rawText, setRawText] = useState("");
  const [loadingParse, setLoadingParse] = useState(false);
  // XXX change document handler here
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [showAddReminderDialog, setShowAddReminderDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [attachMode, setAttachMode] = useState<boolean>(false);
  const [docToTask, setDocToTask] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDataUrl, setUploadDataUrl] = useState<string | null>(null);
  const [cameraDataUrl, setCameraDataUrl] = useState<string | null>(null);
  const activeDataUrl = mode === "upload" ? uploadDataUrl : cameraDataUrl;

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
        // @ts-expect-error: srcObject not in lib dom older types
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
    setName(`Photo ${new Date().toLocaleString()}`);
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
    setName(f.name.replace(/\.[a-z0-9]+$/i, ""));
    e.currentTarget.value = ""; // allow re-selecting same file later
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDataUrl) return;

    if (docToTask) {
      if (!title.trim()) return;
      onCreateTask({
        title: title.trim(),
        description: description.trim(),
        date: new Date(),
        categoryId: "",
        notes: notes.trim(),
        attachments: [activeDataUrl],
        reminders: [],
        completed: false,
      });
      onCancel();
      return;
    }

    if (attachMode) {
      if (!selectedTaskId) return;
      onAttachToTask(selectedTaskId, activeDataUrl);
      onCancel();
      return;
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
                filename={(mode === "upload" ? uploadFile?.name : undefined) || name}
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
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
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

            {/* Submit */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={!name.trim() || !activeDataUrl}
                className="h-12 bg-[#312E81] text-white hover:bg-[#4338CA]"
              >
                {attachMode ? "Attach to Task" : mode === "camera" ? "Save Photo" : "Save Document"}
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
          </form>
        )}
      </Card>
    </div>
  );
}
