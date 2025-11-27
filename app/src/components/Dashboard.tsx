import { useState } from "react";
import { Task, Category, Suggestion } from "../types";
import { CategoryIcon } from "./CategoryIcon";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  AlertCircle,
  List,
} from "lucide-react";
import {
  formatDistanceToNow,
  format,
  isToday,
  isTomorrow,
  isPast,
  formatDistanceStrict,
} from "date-fns";
import { CalendarView } from "./CalendarView";
import { TaskDetailDialog } from "./TaskDetailDialog";
import SmartSuggestions from "./SmartSuggestions";

interface DashboardProps {
  tasks: Task[];
  categories: Category[];
  suggestions: Suggestion[];
  onNavigateToCategory: (categoryId: string) => void;
  onNavigateToAddTask: () => void;
  onNavigateToTaskDetails: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  onDismissSuggestion: (suggestionId: string) => void;
  onSuggestionFeedback: (
    suggestionId: string,
    feedback: "more" | "less"
  ) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function Dashboard({
  tasks,
  categories,
  suggestions,
  onNavigateToCategory,
  onNavigateToAddTask,
  onNavigateToTaskDetails,
  onToggleTask,
  onDismissSuggestion,
  onSuggestionFeedback,
  onUpdateTask,
}: DashboardProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  const handleTaskClick = (task: Task) => {
    onNavigateToTaskDetails(task.id);
  };

  const upcomingTasks = tasks
    .filter((task) => !task.completed && task.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const overdueTasks = tasks
    .filter(
      (task) => !task.completed && isPast(task.date) && !isToday(task.date)
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const activeSuggestions = suggestions.filter((s) => !s.dismissed).slice(0, 3);

  const getCategoryById = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const formatTaskDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d, yyyy");
  };

  return (
    <div className="space-y-5">
      {/* Welcome Section */}
      <div>
        <h1 className="mb-1 text-[#312E81] text-2xl font-bold">
          Welcome back!
        </h1>
        <p className="text-[#4C4799]">Here's what needs your attention</p>
      </div>

      {/* Assistant Suggestions */}
      <SmartSuggestions
        suggestions={activeSuggestions}
        onDismissSuggestion={onDismissSuggestion}
      />
      {/* {activeSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <h3 className="text-sm mb-1 text-[#312E81]">Smart Suggestions</h3>
              <p className="text-xs text-[#4C4799]">Tips from your assistant</p>
            </div>
          </div>

          <div className="space-y-3">
            {activeSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white rounded-xl p-3 shadow-sm"
              >
                <p className="text-sm mb-3 text-[#312E81]">
                  {suggestion.message}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSuggestionFeedback(suggestion.id, "more")}
                    className="flex-1 text-xs h-8 text-[#312E81]"
                  >
                    👍 More
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSuggestionFeedback(suggestion.id, "less")}
                    className="flex-1 text-xs h-8 text-[#312E81]"
                  >
                    👎 Less
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDismissSuggestion(suggestion.id)}
                    className="text-xs h-8"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Overdue Tasks Section */}
      {overdueTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-[#312E81]">Overdue Tasks</h3>
            <Badge variant="destructive" className="ml-auto">
              {overdueTasks.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {overdueTasks.map((task) => {
              const category = getCategoryById(task.categoryId);
              const daysOverdue = formatDistanceStrict(task.date, new Date(), {
                unit: "day",
              });

              return (
                <div
                  key={task.id}
                  className="bg-red-50 rounded-xl p-4 shadow-sm border-l-4 border-red-500 active:scale-[0.98] transition-transform cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }}
                      className="mt-0.5 text-red-600 active:text-green-600 transition-colors"
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
                          <CategoryIcon
                            iconName={category.icon}
                            size={18}
                            color={category.color}
                          />
                        )}
                        <h4 className="text-sm truncate text-[#312E81]">
                          {task.title}
                        </h4>
                      </div>
                      {task.description && (
                        <p className="text-xs text-[#4C4799] line-clamp-1 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 text-xs text-red-700">
                          <Calendar className="h-3 w-3" />
                          <span>{format(task.date, "MMM d, yyyy")}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs bg-red-100 text-red-700 border-red-300"
                        >
                          {daysOverdue} overdue
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#312E81]">Upcoming Tasks</h3>
          <span>
            <button
              onClick={() => {
                setShowCalendar(false);
              }}
              className={`transition-colors p-2 rounded-xl ${
                !showCalendar ? "bg-primary text-white" : ""
              }`}
            >
              <List className="h-6 w-6" />
            </button>
            <button
              onClick={() => {
                setShowCalendar(true);
              }}
              className={`transition-colors p-2 rounded-xl ${
                showCalendar ? "bg-primary text-white" : ""
              }`}
            >
              <Calendar className="h-6 w-6" />
            </button>
          </span>
        </div>
        {upcomingTasks.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-[#4C4799] text-sm">
              No upcoming tasks. You're all set! 🎉
            </p>
          </div>
        ) : !showCalendar ? (
          <div className="space-y-2">
            {upcomingTasks.map((task) => {
              const category = getCategoryById(task.categoryId);
              return (
                <div
                  key={task.id}
                  className="bg-white rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                  onClick={() => handleTaskClick(task)}
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
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {category && (
                          <CategoryIcon
                            iconName={category.icon}
                            size={18}
                            color={category.color}
                          />
                        )}
                        <h4 className="text-sm truncate text-[#312E81]">
                          {task.title}
                        </h4>
                      </div>
                      {task.description && (
                        <p className="text-xs text-[#4C4799] line-clamp-1 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-[#4C4799]">
                        <Calendar className="h-3 w-3" />
                        <span>{formatTaskDate(task.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <CalendarView
            tasks={tasks}
            categories={categories}
            onToggleTask={onToggleTask}
          />
        )}
      </div>

      {/* Calendar Dialog */}
      {/* <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#312E81]">Calendar</DialogTitle>
            <DialogDescription>
              View and manage your tasks by date
            </DialogDescription>
          </DialogHeader>
          <CalendarView
            tasks={tasks}
            categories={categories}
            onToggleTask={onToggleTask}
          />
        </DialogContent>
      </Dialog> */}

      {/* Task Detail Dialog */}
      {/* <TaskDetailDialog
        task={selectedTask}
        category={
          selectedTask ? getCategoryById(selectedTask.categoryId) : undefined
        }
        open={showTaskDetail}
        onOpenChange={setShowTaskDetail}
        onUpdateTask={onUpdateTask}
      /> */}
    </div>
  );
}
