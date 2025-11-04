import { Template, Reminder } from '../types';

// Preset templates for different categories
export const PRESET_TEMPLATES: Omit<Template, 'id' | 'categoryId' | 'createdAt'>[] = [
  // Home Maintenance
  {
    name: 'HVAC Filter Replacement',
    title: 'Replace HVAC Filter',
    description: 'Replace air conditioning and heating system filter',
    notes: 'Check filter size before purchasing. Most systems use 16x20 or 20x25 filters.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Gutter Cleaning',
    title: 'Clean Gutters',
    description: 'Remove debris from gutters and downspouts',
    notes: 'Best done in spring and fall. Check for leaks and proper drainage.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Smoke Detector Test',
    title: 'Test Smoke Detectors',
    description: 'Test all smoke and CO detectors, replace batteries if needed',
    notes: 'Press test button on each detector. Replace batteries annually.',
    reminders: [],
    isPreset: true,
  },

  // Health
  {
    name: 'Annual Physical',
    title: 'Schedule Annual Physical Exam',
    description: 'Book yearly checkup with primary care physician',
    notes: 'Bring list of current medications and any health concerns to discuss.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Dental Cleaning',
    title: 'Dental Checkup & Cleaning',
    description: 'Schedule routine dental cleaning and examination',
    notes: 'Recommended every 6 months. Call insurance for coverage details.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Vision Test',
    title: 'Eye Examination',
    description: 'Schedule comprehensive eye exam',
    notes: 'Bring current prescription and insurance card. Recommended annually.',
    reminders: [],
    isPreset: true,
  },

  // Taxes & Finance
  {
    name: 'Tax Filing',
    title: 'File Annual Tax Return',
    description: 'Prepare and file tax return by deadline',
    notes: 'Gather W-2s, 1099s, and receipts for deductions. Deadline typically April 15.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Budget Review',
    title: 'Monthly Budget Review',
    description: 'Review spending and adjust budget categories',
    notes: 'Compare actual spending vs. planned budget. Identify areas to optimize.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Investment Review',
    title: 'Review Investment Portfolio',
    description: 'Check investment performance and rebalance if needed',
    notes: 'Review asset allocation, fees, and performance vs. benchmarks.',
    reminders: [],
    isPreset: true,
  },

  // Subscriptions
  {
    name: 'Subscription Audit',
    title: 'Review All Subscriptions',
    description: 'Check all active subscriptions and cancel unused ones',
    notes: 'Review bank statements for recurring charges. Cancel what you don\'t use.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Streaming Service',
    title: 'Streaming Service Renewal',
    description: 'Review and renew streaming service subscription',
    notes: 'Check for better plans or promotional pricing.',
    reminders: [],
    isPreset: true,
  },

  // Warranties
  {
    name: 'Appliance Warranty',
    title: 'Appliance Warranty Expiration',
    description: 'Check warranty expiration and consider extended coverage',
    notes: 'Review warranty terms and decide if extended coverage is worth it.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Electronics Warranty',
    title: 'Electronics Warranty Check',
    description: 'Verify warranty coverage for electronics',
    notes: 'Keep purchase receipts and warranty documents in a safe place.',
    reminders: [],
    isPreset: true,
  },

  // Travel
  {
    name: 'Passport Renewal',
    title: 'Renew Passport',
    description: 'Submit passport renewal application',
    notes: 'Process takes 6-8 weeks. Renew if expiring within 6 months of travel.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Travel Visa',
    title: 'Apply for Travel Visa',
    description: 'Submit visa application for upcoming travel',
    notes: 'Check requirements for destination country. Apply well in advance.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Vaccination',
    title: 'Travel Vaccinations',
    description: 'Get required vaccinations for travel destination',
    notes: 'Consult travel clinic 4-6 weeks before departure.',
    reminders: [],
    isPreset: true,
  },

  // Vehicle
  {
    name: 'Oil Change',
    title: 'Vehicle Oil Change',
    description: 'Schedule oil change and basic maintenance',
    notes: 'Typically every 3,000-5,000 miles. Check owner\'s manual for specifics.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Vehicle Registration',
    title: 'Renew Vehicle Registration',
    description: 'Renew vehicle registration before expiration',
    notes: 'Check renewal notice for fees and required documents.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Tire Rotation',
    title: 'Tire Rotation & Alignment',
    description: 'Rotate tires and check alignment',
    notes: 'Recommended every 6,000-8,000 miles or per manufacturer schedule.',
    reminders: [],
    isPreset: true,
  },

  // Insurance
  {
    name: 'Insurance Renewal',
    title: 'Review Insurance Policy',
    description: 'Review policy coverage and rates before renewal',
    notes: 'Shop around for better rates. Verify coverage meets current needs.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Life Insurance Review',
    title: 'Review Life Insurance Coverage',
    description: 'Assess if life insurance coverage is adequate',
    notes: 'Update beneficiaries. Consider adjusting coverage based on life changes.',
    reminders: [],
    isPreset: true,
  },

  // Personal
  {
    name: 'Birthday Planning',
    title: 'Plan Birthday Celebration',
    description: 'Plan and organize birthday celebration',
    notes: 'Make reservations, send invitations, order cake.',
    reminders: [],
    isPreset: true,
  },
  {
    name: 'Important Document Review',
    title: 'Review Important Documents',
    description: 'Review and update important legal documents',
    notes: 'Check will, power of attorney, and advanced directives. Update as needed.',
    reminders: [],
    isPreset: true,
  },
];

export function getPresetTemplatesForCategory(categoryName: string): Omit<Template, 'id' | 'categoryId' | 'createdAt'>[] {
  const categoryMap: Record<string, string[]> = {
    'Home Maintenance': ['HVAC Filter Replacement', 'Gutter Cleaning', 'Smoke Detector Test'],
    'Health': ['Annual Physical', 'Dental Cleaning', 'Vision Test'],
    'Taxes & Finance': ['Tax Filing', 'Budget Review', 'Investment Review'],
    'Subscriptions': ['Subscription Audit', 'Streaming Service'],
    'Warranties': ['Appliance Warranty', 'Electronics Warranty'],
    'Travel': ['Passport Renewal', 'Travel Visa', 'Vaccination'],
    'Vehicle': ['Oil Change', 'Vehicle Registration', 'Tire Rotation'],
    'Insurance': ['Insurance Renewal', 'Life Insurance Review'],
    'Personal': ['Birthday Planning', 'Important Document Review'],
  };

  const templateNames = categoryMap[categoryName] || [];
  return PRESET_TEMPLATES.filter(template => templateNames.includes(template.name));
}
