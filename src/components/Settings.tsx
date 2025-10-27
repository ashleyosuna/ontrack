import { useState } from 'react';
import { Category, UserProfile } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../types';
import { Separator } from './ui/separator';

interface SettingsProps {
  categories: Category[];
  userProfile: UserProfile;
  onBack: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export function Settings({
  categories,
  userProfile,
  onBack,
  onUpdateProfile,
  onAddCategory,
  onDeleteCategory,
}: SettingsProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');

  const customCategories = categories.filter((c) => c.isCustom);
  const predefinedCategories = categories.filter((c) => !c.isCustom);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    onAddCategory({
      name: newCategoryName.trim(),
      icon: newCategoryIcon || '📌',
      color: '#3B82F6',
      isCustom: true,
    });

    setNewCategoryName('');
    setNewCategoryIcon('');
  };

  return (
    <div className="space-y-5">
      {/* Header - Remove back button on mobile settings */}
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your preferences</p>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-5">
        <h3>Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>Calendar Sync</Label>
              <p className="text-xs text-muted-foreground">
                Import events from calendar
              </p>
            </div>
            <Switch
              checked={userProfile.calendarIntegration}
              onCheckedChange={(checked) =>
                onUpdateProfile({
                  ...userProfile,
                  calendarIntegration: checked,
                })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Get reminders and tips
              </p>
            </div>
            <Switch
              checked={userProfile.notificationsEnabled}
              onCheckedChange={(checked) =>
                onUpdateProfile({
                  ...userProfile,
                  notificationsEnabled: checked,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Manage Categories */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3>Manage Categories</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Add or remove categories as needed
          </p>
        </div>
        
        {/* Predefined Categories */}
        {predefinedCategories.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm">Predefined Categories</h4>
            {predefinedCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 rounded-xl border"
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="flex-1 text-sm">{category.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Separator />

        {/* Custom Categories */}
        {customCategories.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm">Custom Categories</h4>
            {customCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 rounded-xl border"
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="flex-1 text-sm">{category.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {customCategories.length > 0 && <Separator />}

        {/* Add New Category */}
        <div className="space-y-2">
          <Label className="text-sm">Add Category</Label>
          <div className="flex gap-2">
            <Input
              value={newCategoryIcon}
              onChange={(e) => setNewCategoryIcon(e.target.value)}
              placeholder="📌"
              className="w-16 text-center text-xl h-12"
              maxLength={2}
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

      {/* Data & Privacy */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3>Data & Privacy</h3>
          <p className="text-xs text-muted-foreground mt-1">
            All data is stored locally on your device
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Button variant="outline" className="w-full h-12">
            Export Data
          </Button>
          <Button variant="outline" className="w-full h-12">
            Import Data
          </Button>
          <Button variant="destructive" className="w-full h-12">
            Clear All Data
          </Button>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h4 className="mb-1">About OnTrack</h4>
        <p className="text-xs text-muted-foreground">
          Version 1.0.0 • Privacy-focused life admin
        </p>
      </div>
    </div>
  );
}
