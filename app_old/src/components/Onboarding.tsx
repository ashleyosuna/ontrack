import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DEFAULT_CATEGORIES } from '../types';

interface OnboardingProps {
  onComplete: (data: {
    trackedCategories: string[];
    age?: string;
    gender?: string;
  }) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleContinue = () => {
    if (step === 1 && selectedCategories.length > 0) {
      setStep(2);
    } else if (step === 2) {
      onComplete({
        trackedCategories: selectedCategories,
        age: age || undefined,
        gender: gender || undefined,
      });
    }
  };

  const handleSkip = () => {
    onComplete({
      trackedCategories: selectedCategories,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-lg">
        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="text-5xl mb-3">📱</div>
              <h1 className="mb-2">Welcome to OnTrack</h1>
              <p className="text-muted-foreground text-sm">
                What do you want to keep track of?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto">
              {DEFAULT_CATEGORIES.map((category) => (
                <div
                  key={category.name}
                  onClick={() => toggleCategory(category.name)}
                  className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-95"
                  style={{
                    borderColor: selectedCategories.includes(category.name)
                      ? category.color
                      : '#e5e7eb',
                    backgroundColor: selectedCategories.includes(category.name)
                      ? `${category.color}15`
                      : 'transparent',
                  }}
                >
                  <Checkbox
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => toggleCategory(category.name)}
                  />
                  <span className="text-2xl">{category.icon}</span>
                  <Label className="cursor-pointer flex-1">{category.name}</Label>
                </div>
              ))}
            </div>

            <Button
              onClick={handleContinue}
              disabled={selectedCategories.length === 0}
              className="w-full h-12"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="text-5xl mb-3">👤</div>
              <h2 className="mb-2">Personalize</h2>
              <p className="text-muted-foreground text-sm">
                Optional. Helps us give better suggestions.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age Range</Label>
                <Select value={age} onValueChange={setAge}>
                  <SelectTrigger id="age" className="h-12">
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55-64">55-64</SelectItem>
                    <SelectItem value="65+">65+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender" className="h-12">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleContinue} className="w-full h-12">
                Get Started
              </Button>
              <Button onClick={handleSkip} variant="outline" className="w-full h-12">
                Skip
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}