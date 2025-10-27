import { useState, useEffect } from 'react';
import { Task, Category, Reminder } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, Upload, X, Bell, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from './ui/switch';

interface TaskFormProps {
  task?: Task;
  categories: Category[];
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  onDelete?: (taskId: string) => void;
  defaultCategoryId?: string;
}

export function TaskForm({
  task,
  categories,
  onSave,
  onCancel,
  onDelete,
  defaultCategoryId,
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [date, setDate] = useState<Date>(task?.date || new Date());
  const [categoryId, setCategoryId] = useState(task?.categoryId || defaultCategoryId || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [attachments, setAttachments] = useState<string[]>(task?.attachments || []);
  const [reminders, setReminders] = useState<Reminder[]>(task?.reminders || []);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDate(task.date);
      setCategoryId(task.categoryId);
      setNotes(task.notes);
      setAttachments(task.attachments);
      setReminders(task.reminders || []);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !categoryId) {
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      date,
      categoryId,
      notes: notes.trim(),
      attachments,
      reminders,
      completed: task?.completed || false,
    });
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const mockFileName = `document_${Date.now()}.pdf`;
    setAttachments([...attachments, mockFileName]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const addReminder = () => {
    const newReminder: Reminder = {
      id: `reminder-${Date.now()}`,
      time: new Date(date.getTime() - 24 * 60 * 60 * 1000), // 1 day before by default
      frequency: 'once',
      enabled: true,
    };
    setReminders([...reminders, newReminder]);
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button onClick={onCancel} variant="outline" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2>{task ? 'Edit Task' : 'New Task'}</h2>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Renew passport"
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger id="category" className="h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Reminders Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Reminders
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addReminder}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {reminders.length > 0 && (
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="border rounded-xl p-3 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={reminder.enabled}
                          onCheckedChange={(enabled) =>
                            updateReminder(reminder.id, { enabled })
                          }
                        />
                        <span className="text-sm">Enabled</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeReminder(reminder.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Reminder Time</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start h-10 text-sm">
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            {format(reminder.time, 'PPP p')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={reminder.time}
                            onSelect={(newDate) =>
                              newDate && updateReminder(reminder.id, { time: newDate })
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Frequency</Label>
                      <Select
                        value={reminder.frequency}
                        onValueChange={(value: 'once' | 'daily' | 'weekly' | 'monthly') =>
                          updateReminder(reminder.id, { frequency: value })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once">Once</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="space-y-2">
              {attachments.map((attachment, index) => (
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
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!title.trim() || !categoryId}
              className="h-12"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
            
            {task && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => onDelete(task.id)}
                className="h-12"
              >
                Delete Task
              </Button>
            )}
            
            <Button type="button" variant="outline" onClick={onCancel} className="h-12">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
