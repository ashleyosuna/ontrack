import { useState, useEffect } from "react";
import { Onboarding } from "./components/Onboarding";
import { Dashboard } from "./components/Dashboard";
import { CategoryView } from "./components/CategoryView";
import { TaskForm } from "./components/TaskForm";
import { Settings } from "./components/Settings";
import { RemindersView } from "./components/RemindersView";
import { CategoryIcon } from "./components/CategoryIcon";
import { TemplateSelectionDialog } from "./components/TemplateSelectionDialog";
import { TaskCreationModeDialog } from "./components/TaskCreationModeDialog";
import { TemplateForm } from "./components/TemplateForm";
import { Button } from "./components/ui/button";
import {
  Home,
  List,
  Plus,
  Settings as SettingsIcon,
  Sparkles,
  CheckCircle,
  Bell,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  Category,
  Task,
  Suggestion,
  UserProfile,
  Template,
  DEFAULT_CATEGORIES,
} from "./types";
import { storage } from "./utils/storage";
import {
  generateSuggestions,
  generateCategoryBasedSuggestions,
} from "./utils/assistant";
import { generateDemoTasks } from "./utils/demoData";

type View =
  | "dashboard"
  | "categories"
  | "category"
  | "add-task"
  | "edit-task"
  | "settings"
  | "reminders"
  | "create-template"
  | "edit-template";

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Omit<
    Template,
    "id" | "createdAt"
  > | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [showModeDialog, setShowModeDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [previousView, setPreviousView] = useState<View>("dashboard");

  // Initialize app
  useEffect(() => {
    const profile = storage.getUserProfile();
    const savedCategories = storage.getCategories();
    const savedTasks = storage.getTasks();
    const savedSuggestions = storage.getSuggestions();
    const savedTemplates = storage.getTemplates();

    // First time user - don't auto-initialize, let them go through onboarding
    if (!profile) {
      setIsInitialized(true);
      return;
    }

    // Migrate old profiles
    let migratedProfile = { ...profile };
    let needsMigration = false;

    // Migrate demoMode field
    if (migratedProfile.demoMode === undefined) {
      migratedProfile.demoMode = false;
      needsMigration = true;
    }

    // Migrate from trackedCategories to preferredCategories + hiddenCategories
    if (
      "trackedCategories" in migratedProfile &&
      !("preferredCategories" in migratedProfile)
    ) {
      const oldProfile = migratedProfile as any;
      migratedProfile.preferredCategories = oldProfile.trackedCategories || [];
      migratedProfile.hiddenCategories = [];

      // Add any missing predefined categories
      const missingCategories = DEFAULT_CATEGORIES.filter(
        (defCat) => !savedCategories.find((c) => c.name === defCat.name)
      ).map((cat, index) => ({
        ...cat,
        id: `category-${Date.now()}-${index}`,
      }));

      if (missingCategories.length > 0) {
        const allCategories = [...savedCategories, ...missingCategories];
        setCategories(allCategories);
        storage.saveCategories(allCategories);
      }

      needsMigration = true;
    }

    if (needsMigration) {
      setUserProfile(migratedProfile);
      storage.saveUserProfile(migratedProfile);
      // Categories were already set in migration if needed
      if (savedCategories.length > 0 && categories.length === 0) {
        setCategories(savedCategories);
      }
    } else {
      setUserProfile(profile);
      if (savedCategories.length > 0) {
        setCategories(savedCategories);
      }
    }

    setTasks(savedTasks);
    setSuggestions(savedSuggestions);
    setTemplates(savedTemplates);
    setIsInitialized(true);
  }, []);

  // Generate task-based suggestions when tasks exist
  useEffect(() => {
    if (categories.length > 0 && tasks.length > 0) {
      const newSuggestions = generateSuggestions(tasks, categories);
      // Merge with existing feedback
      const mergedSuggestions = newSuggestions.map((newSug) => {
        const existing = suggestions.find((s) => s.id === newSug.id);
        return existing
          ? {
              ...newSug,
              feedback: existing.feedback,
              dismissed: existing.dismissed,
            }
          : newSug;
      });
      setSuggestions(mergedSuggestions);
      storage.saveSuggestions(mergedSuggestions);
    }
  }, [tasks, categories]);

  // Generate category-based suggestions when user has no tasks (normal mode only)
  useEffect(() => {
    if (
      !userProfile?.demoMode &&
      userProfile?.hasCompletedOnboarding &&
      tasks.length === 0 &&
      categories.length > 0 &&
      isInitialized
    ) {
      const categorySuggestions = generateCategoryBasedSuggestions(
        categories,
        userProfile.preferredCategories
      );
      setSuggestions(categorySuggestions);
      storage.saveSuggestions(categorySuggestions);
    }
  }, [
    userProfile?.demoMode,
    userProfile?.hasCompletedOnboarding,
    userProfile?.preferredCategories,
    tasks.length,
    categories.length,
    isInitialized,
  ]);

  const handleOnboardingComplete = (data: {
    preferredCategories: string[];
    age?: string;
    gender?: string;
  }) => {
    const profile: UserProfile = {
      preferredCategories: data.preferredCategories,
      hiddenCategories: [],
      age: data.age,
      gender: data.gender,
      hasCompletedOnboarding: true,
      calendarIntegration: true,
      notificationsEnabled: true,
      demoMode: false,
    };

    // Initialize ALL predefined categories (show all by default)
    const initialCategories = DEFAULT_CATEGORIES.map((cat, index) => ({
      ...cat,
      id: `category-${Date.now()}-${index}`,
    }));

    setUserProfile(profile);
    setCategories(initialCategories);
    storage.saveUserProfile(profile);
    storage.saveCategories(initialCategories);
    toast.success("Welcome to OnTrack! 🎉");
  };

  const handleDemoMode = () => {
    // Initialize with all categories and demo mode enabled
    const profile: UserProfile = {
      preferredCategories: DEFAULT_CATEGORIES.map((c) => c.name),
      hiddenCategories: [],
      hasCompletedOnboarding: true,
      calendarIntegration: true,
      notificationsEnabled: true,
      demoMode: true,
    };

    const initialCategories = DEFAULT_CATEGORIES.map((cat, index) => ({
      ...cat,
      id: `category-${Date.now()}-${index}`,
    }));

    const demoTasks = generateDemoTasks(initialCategories);

    setUserProfile(profile);
    setCategories(initialCategories);
    setTasks(demoTasks);
    storage.saveUserProfile(profile);
    storage.saveCategories(initialCategories);
    storage.saveTasks(demoTasks);

    // Navigate to dashboard
    setCurrentView("dashboard");
    toast.success("Welcome to Demo Mode! 🎉");
  };

  const handleToggleDemoMode = (enabled: boolean) => {
    if (!userProfile) return;

    if (enabled) {
      // Turn ON demo mode - load all categories and demo data
      const updatedProfile = {
        ...userProfile,
        demoMode: true,
        preferredCategories: DEFAULT_CATEGORIES.map((c) => c.name),
        hiddenCategories: [],
      };

      // Create all categories
      const allCategories = DEFAULT_CATEGORIES.map((cat, index) => ({
        ...cat,
        id: `category-${Date.now()}-${index}`,
      }));

      const demoTasks = generateDemoTasks(allCategories);

      setUserProfile(updatedProfile);
      setCategories(allCategories);
      setTasks(demoTasks);
      storage.saveUserProfile(updatedProfile);
      storage.saveCategories(allCategories);
      storage.saveTasks(demoTasks);

      // Navigate to dashboard
      setCurrentView("dashboard");
      toast.success("Demo mode enabled! Sample tasks loaded.");
    } else {
      // Turn OFF demo mode - clear everything and return to onboarding
      localStorage.clear();
      setUserProfile(null);
      setCategories([]);
      setTasks([]);
      setSuggestions([]);
      setCurrentView("dashboard");
      toast.success("Demo mode disabled. Starting fresh!");
    }
  };

  const handleAddTask = (
    taskData: Omit<Task, "id" | "createdAt">,
    saveAsTemplate?: boolean,
    templateName?: string
  ) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);

    // Save as template if requested
    if (saveAsTemplate && templateName) {
      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name: templateName,
        categoryId: taskData.categoryId,
        title: taskData.title,
        description: taskData.description,
        notes: taskData.notes,
        reminders: taskData.reminders,
        isPreset: false,
        createdAt: new Date(),
      };

      const updatedTemplates = [...templates, newTemplate];
      setTemplates(updatedTemplates);
      storage.saveTemplates(updatedTemplates);
      toast.success("Task created and saved as template!");
    } else {
      toast.success("Task created successfully!");
    }

    setCurrentView("dashboard");
    setSelectedCategoryId(null);
    setSelectedTemplate(null);
  };

  const handleEditTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (!selectedTaskId) return;

    const updatedTasks = tasks.map((task) =>
      task.id === selectedTaskId ? { ...task, ...taskData } : task
    );

    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setCurrentView("dashboard");
    setSelectedTaskId(null);
    toast.success("Task updated successfully!");
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setCurrentView("dashboard");
    setSelectedTaskId(null);
    toast.success("Task deleted successfully!");
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const wasCompleted = task.completed;
    const now = new Date();

    let updatedTasks = [...tasks];

    if (!wasCompleted) {
      // Mark task as completed with timestamp
      updatedTasks = tasks.map((t) =>
        t.id === taskId ? { ...t, completed: true, completedAt: now } : t
      );

      // Check if task has recurring reminders
      const hasRecurringReminders = task.reminders.some(
        (r) => r.enabled && r.frequency !== "once"
      );

      if (hasRecurringReminders) {
        // Create a new task for the next occurrence
        const nextDate = calculateNextDate(
          task.date,
          task.reminders[0].frequency
        );

        // Add current completion to history
        const completionRecord = {
          id: task.id,
          completedAt: now,
          date: task.date,
        };

        const newTask: Task = {
          ...task,
          id: `task-${Date.now()}`,
          date: nextDate,
          completed: false,
          completedAt: undefined,
          createdAt: new Date(),
          previousCompletions: [
            ...(task.previousCompletions || []),
            completionRecord,
          ].slice(-5), // Keep only last 5 completions
        };

        updatedTasks.push(newTask);
      }
    } else {
      // Uncomplete task - remove completion timestamp
      updatedTasks = tasks.map((t) =>
        t.id === taskId ? { ...t, completed: false, completedAt: undefined } : t
      );
    }

    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);

    // Show confirmation toast with undo action
    if (!wasCompleted) {
      const hasRecurring = task.reminders.some(
        (r) => r.enabled && r.frequency !== "once"
      );
      toast.success(
        hasRecurring
          ? "Task completed! Next occurrence created 🎉"
          : "Task completed! 🎉",
        {
          duration: 4000,
          action: {
            label: "Undo",
            onClick: () => {
              // Undo the completion and remove new task if created
              let revertedTasks = tasks.map((t) =>
                t.id === taskId
                  ? { ...t, completed: false, completedAt: undefined }
                  : t
              );
              // Remove the newly created recurring task if it exists
              if (hasRecurring) {
                revertedTasks = revertedTasks.filter(
                  (t) => !t.previousCompletions?.some((c) => c.id === taskId)
                );
              }
              setTasks(revertedTasks);
              storage.saveTasks(revertedTasks);
              toast.info("Task marked as incomplete");
            },
          },
        }
      );
    } else {
      toast.info("Task marked as incomplete");
    }
  };

  // Helper function to calculate next date based on frequency
  const calculateNextDate = (currentDate: Date, frequency: string): Date => {
    const next = new Date(currentDate);
    switch (frequency) {
      case "daily":
        next.setDate(next.getDate() + 1);
        break;
      case "weekly":
        next.setDate(next.getDate() + 7);
        break;
      case "monthly":
        next.setMonth(next.getMonth() + 1);
        break;
      default:
        next.setDate(next.getDate() + 1);
    }
    return next;
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
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

  const handleSuggestionFeedback = (
    suggestionId: string,
    feedback: "more" | "less"
  ) => {
    const updatedSuggestions = suggestions.map((s) =>
      s.id === suggestionId ? { ...s, feedback } : s
    );
    setSuggestions(updatedSuggestions);
    storage.saveSuggestions(updatedSuggestions);
    toast.success(
      feedback === "more"
        ? "We'll show more like this 👍"
        : "We'll show less like this 👎"
    );
  };

  const handleAddCategory = (categoryData: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...categoryData,
      id: `category-${Date.now()}`,
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
    toast.success("Category added successfully!");
  };

  const handleDeleteCategory = (categoryId: string) => {
    const categoryTasks = tasks.filter((t) => t.categoryId === categoryId);

    if (categoryTasks.length > 0) {
      toast.error("Cannot delete category with existing tasks");
      return;
    }

    const updatedCategories = categories.filter((c) => c.id !== categoryId);
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
    toast.success("Category deleted successfully!");
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    storage.saveUserProfile(profile);
    toast.success("Settings updated!");
  };

  // Navigation handlers
  const navigateToCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentView("category");
  };

  const navigateToAddTask = (categoryId?: string) => {
    setSelectedCategoryId(categoryId || null);
    setSelectedTaskId(null);
    setSelectedTemplate(null);
    setShowModeDialog(true);
  };

  const handleModeSelected = (
    mode: "quick" | "template" | "create-template"
  ) => {
    if (mode === "quick") {
      // Go directly to TaskForm (start from scratch)
      setCurrentView("add-task");
    } else if (mode === "template") {
      // Open template selection dialog
      setShowTemplateDialog(true);
    } else {
      // Create new template
      setPreviousView(currentView);
      setCurrentView("create-template");
    }
  };

  const handleTemplateSelected = (
    template: Omit<Template, "id" | "createdAt"> | null
  ) => {
    setSelectedTemplate(template);
    setShowTemplateDialog(false);

    // If template is selected, use its categoryId, otherwise use the selected category
    if (template) {
      setSelectedCategoryId(template.categoryId);
    }

    setCurrentView("add-task");
  };

  const handleAddTemplate = (
    templateData: Omit<Template, "id" | "createdAt">
  ) => {
    const newTemplate: Template = {
      ...templateData,
      id: `template-${Date.now()}`,
      createdAt: new Date(),
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    storage.saveTemplates(updatedTemplates);
    toast.success("Template created successfully!");
    setCurrentView("dashboard");
  };

  const handleEditTemplate = (
    templateData: Omit<Template, "id" | "createdAt">
  ) => {
    if (!selectedTemplateId) return;

    const updatedTemplates = templates.map((template) =>
      template.id === selectedTemplateId
        ? { ...template, ...templateData }
        : template
    );

    setTemplates(updatedTemplates);
    storage.saveTemplates(updatedTemplates);
    setCurrentView("settings");
    setSelectedTemplateId(null);
    toast.success("Template updated successfully!");
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter((t) => t.id !== templateId);
    setTemplates(updatedTemplates);
    storage.saveTemplates(updatedTemplates);
    toast.success("Template deleted successfully!");

    // If we're in edit view, go back to settings
    if (currentView === "edit-template") {
      setCurrentView("settings");
      setSelectedTemplateId(null);
    }
  };

  const navigateToEditTemplate = (templateId: string) => {
    setPreviousView(currentView);
    setSelectedTemplateId(templateId);
    setCurrentView("edit-template");
  };

  const navigateToEditTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setCurrentView("edit-task");
  };

  const navigateToSettings = () => {
    setCurrentView("settings");
  };

  const navigateToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedCategoryId(null);
    setSelectedTaskId(null);
  };

  const navigateToCategories = () => {
    setCurrentView("categories");
    setSelectedCategoryId(null);
  };

  const navigateToReminders = () => {
    setCurrentView("reminders");
    setSelectedCategoryId(null);
    setSelectedTaskId(null);
  };

  const navigateToPreviousView = () => {
    setCurrentView(previousView);
    if (previousView === "settings") {
      setSelectedTemplateId(null);
    }
  };

  // Wait for initialization to complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-[#2C7A7B] mx-auto mb-4 animate-pulse" />
          <p className="text-[#4338CA]">Loading...</p>
        </div>
      </div>
    );
  }

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const categoryTasks = selectedCategoryId
    ? tasks
        .filter((t) => t.categoryId === selectedCategoryId)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
    : [];

  // Show onboarding if not completed
  if (!userProfile?.hasCompletedOnboarding) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        onDemoMode={handleDemoMode}
      />
    );
  }

  // Check if we're on a main view (for bottom nav)
  const isMainView = [
    "dashboard",
    "categories",
    "category",
    "settings",
    "reminders",
  ].includes(currentView);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <Toaster position="top-center" />

      {/* Mobile Header */}
      <header className="bg-[#2C7A7B] border-b border-[#236767] sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-center">
            <h2 className="text-[#F8FAFC] text-3xl relative">
              <Sparkles className="absolute -left-10 top-1/2 -translate-y-1/2 h-8 w-8 text-[#312E81]" />
              OnTrack
            </h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        {currentView === "dashboard" && (
          <Dashboard
            tasks={tasks}
            categories={categories}
            suggestions={suggestions}
            onNavigateToCategory={navigateToCategory}
            onNavigateToAddTask={navigateToAddTask}
            onNavigateToTaskDetails={navigateToEditTask}
            onToggleTask={handleToggleTask}
            onDismissSuggestion={handleDismissSuggestion}
            onSuggestionFeedback={handleSuggestionFeedback}
            onUpdateTask={handleUpdateTask}
          />
        )}

        {currentView === "categories" && userProfile && (
          <div className="space-y-4">
            <h1 className="text-[#312E81] text-2xl font-bold">Categories</h1>
            <div className="grid grid-cols-2 gap-3">
              {/* Completed Tasks Category */}
              <div
                className="bg-white rounded-2xl p-4 cursor-pointer transition-all active:scale-95 shadow-sm border-t-4 border-green-500"
                onClick={() => {
                  setSelectedCategoryId("completed");
                  setCurrentView("category");
                }}
              >
                <div className="text-center space-y-1.5">
                  <div className="mb-1 flex justify-center">
                    <CheckCircle
                      style={{ width: "48px", height: "48px" }}
                      className="text-green-500"
                    />
                  </div>
                  <h4 className="text-sm text-[#312E81]">Completed</h4>
                  <p className="text-xs text-[#4C4799]">
                    {tasks.filter((t) => t.completed).length} tasks
                  </p>
                </div>
              </div>

              {categories
                .filter(
                  (category) =>
                    !userProfile.hiddenCategories.includes(category.name)
                )
                .map((category) => {
                  const categoryTaskCount = tasks.filter(
                    (t) => t.categoryId === category.id && !t.completed
                  ).length;
                  return (
                    <div
                      key={category.id}
                      className="bg-white rounded-2xl p-4 cursor-pointer transition-all active:scale-95 shadow-sm"
                      onClick={() => navigateToCategory(category.id)}
                      style={{ borderTop: `4px solid ${category.color}` }}
                    >
                      <div className="text-center space-y-1.5">
                        <div className="mb-1 flex justify-center">
                          <CategoryIcon
                            iconName={category.icon}
                            size={48}
                            color={category.color}
                          />
                        </div>
                        <h4 className="text-sm text-[#312E81]">
                          {category.name}
                        </h4>
                        <p className="text-xs text-[#4C4799]">
                          {categoryTaskCount}{" "}
                          {categoryTaskCount === 1 ? "task" : "tasks"}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {currentView === "category" && selectedCategoryId === "completed" && (
          <CategoryView
            category={{
              id: "completed",
              name: "Completed Tasks",
              icon: "CheckCircle",
              color: "#6EE7B7",
              isCustom: false,
            }}
            tasks={tasks
              .filter((t) => t.completed)
              .sort((a, b) => b.date.getTime() - a.date.getTime())}
            onBack={navigateToCategories}
            onAddTask={() => navigateToAddTask()}
            onEditTask={navigateToEditTask}
            onToggleTask={handleToggleTask}
          />
        )}

        {currentView === "category" && selectedCategory && (
          <CategoryView
            category={selectedCategory}
            tasks={categoryTasks}
            onBack={navigateToCategories}
            onAddTask={() => navigateToAddTask(selectedCategoryId || undefined)}
            onEditTask={navigateToEditTask}
            onToggleTask={handleToggleTask}
          />
        )}

        {currentView === "add-task" && (
          <TaskForm
            categories={categories}
            onSave={handleAddTask}
            onCancel={() => {
              setSelectedTemplate(null);
              selectedCategoryId
                ? setCurrentView("category")
                : navigateToDashboard();
            }}
            defaultCategoryId={selectedCategoryId || undefined}
            templateData={
              selectedTemplate
                ? {
                    title: selectedTemplate.title,
                    description: selectedTemplate.description,
                    notes: selectedTemplate.notes,
                    reminders: selectedTemplate.reminders,
                  }
                : undefined
            }
          />
        )}

        {currentView === "edit-task" && selectedTask && (
          <TaskForm
            task={selectedTask}
            categories={categories}
            onSave={handleEditTask}
            onCancel={navigateToDashboard}
            onDelete={handleDeleteTask}
          />
        )}

        {currentView === "settings" && userProfile && (
          <Settings
            categories={categories}
            userProfile={userProfile}
            onBack={navigateToDashboard}
            onUpdateProfile={handleUpdateProfile}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            tasks={tasks}
            onToggleDemoMode={handleToggleDemoMode}
            templates={templates}
            onEditTemplate={navigateToEditTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        )}

        {currentView === "reminders" && (
          <RemindersView
            tasks={tasks}
            categories={categories}
            onToggleTask={handleToggleTask}
            onEditTask={navigateToEditTask}
          />
        )}

        {currentView === "create-template" && (
          <TemplateForm
            categories={categories}
            onSave={handleAddTemplate}
            onCancel={navigateToPreviousView}
            defaultCategoryId={selectedCategoryId || undefined}
          />
        )}

        {currentView === "edit-template" && selectedTemplateId && (
          <TemplateForm
            template={templates.find((t) => t.id === selectedTemplateId)}
            categories={categories}
            onSave={handleEditTemplate}
            onCancel={navigateToPreviousView}
            onDelete={handleDeleteTemplate}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      {isMainView && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
          <div className="grid grid-cols-4 max-w-2xl mx-auto">
            <button
              onClick={navigateToDashboard}
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                currentView === "dashboard" ? "text-primary" : "text-gray-400"
              }`}
            >
              <Home className="h-6 w-6 mb-1" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={navigateToCategories}
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                currentView === "categories" ? "text-primary" : "text-gray-400"
              }`}
            >
              <List className="h-6 w-6 mb-1" />
              <span className="text-xs">Categories</span>
            </button>

            <button
              onClick={navigateToReminders}
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                currentView === "reminders" ? "text-primary" : "text-gray-400"
              }`}
            >
              <Bell className="h-6 w-6 mb-1" />
              <span className="text-xs">Reminders</span>
            </button>

            <button
              onClick={navigateToSettings}
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                currentView === "settings" ? "text-primary" : "text-gray-400"
              }`}
            >
              <SettingsIcon className="h-6 w-6 mb-1" />
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </nav>
      )}

      {/* Floating Action Button */}
      {(currentView === "dashboard" || currentView === "categories") && (
        <button
          onClick={() => navigateToAddTask()}
          className="fixed bottom-24 right-4 bg-[#312E81] text-[#F8FAFC] rounded-full shadow-lg px-5 py-3 flex items-center gap-2 active:bg-[#4338CA] transition-all active:scale-95 z-10"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm">New Task</span>
        </button>
      )}

      {/* Task Creation Mode Dialog */}
      <TaskCreationModeDialog
        open={showModeDialog}
        onOpenChange={setShowModeDialog}
        onSelectMode={handleModeSelected}
      />

      {/* Template Selection Dialog */}
      <TemplateSelectionDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        categories={categories}
        customTemplates={templates}
        onSelectTemplate={handleTemplateSelected}
        onDeleteTemplate={handleDeleteTemplate}
      />
    </div>
  );
}
