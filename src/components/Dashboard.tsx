import { Task, Category, Suggestion } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { formatDistanceToNow, format, isToday, isTomorrow, isPast } from 'date-fns';

interface DashboardProps {
  tasks: Task[];
  categories: Category[];
  suggestions: Suggestion[];
  onNavigateToCategory: (categoryId: string) => void;
  onNavigateToAddTask: () => void;
  onToggleTask: (taskId: string) => void;
  onDismissSuggestion: (suggestionId: string) => void;
  onSuggestionFeedback: (suggestionId: string, feedback: 'more' | 'less') => void;
}

export function Dashboard({
  tasks,
  categories,
  suggestions,
  onNavigateToCategory,
  onNavigateToAddTask,
  onToggleTask,
  onDismissSuggestion,
  onSuggestionFeedback,
}: DashboardProps) {
  const upcomingTasks = tasks
    .filter((task) => !task.completed && task.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const overdueTasks = tasks.filter((task) => !task.completed && isPast(task.date) && !isToday(task.date));

  const activeSuggestions = suggestions
    .filter((s) => !s.dismissed)
    .slice(0, 3);

  const getCategoryById = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const formatTaskDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="space-y-5">
      {/* Welcome Section */}
      <div>
        <h1 className="mb-1">Welcome back!</h1>
        <p className="text-muted-foreground">Here's what needs your attention</p>
      </div>

      {/* Assistant Suggestions */}
      {activeSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <h3 className="text-sm mb-1">Smart Suggestions</h3>
              <p className="text-xs text-muted-foreground">Tips from your assistant</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {activeSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white rounded-xl p-3 shadow-sm"
              >
                <p className="text-sm mb-3">{suggestion.message}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSuggestionFeedback(suggestion.id, 'more')}
                    className="flex-1 text-xs h-8"
                  >
                    👍 More
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSuggestionFeedback(suggestion.id, 'less')}
                    className="flex-1 text-xs h-8"
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
      )}

      {/* Overdue Tasks Alert */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-900">
              {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      <div>
        <h3 className="mb-3">Upcoming Tasks</h3>
        {upcomingTasks.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-muted-foreground text-sm">No upcoming tasks. You're all set! 🎉</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingTasks.map((task) => {
              const category = getCategoryById(task.categoryId);
              return (
                <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform">
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
                          <span className="text-lg">{category.icon}</span>
                        )}
                        <h4 className="text-sm truncate">{task.title}</h4>
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatTaskDate(task.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
