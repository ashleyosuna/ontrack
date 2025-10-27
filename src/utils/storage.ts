import { Category, Task, Suggestion, UserProfile } from '../types';

const STORAGE_KEYS = {
  CATEGORIES: 'ontrack_categories',
  TASKS: 'ontrack_tasks',
  SUGGESTIONS: 'ontrack_suggestions',
  USER_PROFILE: 'ontrack_user_profile',
};

export const storage = {
  // Categories
  getCategories: (): Category[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
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
};
