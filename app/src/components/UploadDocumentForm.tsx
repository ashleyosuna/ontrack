import { useState, useEffect } from "react";
import { Task, Category, Reminder, Template } from "../types";
import { CategoryIcon } from "./CategoryIcon";
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
import { format } from "date-fns";
import { AddReminderDialog } from "./AddReminderDialog";

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

  const readAsDataURL = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(r.error);
      r.readAsDataURL(f);
    })

  const handleFile = async (f: File) => {
    setFile(f);
    const base = f.name.replace(/\.[a-z0-9]+$/i, "");
    if (!name.trim()) setName(f.name.replace(/\.[a-z0-9]+$/i, ""));
    else setName(f.name.replace(/\.[a-z0-9]+$/i, ""));
    const dataUrl = await readAsDataURL(f);
    setAttachmentDataUrl(dataUrl)
    /*
    setLoadingParse(true);
    // handle things
    setLoadingParse(false);
     */
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!attachmentDataUrl) return;
    /*Attach to existing tasks*/
    if (selectedTaskId) {
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
      categoryId,
      notes: notes.trim(),
      attachments: [attachmentDataUrl],
      reminders,
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

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "once":
        return "Once";
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "custom":
        return "Custom";
      default:
        return "Once";
    }
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
      <div className="flex justify-center">
        <h2 className="text-[#312E81] text-xl font-semibold">
          {template ? "Edit Template" : "Upload Document"}
        </h2>
      </div>

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
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) void handleFile(f);
                  }}
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
                  disabled={!name.trim() || !title.trim() || !categoryId}
                  className="h-12 bg-[#312E81] text-white hover:bg-[#4338CA]"
                >
                  Upload Document
                </Button>

                {template && onDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this template?")
                      ) {
                        onDelete(template.id);
                      }
                    }}
                    className="h-12"
                  >
                    Delete Template
                  </Button>
                )}

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
                  id="file"
                  type="file"
                  accept=".txt,.md,.pdf,.doc,.docx,.png,.jpeg"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                  }}
                />
                <p className="text-xs text-[#4C4799]">
                  Current: {file.name} {loadingParse && "(parsing...)"}
                </p>
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
                <Label htmlFor="title" className="text-[#312E81]">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Title for task/template"
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

              {/* Category selection (required since you validate categoryId) */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-[#312E81]">
                  Category *
                </Label>
                <Select
                  value={categoryId}
                  onValueChange={(val: string) => setCategoryId(val)}
                  required
                >
                  <SelectTrigger id="category" className="h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <span className="flex items-center gap-2">
                          <CategoryIcon
                            iconName={c.icon}
                            size={16}
                            color={c.color}
                          />
                          {c.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reminders list */}
              {reminders.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-[#312E81]">Reminders</Label>
                  <div className="space-y-2">
                    {reminders.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between text-sm bg-white/70 px-3 py-2 rounded border"
                      >
                        <span>
                          {format(r.time, "PPp")} · {getFrequencyLabel(r.frequency)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => removeReminder(r.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddReminderDialog(true)}
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Add Reminder
              </Button>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={
                    !name.trim() || !attachmentDataUrl
                  }
                  className="h-12 bg-[#312E81] text-white hover:bg-[#4338CA]"
                >
                  {template ? "Save Changes" : "Save Document"}
                </Button>

                {template && onDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Delete this template?")) {
                        onDelete(template.id);
                      }
                    }}
                    className="h-12"
                  >
                    Delete Template
                  </Button>
                )}

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

          <AddReminderDialog
            open={showAddReminderDialog}
            onOpenChange={setShowAddReminderDialog}
            onAdd={addReminder}
          />
        </>
      )}
    </div>
  );
}
