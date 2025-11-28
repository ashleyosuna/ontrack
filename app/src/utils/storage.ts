import { Category, Document, Task, Suggestion, UserProfile, Template } from '../types';
import { Filesystem, Directory } from '@capacitor/filesystem';

const STORAGE_KEYS = {
  CATEGORIES: 'ontrack_categories',
  TASKS: 'ontrack_tasks',
  SUGGESTIONS: 'ontrack_suggestions',
  USER_PROFILE: 'ontrack_user_profile',
  TEMPLATES: 'ontrack_templates',
  DOCUMENTS: 'ontract_documents'
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
  getDocuments: (): Document[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
  },
  saveDocuments: (documents: Document[]) => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  },
  async persistAttachment(dataUrl: string): Promise<string> {
    // dataUrl format: data:<mime>;base64,<payload>
    const [, metaAndBase64] = dataUrl.split("data:");
    if (!metaAndBase64) throw new Error("Invalid data URL");
    const [meta, base64] = metaAndBase64.split(",");
    const ext = (meta.match(/image\/(\w+)/)?.[1]) ||
                (meta.includes("pdf") ? "pdf" : "bin");
    const fileName = `doc_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Data, // sandboxed app container
    });

    return fileName; // store this in task.attachments
  },
  async readAttachment(path: string, mimeType?: string): Promise<string> {
    const result = await Filesystem.readFile({
      path,
      directory: Directory.Data,
    });
    const mt = mimeType || this.guessMimeFromPath(path) || "application/octet-stream";
    return `data:${mt};base64,${result.data}`;
  },
  guessMimeFromPath(path: string): string | undefined {
    const ext = path.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "png": return "image/png";
      case "jpg":
      case "jpeg": return "image/jpeg";
      case "gif": return "image/gif";
      case "pdf": return "application/pdf";
      case "txt": return "text/plain";
      case "md": return "text/markdown";
      case "json": return "application/json";
      default: return undefined;
    }
  },
};