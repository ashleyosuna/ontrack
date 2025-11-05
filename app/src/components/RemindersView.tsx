import { useState, useEffect, useRef } from 'react';
import { Task, Category } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { CheckCircle2, Circle, Calendar } from 'lucide-react';
import { formatDistanceToNow, format, isToday, isTomorrow, startOfMonth, endOfMonth, addMonths } from 'date-fns';

interface RemindersViewProps {
  tasks: Task[];
  categories: Category[];
  onToggleTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
}

interface TasksByMonth {
  monthKey: string;
  monthLabel: string;
  tasks: Task[];
}

export function RemindersView({
  tasks,
  categories,
  onToggleTask,
  onEditTask,
}: RemindersViewProps) {
  const [monthsToShow, setMonthsToShow] = useState(5);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const getCategoryById = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const formatTaskDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  // Filter all upcoming tasks (not just those with reminders)
  const tasksWithReminders = tasks
    .filter((task) => !task.completed && task.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Group tasks by month
  const groupTasksByMonth = (): TasksByMonth[] => {
    const groups: { [key: string]: TasksByMonth } = {};
    const now = new Date();
    
    // Generate month groups for the range we want to show
    for (let i = 0; i < monthsToShow; i++) {
      const monthDate = addMonths(startOfMonth(now), i);
      const monthKey = format(monthDate, 'yyyy-MM');
      const monthLabel = format(monthDate, 'MMMM yyyy');
      
      groups[monthKey] = {
        monthKey,
        monthLabel,
        tasks: [],
      };
    }

    // Add tasks to their respective months
    tasksWithReminders.forEach((task) => {
      const taskMonth = format(startOfMonth(task.date), 'yyyy-MM');
      
      if (groups[taskMonth]) {
        groups[taskMonth].tasks.push(task);
      }
    });

    // Return only months that have tasks or are within the current view
    return Object.values(groups)
      .filter((group) => group.tasks.length > 0 || 
        new Date(group.monthKey) <= addMonths(startOfMonth(now), monthsToShow - 1));
  };

  const tasksByMonth = groupTasksByMonth();

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          // Load 3 more months
          setMonthsToShow((prev) => prev + 3);
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-5" ref={scrollContainerRef}>
      {/* Header */}
      <div>
        <h1 className="mb-1 text-[#312E81] text-2xl font-bold">Upcoming Tasks</h1>
        <p className="text-[#4C4799]">All your upcoming tasks organized by month</p>
      </div>

      {/* Tasks List */}
      {tasksWithReminders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <Calendar className="h-16 w-16 text-[#A8D5D7] mx-auto mb-4" />
          <h3 className="text-[#312E81] mb-2">No Upcoming Tasks</h3>
          <p className="text-[#4C4799] text-sm">
            You're all caught up! Create new tasks to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {tasksByMonth.map((monthGroup) => (
            <div key={monthGroup.monthKey} className="space-y-3">
              {/* Month Header */}
              {monthGroup.tasks.length > 0 && (
                <>
                  <div className="sticky top-0 bg-[#F8FAFC] pt-2 pb-3 -mx-4 px-4 z-10">
                    <div className="bg-gradient-to-r from-[#312E81] to-[#4C4799] rounded-xl px-4 py-2 shadow-sm">
                      <h2 className="text-white font-semibold">{monthGroup.monthLabel}</h2>
                    </div>
                  </div>

                  {/* Tasks for this month */}
                  {monthGroup.tasks.map((task) => {
                    const category = getCategoryById(task.categoryId);
                    const nextReminder = task.reminders && task.reminders.length > 0
                      ? task.reminders
                          .filter((r) => r.enabled)
                          .sort((a, b) => a.time.getTime() - b.time.getTime())[0]
                      : null;

                    return (
                      <div
                        key={task.id}
                        className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-all"
                        onClick={() => onEditTask(task.id)}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleTask(task.id);
                            }}
                            className="mt-0.5 text-muted-foreground active:text-green-600 transition-colors"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                              <Circle className="h-6 w-6" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {category && (
                                <CategoryIcon
                                  iconName={category.icon}
                                  size={16}
                                  color={category.color}
                                />
                              )}
                              <span className="text-xs text-[#4C4799]">
                                {category?.name}
                              </span>
                            </div>

                            <h3 className={`mb-1 text-[#312E81] ${task.completed ? 'line-through opacity-60' : ''}`}>
                              {task.title}
                            </h3>

                            {task.description && (
                              <p className="text-sm text-[#4C4799] mb-2 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              <div className="flex items-center gap-1 text-[#4C4799]">
                                <Calendar className="h-3 w-3" />
                                <span>{formatTaskDate(task.date)}</span>
                              </div>

                              {nextReminder && (
                                <div className="flex items-center gap-1 text-[#2C7A7B]">
                                  <span className="inline-block w-2 h-2 rounded-full bg-[#2C7A7B] animate-pulse" />
                                  <span>
                                    Reminder: {format(nextReminder.time, 'MMM d, h:mm a')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          ))}

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="h-4" />
        </div>
      )}
    </div>
  );
}
