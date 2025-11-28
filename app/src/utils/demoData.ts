//                        //
// Abigail's Demo Version //
//                        //
import { Task, Category } from '../types';

export function generateDemoTasks(categories: Category[]): Task[] {
  const mockTasks: Task[] = [];
  const now = Date.now();
  
  // Helper to find category
  const findCat = (name: string) => categories.find((c) => c.name === name);
  
  // Health
  const healthCat = findCat('Health');
  if (healthCat) {
    mockTasks.push(
      {
        id: `task-${now}-health-1`,
        title: 'Annual Exam',
        description: 'Yearly checkup with GP',
        date: new Date(now + 21 * 24 * 60 * 60 * 1000),
        categoryId: healthCat.id,
        attachments: [],
        completed: false,
        notes: 'Dr. Johnson - talk about increasing Cipralex',
        reminders: [{
          id: `reminder-${now}-health-1`,
          time: new Date(now + 20 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
        previousCompletions: [
          {
            id: `task-${now}-health-1-prev-1`,
            completedAt: new Date(now - 345 * 24 * 60 * 60 * 1000), // under a year ago
            date: new Date(now - 345 * 24 * 60 * 60 * 1000),
        }],
      },
      {
        id: `task-${now}-health-2`,
        title: 'Refill Prescription',
        description: 'Cipralex refill',
        date: new Date(now + 3 * 24 * 60 * 60 * 1000),
        categoryId: healthCat.id,
        attachments: [],
        completed: false,
        notes: 'CVS Pharmacy - 2 refills remaining',
        reminders: [{
          id: `reminder-${now}-health-2-rem`,
          time: new Date(now + 2 * 24 * 60 * 60 * 1000),
          frequency: 'monthly',
          enabled: true,
        }],
        createdAt: new Date(),
        previousCompletions: [
          {
            id: `task-${now}-health-2-prev-1`,
            completedAt: new Date(now - 31 * 24 * 60 * 60 * 1000), // 31 days ago
            date: new Date(now - 31 * 24 * 60 * 60 * 1000),
          },
          {
            id: `task-${now}-health-2-prev-2`,
            completedAt: new Date(now - 62 * 24 * 60 * 60 * 1000), // 62 days ago
            date: new Date(now - 62 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        id: `task-${now}-health-3`,
        title: 'Eye Exam',
        description: 'Annual vision check and update glasses prescription',
        date: new Date(now + 60 * 24 * 60 * 60 * 1000),
        categoryId: healthCat.id,
        attachments: [],
        completed: false,
        notes: 'Vision Center - might need new frames',
        reminders: [{
          id: `reminder-${now}-health-3`,
          time: new Date(now + 55 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-health-4`,
        title: 'Dental Cleaning',
        description: '6-month hygenist appointment',
        date: new Date(now + 1 * 24 * 60 * 60 * 1000), 
        categoryId: healthCat.id,
        attachments: [],
        completed: false,
        notes: 'Wheelie Clean - coming to the house',
        reminders: [{
          id: `reminder-${now}-health-4`,
          time: new Date(now + 1 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-health-5`,
        title: 'Dentist Appointment',
        description: 'yearly check up',
        date: new Date(now + 1 * 24 * 60 * 60 * 1000), 
        categoryId: healthCat.id,
        attachments: [],
        completed: false,
        notes: 'Dr. Dave',
        reminders: [{
          id: `reminder-${now}-health-5`,
          time: new Date(now + 1 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
        previousCompletions: [
          {
            id: `task-${now}-health-5-prev-1`,
            completedAt: new Date(now - 180 * 24 * 60 * 60 * 1000), // 6 months ago
            date: new Date(now - 180 * 24 * 60 * 60 * 1000),
        }],
      }
    );
  }
  
  // Subscriptions
  const subsCat = findCat('Subscriptions');
  if (subsCat) {
    mockTasks.push(
      {
        id: `task-${now}-subs-1`,
        title: 'Netflix Renewal',
        description: 'Monthly subscription payment',
        date: new Date(now + 12 * 24 * 60 * 60 * 1000),
        categoryId: subsCat.id,
        attachments: [],
        completed: false,
        notes: '$15.99/month - Consider switching to Crave?',
        reminders: [],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-subs-2`,
        title: 'Gym Membership Due',
        description: 'Annual gym membership renewal',
        date: new Date(now + 28 * 24 * 60 * 60 * 1000),
        categoryId: subsCat.id,
        attachments: [],
        completed: false,
        notes: '$600/year - 15% discount if paid upfront',
        reminders: [],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-subs-3`,
        title: 'Skip Renews',
        description: '',
        date: new Date(now + 4 * 24 * 60 * 60 * 1000),
        categoryId: subsCat.id,
        attachments: [],
        completed: false,
        notes: 'Was free - check pricing',
        reminders: [{
          id: `reminder-${now}-subs-3`,
          time: new Date(now + 3 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      }
    );
  }
  
  // Warranties
  const warrantyCat = findCat('Warranties');
  if (warrantyCat) {
    mockTasks.push(
      {
        id: `task-${now}-warranty-1`,
        title: 'Laptop Warranty Expires',
        description: 'MacBook Pro 3-year AppleCare+ ending',
        date: new Date(now + 42 * 24 * 60 * 60 * 1000),
        categoryId: warrantyCat.id,
        attachments: [],
        completed: false,
        notes: 'Decide if extending warranty or not',
        reminders: [{
          id: `reminder-${now}-warranty-1`,
          time: new Date(now + 40 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-warranty-2`,
        title: 'Dishwasher Warranty Check',
        description: 'Verify warranty coverage before calling repair',
        date: new Date(now + 5 * 24 * 60 * 60 * 1000),
        categoryId: warrantyCat.id,
        attachments: [],
        completed: false,
        notes: 'Making weird noise - still under warranty?',
        reminders: [],
        createdAt: new Date(),
      }
    );
  }
  
  // Vehicle
  const vehicleCat = findCat('Vehicle');
  if (vehicleCat) {
    mockTasks.push(
      {
        id: `task-${now}-vehicle-1`,
        title: 'Oil Change',
        description: 'Regular maintenance - every 10,000 km',
        date: new Date(now -2 * 24 * 60 * 60 * 1000),
        categoryId: vehicleCat.id,
        attachments: [],
        completed: false,
        notes: 'Current mileage: 109,200',
        reminders: [{
          id: `reminder-${now}-vehicle-1`,
          time: new Date(now -2 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-vehicle-2`,
        title: 'Brakes',
        description: 'New brakes & fluid every 2-3 years',
        date: new Date(now + 7 * 24 * 60 * 60 * 1000),
        categoryId: vehicleCat.id,
        attachments: [],
        completed: false,
        notes: 'last check at 25%',
        reminders: [{
          id: `reminder-${now}-vehicle-2`,
          time: new Date(now + 7 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-vehicle-3`,
        title: 'Car Insurance Renewal',
        description: 'Annual auto insurance policy renewal',
        date: new Date(now + 55 * 24 * 60 * 60 * 1000),
        categoryId: vehicleCat.id,
        attachments: [],
        completed: false,
        notes: 'Shop around for better rates',
        reminders: [{
          id: `reminder-${now}-vehicle-3`,
          time: new Date(now + 45 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-vehicle-4`,
        title: 'Registration Renewal',
        description: 'Annual vehicle registration with ICBC',
        date: new Date(now + 25 * 24 * 60 * 60 * 1000),
        categoryId: vehicleCat.id,
        attachments: [],
        completed: false,
        notes: 'Renewal notice should arrive by mail',
        reminders: [{
          id: `reminder-${now}-vehicle-4`,
          time: new Date(now + 24 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      }
    );
  }
  
  return mockTasks;
}
