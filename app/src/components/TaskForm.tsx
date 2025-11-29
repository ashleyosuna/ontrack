import { useState, useEffect, useRef } from "react";
import { Task, Category, Reminder, DocumentAttachment } from "../types";
import { CategoryIcon } from "./CategoryIcon";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {createGoogleEvent} from "../utils/CreateGoogleEvent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Upload,
  X,
  Bell,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { storage } from "../utils/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { MiniUploadCard } from "./UploadDocumentForm";

interface TaskFormProps {
  task?: Task;
  categories: Category[];
  onSave: (
    task: Omit<Task, "id" | "createdAt">,
    saveAsTemplate?: boolean,
    templateName?: string
  ) => void;
  onCancel: () => void;
  onDelete?: (taskId: string) => void;
  defaultCategoryId?: string;
  templateData?: {
    title: string;
    description: string;
    notes: string;
    reminders: Reminder[];
  };
}

export function TaskForm({
  task,
  categories,
  onSave,
  onCancel,
  onDelete,
  defaultCategoryId,
  templateData,
}: TaskFormProps) {
  const [formTask, setFormTask] = useState<Task>({
    id: task?.id || "",
    title: task?.title || templateData?.title || "",
    description: task?.description || templateData?.description || "",
    date: task?.date || new Date(),
    categoryId: task?.categoryId || defaultCategoryId || "",
    notes: task?.notes || templateData?.notes || "",
    attachments: task?.attachments || [],
    reminders: task?.reminders || templateData?.reminders || [],
    completed: task?.completed || false,
    createdAt: task?.createdAt || new Date(),
  });

  const [title, setTitle] = useState(task?.title || templateData?.title || "");
  const [description, setDescription] = useState(
    task?.description || templateData?.description || ""
  );
  const [date, setDate] = useState<Date>(task?.date || new Date());
  const [categoryId, setCategoryId] = useState(
    task?.categoryId || defaultCategoryId || ""
  );
  const [notes, setNotes] = useState(task?.notes || templateData?.notes || "");
  const [attachments, setAttachments] = useState<DocumentAttachment[]>(
    task?.attachments || []
  );
  const [reminders, setReminders] = useState<Reminder[]>(
    task?.reminders || templateData?.reminders || []
  );
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(date);
  const [hours, setHours] = useState(9);
  const [minutes, setMinutes] = useState(0);
  const [frequency, setFrequency] = useState<
    "once" | "daily" | "weekly" | "monthly" | "custom"
  >("once");
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>("");

  const openPreview = async (att: DocumentAttachment) => {
    console.log("Test");
    try {
      const src = att.previewUri
        ? att.previewUri
        : att.uri?.startsWith("data:")
        ? att.uri
        : await storage.readAttachment(att.uri);
      setPreviewSrc(src || "");
      setPreviewName(att.fileName || att.uri);
      setPreviewOpen(true);
    } catch {
      setPreviewSrc("");
      setPreviewName(att.fileName || att.uri);
      setPreviewOpen(true);
    }
  };

  const readAsDataUrl = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(r.error);
      r.readAsDataURL(f);
    });

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget; // capture before await
    const f = inputEl.files?.[0];
    if (!f) return;
    try {
      const dataUrl = await readAsDataUrl(f);
      const savedPath = await storage.persistAttachment(dataUrl);
      const att: DocumentAttachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        uri: savedPath,
        mimeType: f.type || undefined,
        fileName: f.name,
        sizeBytes: f.size,
        previewUri: f.type?.startsWith("image/") ? dataUrl : undefined,
        addedAt: new Date(),
      };
      setFormTask(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), att],
      }));
    } finally {
      inputEl.value = ""; // safe reset
    }
  };

  /*XXX Add a thing that adds Documents on save*/

  const [addToGoogle, setAddToGoogle] = useState<boolean>(() => !!localStorage.getItem("google_access_token"));
  useEffect(()=> {
    const onStorage = (storeEvent: StorageEvent) =>{
      if(storeEvent.key === "google_access_token"){
        setAddToGoogle(!!storeEvent.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []); 
  useEffect(() => {
    if (task) {
      setFormTask(task);
    }
  }, [task]);

  useEffect(() => {
    // go into edit mode if user has made changes to the task
    function equal() {
      if (!task) return true;
      for (const key of Object.keys(formTask)) {
        if (
          (typeof task[key] == "string" &&
            task[key].trim() != formTask[key].trim()) ||
          (typeof task[key] != "string" && task[key] != formTask[key])
        )
          return false;
      }
      const a = (task.attachments || []) as DocumentAttachment[];
      const b = (formTask.attachments || []) as DocumentAttachment[];
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        const ai = a[i], bi = b[i];
        if ((ai.id || ai.uri) !== (bi.id || bi.uri)) return false;
      }
      return true;
    }
    if (!equal()) setEditMode(true);
    else setEditMode(false);
  }, [formTask]);

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTask.title.trim() || !formTask.categoryId) {
      return;
    }

    if (saveAsTemplate && !templateName.trim()) {
      alert("Please enter a template name");
      return;
    }

    onSave(
      {
        title: formTask.title.trim(),
        description: formTask.description.trim(),
        date: formTask.date,
        categoryId: formTask.categoryId,
        notes: formTask.notes.trim(),
        attachments: formTask.attachments,
        reminders: formTask.reminders,
        completed: task?.completed || false,
      },
      saveAsTemplate,
      templateName.trim()
    );

    // If the user already has google calendar access and has token enabled for this task
    (async () => {
      try{
        const token = localStorage.getItem("google_access_token");
        if(!token || !addToGoogle) return;

        await createGoogleEvent({
          title: formTask.title.trim(),
          description: formTask.description.trim(),
          date: formTask.date,
        // categoryId: formTask.categoryId,
          //notes: formTask.notes.trim(),
          //attachments: formTask.attachments,
          //reminders: formTask.reminders,
          endDate: (formTask as any).endDate ?? undefined, 
          allDay: Boolean((formTask as any).allDay),
          location: (formTask as any).location ?? "",
        });
      }catch (err){
        console.error("Failed to create Google Calendar event:", err);
      }
    })();
  };

  const removeAttachment = (index: number) => {
    const filteredAttachments = formTask.attachments.filter(
      (_, i) => i !== index
    );
    setFormTask({ ...formTask, attachments: filteredAttachments });
  };

  const addReminder = (
    time: Date,
    frequency: "once" | "daily" | "weekly" | "monthly" | "custom"
  ) => {
    const newReminder: Reminder = {
      id: `reminder-${Date.now()}`,
      time,
      frequency,
      enabled: true,
    };
    setFormTask({ ...formTask, reminders: [...reminders, newReminder] });
  };

  const handleAddReminder = () => {
    const reminderTime = new Date(selectedDate);
    reminderTime.setHours(hours);
    reminderTime.setMinutes(minutes);
    addReminder(reminderTime, frequency);
    setShowAddReminder(false);
    // Reset form
    setSelectedDate(date);
    setHours(9);
    setMinutes(0);
    setFrequency("once");
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
        className="absolute left-0 top-0"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex justify-center">
        <h2 className="text-xl font-semibold text-secondary">
          {task ? "Task Details" : "New Task"}
        </h2>
      </div>

      {/* Form */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 p-5 border-blue-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#312E81]">
              Task Title *
            </Label>
            <Input
              id="title"
              value={formTask?.title}
              onChange={(e) =>
                setFormTask({ ...formTask, title: e.target.value })
              }
              placeholder="e.g., Renew passport"
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#312E81]">
              Description
            </Label>
            <Textarea
              id="description"
              value={formTask?.description}
              onChange={(e) =>
                setFormTask({ ...formTask, description: e.target.value })
              }
              placeholder="Add details..."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[#312E81]">
                Category *
              </Label>
              <Select
                value={formTask?.categoryId}
                onValueChange={(e) => {
                  setFormTask({ ...formTask, categoryId: e });
                }}
                required
              >
                <SelectTrigger id="category" className="h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center gap-2">
                        <CategoryIcon
                          iconName={category.icon}
                          size={16}
                          color={category.color}
                        />
                        <span>{category.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#312E81]">Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formTask?.date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formTask?.date}
                    onSelect={(newDate:any) =>
                      newDate && setFormTask({ ...formTask, date: newDate })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Reminders Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-[#312E81]">Reminders</Label>
            </div>

            {formTask?.reminders.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-[#4C4799] py-2">
                <Bell className="h-4 w-4" />
                <span>No Reminder Set</span>
              </div>
            ) : (
              <div className="space-y-2">
                {formTask?.reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-start gap-2 text-sm text-[#312E81]"
                  >
                    <Bell className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="block">
                        Reminder: {format(reminder.time, "PPP")} at{" "}
                        {format(reminder.time, "p")}
                        <span className="text-[#4C4799] ml-2">
                          - {getFrequencyLabel(reminder.frequency)}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Add Reminder Section - Inline Collapsible */}
            <div className="border-t border-gray-200 pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-between text-[#2C7A7B] hover:text-[#236767] hover:bg-[#2C7A7B]/5 px-3 py-2"
                onClick={() => setShowAddReminder(!showAddReminder)}
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Reminder
                </span>
                {showAddReminder ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              <AnimatePresence>
                {showAddReminder && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-4 bg-white/50 rounded-lg border border-gray-200 space-y-4">
                      {/* Date Selection */}
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                        className="space-y-2"
                      >
                        <Label className="text-sm text-[#312E81]">
                          Reminder Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start h-10 text-sm"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(selectedDate, "PPP")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(newDate:any) =>
                                newDate && setSelectedDate(newDate)
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </motion.div>

                      {/* Time Selection */}
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.2 }}
                        className="space-y-2"
                      >
                        <Label className="text-sm text-[#312E81]">Time</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Input
                              type="number"
                              min="0"
                              max="23"
                              value={hours}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val) && val >= 0 && val <= 23) {
                                  setHours(val);
                                }
                              }}
                              className="h-10 text-center"
                              placeholder="HH"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="0"
                              max="59"
                              value={minutes}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val) && val >= 0 && val <= 59) {
                                  setMinutes(val);
                                }
                              }}
                              className="h-10 text-center"
                              placeholder="MM"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-[#4C4799] text-center">
                          24-hour format
                        </p>
                      </motion.div>

                      {/* Frequency Selection */}
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.2 }}
                        className="space-y-2"
                      >
                        <Label className="text-sm text-[#312E81]">
                          Frequency
                        </Label>
                        <Select
                          value={frequency}
                          onValueChange={(
                            value:
                              | "once"
                              | "daily"
                              | "weekly"
                              | "monthly"
                              | "custom"
                          ) => setFrequency(value)}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once">Once</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="custom">
                              Custom (Multiple per day)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      {/* Add Button */}
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.2 }}
                        className="flex justify-end gap-2 pt-2"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddReminder(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="bg-[#2C7A7B] text-white hover:bg-[#236767]"
                          onClick={handleAddReminder}
                        >
                          Add Reminder
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#312E81]">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formTask?.notes}
              onChange={(e) =>
                setFormTask({ ...formTask, notes: e.target.value })
              }
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#312E81]">Attachments</Label>
            <div className="space-y-2">
              {formTask?.attachments.map((attachment, index) => (
                <div
                  key={attachment.id ?? index}
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                >
                  {/* Optional thumbnail */}
                  {attachment.previewUri?.startsWith("data:image/") && (
                    <button
                      type="button"
                      onClick={() => openPreview(attachment)}
                      className="h-10 w-10 rounded border overflow-hidden flex-shrink-0"
                      title="Click to preview"
                    >
                      <img
                        src={attachment.previewUri}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => openPreview(attachment)}
                    className="text-sm flex-1 truncate text-left hover:underline"
                    title={attachment.fileName || attachment.uri}
                  >
                    {attachment.fileName || attachment.uri}
                  </button>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.pdf,.doc,.docx,.png,.jpeg,image/*"
                className="hidden"
                onChange={onFileChange}
              />
              <MiniUploadCard
                title="Add document or photo"
                onAdd={(att) =>
                  setFormTask((prev) => ({
                    ...prev,
                    attachments: [...(prev.attachments || []), att],
                  }))
                }
              />
              <p className="text-xs text-muted-foreground text-center">
                Tap a file name to preview
              </p>
            </div>
          </div>

          {/* Save as Template Option - Only show when creating new task */}
          {!task && (
            <div className="space-y-3 pt-2 pb-2 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveAsTemplate"
                  checked={saveAsTemplate}
                  onCheckedChange={(checked:any) =>
                    setSaveAsTemplate(checked as boolean)
                  }
                />
                <Label
                  htmlFor="saveAsTemplate"
                  className="text-sm text-[#312E81] cursor-pointer"
                >
                  Save as template for future use
                </Label>
              </div>

              {saveAsTemplate && (
                <div className="space-y-2 pl-6">
                  <Label
                    htmlFor="templateName"
                    className="text-sm text-[#312E81]"
                  >
                    Template Name *
                  </Label>
                  <Input
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., Quarterly Tax Payment"
                    className="h-10"
                  />
                </div>
              )}
            </div>
          )}
          {/* Google calendar add toggle */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                id="addToGoogle"
                checked={addToGoogle}
                onCheckedChange={(checked: any) => setAddToGoogle(checked as boolean)}
                />
                <Label htmlFor="addToGoogle" className="text-sm text-[#312e81] cursor-pointer">
                  Add to Google Calendar
                </Label>
              </div>
              {!localStorage.getItem("google_access_token") && (
                <span className="text-xs text-[#4c4799]">Connect in Settings to enable</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              disabled={
                !formTask?.title.trim() ||
                !formTask?.categoryId ||
                (task && !editMode)
              }
              className="h-12 bg-[#2C7A7B] text-white hover:bg-[#236767]"
            >
              {task ? "Save Changes" : "Create Task"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (editMode) setFormTask(task);
                else onCancel();
              }}
              disabled={task && !editMode}
              className="h-12"
            >
              Cancel
            </Button>

            {task && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this task?")) {
                    onDelete(task.id);
                  }
                }}
                className="h-12"
              >
                Delete Task
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* <AddReminderDialog
        open={showAddReminderDialog}
        onOpenChange={setShowAddReminderDialog}
        onAdd={addReminder}
        defaultDate={date}
      /> */}

      {/* Preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate">{previewName || "Preview"}</DialogTitle>
          </DialogHeader>

          {previewSrc ? (
            previewSrc.startsWith("data:image/") ? (
              <img
                src={previewSrc}
                alt="Attachment preview"
                className="w-full max-h-[70vh] object-contain rounded border"
              />
            ) : previewSrc.startsWith("data:application/pdf") ? (
              <object
                data={previewSrc}
                type="application/pdf"
                className="w-full h-[70vh] rounded border"
              >
                <div className="text-sm text-[#4C4799] p-3">
                  PDF preview not supported. 
                  <a href={previewSrc} target="_blank" rel="noreferrer" className="underline">
                    Open in new tab
                  </a>
                </div>
              </object>
            ) : previewSrc.startsWith("data:text/") ? (
              <iframe
                src={previewSrc}
                className="w-full h-[70vh] rounded border bg-white"
                title="Text preview"
              />
            ) : (
              <div className="text-sm text-[#4C4799]">
                No inline preview available.{" "}
                {previewSrc.startsWith("data:") && (
                  <a href={previewSrc} download className="underline">Download</a>
                )}
              </div>
            )
          ) : (
            <div className="text-sm text-[#4C4799]">Unable to load preview.</div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
