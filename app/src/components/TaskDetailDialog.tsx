import { useState } from 'react';
import { Task, Category, Reminder } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Bell, Plus, Edit2, Check, History } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { AddReminderDialog } from './AddReminderDialog';

interface TaskDetailDialogProps {
  task: Task | null;
  category: Category | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskDetailDialog({
  task,
  category,
  open,
  onOpenChange,
  onUpdateTask,
}: TaskDetailDialogProps) {
  const [reminders, setReminders] = useState<Reminder[]>(task?.reminders || []);
  const [notes, setNotes] = useState(task?.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [showAddReminderDialog, setShowAddReminderDialog] = useState(false);

  // Update local state when task changes
  if (task && (reminders !== task.reminders || notes !== task.notes)) {
    setReminders(task.reminders || []);
    setNotes(task.notes || '');
    setIsEditingNotes(false);
  }

  const handleSaveNotes = () => {
    if (task) {
      onUpdateTask(task.id, { notes });
      setIsEditingNotes(false);
    }
  };

  const handleUpdateReminders = (newReminders: Reminder[]) => {
    setReminders(newReminders);
    if (task) {
      onUpdateTask(task.id, { reminders: newReminders });
    }
  };

  const addReminder = (time: Date, frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom') => {
    if (!task) return;
    const newReminder: Reminder = {
      id: `reminder-${Date.now()}`,
      time,
      frequency,
      enabled: true,
    };
    handleUpdateReminders([...reminders, newReminder]);
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'once':
        return 'Once';
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'custom':
        return 'Custom';
      default:
        return 'Once';
    }
  };

  if (!task) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#312E81] flex items-center gap-2">
              {category && (
                <CategoryIcon iconName={category.icon} size={20} color={category.color} />
              )}
              {task.title}
            </DialogTitle>
            <DialogDescription>
              View and edit task details, notes, and reminders
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Category and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-[#4C4799]">Category</Label>
                <p className="text-sm text-[#312E81] mt-1">{category?.name}</p>
              </div>
              <div>
                <Label className="text-xs text-[#4C4799]">Due Date</Label>
                <p className="text-sm text-[#312E81] mt-1">{format(task.date, 'PPP')}</p>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <div>
                <Label className="text-xs text-[#4C4799]">Description</Label>
                <p className="text-sm text-[#312E81] mt-1">{task.description}</p>
              </div>
            )}

            {/* Notes Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-[#4C4799]">Notes</Label>
                {!isEditingNotes ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingNotes(true)}
                    className="h-7"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveNotes}
                    className="h-7 bg-[#2C7A7B] text-white hover:bg-[#236767]"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                )}
              </div>
              {isEditingNotes ? (
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  rows={3}
                  className="text-sm"
                />
              ) : (
                <p className="text-sm text-[#312E81] bg-gray-50 rounded-lg p-3 min-h-[60px]">
                  {notes || 'No notes added'}
                </p>
              )}
            </div>

            {/* Task History - Show if there are previous completions */}
            {task.previousCompletions && task.previousCompletions.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-[#2C7A7B]" />
                  <Label className="text-xs text-[#2C7A7B]">Previous Completions</Label>
                </div>
                <div className="space-y-1.5">
                  {task.previousCompletions.slice(-3).reverse().map((completion, index) => (
                    <div
                      key={completion.id + index}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-[#312E81]">{format(completion.date, 'MMM d, yyyy')}</span>
                      <span className="text-[#4C4799]">{formatDistanceToNow(completion.completedAt, { addSuffix: true })}</span>
                    </div>
                  ))}
                </div>
                {task.previousCompletions.length > 3 && (
                  <p className="text-xs text-[#4C4799] text-center pt-1">
                    +{task.previousCompletions.length - 3} more
                  </p>
                )}
              </div>
            )}

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

              {reminders.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-[#4C4799] py-2">
                  <Bell className="h-4 w-4" />
                  <span>No Reminder Set</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-start gap-2 text-sm text-[#312E81]"
                    >
                      <Bell className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="block">
                          Reminder: {format(reminder.time, 'PPP')} at {format(reminder.time, 'p')}
                          <span className="text-[#4C4799] ml-2">- {getFrequencyLabel(reminder.frequency)}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div>
                <Label className="text-xs text-[#4C4799]">Attachments</Label>
                <div className="mt-2 space-y-2">
                  {task.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm flex-1 truncate text-[#312E81]">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddReminderDialog
        open={showAddReminderDialog}
        onOpenChange={setShowAddReminderDialog}
        onAdd={addReminder}
        defaultDate={task?.date || new Date()}
      />
    </>
  );
}
