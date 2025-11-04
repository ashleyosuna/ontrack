export interface Category {
  id: string;
  name: string;
  icon: string; // Icon name from lucide-react
  color: string;
  isCustom: boolean;
}

export interface Reminder {
  id: string;
  time: Date;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  enabled: boolean;
  customTimes?: Date[]; // For custom frequency with multiple times per day
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  categoryId: string;
  attachments: string[];
  completed: boolean;
  completedAt?: Date; // When the task was completed
  notes: string;
  reminders: Reminder[];
  createdAt: Date;
  previousCompletions?: Array<{ // History of when this recurring task was completed
    id: string;
    completedAt: Date;
    date: Date; // The original due date
  }>;
}

export interface Suggestion {
  id: string;
  message: string;
  type: 'reminder' | 'tip' | 'action';
  relatedTaskId?: string;
  relevance: number;
  feedback?: 'more' | 'less';
  dismissed: boolean;
  createdAt: Date;
}

export interface Template {
  id: string;
  name: string;
  categoryId: string;
  title: string;
  description: string;
  notes: string;
  reminders: Reminder[];
  isPreset: boolean; // true for predefined templates, false for user-created
  createdAt: Date;
}

export interface UserProfile {
  hiddenCategories: string[]; // Categories hidden by user in settings
  preferredCategories: string[]; // Categories selected in onboarding for suggestions
  age?: string;
  gender?: string;
  hasCompletedOnboarding: boolean;
  calendarIntegration: boolean;
  notificationsEnabled: boolean;
  demoMode: boolean;
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Home Maintenance', icon: 'Home', color: '#93C5FD', isCustom: false },
  { name: 'Health', icon: 'Heart', color: '#FCA5A5', isCustom: false },
  { name: 'Taxes & Finance', icon: 'DollarSign', color: '#FCD34D', isCustom: false },
  { name: 'Subscriptions', icon: 'Smartphone', color: '#A78BFA', isCustom: false },
  { name: 'Warranties', icon: 'Shield', color: '#6EE7B7', isCustom: false },
  { name: 'Travel', icon: 'Plane', color: '#67E8F9', isCustom: false },
  { name: 'Vehicle', icon: 'Car', color: '#FB923C', isCustom: false },
  { name: 'Insurance', icon: 'FileText', color: '#94A3B8', isCustom: false },
  { name: 'Personal', icon: 'Star', color: '#F9A8D4', isCustom: false },
];