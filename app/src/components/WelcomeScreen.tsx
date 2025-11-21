"use client";

interface WelcomePageProps {
  onGetStarted: () => void;
  onDemoMode: () => void;
}

export default function WelcomePage({ onGetStarted, onDemoMode }: WelcomePageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to OnTrack!</h1>

      <p className="text-lg text-gray-700 max-w-xl mb-10">
        OnTrack helps you stay organized, focused, and confident as you 
        navigate tasks, goals, and daily routines. Let’s walk you through 
        a quick setup to get everything tuned to your needs.
      </p>

      <button
        onClick={onGetStarted}
        className="px-6 py-3 mb-4 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
      >
        Get Started
      </button>

      <button
        onClick={onDemoMode}
        className="px-6 py-3 text-blue-600 underline hover:text-blue-800 transition"
      >
        Try Demo Mode
      </button>
    </div>
  );
}
