import { Task, Suggestion, Category } from '../types';

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
          message: `Your trip is in ${daysUntil} days—check your passport expiry and visa requirements`,
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
