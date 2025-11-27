import { useState, useEffect, useRef } from "react";
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

  const [file, setFile] = useState<File | null>(null);
  const [attachmentDataUrl, setAttachmentDataUrl] = useState<string | null>(null);
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

  const inferCategory = (text: string, cats: Category[], fallback?: string) => {
    const kw: Record<string, string[]> = {
      /*These are only the default categories, thoughts on extending them in the future or using an llm?*/
      'Home Maintenance': [],
      'Health': [],
      'Taxes & Finance': [],
      'Subscriptions': [],
      'Warranties': [],
      'Travel': [],
      'Vehicle': [],
      'Insurance': [],
      'Personal': [] // This is the default!
    }
    const lower = text.toLowerCase();
    let best: { id: string; score: number } | null = null;
    for (const c of cats) {
      const name = c.name || ''
      const list = [...(kw[name] || []), name.toLowerCase()];
      const score = list.reduce((s, k) => (lower.includes(k) ? s + 1 : s), 0);
      if (!best || score > best.score) best = {id: c.id, score}
    }

    return best && best.score > 0 ? best.id : (fallback || "");
  };

  const readAsDataURL = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(r.error);
      r.readAsDataURL(f);
    })

  const replaceFile = () => inputRef.current?.click();

  const onReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void handleFile(f); // your existing loader -> sets preview/name
    e.currentTarget.value = ""; // allow re-selecting same file later
  };


  const handleFile = async (f: File) => {
    setFile(f);
    const base = f.name.replace(/\.[a-z0-9]+$/i, "");
    if (!name.trim()) setName(f.name.replace(/\.[a-z0-9]+$/i, ""));
    else setName(f.name.replace(/\.[a-z0-9]+$/i, ""));
    const dataUrl = await readAsDataURL(f);
    setAttachmentDataUrl(dataUrl)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!attachmentDataUrl) return;

    /*Create a new task from the document*/
    if (docToTask) {
      return;
    }
    /*Attach to existing tasks*/
    if (attachMode) {
      if (!selectedTaskId) return;
      onAttachToTask(selectedTaskId, attachmentDataUrl);
      onCancel();
      return;
    }
    /*Create a new task*/
    //XXX please fix to read the file
    if (!title.trim()) return;
    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      date: new Date(),
      categoryId: "",
      notes: notes.trim(),
      attachments: [attachmentDataUrl],
      reminders: [],
      completed: false,
    })
    onCancel();
    // onSave({
    //   name: name.trim(),
    //   title: title.trim(),
    //   description: description.trim(),
    //   categoryId,
    //   notes: notes.trim(),
    //   reminders,
    //   isPreset: false,
    // });
  };


  return (
    <div className="space-y-5 relative">
      {/* Header */}
      <Button
        onClick={onCancel}
        variant="outline"
        size="icon"
        className="absolute top-0 left-0"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      {/*<div className="flex justify-center">
        <h2 className="text-[#312E81] text-xl font-semibold">
          {template ? "Edit Template" : "Upload Document"}
        </h2>
      </div>*/}

      {/* Form if a file has not been uploaded XXX make better and allow camera*/}
      { !file && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 border-purple-200">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="file" className="text-[#312E81]">
                  Upload File
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept=".txt,.md,.pdf,.doc,.docx,.png,.jpeg"
                  onChange={onReplace}
                  className="h-60 border-dashed border-2 border-[#312E81] rounded-lg text-sm py-14 px-6 cursor-pointer"
                />
                <p className="text-sm text-[#4C4799] text-center">
                  Tap to select a document
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  className="h-12"
                  onClick={() => {
                    onChangeToCamera("document-camera");
                  }}
                >
                  Take a Photo
                </Button>
                <Button
                  type="submit"
                  disabled={!name.trim() || !title.trim()}
                  className="h-12 bg-[#312E81] text-white hover:bg-[#4338CA]"
                >
                  Upload Document
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="h-12"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
      )}
      { file && (
        <>
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-purple-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file" className="text-[#312E81]">
                  Replace File
                </Label>
                <Input
                  ref={inputRef}
                  id="file"
                  type="file"
                  accept=".txt,.md,.pdf,.doc,.docx,.png,.jpeg"
                  onChange={onReplace}
                />
                <p className="text-xs text-[#4C4799]">
                  Current: {file.name} {loadingParse && "(parsing...)"}
                </p>
              </div>
              { attachmentDataUrl && (
                <div>
                <Label className="text-[#312E81]">Document Preview</Label>
                  <FilePreview
                    file={file || undefined}
                    dataUrl={attachmentDataUrl || undefined}
                    filename={file?.name}
                    height={384}
                    className="bg-white/60 space-y-6"
                  />
                </div>
              )}

              {/* Mode toggle */}
              <div className="flex items-center justify-between py-2">
                <Label className="text-[#312E81]">Attach documents to existing tasks</Label>
                <Switch
                  checked={attachMode}
                  onCheckedChange={(val: boolean) => {
                    setAttachMode(val);
                    if (!val) setSelectedTaskId("");
                  }}
                  className="bg-gray-300 data-[state=checked]:bg-[#312E81] transition-colors duration-200"
                />
              </div>

              {/* Create task from document toggle */}
              <div className="flex items-center justify-between py-2">
                <Label className="text-[#312E81]">Convert Document to Task</Label>
                <Switch
                  checked={docToTask}
                  onCheckedChange={(val: boolean) => {
                    setDocToTask(val);
                    if (!val) setSelectedTaskId("");
                  }}
                  className="bg-gray-300 data-[state=checked]:bg-[#312E81] transition-colors duration-200"
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

              { attachMode && ( 
                <div>
                </div>
              )}
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

              {rawText && (
                <div className="space-y-1">
                  <Label className="text-[#312E81]">Extracted Preview</Label>
                  <Textarea
                    value={rawText}
                    readOnly
                    rows={4}
                    className="opacity-80"
                  />
                </div>
              )}

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
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={
                    !name.trim() || !attachmentDataUrl
                  }
                  className="h-12 bg-[#312E81] text-white hover:bg-[#4338CA]"
                >
                  {attachmentDataUrl ? "Save Changes" : "Save Document"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="h-12"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
