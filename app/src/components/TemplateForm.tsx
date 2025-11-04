import { useState, useEffect } from 'react';
import { Category, Reminder, Template } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Bell, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { AddReminderDialog } from './AddReminderDialog';

interface TemplateFormProps {
  template?: Template;
  categories: Category[];
  onSave: (template: Omit<Template, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  onDelete?: (templateId: string) => void;
  defaultCategoryId?: string;
}

export function TemplateForm({
  template,
  categories,
  onSave,
  onCancel,
  onDelete,
  defaultCategoryId,
}: TemplateFormProps) {
  const [name, setName] = useState(template?.name || '');
  const [title, setTitle] = useState(template?.title || '');
  const [description, setDescription] = useState(template?.description || '');
  const [categoryId, setCategoryId] = useState(template?.categoryId || defaultCategoryId || '');
  const [notes, setNotes] = useState(template?.notes || '');
  const [reminders, setReminders] = useState<Reminder[]>(template?.reminders || []);
  const [showAddReminderDialog, setShowAddReminderDialog] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setTitle(template.title);
      setDescription(template.description);
      setCategoryId(template.categoryId);
      setNotes(template.notes);
      setReminders(template.reminders || []);
    }
  }, [template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !title.trim() || !categoryId) {
      return;
    }

    onSave({
      name: name.trim(),
      title: title.trim(),
      description: description.trim(),
      categoryId,
      notes: notes.trim(),
      reminders,
      isPreset: false,
    });
  };

  const addReminder = (time: Date, frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom') => {
    const newReminder: Reminder = {
      id: `reminder-${Date.now()}`,
      time,
      frequency,
      enabled: true,
    };
    setReminders([...reminders, newReminder]);
  };

  const removeReminder = (reminderId: string) => {
    setReminders(reminders.filter(r => r.id !== reminderId));
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button onClick={onCancel} variant="outline" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-[#312E81]">{template ? 'Edit Template' : 'Create Template'}</h2>
      </div>

      {/* Form */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 border-purple-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#312E81]">Template Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Quarterly Tax Payment"
              required
              className="h-12"
            />
            <p className="text-xs text-[#4C4799]">
              This name will help you find the template later
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#312E81]">Task Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Pay quarterly taxes"
              required
              className="h-12"
            />
            <p className="text-xs text-[#4C4799]">
              The default title when creating a task from this template
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#312E81]">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-[#312E81]">Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger id="category" className="h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <CategoryIcon iconName={category.icon} size={16} color={category.color} />
                      <span>{category.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reminders Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-[#312E81]">Default Reminders</Label>
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
                <span>No default reminders</span>
              </div>
            ) : (
              <div className="space-y-2">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-start gap-2 text-sm text-[#312E81] bg-white p-3 rounded-lg"
                  >
                    <Bell className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="block">
                        {format(reminder.time, 'p')}
                        <span className="text-[#4C4799] ml-2">- {getFrequencyLabel(reminder.frequency)}</span>
                      </span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2"
                      onClick={() => removeReminder(reminder.id)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-[#4C4799]">
              These reminders will be applied to tasks created from this template
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#312E81]">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or instructions..."
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!name.trim() || !title.trim() || !categoryId}
              className="h-12 bg-[#312E81] text-white hover:bg-[#4338CA]"
            >
              {template ? 'Save Changes' : 'Create Template'}
            </Button>
            
            {template && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this template?')) {
                    onDelete(template.id);
                  }
                }}
                className="h-12"
              >
                Delete Template
              </Button>
            )}
            
            <Button type="button" variant="outline" onClick={onCancel} className="h-12">
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
    </div>
  );
}
