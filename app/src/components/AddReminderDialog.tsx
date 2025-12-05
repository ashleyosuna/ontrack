import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { scheduleNotification } from "../utils/notifications";

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (boolean) => void;
  // onAdd: (
  //   date: Date,
  //   frequency: "once" | "daily" | "weekly" | "monthly" | "custom"
  // ) => void;
  // onAdd: () => void;
  defaultHour: number;
  defaultMinute: number;
}

export function AddReminderDialog({
  open,
  onOpenChange,
  onAdd,
  // defaultDate = new Date(),
  defaultHour,
  defaultMinute,
}: AddReminderDialogProps) {
  // const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [hours, setHours] = useState<number | string>(defaultHour);
  const [minutes, setMinutes] = useState<number | string>(defaultMinute);
  const [frequency, setFrequency] = useState<
    "once" | "daily" | "weekly" | "monthly" | "custom"
  >("once");

  const handleAdd = async () => {
    if (typeof hours == "string" || typeof minutes == "string") return;
    const reminderTime = new Date();
    reminderTime.setHours(hours);
    reminderTime.setMinutes(minutes);
    // onAdd(reminderTime, frequency);
    await scheduleNotification(
      "One small step today keeps you OnTrack. Take a quick look?",
      "",
      "daily",
      reminderTime
    );
    onAdd(true);
    onOpenChange(false);
    // Reset form
    // setSelectedDate(defaultDate);
    // setHours(defaultHour);
    // setMinutes(defaultMinute);
    setFrequency("once");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#312E81]">
            Add a Daily Reminder
          </DialogTitle>
          {/* <DialogDescription>
            Set when you want to be reminded about this task
          </DialogDescription> */}
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Calendar */}
          {/* <div className="space-y-2">
            <Label className="text-sm text-[#312E81]">Date</Label>
            <div className="border rounded-lg p-3 bg-gray-50">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md"
              />
            </div>
          </div> */}

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
                    const val = e.target.value;
                    if (
                      val === "" ||
                      (/^\d+$/.test(val) && Number(val) <= 59)
                    ) {
                      setHours(val === "" ? "" : Number(val));
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
                    const val = e.target.value;
                    if (
                      val === "" ||
                      (/^\d+$/.test(val) && Number(val) <= 59)
                    ) {
                      setMinutes(val === "" ? "" : Number(val));
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
          {/* <div className="space-y-2">
            <Label className="text-sm text-[#312E81]">Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(
                value: "once" | "daily" | "weekly" | "monthly" | "custom"
              ) => setFrequency(value)}
            >
              <SelectTrigger className="h-12">
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
          </div> */}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
