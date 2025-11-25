"use client";

import { useEffect } from "react";

interface LoadingPageProps {
  onFinishLoading: () => void;
}

export default function LoadingPage({ onFinishLoading }: LoadingPageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinishLoading();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinishLoading]);

  return (

    <div className="flex items-center justify-center min-h-screen px-6">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200 shadow-md max-w-md mx-auto text-center">
            <h1 className="text-sm font-bold text-[#312E81] mb-2">
            Loading your dashboard based on your preferences...
            </h1>
            <p className="text-xs text-[#4C4799] mt-4 leading-relaxed">
            Smart Suggestions will highlight habits you might want to track — helping you
            discover what you don’t know yet!
            </p>
        </div>
    </div>

    
  );
}
