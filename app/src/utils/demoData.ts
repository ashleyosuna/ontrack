import { Task, Category } from '../types';

export function generateDemoTasks(categories: Category[]): Task[] {
  const mockTasks: Task[] = [];
  const now = Date.now();
  
  // Helper to find category
  const findCat = (name: string) => categories.find((c) => c.name === name);
  
  // Home Maintenance
  const homeCat = findCat('Home Maintenance');
  if (homeCat) {
    mockTasks.push(
      {
        id: `task-${now}-home-1`,
        title: 'Replace HVAC Filter',
        description: 'Change air filter in heating/cooling system',
        date: new Date(now + 7 * 24 * 60 * 60 * 1000), // 7 days
        categoryId: homeCat.id,
        attachments: [],
        completed: false,
        notes: 'Size: 16x25x1 - Buy at hardware store',
        reminders: [{
          id: `reminder-${now}-1`,
          time: new Date(now + 6 * 24 * 60 * 60 * 1000),
          frequency: 'monthly',
          enabled: true,
        }],
        createdAt: new Date(),
        previousCompletions: [
          {
            id: `task-${now}-home-1-prev-1`,
            completedAt: new Date(now - 90 * 24 * 60 * 60 * 1000), // 90 days ago
            date: new Date(now - 90 * 24 * 60 * 60 * 1000),
          },
          {
            id: `task-${now}-home-1-prev-2`,
            completedAt: new Date(now - 60 * 24 * 60 * 60 * 1000), // 60 days ago
            date: new Date(now - 60 * 24 * 60 * 60 * 1000),
          },
          {
            id: `task-${now}-home-1-prev-3`,
            completedAt: new Date(now - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            date: new Date(now - 30 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        id: `task-${now}-home-2`,
        title: 'Clean Gutters',
        description: 'Remove leaves and debris from roof gutters',
        date: new Date(now - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        categoryId: homeCat.id,
        attachments: [],
        completed: true,
        completedAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
        notes: 'Done! They were really full.',
        reminders: [],
        createdAt: new Date(now - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: `task-${now}-home-3`,
        title: 'Test Smoke Detectors',
        description: 'Check batteries and test all smoke alarms',
        date: new Date(now + 45 * 24 * 60 * 60 * 1000),
        categoryId: homeCat.id,
        attachments: [],
        completed: false,
        notes: 'Replace batteries if low',
        reminders: [{
          id: `reminder-${now}-home-3`,
          time: new Date(now + 44 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-home-4`,
        title: 'Schedule HVAC Service',
        description: 'Annual heating system maintenance',
        date: new Date(now + 105 * 24 * 60 * 60 * 1000), // ~3.5 months
        categoryId: homeCat.id,
        attachments: [],
        completed: false,
        notes: 'Before winter - call ABC Heating',
        reminders: [{
          id: `reminder-${now}-home-4`,
          time: new Date(now + 95 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-home-5`,
        title: 'Roof Inspection',
        description: 'Annual roof check for damage',
        date: new Date(now + 150 * 24 * 60 * 60 * 1000), // ~5 months
        categoryId: homeCat.id,
        attachments: [],
        completed: false,
        notes: 'Check for loose shingles after winter',
        reminders: [{
          id: `reminder-${now}-home-5`,
          time: new Date(now + 145 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      }
    );
  }
  
  // Health
  const healthCat = findCat('Health');
  if (healthCat) {
    mockTasks.push(
      {
        id: `task-${now}-health-1`,
        title: 'Annual Physical Exam',
        description: 'Yearly checkup with primary care physician',
        date: new Date(now + 21 * 24 * 60 * 60 * 1000),
        categoryId: healthCat.id,
        attachments: [],
        completed: false,
        notes: 'Dr. Johnson - Bring insurance card',
        reminders: [{
          id: `reminder-${now}-2`,
          time: new Date(now + 20 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-health-2`,
        title: 'Refill Prescription',
        description: 'Blood pressure medication refill',
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
        description: '6-month dental checkup and cleaning',
        date: new Date(now + 135 * 24 * 60 * 60 * 1000), // ~4.5 months
        categoryId: healthCat.id,
        attachments: [],
        completed: false,
        notes: 'Dr. Smith Dental - call to schedule',
        reminders: [{
          id: `reminder-${now}-health-4`,
          time: new Date(now + 130 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      }
    );
  }
  
  // Taxes & Finance
  const taxCat = findCat('Taxes & Finance');
  if (taxCat) {
    mockTasks.push(
      {
        id: `task-${now}-tax-1`,
        title: 'Quarterly Tax Payment',
        description: 'Q4 estimated tax payment due',
        date: new Date(now + 35 * 24 * 60 * 60 * 1000),
        categoryId: taxCat.id,
        attachments: [],
        completed: false,
        notes: 'Pay via IRS Direct Pay',
        reminders: [{
          id: `reminder-${now}-tax-1`,
          time: new Date(now + 30 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-tax-2`,
        title: 'Review Investment Portfolio',
        description: 'Quarterly financial review with advisor',
        date: new Date(now + 100 * 24 * 60 * 60 * 1000), // ~3.3 months
        categoryId: taxCat.id,
        attachments: [],
        completed: false,
        notes: 'Check 401k performance and rebalancing',
        reminders: [{
          id: `reminder-${now}-tax-2`,
          time: new Date(now + 95 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
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
        notes: '$15.99/month - Consider canceling?',
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
        reminders: [],
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
  
  // Travel
  const travelCat = findCat('Travel');
  if (travelCat) {
    mockTasks.push(
      {
        id: `task-${now}-travel-1`,
        title: 'Trip to Japan',
        description: 'Summer vacation to Tokyo and Kyoto',
        date: new Date(now + 90 * 24 * 60 * 60 * 1000),
        categoryId: travelCat.id,
        attachments: [],
        completed: false,
        notes: 'Book flights and accommodation soon',
        reminders: [{
          id: `reminder-${now}-4`,
          time: new Date(now + 60 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-travel-2`,
        title: 'Renew Passport',
        description: 'Passport expires in 8 months',
        date: new Date(now + 180 * 24 * 60 * 60 * 1000),
        categoryId: travelCat.id,
        attachments: [],
        completed: false,
        notes: 'Need for Japan trip - renew at least 6 months before',
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
        description: 'Regular maintenance - every 5,000 miles',
        date: new Date(now + 10 * 24 * 60 * 60 * 1000),
        categoryId: vehicleCat.id,
        attachments: [],
        completed: false,
        notes: 'Current mileage: 47,200',
        reminders: [{
          id: `reminder-${now}-vehicle-1`,
          time: new Date(now + 9 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-vehicle-2`,
        title: 'Car Insurance Renewal',
        description: 'Annual auto insurance policy renewal',
        date: new Date(now + 55 * 24 * 60 * 60 * 1000),
        categoryId: vehicleCat.id,
        attachments: [],
        completed: false,
        notes: 'Shop around for better rates',
        reminders: [{
          id: `reminder-${now}-5`,
          time: new Date(now + 45 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-vehicle-3`,
        title: 'Registration Renewal',
        description: 'Annual vehicle registration with DMV',
        date: new Date(now + 25 * 24 * 60 * 60 * 1000),
        categoryId: vehicleCat.id,
        attachments: [],
        completed: false,
        notes: 'Renewal notice should arrive by mail',
        reminders: [{
          id: `reminder-${now}-vehicle-3`,
          time: new Date(now + 24 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      }
    );
  }
  
  // Insurance
  const insuranceCat = findCat('Insurance');
  if (insuranceCat) {
    mockTasks.push(
      {
        id: `task-${now}-insurance-1`,
        title: 'Home Insurance Renewal',
        description: 'Annual homeowners insurance policy review',
        date: new Date(now + 70 * 24 * 60 * 60 * 1000),
        categoryId: insuranceCat.id,
        attachments: [],
        completed: false,
        notes: 'Compare rates - home value increased',
        reminders: [{
          id: `reminder-${now}-insurance-1`,
          time: new Date(now + 60 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-insurance-2`,
        title: 'Review Life Insurance',
        description: 'Annual checkup on life insurance coverage',
        date: new Date(now + 120 * 24 * 60 * 60 * 1000),
        categoryId: insuranceCat.id,
        attachments: [],
        completed: false,
        notes: 'Might need to increase coverage',
        reminders: [{
          id: `reminder-${now}-insurance-2`,
          time: new Date(now + 110 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      }
    );
  }
  
  // Personal
  const personalCat = findCat('Personal');
  if (personalCat) {
    mockTasks.push(
      {
        id: `task-${now}-personal-1`,
        title: "Mom's Birthday Gift",
        description: 'Buy and send birthday present',
        date: new Date(now + 18 * 24 * 60 * 60 * 1000),
        categoryId: personalCat.id,
        attachments: [],
        completed: false,
        notes: 'She mentioned wanting a new scarf',
        reminders: [{
          id: `reminder-${now}-6`,
          time: new Date(now + 14 * 24 * 60 * 60 * 1000),
          frequency: 'once',
          enabled: true,
        }],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-personal-2`,
        title: "Renew Driver's License",
        description: 'License expires next month',
        date: new Date(now + 30 * 24 * 60 * 60 * 1000),
        categoryId: personalCat.id,
        attachments: [],
        completed: false,
        notes: 'Can renew online or at DMV',
        reminders: [],
        createdAt: new Date(),
      },
      {
        id: `task-${now}-personal-3`,
        title: 'Organize Photo Albums',
        description: 'Sort and backup digital photos from last year',
        date: new Date(now - 2 * 24 * 60 * 60 * 1000),
        categoryId: personalCat.id,
        attachments: [],
        completed: true,
        notes: 'Uploaded to Google Photos - 2,847 photos!',
        reminders: [],
        createdAt: new Date(now - 45 * 24 * 60 * 60 * 1000),
      }
    );
  }
  
  return mockTasks;
}
