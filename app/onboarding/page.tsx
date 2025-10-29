'use client';

import { useRouter } from 'next/navigation';
import { Onboarding } from '@/components/Onboarding';
import { storage } from '@/utils/storage';
import { DEFAULT_CATEGORIES, type UserProfile } from '@/types';

export default function OnboardingPage() {
  const router = useRouter();

  // NOTE: Your Onboarding currently passes trackedCategories as *names*.
  // To be robust, this handler accepts *names or ids* and normalizes.
  const handleOnboardingComplete = (data: {
    trackedCategories: string[];
    age?: string;
    gender?: string;
  }) => {
    const picked = new Set(data.trackedCategories);

    // Normalize: allow either category *names* or *ids* coming in.
    const chosen = DEFAULT_CATEGORIES.filter(
      (cat) => picked.has(cat.name) || picked.has(cat.name)
    ).map((cat, index) => ({
      ...cat,
      // create stable-ish ids for runtime usage (like your App does)
      id: `category-${Date.now()}-${index}`,
    }));

    const profile: UserProfile = {
      trackedCategories: data.trackedCategories, // keep as-is (names or ids)
      age: data.age,
      gender: data.gender,
      hasCompletedOnboarding: true,
      calendarIntegration: true,
      notificationsEnabled: true,
    };

    storage.saveUserProfile(profile);
    storage.saveCategories(chosen);

    // go back to the main app (your App component will see the saved profile and skip onboarding)
    router.push('/');
  };

  return <Onboarding onComplete={handleOnboardingComplete} />;
}
