import { useState, useRef, useEffect } from 'react';
import { Category, UserProfile, Template } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, Trash2, FileText, Edit } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../types';
import { Separator } from './ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
// import { format } from 'path';

interface SettingsProps {
  categories: Category[];
  userProfile: UserProfile;
  onBack: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onDeleteCategory: (categoryId: string) => void;
  tasks: { id: string; categoryId: string; completed: boolean }[];
  onToggleDemoMode: (enabled: boolean) => void;
  templates: Template[];
  onEditTemplate: (templateId: string) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export function Settings({
  categories,
  userProfile,
  onBack,
  onUpdateProfile,
  onAddCategory,
  onDeleteCategory,
  tasks,
  onToggleDemoMode,
  templates,
  onEditTemplate,
  onDeleteTemplate,
}: SettingsProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showDemoModeDialog, setShowDemoModeDialog] = useState(false);

  const customCategories = categories.filter((c) => c.isCustom);
  const predefinedCategories = categories.filter((c) => !c.isCustom);

  // Split categories into visible and hidden
  const visibleCategories = [...predefinedCategories, ...customCategories].filter(
    (c) => !userProfile.hiddenCategories.includes(c.name)
  );
  
  const hiddenCategories = [...predefinedCategories, ...customCategories].filter(
    (c) => userProfile.hiddenCategories.includes(c.name)
  );

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    onAddCategory({
      name: newCategoryName.trim(),
      icon: newCategoryIcon || 'Star',
      color: '#3B82F6',
      isCustom: true,
    });

    setNewCategoryName('');
    setNewCategoryIcon('');
  };

  const handleHideCategory = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    if (!category) return;

    // Check if there are tasks associated with this category
    const categoryTasks = tasks.filter((t) => t.categoryId === category.id);
    const hasUnfinishedTasks = categoryTasks.some((t) => !t.completed);

    if (hasUnfinishedTasks) {
      // Show confirmation dialog
      setCategoryToDelete({ id: category.id, name: category.name });
      return;
    }

    // Add to hidden categories
    onUpdateProfile({
      ...userProfile,
      hiddenCategories: [...userProfile.hiddenCategories, categoryName],
    });
  };

  const handleDeleteCustomCategory = (categoryId: string, categoryName: string) => {
    // Check if there are tasks associated with this category
    const categoryTasks = tasks.filter((t) => t.categoryId === categoryId);
    const hasUnfinishedTasks = categoryTasks.some((t) => !t.completed);

    if (hasUnfinishedTasks) {
      // Show confirmation dialog
      setCategoryToDelete({ id: categoryId, name: categoryName });
      return;
    }

    onDeleteCategory(categoryId);
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;

    const category = categories.find((c) => c.id === categoryToDelete.id);
    
    if (category && !category.isCustom) {
      // For predefined categories, just hide them
      onUpdateProfile({
        ...userProfile,
        hiddenCategories: [...userProfile.hiddenCategories, category.name],
      });
    } else {
      // For custom categories, delete completely
      onDeleteCategory(categoryToDelete.id);
    }

    setCategoryToDelete(null);
  };

  const handleShowCategory = (categoryName: string) => {
    // Remove from hidden categories
    onUpdateProfile({
      ...userProfile,
      hiddenCategories: userProfile.hiddenCategories.filter((name) => name !== categoryName),
    });
  };

  const handleDemoModeToggle = (checked: boolean) => {
    if (checked) {
      // Show confirmation dialog when turning ON
      setShowDemoModeDialog(true);
    } else {
      // Directly turn off when disabling
      onToggleDemoMode(false);
    }
  };

  const confirmDemoMode = () => {
    setShowDemoModeDialog(false);
    onToggleDemoMode(true);
  };

  const customTemplates = templates.filter(t => !t.isPreset);
  // CSV conversion helper -> transforms every value into a csv compatible string
  const csvEscape = (value: any) => {
    if (value == null) return "";
    const s = String(value);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  // transforms the value into a compatible Date format 
  const toDate = (value: any): Date | null => {
    if(!value) return null;
    if(value instanceof Date) return value;
    const dateInst = new Date(value);
    return isNaN(dateInst.getTime()) ? null : dateInst;
  };

  const formatDateForCSV = (date: Date | null) => {
    if(!date) return "";

    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    
    return `${mm}/${dd}/${yyyy}`;
    
  }

  const formatTimeForCSV = (date: Date | null) => {
    if(!date) return "";
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  }
  const isAllDayEvent = (date: Date |null) => {
    if(!date) return false;
    return date.getHours() === 0 && date.getMinutes() === 0;
  }

  const exportTasksToGoogleCalendarCSV = (taskList: any[]) => {
    if(!taskList || taskList.length === 0){
      alert("No tasks to export to CSV");
      return;
    }
    const headers = [
      "Subject", 
      "Start Date", 
      "Start Time", 
      "End Date", 
      "End Time", 
      "All Day Event", 
      "Description", 
      "Location", 
      "Private",
    ];
    const rows = taskList.map((task) => {
      const title = task.title ?? task.name ?? "Task";
      const description = (task.description ?? task.notes ?? "").toString().replace(/\r?\n/g, " ");
      const start = toDate(task.startDate ?? task.start ?? task.date ?? task.due ?? task.dueDate ?? task.createdAt);
      const end = toDate(task.endDate ?? task.end ?? null) ?? start;
      const allDay = isAllDayEvent(start);
      const startDate = formatDateForCSV(start);
      const endDate = formatDateForCSV(end);
      const startTime = allDay ? "" : formatTimeForCSV(start);
      const endTime = allDay ? "" : formatTimeForCSV(end);
      const location = task.location ?? "";

      return [
        csvEscape(title),
        startDate, 
        startTime, 
        endDate, 
        endTime, 
        allDay ? "True" : "False", 
        csvEscape(description),
        csvEscape(location),
        task.private ? "True" : "False",
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ontrack-tasks-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  //const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
  const GOOGLE_CLIENT_ID = (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID) || "YOUR_GOOGLE_CLIENT_ID";
  const tokenClientRef = useRef<any | null>(null);
  const [hasGoogleToken, setHasGoogleToken] = useState<boolean>(() => !!localStorage.getItem("google_access_token"));
  
  const loadGsi = () => 
    new Promise<void>((resolve) =>{
      if((window as any).google) return resolve();
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload  = () => resolve();
      document.head.appendChild(script);
    });

  const initTokenClient = async () => {
    await loadGsi();
    if(!(window as any).google) throw new Error("gsi client not available");
    if(!tokenClientRef.current){
      tokenClientRef.current = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID, 
        scope: "https://www.googleapis.com/auth/calendar.events", 
        callback: (resp:any) => {
          if(resp.error){
            console.error("google token error", resp);
            return;
          }
          localStorage.setItem("google_access_token", resp.access_token);
          setHasGoogleToken(true);
          onUpdateProfile({ ...userProfile, calendarIntegration: true});
        },
      });
    }
  };

  const requestGooglePermission = async () => {
    try {
      if(!tokenClientRef.current) await initTokenClient();
      tokenClientRef.current.requestAccessToken({ prompt: "consent"});

    }catch (err){
      console.error("requestGooglePermission failed", err);
    }
  };

  const disconnectGoogleCalendar = () => {
    localStorage.removeItem("google_access_token");
    tokenClientRef.current = null;
    setHasGoogleToken(false);
    onUpdateProfile({ ...userProfile, calendarIntegration: false});
  };
  // track state when changes made in other tabs  
  // useEffect(() => {
  //   const onStorage = (stEvent: StorageEvent)
  // })
  return (
    <div className="space-y-5">
      {/* Header - Remove back button on mobile settings */}
      <div>
        <h1 className="text-[#312E81] text-2xl font-bold">Settings</h1>
        <p className="text-[#4C4799] text-sm">Manage your preferences</p>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-5">
        <h3 className="text-[#312E81]">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-[#312E81]">Calendar Sync</Label>
              <p className="text-xs text-[#4C4799]">
                Import events from calendar
              </p>
            </div>
            <Switch
              checked={userProfile.calendarIntegration}
              onCheckedChange={(checked: any) =>
                onUpdateProfile({
                  ...userProfile,
                  calendarIntegration: checked,
                })
              }
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-[#312E81]"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-[#312E81]">Notifications</Label>
              <p className="text-xs text-[#4C4799]">
                Get reminders and tips
              </p>
            </div>
            <Switch
              checked={userProfile.notificationsEnabled}
              onCheckedChange={(checked: any) =>
                onUpdateProfile({
                  ...userProfile,
                  notificationsEnabled: checked,
                })
              }
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-[#312E81]"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-[#312E81]">Demo Mode</Label>
              <p className="text-xs text-[#4C4799]">
                Load sample tasks to explore features
              </p>
            </div>
            <Switch
              checked={userProfile.demoMode}
              onCheckedChange={handleDemoModeToggle}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-[#312E81]"
            />
          </div>
        </div>
      </div>

      {/* Manage Categories */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-[#312E81]">Manage Categories</h3>
          <p className="text-xs text-[#4C4799] mt-1">
            Add or remove categories as needed
          </p>
        </div>
        
        {/* Visible Categories */}
        {visibleCategories.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm text-[#312E81]">Visible Categories</h4>
            <p className="text-xs text-[#4C4799]">
              These categories appear on your dashboard
            </p>
            {visibleCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 rounded-xl border"
              >
                <CategoryIcon iconName={category.icon} size={24} color={category.color} />
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm text-[#312E81]">{category.name}</span>
                  {category.isCustom && (
                    <Badge variant="secondary" className="text-xs">Custom</Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => category.isCustom 
                    ? handleDeleteCustomCategory(category.id, category.name)
                    : handleHideCategory(category.name)
                  }
                  className="text-[#4C4799] hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {visibleCategories.length > 0 && hiddenCategories.length > 0 && <Separator />}

        {/* Hidden Categories */}
        {hiddenCategories.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm text-[#312E81]">Hidden Categories</h4>
            <p className="text-xs text-[#4C4799]">
              Click + to show these on your dashboard
            </p>
            {hiddenCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-dashed opacity-60"
              >
                <CategoryIcon iconName={category.icon} size={24} color={category.color} />
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm text-[#312E81]">{category.name}</span>
                  {category.isCustom && (
                    <Badge variant="secondary" className="text-xs">Custom</Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShowCategory(category.name)}
                  className="text-[#2C7A7B] hover:text-[#2C7A7B]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {(visibleCategories.length > 0 || hiddenCategories.length > 0) && <Separator />}

        {/* Add New Category */}
        <div className="space-y-2">
          <Label className="text-sm text-[#312E81]">Add Custom Category</Label>
          <p className="text-xs text-[#4C4799]">
            Available icons: Home, Heart, Star, Car, Plane, Shield, Calendar, ShoppingBag, Briefcase, Book, Dumbbell, Music, Camera, Coffee, Gift, Lightbulb, Users, Wrench, Package
          </p>
          <div className="flex gap-2">
            <Input
              value={newCategoryIcon}
              onChange={(e) => setNewCategoryIcon(e.target.value)}
              placeholder="Star"
              className="w-24 h-12"
            />
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1 h-12"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
            />
            <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()} size="icon" className="h-12 w-12 flex-shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Manage Templates */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-[#312E81]">My Templates</h3>
          <p className="text-xs text-[#4C4799] mt-1">
            Edit or delete your custom templates
          </p>
        </div>

        {customTemplates.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-2 text-[#4C4799] opacity-50" />
            <p className="text-sm text-[#4C4799] mb-1">No custom templates yet</p>
            <p className="text-xs text-[#4C4799]">
              Create a task and save it as a template, or use "Create Template" when adding a new task
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {customTemplates.map((template) => {
              const category = categories.find(c => c.id === template.categoryId);
              return (
                <div
                  key={template.id}
                  className="flex items-center gap-3 p-3 rounded-xl border"
                >
                  {category && (
                    <CategoryIcon iconName={category.icon} size={24} color={category.color} />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-[#312E81] truncate">{template.name}</h4>
                    <p className="text-xs text-[#4C4799] truncate">{category?.name}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditTemplate(template.id)}
                  >
                    <Edit className="h-4 w-4 text-[#2C7A7B]" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm(`Delete template "${template.name}"?`)) {
                        onDeleteTemplate(template.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Data & Privacy */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-[#312E81]">Data & Privacy</h3>
          <p className="text-xs text-[#4C4799] mt-1">
            All data is stored locally on your device
          </p>
        </div>
        
        <Separator />
      
        <div className="space-y-2">
          <Button variant="outline" className="w-full h-12" onClick={() => exportTasksToGoogleCalendarCSV(tasks)}>
            Export Data
          </Button>
          <Button variant="outline" className="w-full h-12">
            Import Data
          </Button>
          <Button variant="destructive" className="w-full h-12">
            Clear All Data
          </Button>
        </div>
      <div className="space-y-2">
        {/*exports data in csv format for google calendar */}
        {!hasGoogleToken ? (
          <Button variant="outline" className="w-full h-12" onClick={requestGooglePermission}>
            Connect Google Calendar
          </Button>
        ) : (
          <div className="flex gap-2">
          <Button variant="outline" className="flex-1 h-12" onClick={() => alert("Google Calendar connected")}  >
            Google Connected
          </Button>
          <Button variant="ghost" className="h-12" onClick={disconnectGoogleCalendar}>
            Disconnect
          </Button>
          </div>
        )}

      </div>
      
    </div>


      {/* About */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h4 className="mb-1 text-[#312E81]">About OnTrack</h4>
        <p className="text-xs text-[#4C4799]">
          Version 1.0.0 • Privacy-focused life admin
        </p>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open: any) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? You currently have unfinished tasks in "{categoryToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-600">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-[#312E81] text-[#F8FAFC] hover:bg-[#4338CA]">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Demo Mode Confirmation Dialog */}
      <AlertDialog open={showDemoModeDialog} onOpenChange={setShowDemoModeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch to Demo Mode?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to switch to demo mode? All of your saved tasks will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-600">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDemoMode} className="bg-[#312E81] text-[#F8FAFC] hover:bg-[#4338CA]">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
