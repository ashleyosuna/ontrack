export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom: boolean;
}

export interface Reminder {
  id: string;
  time: Date;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  categoryId: string;
  attachments: string[];
  completed: boolean;
  notes: string;
  reminders: Reminder[];
  createdAt: Date;
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

export interface UserProfile {
  trackedCategories: string[];
  age?: string;
  gender?: string;
  hasCompletedOnboarding: boolean;
  calendarIntegration: boolean;
  notificationsEnabled: boolean;
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Home Maintenance', icon: '🏠', color: '#93C5FD', isCustom: false },
  { name: 'Health', icon: '❤️', color: '#FCA5A5', isCustom: false },
  { name: 'Taxes & Finance', icon: '💰', color: '#FCD34D', isCustom: false },
  { name: 'Subscriptions', icon: '📱', color: '#A78BFA', isCustom: false },
  { name: 'Warranties', icon: '🛡️', color: '#6EE7B7', isCustom: false },
  { name: 'Travel', icon: '✈️', color: '#67E8F9', isCustom: false },
  { name: 'Vehicle', icon: '🚗', color: '#FB923C', isCustom: false },
  { name: 'Insurance', icon: '📋', color: '#94A3B8', isCustom: false },
  { name: 'Personal', icon: '⭐', color: '#F9A8D4', isCustom: false },
];