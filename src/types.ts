// src/types.ts

// ----- Core domain types -----
export type Category = {
  id: string;
  name: string;
  icon?: string;      // e.g., "calendar", "bell", "file-text"
  color?: string;     // e.g., Tailwind token or hex
  isCustom?: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;      // link to Category.id
  dueDate?: string;         // ISO string
  completed?: boolean;
  createdAt: Date;
};

export type Suggestion = {
  id: string;
  message: string;
  dismissed: boolean;
};

export type UserProfile = {
  notificationsEnabled: boolean;
  calendarIntegration: boolean;
  trackedCategories: string[]; // names or ids your UI prefers
};

// ----- Defaults used by Onboarding / seed data -----
export const DEFAULT_CATEGORIES: Array<Pick<Category, "name" | "icon" | "color">> = [
  { name: "School",  icon: "graduation-cap", color: "indigo" },
  { name: "Health",  icon: "heart",          color: "rose"   },
  { name: "Finance", icon: "wallet",         color: "emerald"},
  { name: "Work",    icon: "briefcase",      color: "amber"  },
];
