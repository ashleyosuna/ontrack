import { useState } from 'react';
import { Task, Category } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday } from 'date-fns';
import { CategoryIcon } from './CategoryIcon';

interface CalendarViewProps {
  tasks: Task[];
  categories: Category[];
  onToggleTask: (taskId: string) => void;
}

export function CalendarView({ tasks, categories, onToggleTask }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.date, date));
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDayClick = (date: Date, taskCount: number) => {
    if (taskCount > 0) {
      setSelectedDate(date);
    }
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <h3 className="text-lg text-[#312E81]">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-[#4C4799] py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          
          {/* Days of the month */}
          {daysInMonth.map(date => {
            const dayTasks = getTasksForDate(date);
            const taskCount = dayTasks.length;
            const isCurrentDay = isToday(date);
            
            return (
              <div
                key={date.toISOString()}
                className={`aspect-square flex items-center justify-center relative ${
                  taskCount > 0 ? 'cursor-pointer' : ''
                }`}
                onClick={() => handleDayClick(date, taskCount)}
              >
                <div className="relative flex items-center justify-center w-full h-full">
                  {taskCount > 0 ? (
                    <div className="bg-[#2C7A7B] rounded-full w-9 h-9 flex items-center justify-center active:scale-95 transition-transform">
                      <span className="text-[#F8FAFC] text-sm">{taskCount}</span>
                    </div>
                  ) : (
                    <span className={`text-sm ${
                      isCurrentDay 
                        ? 'text-[#312E81] font-bold' 
                        : 'text-[#4C4799]'
                    }`}>
                      {format(date, 'd')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Tasks Dialog */}
      <Dialog open={selectedDate !== null} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#312E81]">
              {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
            </DialogTitle>
            <DialogDescription>
              Tasks scheduled for this day
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {selectedDateTasks.length === 0 ? (
              <p className="text-[#4C4799] text-sm text-center py-4">
                No tasks for this day
              </p>
            ) : (
              selectedDateTasks.map(task => {
                const category = getCategoryById(task.categoryId);
                return (
                  <div
                    key={task.id}
                    className="bg-[#F8FAFC] rounded-xl p-3"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className="mt-0.5 text-muted-foreground active:text-green-600 transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {category && (
                            <CategoryIcon iconName={category.icon} size={16} color={category.color} />
                          )}
                          <h4 className={`text-sm ${
                            task.completed 
                              ? 'line-through text-[#9CA3AF]' 
                              : 'text-[#312E81]'
                          }`}>
                            {task.title}
                          </h4>
                        </div>
                        {task.description && (
                          <p className="text-xs text-[#4C4799]">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
