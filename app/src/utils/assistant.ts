import { Task, Suggestion, Category } from '../types';

// Generate category-based suggestions when user has no tasks yet
export const generateCategoryBasedSuggestions = (categories: Category[], trackedCategories: string[]): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const now = new Date();
  const currentMonth = now.getMonth(); // 0 = January, 9 = October, etc.

  // Only generate ONE suggestion based on priority
  // Priority order: Seasonal > Health > Vehicle > Home > Others

  // Vehicle - Winter tire reminder (October-November in Northern hemisphere)
  if (trackedCategories.includes('Vehicle') && (currentMonth === 9 || currentMonth === 10)) {
    suggestions.push({
      id: 'suggestion-category-vehicle-winter',
      message: 'Winter is coming—have you checked or changed your tires?',
      type: 'tip',
      relevance: 10,
      dismissed: false,
      createdAt: now,
    });
  }

  // Health - Annual checkup reminder
  if (suggestions.length === 0 && trackedCategories.includes('Health')) {
    suggestions.push({
      id: 'suggestion-category-health-checkup',
      message: 'Stay healthy—schedule your annual physical exam and dental checkup',
      type: 'tip',
      relevance: 9,
      dismissed: false,
      createdAt: now,
    });
  }

  // Home Maintenance - HVAC filter (Fall/Winter)
  if (suggestions.length === 0 && trackedCategories.includes('Home Maintenance') && (currentMonth >= 8 || currentMonth <= 2)) {
    suggestions.push({
      id: 'suggestion-category-home-hvac',
      message: 'Check your HVAC filter—it should be replaced every 1-3 months',
      type: 'tip',
      relevance: 8,
      dismissed: false,
      createdAt: now,
    });
  }

  // Taxes & Finance - Tax season reminder (January-April)
  if (suggestions.length === 0 && trackedCategories.includes('Taxes & Finance') && (currentMonth >= 0 && currentMonth <= 3)) {
    suggestions.push({
      id: 'suggestion-category-tax-season',
      message: 'Tax season is here—start gathering your documents and receipts',
      type: 'action',
      relevance: 9,
      dismissed: false,
      createdAt: now,
    });
  }

  // Travel - Passport check
  if (suggestions.length === 0 && trackedCategories.includes('Travel')) {
    suggestions.push({
      id: 'suggestion-category-travel-passport',
      message: 'Planning to travel? Check your passport expiry—many countries require 6 months validity',
      type: 'tip',
      relevance: 8,
      dismissed: false,
      createdAt: now,
    });
  }

  // Subscriptions - Review subscriptions
  if (suggestions.length === 0 && trackedCategories.includes('Subscriptions')) {
    suggestions.push({
      id: 'suggestion-category-subscriptions-review',
      message: 'Review your subscriptions—are you using all of them?',
      type: 'action',
      relevance: 7,
      dismissed: false,
      createdAt: now,
    });
  }

  // Warranties - Document warranties
  if (suggestions.length === 0 && trackedCategories.includes('Warranties')) {
    suggestions.push({
      id: 'suggestion-category-warranties-organize',
      message: 'Keep track of your warranties—take photos and store them digitally',
      type: 'tip',
      relevance: 7,
      dismissed: false,
      createdAt: now,
    });
  }

  // Insurance - Annual review
  if (suggestions.length === 0 && trackedCategories.includes('Insurance')) {
    suggestions.push({
      id: 'suggestion-category-insurance-review',
      message: 'Review your insurance policies annually to ensure adequate coverage',
      type: 'tip',
      relevance: 8,
      dismissed: false,
      createdAt: now,
    });
  }

  // Personal - Generic organization tip
  if (suggestions.length === 0 && trackedCategories.includes('Personal')) {
    suggestions.push({
      id: 'suggestion-category-personal-organize',
      message: 'Start organizing—add your first task to stay on track',
      type: 'tip',
      relevance: 6,
      dismissed: false,
      createdAt: now,
    });
  }

  // Default fallback if no categories matched
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'suggestion-category-default',
      message: 'Welcome to OnTrack! Add your first task to get started',
      type: 'tip',
      relevance: 5,
      dismissed: false,
      createdAt: now,
    });
  }

  // Return only the first (highest priority) suggestion
  return suggestions.slice(0, 1);
};

export const generateSuggestions = (tasks: Task[], categories: Category[]): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const now = new Date();

  tasks.forEach((task) => {
    if (task.completed) return;

    const daysUntil = Math.ceil((task.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const category = categories.find((c) => c.id === task.categoryId);

    // Travel-related suggestions
    if (category?.name === 'Travel' && daysUntil > 0 && daysUntil <= 90) {
      if (task.title.toLowerCase().includes('japan') || task.title.toLowerCase().includes('travel')) {
        suggestions.push({
          id: `suggestion-${task.id}-passport`,
          message: `Your trip is in ${daysUntil} days—check your passport expiry, visa requirements, and travel insurance`,
          type: 'tip',
          relatedTaskId: task.id,
          relevance: daysUntil <= 30 ? 10 : 7,
          dismissed: false,
          createdAt: now,
        });
      }
    }

    // Health-related suggestions
    if (category?.name === 'Health') {
      const monthsSince = Math.floor(-daysUntil / 30);
      if (monthsSince >= 6 && task.title.toLowerCase().includes('dental')) {
        suggestions.push({
          id: `suggestion-${task.id}-dental`,
          message: "Time for your biannual dental checkup",
          type: 'reminder',
          relatedTaskId: task.id,
          relevance: 8,
          dismissed: false,
          createdAt: now,
        });
      }
    }

    // Subscription reminders
    if (category?.name === 'Subscriptions' && daysUntil >= -7 && daysUntil <= 7) {
      suggestions.push({
        id: `suggestion-${task.id}-subscription`,
        message: `Your ${task.title} is ${daysUntil > 0 ? 'renewing' : 'renewed'} soon—review if you still need it`,
        type: 'action',
        relatedTaskId: task.id,
        relevance: 9,
        dismissed: false,
        createdAt: now,
      });
    }

    // Warranty expiration
    if (category?.name === 'Warranties' && daysUntil > 0 && daysUntil <= 30) {
      suggestions.push({
        id: `suggestion-${task.id}-warranty`,
        message: `Warranty for ${task.title} expires in ${daysUntil} days—report any issues now`,
        type: 'reminder',
        relatedTaskId: task.id,
        relevance: 8,
        dismissed: false,
        createdAt: now,
      });
    }

    // Tax deadline
    if (category?.name === 'Taxes & Finance' && daysUntil > 0 && daysUntil <= 14) {
      suggestions.push({
        id: `suggestion-${task.id}-tax`,
        message: `Tax deadline approaching in ${daysUntil} days—gather your documents`,
        type: 'action',
        relatedTaskId: task.id,
        relevance: 10,
        dismissed: false,
        createdAt: now,
      });
    }

    // Home maintenance
    if (category?.name === 'Home Maintenance' && daysUntil >= -30 && daysUntil <= 0) {
      suggestions.push({
        id: `suggestion-${task.id}-maintenance`,
        message: `${task.title} maintenance is due—schedule it before issues arise`,
        type: 'reminder',
        relatedTaskId: task.id,
        relevance: 7,
        dismissed: false,
        createdAt: now,
      });
    }
  });

  return suggestions.sort((a, b) => b.relevance - a.relevance);
};