import { Category, Task, Suggestion, UserProfile, Template } from '../types';

const STORAGE_KEYS = {
  CATEGORIES: 'ontrack_categories',
  TASKS: 'ontrack_tasks',
  SUGGESTIONS: 'ontrack_suggestions',
  USER_PROFILE: 'ontrack_user_profile',
  TEMPLATES: 'ontrack_templates',
};

// Migration map to fix emoji icons to proper icon names
const EMOJI_TO_ICON_MAP: Record<string, string> = {
  '🏠': 'Home',
  '❤️': 'Heart',
  '💰': 'DollarSign',
  '📱': 'Smartphone',
  '🛡️': 'Shield',
  '✈️': 'Plane',
  '🚗': 'Car',
  '📄': 'FileText',
  '📃': 'FileText',
  '📝': 'FileText',
  '📋': 'FileText',
  '⭐': 'Star',
};

export const storage = {
  // Categories
  getCategories: (): Category[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!data) return [];
    
    const categories = JSON.parse(data);
    
    // Migrate emoji icons to proper icon names
    const migratedCategories = categories.map((cat: Category) => {
      const originalIcon = cat.icon;
      const migratedIcon = EMOJI_TO_ICON_MAP[cat.icon] || cat.icon;
      
      // Debug logging
      if (cat.name === 'Insurance') {
        console.log('Insurance icon before migration:', originalIcon);
        console.log('Insurance icon after migration:', migratedIcon);
      }
      
      return {
        ...cat,
        icon: migratedIcon,
      };
    });
    
    return migratedCategories;
  },
  saveCategories: (categories: Category[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  // Tasks
  getTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!data) return [];
    return JSON.parse(data).map((task: any) => ({
      ...task,
      date: new Date(task.date),
      createdAt: new Date(task.createdAt),
      reminders: (task.reminders || []).map((reminder: any) => ({
        ...reminder,
        time: new Date(reminder.time),
      })),
    }));
  },
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  // Suggestions
  getSuggestions: (): Suggestion[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SUGGESTIONS);
    if (!data) return [];
    return JSON.parse(data).map((suggestion: any) => ({
      ...suggestion,
      createdAt: new Date(suggestion.createdAt),
    }));
  },
  saveSuggestions: (suggestions: Suggestion[]) => {
    localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(suggestions));
  },

  // User Profile
  getUserProfile: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  },
  saveUserProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  // Templates
  getTemplates: (): Template[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!data) return [];
    return JSON.parse(data).map((template: any) => ({
      ...template,
      createdAt: new Date(template.createdAt),
      reminders: (template.reminders || []).map((reminder: any) => ({
        ...reminder,
        time: new Date(reminder.time),
      })),
    }));
  },
  saveTemplates: (templates: Template[]) => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  },
};