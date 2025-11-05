import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (date: Date, frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom') => void;
  defaultDate?: Date;
}

export function AddReminderDialog({
  open,
  onOpenChange,
  onAdd,
  defaultDate = new Date(),
}: AddReminderDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [hours, setHours] = useState(9);
  const [minutes, setMinutes] = useState(0);
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly' | 'custom'>('once');

  const handleAdd = () => {
    const reminderTime = new Date(selectedDate);
    reminderTime.setHours(hours);
    reminderTime.setMinutes(minutes);
    onAdd(reminderTime, frequency);
    onOpenChange(false);
    // Reset form
    setSelectedDate(defaultDate);
    setHours(9);
    setMinutes(0);
    setFrequency('once');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#312E81]">Add Reminder</DialogTitle>
          <DialogDescription>
            Set when you want to be reminded about this task
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Calendar */}
          <div className="space-y-2">
            <Label className="text-sm text-[#312E81]">Date</Label>
            <div className="border rounded-lg p-3 bg-gray-50">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md"
              />
            </div>
          </div>

          {/* Time */}
          <div className="space-y-2">
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
                  className="h-12 text-center"
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
                  className="h-12 text-center"
                  placeholder="MM"
                />
              </div>
            </div>
            <p className="text-xs text-[#4C4799] text-center">24-hour format</p>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label className="text-sm text-[#312E81]">Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(value: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom') => 
                setFrequency(value)
              }
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Once</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom (Multiple per day)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-[#2C7A7B] text-white hover:bg-[#236767]"
          >
            Add Reminder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
