import { Task, Category } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, CheckCircle2, Circle, Calendar, FileText } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

interface CategoryViewProps {
  category: Category;
  tasks: Task[];
  onBack: () => void;
  onAddTask: () => void;
  onEditTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
}

export function CategoryView({
  category,
  tasks,
  onBack,
  onAddTask,
  onEditTask,
  onToggleTask,
}: CategoryViewProps) {
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const formatTaskDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    return format(date, 'MMM d, yyyy');
  };

  const TaskList = ({ tasks, showCompleted }: { tasks: Task[]; showCompleted: boolean }) => (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <p className="text-muted-foreground text-sm">
            {showCompleted ? 'No completed tasks' : 'No active tasks'}
          </p>
        </div>
      ) : (
        tasks.map((task) => {
          const isOverdue = !task.completed && isPast(task.date) && !isToday(task.date);
          
          return (
            <div
              key={task.id}
              className="bg-white rounded-xl p-4 cursor-pointer active:scale-[0.98] transition-transform shadow-sm"
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
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-sm truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h4>
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs">Overdue</Badge>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatTaskDate(task.date)}</span>
                    </div>
                    {task.attachments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{task.attachments.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button onClick={onBack} variant="outline" size="icon" className="flex-shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-4xl">{category.icon}</span>
            <h1 className="text-xl">{category.name}</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {activeTasks.length} active • {completedTasks.length} completed
          </p>
        </div>
      </div>

      {/* Floating Add Button for Category */}
      <button
        onClick={onAddTask}
        className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center active:bg-blue-700 transition-all active:scale-95 z-10"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Active Tasks */}
      <div>
        <h3 className="mb-3">Active Tasks</h3>
        <TaskList tasks={activeTasks} showCompleted={false} />
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h4 className="mb-3">Completed</h4>
          <TaskList tasks={completedTasks} showCompleted={true} />
        </div>
      )}
    </div>
  );
}
