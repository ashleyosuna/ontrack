import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { CategoryView } from './components/CategoryView';
import { TaskForm } from './components/TaskForm';
import { Settings } from './components/Settings';
import { Button } from './components/ui/button';
import { Home, List, Plus, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Category, Task, Suggestion, UserProfile, DEFAULT_CATEGORIES } from './types';
import { storage } from './utils/storage';
import { generateSuggestions } from './utils/assistant';

type View = 'dashboard' | 'categories' | 'category' | 'add-task' | 'edit-task' | 'settings';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize app
  useEffect(() => {
    const profile = storage.getUserProfile();
    const savedCategories = storage.getCategories();
    const savedTasks = storage.getTasks();
    const savedSuggestions = storage.getSuggestions();

    // Auto-initialize with all categories if first time
    if (!profile) {
      const newProfile: UserProfile = {
        trackedCategories: DEFAULT_CATEGORIES.map(c => c.name),
        hasCompletedOnboarding: true,
        calendarIntegration: true,
        notificationsEnabled: true,
      };
      setUserProfile(newProfile);
      storage.saveUserProfile(newProfile);
      
      // Initialize all categories
      const initialCategories = DEFAULT_CATEGORIES.map((cat, index) => ({
        ...cat,
        id: `category-${Date.now()}-${index}`,
      }));
      setCategories(initialCategories);
      storage.saveCategories(initialCategories);
      toast.success('Welcome to OnTrack! 🎉');
    } else {
      setUserProfile(profile);
      if (savedCategories.length > 0) {
        setCategories(savedCategories);
      }
    }

    setTasks(savedTasks);
    setSuggestions(savedSuggestions);
    setIsInitialized(true);
  }, []);

  // Generate suggestions when tasks change
  useEffect(() => {
    if (categories.length > 0 && tasks.length > 0) {
      const newSuggestions = generateSuggestions(tasks, categories);
      // Merge with existing feedback
      const mergedSuggestions = newSuggestions.map((newSug) => {
        const existing = suggestions.find((s) => s.id === newSug.id);
        return existing ? { ...newSug, feedback: existing.feedback, dismissed: existing.dismissed } : newSug;
      });
      setSuggestions(mergedSuggestions);
      storage.saveSuggestions(mergedSuggestions);
    }
  }, [tasks, categories]);

  // Add mock calendar tasks if calendar integration is enabled
  useEffect(() => {
    if (userProfile?.calendarIntegration && tasks.length === 0 && categories.length > 0) {
      const travelCategory = categories.find((c) => c.name === 'Travel');
      const healthCategory = categories.find((c) => c.name === 'Health');
      
      if (travelCategory || healthCategory) {
        const mockTasks: Task[] = [];
        
        if (travelCategory) {
          mockTasks.push({
            id: `task-${Date.now()}-1`,
            title: 'Travel to Japan',
            description: 'Summer vacation trip to Tokyo and Kyoto',
            date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
            categoryId: travelCategory.id,
            attachments: [],
            completed: false,
            notes: 'Book flights and accommodation',
            reminders: [],
            createdAt: new Date(),
          });
        }
        
        if (healthCategory) {
          mockTasks.push({
            id: `task-${Date.now()}-2`,
            title: 'Dental Checkup',
            description: 'Regular biannual dental cleaning and checkup',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            categoryId: healthCategory.id,
            attachments: [],
            completed: false,
            notes: 'Dr. Smith - Downtown Dental',
            reminders: [],
            createdAt: new Date(),
          });
        }
        
        if (mockTasks.length > 0) {
          setTasks(mockTasks);
          storage.saveTasks(mockTasks);
          toast.success('Calendar events imported successfully!');
        }
      }
    }
  }, [userProfile?.calendarIntegration, categories]);

  const handleOnboardingComplete = (data: {
    trackedCategories: string[];
    age?: string;
    gender?: string;
  }) => {
    const profile: UserProfile = {
      trackedCategories: data.trackedCategories,
      age: data.age,
      gender: data.gender,
      hasCompletedOnboarding: true,
      calendarIntegration: true,
      notificationsEnabled: true,
    };

    // Initialize categories based on tracked categories
    const initialCategories = DEFAULT_CATEGORIES
      .filter((cat) => data.trackedCategories.includes(cat.name))
      .map((cat, index) => ({
        ...cat,
        id: `category-${Date.now()}-${index}`,
      }));

    setUserProfile(profile);
    setCategories(initialCategories);
    storage.saveUserProfile(profile);
    storage.saveCategories(initialCategories);
    toast.success('Welcome to OnTrack! 🎉');
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setCurrentView('dashboard');
    setSelectedCategoryId(null);
    toast.success('Task created successfully!');
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!selectedTaskId) return;

    const updatedTasks = tasks.map((task) =>
      task.id === selectedTaskId
        ? { ...task, ...taskData }
        : task
    );

    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setCurrentView('dashboard');
    setSelectedTaskId(null);
    toast.success('Task updated successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setCurrentView('dashboard');
    setSelectedTaskId(null);
    toast.success('Task deleted successfully!');
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    const updatedSuggestions = suggestions.map((s) =>
      s.id === suggestionId ? { ...s, dismissed: true } : s
    );
    setSuggestions(updatedSuggestions);
    storage.saveSuggestions(updatedSuggestions);
  };

  const handleSuggestionFeedback = (suggestionId: string, feedback: 'more' | 'less') => {
    const updatedSuggestions = suggestions.map((s) =>
      s.id === suggestionId ? { ...s, feedback } : s
    );
    setSuggestions(updatedSuggestions);
    storage.saveSuggestions(updatedSuggestions);
    toast.success(feedback === 'more' ? 'We\'ll show more like this 👍' : 'We\'ll show less like this 👎');
  };

  const handleAddCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `category-${Date.now()}`,
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
    toast.success('Category added successfully!');
  };

  const handleDeleteCategory = (categoryId: string) => {
    const categoryTasks = tasks.filter((t) => t.categoryId === categoryId);
    
    if (categoryTasks.length > 0) {
      toast.error('Cannot delete category with existing tasks');
      return;
    }

    const updatedCategories = categories.filter((c) => c.id !== categoryId);
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
    toast.success('Category deleted successfully!');
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    storage.saveUserProfile(profile);
    toast.success('Settings updated!');
  };

  // Navigation handlers
  const navigateToCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentView('category');
  };

  const navigateToAddTask = (categoryId?: string) => {
    setSelectedCategoryId(categoryId || null);
    setSelectedTaskId(null);
    setCurrentView('add-task');
  };

  const navigateToEditTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setCurrentView('edit-task');
  };

  const navigateToSettings = () => {
    setCurrentView('settings');
  };

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCategoryId(null);
    setSelectedTaskId(null);
  };

  const navigateToCategories = () => {
    setCurrentView('categories');
    setSelectedCategoryId(null);
  };

  // Wait for initialization to complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const categoryTasks = selectedCategoryId
    ? tasks.filter((t) => t.categoryId === selectedCategoryId).sort((a, b) => a.date.getTime() - b.date.getTime())
    : [];

  // Check if we're on a main view (for bottom nav)
  const isMainView = ['dashboard', 'categories', 'settings'].includes(currentView);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20">
      <Toaster position="top-center" />
      
      {/* Mobile Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h2>OnTrack</h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        {currentView === 'dashboard' && (
          <Dashboard
            tasks={tasks}
            categories={categories}
            suggestions={suggestions}
            onNavigateToCategory={navigateToCategory}
            onNavigateToAddTask={navigateToAddTask}
            onToggleTask={handleToggleTask}
            onDismissSuggestion={handleDismissSuggestion}
            onSuggestionFeedback={handleSuggestionFeedback}
          />
        )}

        {currentView === 'categories' && (
          <div className="space-y-4">
            <h1>Categories</h1>
            <div className="grid grid-cols-2 gap-3">
              {/* Completed Tasks Category */}
              <div
                className="bg-white rounded-2xl p-6 cursor-pointer transition-all active:scale-95 shadow-sm border-t-4 border-green-500"
                onClick={() => {
                  setSelectedCategoryId('completed');
                  setCurrentView('category');
                }}
              >
                <div className="text-center space-y-2">
                  <div className="text-5xl mb-2">✅</div>
                  <h4 className="text-sm">Completed</h4>
                  <p className="text-xs text-muted-foreground">
                    {tasks.filter((t) => t.completed).length} tasks
                  </p>
                </div>
              </div>

              {categories.map((category) => {
                const categoryTaskCount = tasks.filter((t) => t.categoryId === category.id && !t.completed).length;
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-2xl p-6 cursor-pointer transition-all active:scale-95 shadow-sm"
                    onClick={() => navigateToCategory(category.id)}
                    style={{ borderTop: `4px solid ${category.color}` }}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-5xl mb-2">{category.icon}</div>
                      <h4 className="text-sm">{category.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {categoryTaskCount} {categoryTaskCount === 1 ? 'task' : 'tasks'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'category' && selectedCategoryId === 'completed' && (
          <CategoryView
            category={{
              id: 'completed',
              name: 'Completed Tasks',
              icon: '✅',
              color: '#6EE7B7',
              isCustom: false,
            }}
            tasks={tasks.filter((t) => t.completed).sort((a, b) => b.date.getTime() - a.date.getTime())}
            onBack={navigateToCategories}
            onAddTask={() => navigateToAddTask()}
            onEditTask={navigateToEditTask}
            onToggleTask={handleToggleTask}
          />
        )}

        {currentView === 'category' && selectedCategory && (
          <CategoryView
            category={selectedCategory}
            tasks={categoryTasks}
            onBack={navigateToCategories}
            onAddTask={() => navigateToAddTask(selectedCategoryId || undefined)}
            onEditTask={navigateToEditTask}
            onToggleTask={handleToggleTask}
          />
        )}

        {currentView === 'add-task' && (
          <TaskForm
            categories={categories}
            onSave={handleAddTask}
            onCancel={() => selectedCategoryId ? setCurrentView('category') : navigateToDashboard()}
            defaultCategoryId={selectedCategoryId || undefined}
          />
        )}

        {currentView === 'edit-task' && selectedTask && (
          <TaskForm
            task={selectedTask}
            categories={categories}
            onSave={handleEditTask}
            onCancel={navigateToDashboard}
            onDelete={handleDeleteTask}
          />
        )}

        {currentView === 'settings' && (
          <Settings
            categories={categories}
            userProfile={userProfile}
            onBack={navigateToDashboard}
            onUpdateProfile={handleUpdateProfile}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      {isMainView && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
          <div className="grid grid-cols-3 max-w-2xl mx-auto">
            <button
              onClick={navigateToDashboard}
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                currentView === 'dashboard'
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <Home className="h-6 w-6 mb-1" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={navigateToCategories}
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                currentView === 'categories'
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <List className="h-6 w-6 mb-1" />
              <span className="text-xs">Categories</span>
            </button>

            <button
              onClick={navigateToSettings}
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                currentView === 'settings'
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <SettingsIcon className="h-6 w-6 mb-1" />
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </nav>
      )}

      {/* Floating Action Button */}
      {(currentView === 'dashboard' || currentView === 'categories') && (
        <button
          onClick={() => navigateToAddTask()}
          className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all active:scale-95 z-10"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
