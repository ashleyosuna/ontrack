import { useState, useEffect } from "react";
import { Task, Category, Reminder } from "../types";
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
  Edit2,
} from "lucide-react";
import { format } from "date-fns";
import { AddReminderDialog } from "./AddReminderDialog";

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
    title: task?.title || templateData?.title || "",
    description: task?.description || templateData?.description || "",
    date: task?.date || new Date(),
    categoryId: task?.categoryId || defaultCategoryId || "",
    notes: task?.notes || templateData?.notes || "",
    attachments: task?.attachments || [],
    reminders: task?.reminders || templateData?.reminders || [],
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
  const [attachments, setAttachments] = useState<string[]>(
    task?.attachments || []
  );
  const [reminders, setReminders] = useState<Reminder[]>(
    task?.reminders || templateData?.reminders || []
  );
  const [showAddReminderDialog, setShowAddReminderDialog] = useState(false);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (task) {
      // setTitle(task.title);
      // setDescription(task.description);
      // setDate(task.date);
      // setCategoryId(task.categoryId);
      // setNotes(task.notes);
      // setAttachments(task.attachments);
      // setReminders(task.reminders || []);
      setFormTask(task);
    }
  }, [task]);

  useEffect(() => {
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
      return true;
    }
    if (!equal()) setEditMode(true);
    else setEditMode(false);
  }, [formTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !categoryId) {
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
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const mockFileName = `document_${Date.now()}.pdf`;
    setFormTask({
      ...formTask,
      attachments: [...formTask.attachments, mockFileName],
    });
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
    setReminders([...reminders, newReminder]);
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button onClick={onCancel} variant="outline" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="grow text-lg font-semibold text-secondary">
          {task ? "Task Details" : "New Task"}
        </h2>
        {/* <Button
          className="justify-self-end"
          variant="outline"
          onClick={() => setEditMode((prev) => !prev)}
        >
          <Edit2 className="h-5 w-5" />
        </Button> */}
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formTask?.date}
                    onSelect={(newDate) =>
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
              <Button
                type="button"
                size="sm"
                className="bg-[#2C7A7B] text-white hover:bg-[#236767]"
                onClick={() => setShowAddReminderDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
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
                  key={index}
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                >
                  <span className="text-sm flex-1 truncate">{attachment}</span>
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
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFileUpload}
                  className="w-full h-12"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Scan or upload documents
                </p>
              </>
            </div>
          </div>

          {/* Save as Template Option - Only show when creating new task */}
          {!task && (
            <div className="space-y-3 pt-2 pb-2 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveAsTemplate"
                  checked={saveAsTemplate}
                  onCheckedChange={(checked) =>
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

          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              disabled={!title.trim() || !categoryId || (task && !editMode)}
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

      <AddReminderDialog
        open={showAddReminderDialog}
        onOpenChange={setShowAddReminderDialog}
        onAdd={addReminder}
        defaultDate={date}
      />
    </div>
  );
}
