import { useState, useEffect } from "react";
import WelcomePage from './components/WelcomeScreen';
import LoadingPage from './components/LoadingScreen';
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
import { UploadDocumentForm } from "./components/UploadDocumentForm";
import { PhotoForm } from "./components/PhotoForm";
import { Button } from "./components/ui/button";
import {
  Home,
  List,
  Plus,
  Settings as SettingsIcon,
  Sparkles,
  CheckCircle,
  Bell,
  Files,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  Document,
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
import { SafeArea } from "capacitor-plugin-safe-area";
import CategoryTab from "./components/CategoryTab";
import { getRandomDailyReminderMessage, hasNotificationOnDate } from "./utils/DailyReminder";

type View = 'welcome' 
  | 'onboarding' 
  | 'loading'
  | "dashboard"
  | "categories"
  | "category"
  | "add-task"
  | "edit-task"
  | "settings"
  | "reminders"
  | "create-template"
  | "edit-template"
  | "pre-add-task"
  | "select-template"
  | "documents"
  | "add-document-upload"

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildSmartSuggestionPool(
  tasks: Task[],
  categories: Category[],
  userProfile: UserProfile,
  options?: { includeHiddenCategories?: boolean }
): Suggestion[] {
  const pool: Suggestion[] = [];

  // Task-based suggestions (only if tasks exist)
  if (categories.length > 0 && tasks.length > 0) {
    const taskBased = generateSuggestions(tasks, categories);
    pool.push(...taskBased);
  }

  // Category-based suggestions (even when there are no tasks)
  if (!userProfile.demoMode && categories.length > 0) {
    const trackedCategoryNames = options?.includeHiddenCategories
      ? Array.from(
          new Set([
            ...(userProfile.preferredCategories || []),
            ...(userProfile.hiddenCategories || []),
          ])
        )
      : userProfile.preferredCategories;

    const categorySuggestions = generateCategoryBasedSuggestions(
      categories,
      trackedCategoryNames
    );
    pool.push(...categorySuggestions);
  }
  return pool;
}

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionPool, setSuggestionPool] = useState<Suggestion[]>([]);
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

  useEffect(() => {
    (async function () {
      const safeAreaData = await SafeArea.getSafeAreaInsets();
      const { insets } = safeAreaData;
      for (const [key, value] of Object.entries(insets)) {
        document.documentElement.style.setProperty(
          `--safe-area-inset-${key}`,
          `${value}px`
        );
      }
    })();
  }, []);

  // Initialize app
  useEffect(() => {
    const profile = storage.getUserProfile();
    const savedCategories = storage.getCategories();
    const savedTasks = storage.getTasks();
    const savedSuggestions = storage.getSuggestions();
    const savedTemplates = storage.getTemplates();
    const savedDocuments = storage.getDocuments();

    // First time user - don't auto-initialize, let them go through onboarding
    if (!profile) {
      setCurrentView('welcome');
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
    setDocuments(savedDocuments);
    setIsInitialized(true);
  }, []);


useEffect(() => {
  if (!isInitialized || !userProfile) return;
  const now = new Date();

  // First-time build
  if (suggestions.length === 0) {
    let fullPool = buildSmartSuggestionPool(
      tasks,
      categories,
      userProfile,
      { includeHiddenCategories: false }
    );

    // -----------------------------------------------------
    // DEMO MODE — FORCE FIRST 4 SMART SUGGESTIONS
    // -----------------------------------------------------
    if (userProfile.demoMode) {
      const hero: Suggestion[] = [
        {
          id: "demo-hero-oil-change",
          title: "Oil change",
          categoryId: categories.find(c => c.name === "Vehicle")?.id ?? categories[0]?.id ?? "",
          message:
            "When was the last time you had your oil changed? Might be time to give the car a spa treatment.",
          type: "action",
          relevance: 100,
          dismissed: false,
          createdAt: now,
        },
        {
          id: "demo-hero-timing-belt",
          title: "Check timing belt",
          categoryId: categories.find(c => c.name === "Vehicle")?.id ?? categories[0]?.id ?? "",
          message:
            "If your vehicle is around 100,000 km or more, it’s a good time to check whether the timing belt has ever been replaced.",
          type: "tip",
          relevance: 99,
          dismissed: false,
          createdAt: now,
        },
        {
          id: "demo-hero-health-annual",
          title: "Annual health and dental check",
          categoryId: categories.find(c => c.name === "Health")?.id ?? categories[0]?.id ?? "",
          message:
            "Quick win: most people benefit from a yearly doctor visit and a regular dentist appointment — consider adding tasks to keep those on your radar.",
          type: "tip",
          relevance: 98,
          dismissed: false,
          createdAt: now,
        },
        {
          id: "demo-hero-warranty-quick-win",
          title: "Save receipt and serial for warranties",
          categoryId: categories.find(c => c.name === "Warranties")?.id ?? categories[0]?.id ?? "",
          message:
            "Quick win: whenever you buy an electronic device, snap a pic of the receipt and serial number and store it with the warranty — future you will thank you when something dies right before the warranty ends.",
          type: "action",
          relevance: 97,
          dismissed: false,
          createdAt: now,
        },
      ];

      // Optional: if the underlying pool ever contains text-duplicates of these,
      // you could filter them out by message, but safest is to just leave them.
      const combined = [...hero, ...shuffle(fullPool)];
      
      setSuggestions(combined.slice(0, 6));
      setSuggestionPool(combined.slice(6));
      return;
    }

    // ---------- Normal (non-demo) first-time path ----------
    const combined = shuffle(fullPool);
    setSuggestions(combined.slice(0, 6));
    setSuggestionPool(combined.slice(6));
    return;
  }

  // -----------------------------------------------------
  // Top up to 6 suggestions (demo + normal)
  // -----------------------------------------------------
  if (suggestions.length < 6) {
    const needed = 6 - suggestions.length;

    let refill = suggestionPool.slice(0, needed);
    let newPool = suggestionPool.slice(needed);

    if (refill.length < needed) {
      // Pool ran out → rebuild and EXPAND to include hidden categories
      const rebuiltFullPool = buildSmartSuggestionPool(
        tasks,
        categories,
        userProfile,
        { includeHiddenCategories: true }
      );

      const rebuiltShuffled = shuffle(rebuiltFullPool);

      const extraNeeded = needed - refill.length;
      refill = [...refill, ...rebuiltShuffled.slice(0, extraNeeded)];
      newPool = rebuiltShuffled.slice(extraNeeded);
    }

    setSuggestions([...suggestions, ...refill]);
    setSuggestionPool(newPool);
  }
}, [
  tasks,
  categories,
  userProfile,
  suggestionPool,
  suggestions,
  isInitialized,
]);

  // ---------------------------------------------------------------------------
  // Daily reminder notification (toast-based)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!userProfile?.notificationsEnabled || !userProfile.dailyReminderTime) {
      return;
    }

    // Build a list of *other* notifications from task reminders
    const notificationsForTasks = tasks.flatMap((task) =>
      (task.reminders ?? [])
        .filter((r) => r.enabled && r.time)
        .map((r) => ({ time: r.time }))
    );

    const today = new Date();

    // If there's *any* other notification scheduled today, skip the daily nudge
    if (hasNotificationOnDate(notificationsForTasks, today)) {
      return;
    }

    // Parse "HH:MM" from userProfile.dailyReminderTime (24h stored from Settings)
    const [hourStr, minuteStr] = userProfile.dailyReminderTime.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return;
    }

    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(hour, minute, 0, 0);

    // If today's time has already passed, schedule for tomorrow instead
    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 1);
    }

    const delay = scheduled.getTime() - now.getTime();

    const timeoutId = window.setTimeout(() => {
      // Re-check right before firing: if tasks now have notifications today, bail out
      const stillHasOtherNotifications = hasNotificationOnDate(
        notificationsForTasks,
        new Date()
      );
      if (stillHasOtherNotifications) return;

      const message = getRandomDailyReminderMessage(
        suggestions // uses suggestion.message, ignores dismissed ones
      );

      toast(message);
    }, delay);

    // Clear timeout if dependencies change (time, tasks, suggestions, toggle)
    return () => window.clearTimeout(timeoutId);
  }, [
    userProfile?.notificationsEnabled,
    userProfile?.dailyReminderTime,
    tasks,
    suggestions,
  ]);

  const handleOnboardingComplete = (data: {
    preferredCategories: string[];
    age?: string;
    gender?: string;
  }) => {
    const hiddenCategoryNames = DEFAULT_CATEGORIES
      .map((c) => c.name)
      .filter((name) => !data.preferredCategories.includes(name));

    const profile: UserProfile = {
      preferredCategories: data.preferredCategories,
      hiddenCategories: hiddenCategoryNames,
      age: data.age,
      gender: data.gender,
      hasCompletedOnboarding: true,
      calendarIntegration: true,
      notificationsEnabled: true,
      demoMode: false,
    };

    // Initialize ALL predefined categories
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

  const DEMO_CATEGORY_NAMES = ["Subscriptions", "Health", "Warranties", "Vehicle"];

  const DEMO_HIDDEN_CATEGORY_NAMES = DEFAULT_CATEGORIES
  .map((c) => c.name)
  .filter((name) => !DEMO_CATEGORY_NAMES.includes(name));

  // ---------------------------------------------------------------------------
  // Demo mode from onboarding button
  // ---------------------------------------------------------------------------
  const handleDemoMode = () => {
    const initialCategories = DEFAULT_CATEGORIES.map((cat, index) => ({
      ...cat,
      id: `category-${Date.now()}-${index}`,
    }));

    const profile: UserProfile = {
      preferredCategories: DEMO_CATEGORY_NAMES,
      hiddenCategories: DEMO_HIDDEN_CATEGORY_NAMES,
      hasCompletedOnboarding: true,
      calendarIntegration: true,
      notificationsEnabled: true,
      demoMode: true,
    };

    const demoTasks = generateDemoTasks(initialCategories);

    setUserProfile(profile);
    setCategories(initialCategories);
    setTasks(demoTasks);
    storage.saveUserProfile(profile);
    storage.saveCategories(initialCategories);
    storage.saveTasks(demoTasks);

    // Navigate to dashboard
    setCurrentView("dashboard");
    toast.success("Welcome to Demo Mode!");
  };

  // ---------------------------------------------------------------------------
  // Demo mode toggle in settings
  // ---------------------------------------------------------------------------
  const handleToggleDemoMode = (enabled: boolean) => {
    if (!userProfile && !enabled) {
      setCurrentView("onboarding");
      return;
    }

    if (enabled) {
      // --- TURNING DEMO MODE ON ---
      const allCategories = DEFAULT_CATEGORIES.map((cat, index) => ({
        ...cat,
        id: `category-${Date.now()}-${index}`,
      }));

      const updatedProfile: UserProfile = {
        ...userProfile!,
        demoMode: true,
        preferredCategories: DEMO_CATEGORY_NAMES,
        hiddenCategories: DEMO_HIDDEN_CATEGORY_NAMES,
      };

      const demoTasks = generateDemoTasks(allCategories);

      setUserProfile(updatedProfile);
      setCategories(allCategories);
      setTasks(demoTasks);
      storage.saveUserProfile(updatedProfile);
      storage.saveCategories(allCategories);
      storage.saveTasks(demoTasks);

      setSuggestions([]);        // let demo logic rebuild them
      setSuggestionPool([]);
      setCurrentView("dashboard");
      toast.success("Demo mode enabled! Sample tasks loaded.");
    } else {
      // --- TURNING DEMO MODE OFF ---
      // Treat this like a brand-new install
      localStorage.clear();

      setUserProfile(null);
      setCategories([]);
      setTasks([]);
      setSuggestionPool([]);
      setTemplates([]);
      setDocuments([]);

      // We’re already initialized (app shell is up), just move to onboarding
      setCurrentView("onboarding");
      toast.success("Demo mode disabled. Let’s set things up for you!");
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

  const dismissSuggestion = (id: string) => {
    const updated = suggestions.filter(s => s.id !== id);
    setSuggestions(updated);
  };

  const snoozeSuggestion = (id: string) => {
    const updated = suggestions.filter(s => s.id !== id);
    setSuggestions(updated);
  };
  const handleDismissSuggestion = (
    id: string,
    options?: { temporary?: boolean }
  ) => {
    if (options?.temporary) {
      // snooze: remove it from the visible 6, but don’t permanently kill it
      const updated = suggestions.filter((s) => s.id !== id);
      setSuggestions(updated);
      // the effect that keeps count at 6 will refill
    } else {
      // hard dismiss: same behavior for now (we’re not doing permanent removal yet)
      const updated = suggestions.filter((s) => s.id !== id);
      setSuggestions(updated);
    }
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
    // setShowModeDialog(true);
    setCurrentView("pre-add-task");
  };

  const handleModeSelected = (
    mode: "quick" | "template" | "create-template" | "document-upload"
  ) => {
    setPreviousView(currentView);
    if (mode === "quick") {
      // Go directly to TaskForm (start from scratch)
      setCurrentView("add-task");
    } else if (mode === "document-upload") {
      setCurrentView("add-document-upload");
    } else if (mode === "template") {
      // Open template selection dialog
      // setShowTemplateDialog(true);
      setCurrentView("select-template");
    } else {
      // Create new template
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

  const handleCreateTaskFromUpload = (taskData: Omit<Task, "id" | "createdAt">): string => {
    const newID = `task-${Date.now()}`;
    const newTask: Task = {
      ...taskData,
      id: newID,
      createdAt: new Date(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    toast.success("Task created from document");
    setSelectedTaskId(newID);
    setCurrentView("edit-task"); // navigate to edit view
    return newID;
  };

  const handleSaveDocumentAsTask = (taskId: string, attachment: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
      toast.error("Task not found");
      return;
    }
    const updatedTask: Task = {
      ...task,
      attachments: [
        ...(task.attachments || []),
        {
          id: `att-${Date.now()}`,
          uri: attachment,
          fileName: "attachment",
          addedAt: new Date(),
        },
      ],
    };
    const updatedTasks = tasks.map((t) => (t.id === taskId ? updatedTask : t));
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    toast.success("Document saved to task");
    setSelectedTaskId(taskId);
    setCurrentView("edit-task");
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

  const createTaskFromSuggestion = (s: Suggestion) => {
    const title = s.title;
    const description = s.message;
    const categoryId = s.categoryId ?? categories[0]?.id ?? "";

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title,
      description: description,
      categoryId: categoryId,
      notes: "",
      attachments: [],
      reminders: [],
      completed: false,
      date: new Date(),
      createdAt: new Date(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);

    const updatedSuggestions = suggestions.map((sg) =>
      sg.id === s.id ? { ...sg, dismissed: true } : sg
    );
    setSuggestions(updatedSuggestions);
    storage.saveSuggestions(updatedSuggestions);


    setSelectedTaskId(newTask.id);
    setCurrentView("edit-task");
  }

  const createTemplateFromSuggestion = (s: Suggestion) => {
    const title = s.title;
    const description = s.message;
    const categoryId = s.categoryId ?? categories[0]?.id ?? "";

    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: s.title,
      categoryId,
      title: s.title,
      description: s.message,
      notes: "",
      reminders: [],
      isPreset: false,
      createdAt: new Date(),
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    storage.saveTemplates(updatedTemplates);

    const updatedSuggestions = suggestions.map((sg) =>
      sg.id === s.id ? { ...sg, dismissed: true } : sg
    );
    setSuggestions(updatedSuggestions);
    storage.saveSuggestions(updatedSuggestions);

    setSelectedTemplateId(newTemplate.id);
    setCurrentView("edit-template");
  }

  // Wait for initialization to complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <img
            src="logo.webp"
            width={"35px"}
            className="mx-auto mb-4 animate-pulse"
          />
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
  // if (!userProfile?.hasCompletedOnboarding) {
  //   return <Onboarding onComplete={handleOnboardingComplete} onDemoMode={handleDemoMode} />;
  // }
  // --- Welcome Screen ---
  if (currentView === 'welcome') {
    return (
      <WelcomePage
        onGetStarted={() => setCurrentView('onboarding')}
        onDemoMode={handleDemoMode}
      />
    );
  }

  if (currentView === 'onboarding') {
    return (
      <Onboarding
        onComplete={(data) => {
          handleOnboardingComplete(data);
          // setCurrentView('dashboard'); // go to dashboard after onboarding
          setCurrentView('loading') // go to a loading screen that lasts 2 seconds before dashboard
        }}
        onDemoMode={handleDemoMode}
      />
    );
  }

  // Check if we're on a main view (for bottom nav)
  // const isMainView = [
  //   "dashboard",
  //   "categories",
  //   "category",
  //   "settings",
  //   "reminders",
  // ].includes(currentView);
  const isMainView = true;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Toaster
        position="top-center"
        style={{ top: "calc(var(--safe-area-inset-top)" }}
      />

      {/* Mobile Header */}
      {/* <header
        className="sticky top-0 z-50 bg-white border-b shadow-sm"
        style={{ paddingTop: "var(--safe-area-inset-top)" }}
      >
        <div className="px-4 pb-4">
          <div className="flex items-center justify-center">
            <h2 className="text-primary text-3xl relative">
              <Sparkles className="absolute -left-10 top-1/2 -translate-y-1/2 h-8 w-8 text-[#312E81]" />
              OnTrack
            </h2>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main
        className="px-4 max-w-2xl mx-auto"
        style={{ paddingBottom: "calc(var(--safe-area-inset-bottom) + 100px)", paddingTop: "calc(var(--safe-area-inset-top) + 15px)" }}
      >
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
            onCreateTaskFromSuggestion={createTaskFromSuggestion}
            onCreateTemplateFromSuggestion={createTemplateFromSuggestion}
          />
        )}

        {currentView === "categories" && userProfile && (
          <CategoryTab
            userProfile={userProfile}
            tasks={tasks}
            categories={categories}
            setSelectedCategoryId={setSelectedCategoryId}
            setCurrentView={setCurrentView}
            navigateToCategory={navigateToCategory}
          />
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
                : navigateToPreviousView();
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
        {currentView === "add-document-upload" && (
          <UploadDocumentForm
            task={selectedTask}
            categories={categories}
            onCreateTask={handleCreateTaskFromUpload}
            onSaveAsTask={handleSaveDocumentAsTask}
            onCancel={navigateToDashboard}
            onDelete={handleDeleteTask}
            onNavigateToTasks={navigateToEditTask}
          />
        )}


        {currentView === "edit-task" && selectedTask && (
          <TaskForm
            task={selectedTask}
            categories={categories}
            onSave={handleEditTask}
            onCancel={navigateToDashboard}
            onDelete={handleDeleteTask}
            onChangeToCamera={handleModeSelected}
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

        {/* Template Selection Dialog */}
        {currentView === "select-template" && (
          <TemplateSelectionDialog
            open={showTemplateDialog}
            onOpenChange={setShowTemplateDialog}
            categories={categories}
            customTemplates={templates}
            onSelectTemplate={handleTemplateSelected}
            onDeleteTemplate={handleDeleteTemplate}
            onCancel={navigateToPreviousView}
          />
        )}

        {currentView === "pre-add-task" && (
          <TaskCreationModeDialog
            open={showModeDialog}
            onOpenChange={setShowModeDialog}
            onSelectMode={handleModeSelected}
            onCancel={navigateToDashboard}
          />
        )}
      </main>

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
      {/* {currentView === "pre-add-task" && (
        <TaskCreationModeDialog
          open={showModeDialog}
          onOpenChange={setShowModeDialog}
          onSelectMode={handleModeSelected}
          onCancel={navigateToDashboard}
        />
      )} */}

      {/* Template Selection Dialog
      {currentView === "select-template" && (
        <TemplateSelectionDialog
          open={showTemplateDialog}
          onOpenChange={setShowTemplateDialog}
          categories={categories}
          customTemplates={templates}
          onSelectTemplate={handleTemplateSelected}
          onDeleteTemplate={handleDeleteTemplate}
        />
      )} */}

      {/* Bottom Navigation */}
      {isMainView && (
        <nav
          className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20"
          style={{ paddingBottom: "var(--safe-area-inset-bottom)" }}
        >
          <div className="grid grid-cols-4 max-w-2xl mx-auto">
            <button
              onClick={navigateToDashboard}
              className={`flex flex-col items-center justify-center pt-3 transition-colors ${
                currentView === "dashboard" ? "text-primary" : "text-gray-400"
              }`}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={navigateToCategories}
              className={`flex flex-col items-center justify-center pt-3 transition-colors ${
                currentView === "categories" ? "text-primary" : "text-gray-400"
              }`}
            >
              <List className="h-6 w-6" />
              <span className="text-xs">Categories</span>
            </button>
            <button
              onClick={navigateToReminders}
              className={`flex flex-col items-center justify-center pt-3 transition-colors ${
                currentView === "reminders" ? "text-primary" : "text-gray-400"
              }`}
            >
              <Bell className="h-6 w-6" />
              <span className="text-xs">Reminders</span>
            </button>

            <button
              onClick={navigateToSettings}
              className={`flex flex-col items-center justify-center pt-3 transition-colors ${
                currentView === "settings" ? "text-primary" : "text-gray-400"
              }`}
            >
              <SettingsIcon className="h-6 w-6" />
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
      {/* {currentView === "pre-add-task" && (
        <TaskCreationModeDialog
          open={showModeDialog}
          onOpenChange={setShowModeDialog}
          onSelectMode={handleModeSelected}
          onCancel={navigateToDashboard}
        />
      )} */}

      {/* Template Selection Dialog
      {currentView === "select-template" && (
        <TemplateSelectionDialog
          open={showTemplateDialog}
          onOpenChange={setShowTemplateDialog}
          categories={categories}
          customTemplates={templates}
          onSelectTemplate={handleTemplateSelected}
          onDeleteTemplate={handleDeleteTemplate}
        />
      )} */}
    </div>
  );
}
