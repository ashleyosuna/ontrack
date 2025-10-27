"use client"

import { useMemo, useState } from "react"
import { Onboarding } from "@/components/Onboarding"
import { Settings } from "@/components/Settings"
import { TaskForm } from "@/components/TaskForm"
import { CategoryView } from "@/components/CategoryView"
import { Dashboard } from "@/components/Dashboard"

import {
  DEFAULT_CATEGORIES,
  type Category,
  type Suggestion,
  type Task,
  type UserProfile,
} from "@/types"

type View =
  | { name: "onboarding" }
  | { name: "dashboard" }
  | { name: "settings" }
  | { name: "category"; category: Category }
  | { name: "task-new"; defaultCategoryId?: string }
  | { name: "task-edit"; taskId: string }

export default function Page() {
  // ----- seed data ----------------------------------------------------------
  const [categories, setCategories] = useState<Category[]>(
    DEFAULT_CATEGORIES.map((c, i) => ({
      id: `cat-${i + 1}`,
      name: c.name,
      icon: c.icon,
      color: c.color,
      isCustom: false,
    }))
  )

  const [user, setUser] = useState<UserProfile>({
    notificationsEnabled: true,
    calendarIntegration: false,
    trackedCategories: categories.map((c) => c.name),
  })

  const [tasks, setTasks] = useState<Task[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "s-1",
      message: "Review important documents expiring soon.",
      dismissed: false,
    },
  ])

  const [view, setView] = useState<View>({ name: "onboarding" })

  // ----- derived helpers ----------------------------------------------------
  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c] as const)),
    [categories]
  )
  const upsertTask = (t: Omit<Task, "id" | "createdAt">, existingId?: string) => {
    if (existingId) {
      setTasks((prev) =>
        prev.map((x) => (x.id === existingId ? { ...x, ...t } : x))
      )
    } else {
      const id = `task-${Date.now()}`
      setTasks((prev) => [...prev, { ...t, id, createdAt: new Date() }])
    }
  }

  // ----- view handlers (navigation) ----------------------------------------
  const goDashboard = () => setView({ name: "dashboard" })
  const goSettings = () => setView({ name: "settings" })
  const goCategory = (categoryId: string) => {
    const cat = categoryById.get(categoryId)
    if (cat) setView({ name: "category", category: cat })
  }
  const goTaskNew = (defaultCategoryId?: string) =>
    setView({ name: "task-new", defaultCategoryId })
  const goTaskEdit = (taskId: string) => setView({ name: "task-edit", taskId })

  // ----- callbacks passed to children --------------------------------------
  // Onboarding
  const handleOnboardingComplete = (data: {
    trackedCategories: string[]
    age?: string
    gender?: string
  }) => {
    setUser((u) => ({ ...u, trackedCategories: data.trackedCategories }))
    goDashboard()
  }

  // Settings
  const handleUpdateProfile = (profile: UserProfile) => setUser(profile)
  const handleAddCategory = (c: Omit<Category, "id">) =>
    setCategories((prev) => [...prev, { ...c, id: `cat-${Date.now()}` }])
  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId))
    setTasks((prev) => prev.filter((t) => t.categoryId !== categoryId))
  }

  // Dashboard
  const handleToggleTask = (taskId: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    )
  const handleDismissSuggestion = (id: string) =>
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, dismissed: true } : s)))
  const handleSuggestionFeedback = (id: string, _fb: "more" | "less") => {
    // no-op stub; wire to analytics later if desired
  }

  // CategoryView
  const handleToggleTaskInCategory = (taskId: string) => handleToggleTask(taskId)

  // TaskForm
  const handleSaveTask = (payload: Omit<Task, "id" | "createdAt">, existingId?: string) => {
    upsertTask(payload, existingId)
    if (payload.categoryId) goCategory(payload.categoryId)
    else goDashboard()
  }
  const handleDeleteTask = (taskId: string) => {
    const deleted = tasks.find((t) => t.id === taskId)
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    if (deleted?.categoryId) goCategory(deleted.categoryId)
    else goDashboard()
  }

  // ----- render router ------------------------------------------------------
  return (
    <main className="min-h-screen bg-zinc-50 text-foreground dark:bg-black">
      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
        {view.name === "onboarding" && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}

        {view.name === "dashboard" && (
          <Dashboard
            tasks={tasks}
            categories={categories}
            suggestions={suggestions}
            onNavigateToCategory={(cid) => goCategory(cid)}
            onNavigateToAddTask={() => goTaskNew()}
            onToggleTask={handleToggleTask}
            onDismissSuggestion={handleDismissSuggestion}
            onSuggestionFeedback={handleSuggestionFeedback}
          />
        )}

        {view.name === "settings" && (
          <Settings
            categories={categories}
            userProfile={user}
            onBack={goDashboard}
            onUpdateProfile={handleUpdateProfile}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {view.name === "category" && (
          <CategoryView
            category={view.category}
            tasks={tasks.filter((t) => t.categoryId === view.category.id)}
            onBack={goDashboard}
            onAddTask={() => goTaskNew(view.category.id)}
            onEditTask={(taskId) => goTaskEdit(taskId)}
            onToggleTask={handleToggleTaskInCategory}
          />
        )}

        {view.name === "task-new" && (
          <TaskForm
            categories={categories}
            onSave={(task) => handleSaveTask(task)}
            onCancel={goDashboard}
            defaultCategoryId={view.defaultCategoryId}
          />
        )}

        {view.name === "task-edit" && (() => {
          const task = tasks.find((t) => t.id === view.taskId)
          if (!task) return <div className="p-6">Task not found.</div>
          return (
            <TaskForm
              task={task}
              categories={categories}
              onSave={(updated) => handleSaveTask(updated, task.id)}
              onCancel={() =>
                task.categoryId ? goCategory(task.categoryId) : goDashboard()
              }
              onDelete={handleDeleteTask}
            />
          )
        })()}
      </div>
    </main>
  )
}
