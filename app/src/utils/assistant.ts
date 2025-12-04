import { Task, Suggestion, Category } from "./types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Shared builder for generic / baseline suggestions + awareness months
function buildBaselineSuggestions(opts: {
  now: Date;
  month: number;
  hasVehicleCategory: boolean;
  hasVehicleKmSuggestion: boolean;
  hasHealthCategory: boolean;
  hasHealthTask: boolean;
  hasSubscriptionsCategory: boolean;
  hasSubscriptionsTask: boolean;
  hasWarrantiesCategory: boolean;
  hasWarrantiesTask: boolean;
  hasHomeCategory: boolean;
  hasHomeTask: boolean;
  hasTaxesCategory: boolean;
  hasTaxesTask: boolean;
  hasTravelCategory: boolean;
  hasTravelTask: boolean;
  hasInsuranceCategory: boolean;
  hasInsuranceTask: boolean;
}): Suggestion[] {
  const {
    now,
    month,
    hasVehicleCategory,
    hasVehicleKmSuggestion,
    hasHealthCategory,
    hasHealthTask,
    hasSubscriptionsCategory,
    hasSubscriptionsTask,
    hasWarrantiesCategory,
    hasWarrantiesTask,
    hasHomeCategory,
    hasHomeTask,
    hasTaxesCategory,
    hasTaxesTask,
    hasTravelCategory,
    hasTravelTask,
    hasInsuranceCategory,
    hasInsuranceTask,
  } = opts;

  const suggestions: Suggestion[] = [];

  // ---- CANADA AWARENESS MONTHS (global, not tied to a specific task) ----
  if (month === 1) {
    // February – Heart Month
    suggestions.push({
      id: "suggestion-awareness-heart-month",
      message:
        "It’s Heart Month in Canada — consider booking a blood pressure or cholesterol check if you haven’t had one in a while.",
      type: "tip",
      relevance: 3,
      dismissed: false,
      createdAt: now,
    });
  }

  if (month === 2) {
    // March – Nutrition Month
    suggestions.push({
      id: "suggestion-awareness-nutrition-month",
      message:
        "It’s Nutrition Month in Canada — maybe review your grocery staples or plan a few balanced meals for the week.",
      type: "tip",
      relevance: 3,
      dismissed: false,
      createdAt: now,
    });
  }

  if (month === 4) {
    // May – Mental Health Awareness Month
    suggestions.push({
      id: "suggestion-awareness-mental-health",
      message:
        "It’s Mental Health Awareness Month — have you checked your benefits or student coverage for therapy or counselling options?",
      type: "tip",
      relevance: 4,
      dismissed: false,
      createdAt: now,
    });
  }

  if (month === 9) {
    // October – Breast Cancer Awareness Month
    suggestions.push({
      id: "suggestion-awareness-breast-cancer",
      message:
        "It’s Breast Cancer Awareness Month — if screening applies to you, this is a great time to talk to your doctor about mammograms or breast exams.",
      type: "reminder",
      relevance: 4,
      dismissed: false,
      createdAt: now,
    });
  }

  if (month === 10) {
    // November – Diabetes Awareness Month
    suggestions.push({
      id: "suggestion-awareness-diabetes",
      message:
        "It’s Diabetes Awareness Month — consider checking your latest blood work or talking with your provider about blood sugar, if it applies to you.",
      type: "tip",
      relevance: 3,
      dismissed: false,
      createdAt: now,
    });
  }

  // ---- VEHICLE BASELINE (km-generic + winter + general) ----
  if (hasVehicleCategory) {
    // Winter tires (Oct–Nov)
    if (month === 9 || month === 10) {
      suggestions.push({
        id: "suggestion-category-vehicle-winter",
        message: "Winter is coming — have you checked or changed your tires?",
        type: "tip",
        relevance: 10,
        dismissed: false,
        createdAt: now,
      });
    }

    // General vehicle care
    suggestions.push({
      id: "suggestion-category-vehicle-service",
      message:
        "Quick win: pick one day this month to book any overdue vehicle service.",
      type: "action",
      relevance: 8,
      dismissed: false,
      createdAt: now,
    });

    suggestions.push({
      id: "suggestion-category-oil-change",
      message:
        "When was the last time you had your oil changed? Might be time to give the car a spa treatment.",
      type: "action",
      relevance: 9,
      dismissed: false,
      createdAt: now,
    });

    suggestions.push({
      id: "suggestion-category-vehicle-km-general",
      message:
        "Going on a big drive? Might be smart to take your vehicle in for an inspection if it's been a while.",
      type: "tip",
      relevance: 7,
      dismissed: false,
      createdAt: now,
    });

    // Generic km tips (only if no km-based tasks)
    if (!hasVehicleKmSuggestion) {
      suggestions.push(
        {
          id: "suggestion-vehicle-timing-belt-generic",
          message:
            "If your vehicle is around 100,000 km or more, it’s a good time to check whether the timing belt has ever been replaced.",
          type: "tip",
          relevance: 8,
          dismissed: false,
          createdAt: now,
        },
        {
          id: "suggestion-vehicle-brakes-generic",
          message:
            "Brake pads often need attention every 2-3 years — consider a brake inspection if you’re in that range.",
          type: "tip",
          relevance: 7,
          dismissed: false,
          createdAt: now,
        },
        {
          id: "suggestion-vehicle-spark-plugs-generic",
          message:
            "Spark plugs are commonly replaced around 80,000 km — if you’re noticing rough starts or lower fuel efficiency, a tune-up may help.",
          type: "tip",
          relevance: 7,
          dismissed: false,
          createdAt: now,
        },
        {
          id: "suggestion-vehicle-coolant-generic",
          message:
            "Coolant/antifreeze typically needs flushing every ~50,000 km — check your manual and maintenance history.",
          type: "action",
          relevance: 6,
          dismissed: false,
          createdAt: now,
        },
        {
          id: "suggestion-vehicle-tires-generic",
          message:
            "Many tires wear down around 40,000 km — check your tread depth and consider rotation or replacement.",
          type: "tip",
          relevance: 5,
          dismissed: false,
          createdAt: now,
        }
      );
    }
  }

  // ---- BASELINE CATEGORY TIPS WHEN NO TASKS IN THAT CATEGORY ----

  if (hasHealthCategory && !hasHealthTask) {
    suggestions.push(
      {
        id: "baseline-health-annual-check",
        message:
          "Quick win: most people benefit from a yearly doctor visit and a regular dentist appointment — consider adding tasks to keep those on your radar.",
        type: "tip",
        relevance: 8,
        dismissed: false,
        createdAt: now,
      },
      {
        id: "baseline-health-mental-benefits",
        message:
          "Quick win: check whether your student or work benefits cover therapy or counselling — future you will be very glad you did.",
        type: "tip",
        relevance: 7,
        dismissed: false,
        createdAt: now,
      }
    );
  }

  if (hasSubscriptionsCategory && !hasSubscriptionsTask) {
    suggestions.push({
      id: "baseline-subscriptions-audit",
      message:
        "Quick win: do a 5-minute subscription audit — list everything you’re paying for and cancel the ones you barely use.",
      type: "action",
      relevance: 7,
      dismissed: false,
      createdAt: now,
    });
  }

  if (hasWarrantiesCategory && !hasWarrantiesTask) {
    suggestions.push(
      {
        id: "baseline-warranties-did-you-know",
        message:
          "Did you know? Tons of everyday things — like toasters, headphones, monitors, sometimes even jeans — come with warranties you can actually use if something breaks (or rips).",
        type: "tip",
        relevance: 7,
        dismissed: false,
        createdAt: now,
      },
      {
        id: "baseline-warranties-quick-win",
        message:
          "Quick win: whenever you buy an electronic device, snap a pic of the receipt and serial number and store it with the warranty — future you will thank you when something dies right before the warranty ends.",
        type: "action",
        relevance: 8,
        dismissed: false,
        createdAt: now,
      }
    );
  }

  if (hasHomeCategory && !hasHomeTask) {
    suggestions.push(
      {
        id: "baseline-home-hvac",
        message:
          "Home tip: changing your HVAC or furnace filter every 1–3 months keeps air cleaner and can lower your energy bill — worth a recurring task.",
        type: "tip",
        relevance: 7,
        dismissed: false,
        createdAt: now,
      },
      {
        id: "baseline-home-mortgage",
        message:
          "Do you know when your mortgage renews? It might be time to consider your options.",
        type: "tip",
        relevance: 7,
        dismissed: false,
        createdAt: now,
    }
    );
  }

  if (hasTaxesCategory && !hasTaxesTask) {
    suggestions.push({
      id: "baseline-taxes-prep",
      message:
        "Quick win: start a single place (folder or note) for tax documents now so tax season isn’t a panicked scavenger hunt later.",
      type: "action",
      relevance: 8,
      dismissed: false,
      createdAt: now,
    });
  }

  if (hasTravelCategory && !hasTravelTask) {
    suggestions.push({
      id: "baseline-travel-passport",
      message:
        "Travel tip: lots of countries want at least 6 months left on your passport — worth checking before you even start planning a big trip.",
      type: "tip",
      relevance: 7,
      dismissed: false,
      createdAt: now,
    });
  }

  if (hasInsuranceCategory && !hasInsuranceTask) {
    suggestions.push({
      id: "baseline-insurance-review",
      message:
        "Insurance tip: once a year, skim your policies and make sure your coverage and beneficiaries still match your life now, not 5 years ago.",
      type: "tip",
      relevance: 7,
      dismissed: false,
      createdAt: now,
    });
  }

  return suggestions;
}

// -----------------------------------------------------------------------------
// Category-based suggestions (demo mode / few tasks)
// -----------------------------------------------------------------------------
export const generateCategoryBasedSuggestions = (
  categories: Category[],
  trackedCategories: string[]
): Suggestion[] => {
  const now = new Date();
  const month = now.getMonth(); // 0 = Jan

  const hasVehicleCategory = trackedCategories.includes("Vehicle");
  const hasHealthCategory = trackedCategories.includes("Health");
  const hasSubscriptionsCategory = trackedCategories.includes("Subscriptions");
  const hasWarrantiesCategory = trackedCategories.includes("Warranties");
  const hasHomeCategory = trackedCategories.includes("Home Maintenance");
  const hasTaxesCategory = trackedCategories.includes("Taxes & Finance");
  const hasTravelCategory = trackedCategories.includes("Travel");
  const hasInsuranceCategory = trackedCategories.includes("Insurance");

  // In demo mode, assume no tasks yet and no km-based vehicle info
  const baseline = buildBaselineSuggestions({
    now,
    month,
    hasVehicleCategory,
    hasVehicleKmSuggestion: false,
    hasHealthCategory,
    hasHealthTask: false,
    hasSubscriptionsCategory,
    hasSubscriptionsTask: false,
    hasWarrantiesCategory,
    hasWarrantiesTask: false,
    hasHomeCategory,
    hasHomeTask: false,
    hasTaxesCategory,
    hasTaxesTask: false,
    hasTravelCategory,
    hasTravelTask: false,
    hasInsuranceCategory,
    hasInsuranceTask: false,
  });

  const sorted = baseline.sort((a, b) => b.relevance - a.relevance);
  return sorted.slice(0, 6);
};

// -----------------------------------------------------------------------------
// Task-based smart suggestions (main app mode)
// -----------------------------------------------------------------------------
export const generateSuggestions = (
  tasks: Task[],
  categories: Category[]
): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const now = new Date();
  const month = now.getMonth(); // 0 = Jan

  // Category flags for baseline logic
  const hasVehicleCategory = categories.some((c) => c.name === "Vehicle");
  let hasVehicleKmSuggestion = false;

  const hasHealthCategory = categories.some((c) => c.name === "Health");
  let hasHealthTask = false;

  const hasSubscriptionsCategory = categories.some(
    (c) => c.name === "Subscriptions"
  );
  let hasSubscriptionsTask = false;

  const hasWarrantiesCategory = categories.some(
    (c) => c.name === "Warranties"
  );
  let hasWarrantiesTask = false;

  const hasHomeCategory = categories.some(
    (c) => c.name === "Home Maintenance"
  );
  let hasHomeTask = false;

  const hasTaxesCategory = categories.some(
    (c) => c.name === "Taxes & Finance"
  );
  let hasTaxesTask = false;

  const hasTravelCategory = categories.some((c) => c.name === "Travel");
  let hasTravelTask = false;

  const hasInsuranceCategory = categories.some(
    (c) => c.name === "Insurance"
  );
  let hasInsuranceTask = false;

  tasks.forEach((task) => {
    if (task.completed) return;

    const daysUntil = Math.ceil(
      (task.date.getTime() - now.getTime()) / MS_PER_DAY
    );
    const category = categories.find((c) => c.id === task.categoryId);
    const lowerTitle = task.title.toLowerCase();

    // --- TRAVEL ---
    if (category?.name === "Travel" && daysUntil > 0 && daysUntil <= 90) {
      hasTravelTask = true;

      suggestions.push({
        id: `suggestion-${task.id}-travel-trip`,
        message: `Your trip "${task.title}" is in ${daysUntil} days — double-check your bookings, passport expiry (many places want 6+ months left), and travel insurance.`,
        type: "tip",
        relatedTaskId: task.id,
        relevance: daysUntil <= 30 ? 10 : 7,
        dismissed: false,
        createdAt: now,
      });
    }

    // --- HEALTH: DENTAL / DOCTOR ---
    if (category?.name === "Health") {
      hasHealthTask = true;
      const monthsSince = Math.floor(-daysUntil / 30); // negative daysUntil = in past

      // Dentist tasks
      if (lowerTitle.includes("dentist") || lowerTitle.includes("dental")) {
        if (monthsSince >= 12) {
          suggestions.push({
            id: `suggestion-${task.id}-dentist-annual`,
            message:
              "It’s been over a year since your last dentist appointment — time to schedule your annual checkup.",
            type: "reminder",
            relatedTaskId: task.id,
            relevance: 9,
            dismissed: false,
            createdAt: now,
          });
        } else if (monthsSince >= 6) {
          suggestions.push({
            id: `suggestion-${task.id}-cleaning-biannual`,
            message:
              "Time for your biannual teeth cleaning — book a hygienist appointment.",
            type: "reminder",
            relatedTaskId: task.id,
            relevance: 8,
            dismissed: false,
            createdAt: now,
          });
        }
      }

      // Doctor / physical / annual check
      if (
        lowerTitle.includes("doctor") ||
        lowerTitle.includes("checkup") ||
        lowerTitle.includes("physical") ||
        lowerTitle.includes("annual")
      ) {
        if (monthsSince >= 12) {
          suggestions.push({
            id: `suggestion-${task.id}-doctor-annual`,
            message:
              "It’s time for your yearly health checkup — schedule an appointment with your family doctor or GP.",
            type: "reminder",
            relatedTaskId: task.id,
            relevance: 9,
            dismissed: false,
            createdAt: now,
          });
        }
      }
    }

    // --- VEHICLE KM-BASED MAINTENANCE & VEHICLE DOCS ---
    if (category?.name === "Vehicle") {
      // Extract km from title (e.g., "120000km", "120,000 km")
      const kmMatch = lowerTitle.match(/(\d{2,7})\s*[,]*\s*km/);
      if (kmMatch) {
        hasVehicleKmSuggestion = true;
        const km = parseInt(kmMatch[1], 10);

        if (km >= 100_000) {
          suggestions.push({
            id: `suggestion-${task.id}-timing-belt`,
            message: `Your vehicle has ${km.toLocaleString()} km — consider inspecting or replacing the timing belt if it hasn’t been done recently.`,
            type: "tip",
            relatedTaskId: task.id,
            relevance: 9,
            dismissed: false,
            createdAt: now,
          });
        }

        if (km >= 40_000) {
          suggestions.push({
            id: `suggestion-${task.id}-brakes`,
            message: `At around ${km.toLocaleString()} km, brake pads may need inspection or replacement.`,
            type: "tip",
            relatedTaskId: task.id,
            relevance: 7,
            dismissed: false,
            createdAt: now,
          });
        }

        if (km >= 80_000) {
          suggestions.push({
            id: `suggestion-${task.id}-spark-plugs`,
            message: `Vehicles around ${km.toLocaleString()} km often need spark plug replacement for smoother performance.`,
            type: "tip",
            relatedTaskId: task.id,
            relevance: 8,
            dismissed: false,
            createdAt: now,
          });
        }

        if (km >= 50_000) {
          suggestions.push({
            id: `suggestion-${task.id}-coolant`,
            message: `Around ${km.toLocaleString()} km is a good time for a coolant flush to protect your engine.`,
            type: "action",
            relatedTaskId: task.id,
            relevance: 6,
            dismissed: false,
            createdAt: now,
          });
        }

        if (km >= 40_000) {
          suggestions.push({
            id: `suggestion-${task.id}-tires`,
            message: `With ${km.toLocaleString()} km on your vehicle, check your tire tread and consider rotation or replacement.`,
            type: "tip",
            relatedTaskId: task.id,
            relevance: 5,
            dismissed: false,
            createdAt: now,
          });
        }
      }

      // Vehicle insurance / registration (ICBC etc.)
      if (
        daysUntil > 0 &&
        daysUntil <= 14 &&
        (lowerTitle.includes("insurance") ||
          lowerTitle.includes("registration") ||
          lowerTitle.includes("icbc"))
      ) {
        hasInsuranceTask = true;
        suggestions.push({
          id: `suggestion-${task.id}-vehicle-docs`,
          message: `Your vehicle insurance/registration is due in ${daysUntil} days — renew early so you’re not stuck without coverage.`,
          type: "action",
          relatedTaskId: task.id,
          relevance: 10,
          dismissed: false,
          createdAt: now,
        });
      }
    }

    // --- INSURANCE ---
    if (category?.name === "Insurance") {
      hasInsuranceTask = true;

      if (daysUntil > 0 && daysUntil <= 30) {
        suggestions.push({
          id: `suggestion-${task.id}-insurance-renewal`,
          message: `Your insurance policy "${task.title}" renews in ${daysUntil} days — quick win: skim your coverage and decide if it still fits your life before it auto-renews.`,
          type: "action",
          relatedTaskId: task.id,
          relevance: 9,
          dismissed: false,
          createdAt: now,
        });
      }
    }

    // --- SUBSCRIPTIONS ---
    if (category?.name === "Subscriptions") {
      hasSubscriptionsTask = true;

      if (daysUntil >= -7 && daysUntil <= 7) {
        suggestions.push({
          id: `suggestion-${task.id}-subscription-window`,
          message: `Your ${task.title} is ${
            daysUntil > 0 ? "renewing" : "just renewed"
          } around now — decide if you still want to keep it.`,
          type: "action",
          relatedTaskId: task.id,
          relevance: 9,
          dismissed: false,
          createdAt: now,
        });
      }

      if (daysUntil > 7 && daysUntil <= 30) {
        suggestions.push({
          id: `suggestion-${task.id}-subscription-early`,
          message: `Your ${task.title} renews in ${daysUntil} days — check if there’s a cheaper plan or if you still use it regularly.`,
          type: "tip",
          relatedTaskId: task.id,
          relevance: 7,
          dismissed: false,
          createdAt: now,
        });
      }

      if (daysUntil < -7 && daysUntil >= -30) {
        suggestions.push({
          id: `suggestion-${task.id}-subscription-post`,
          message: `${task.title} was renewed recently — set a reminder before the next renewal if you're unsure you'll keep it long term.`,
          type: "tip",
          relatedTaskId: task.id,
          relevance: 6,
          dismissed: false,
          createdAt: now,
        });
      }
    }

    // --- WARRANTIES ---
    if (category?.name === "Warranties") {
      hasWarrantiesTask = true;

      if (daysUntil > 0 && daysUntil <= 30) {
        suggestions.push({
          id: `suggestion-${task.id}-warranty-imminent`,
          message: `Warranty for ${task.title} expires in ${daysUntil} days — test everything now and report any issues while you're covered.`,
          type: "reminder",
          relatedTaskId: task.id,
          relevance: 9,
          dismissed: false,
          createdAt: now,
        });
      }

      if (daysUntil > 30 && daysUntil <= 90) {
        suggestions.push({
          id: `suggestion-${task.id}-warranty-soon`,
          message: `Warranty for ${task.title} ends in about ${Math.round(
            daysUntil / 30
          )} months — schedule a quick check so you don’t miss problems.`,
          type: "tip",
          relatedTaskId: task.id,
          relevance: 7,
          dismissed: false,
          createdAt: now,
        });
      }

      if (daysUntil < 0 && daysUntil >= -30) {
        suggestions.push({
          id: `suggestion-${task.id}-warranty-expired`,
          message: `Warranty for ${task.title} expired recently — update your records and consider whether extended coverage makes sense.`,
          type: "tip",
          relatedTaskId: task.id,
          relevance: 6,
          dismissed: false,
          createdAt: now,
        });
      }
    }

    // --- TAXES & FINANCE ---
    if (
      category?.name === "Taxes & Finance" &&
      daysUntil > 0 &&
      daysUntil <= 14
    ) {
      hasTaxesTask = true;
      suggestions.push({
        id: `suggestion-${task.id}-tax`,
        message: `Tax deadline approaching in ${daysUntil} days — gather your documents.`,
        type: "action",
        relatedTaskId: task.id,
        relevance: 10,
        dismissed: false,
        createdAt: now,
      });
    }

    // --- HOME MAINTENANCE ---
    if (
      category?.name === "Home Maintenance" &&
      daysUntil >= -30 &&
      daysUntil <= 0
    ) {
      hasHomeTask = true;
      suggestions.push({
        id: `suggestion-${task.id}-maintenance`,
        message: `${task.title} maintenance is due — schedule it before issues arise.`,
        type: "reminder",
        relatedTaskId: task.id,
        relevance: 7,
        dismissed: false,
        createdAt: now,
      });
    }
  });

  // ---- BASELINE + AWARENESS + VEHICLE GENERIC (shared helper) ----
  const baseline = buildBaselineSuggestions({
    now,
    month,
    hasVehicleCategory,
    hasVehicleKmSuggestion,
    hasHealthCategory,
    hasHealthTask,
    hasSubscriptionsCategory,
    hasSubscriptionsTask,
    hasWarrantiesCategory,
    hasWarrantiesTask,
    hasHomeCategory,
    hasHomeTask,
    hasTaxesCategory,
    hasTaxesTask,
    hasTravelCategory,
    hasTravelTask,
    hasInsuranceCategory,
    hasInsuranceTask,
  });

  suggestions.push(...baseline);

  // ---- PRIORITIZE ----
  const sorted = suggestions
    .filter((s) => !!s.message)
    .map((s) => ({ ...s, createdAt: now }))
    .sort((a, b) => {
      const aIsTask = !!a.relatedTaskId;
      const bIsTask = !!b.relatedTaskId;

      // Task-based suggestions first
      if (aIsTask !== bIsTask) {
        return aIsTask ? -1 : 1;
      }

      // Then by relevance
      return b.relevance - a.relevance;
    });

  return sorted;
};
