import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CategoryIcon } from "./CategoryIcon";
import { Category, DEFAULT_CATEGORIES } from "../types";
import { Sparkles } from "lucide-react";
import React from "react";

interface OnboardingProps {
  onComplete: (data: {
    preferredCategories: string[];
    age?: string;
    gender?: string;
  }) => void;
  onDemoMode: () => void;
}

function CategoryCard({
  category,
  onSelect,
  isSelected,
  bgColor,
}: {
  category: Category;
  onSelect: () => void;
  isSelected: boolean;
  bgColor: string;
}) {
  return (
    <div
      className={`flex flex-col justify-center rounded-xl items-center py-4 shadow-sm`}
      style={{
        backgroundColor: bgColor,
        border: `2px solid ${category.color}60`,
      }}
      onClick={onSelect}
    >
      <div className="flex w-full px-2 gap-2 items-center">
        <CategoryIcon
          iconName={category.icon}
          size={20}
          color={category.color}
          className=""
        />
        <div>
          <div className="flex-grow leading-tight font-semibold text-gray-700">
            {category.name}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Onboarding({ onComplete, onDemoMode }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");

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
        preferredCategories: selectedCategories,
        age: age || undefined,
        gender: gender || undefined,
      });
    }
  };

  const handleSkip = () => {
    onComplete({
      preferredCategories: selectedCategories,
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-green-50"
      style={{
        paddingTop: "calc(var(--safe-area-inset-top) + 15px)",
        paddingBottom: "var(--safe-area-inset-bottom)",
      }}
    >
      <div className="bg-white w-full max-w-md rounded-3xl px-2 py-4 shadow-lg border">
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <img width={60} src="logo.webp" className="mx-auto" />
              <h1 className="text-[#312E81] text-2xl">Welcome to OnTrack</h1>
              <p className="text-[#4C4799] text-sm">
                What areas are most relevant to you? This helps us provide
                better suggestions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto auto-rows-fr">
              {DEFAULT_CATEGORIES.map((category, idx) => {
                const isSelected = selectedCategories.includes(category.name);
                return (
                  <CategoryCard
                    category={{ ...category, id: idx.toString() }}
                    onSelect={() => toggleCategory(category.name)}
                    isSelected={selectedCategories.includes(category.name)}
                    bgColor={isSelected ? `${category.color}50` : "white"}
                  />
                  // <div
                  //   key={category.name}
                  //   onClick={() => toggleCategory(category.name)}
                  //   className="bg-white rounded-2xl p-4 cursor-pointer transition-all active:scale-95 shadow-sm relative"
                  //   style={{
                  //     borderTop: `4px solid ${category.color}`,
                  //     backgroundColor: isSelected
                  //       ? `${category.color}10`
                  //       : "white",
                  //   }}
                  // >
                  //   <div className="absolute top-2 left-2">
                  //     <Checkbox
                  //       checked={isSelected}
                  //       onCheckedChange={() => toggleCategory(category.name)}
                  //     />
                  //   </div>
                  //   <div className="text-center space-y-1.5 pt-2">
                  //     <div className="mb-1 flex justify-center">
                  //       <CategoryIcon
                  //         iconName={category.icon}
                  //         size={48}
                  //         color={category.color}
                  //       />
                  //     </div>
                  //     <h4 className="text-sm text-[#312E81]">
                  //       {category.name}
                  //     </h4>
                  //   </div>
                  // </div>
                );
              })}

              {/* Custom Category Option */}
              {/* {(() => {
                const isSelected = selectedCategories.includes("Custom");
                return (
                  <div
                    key="custom"
                    onClick={() => toggleCategory("Custom")}
                    className="bg-white rounded-2xl p-4 cursor-pointer transition-all active:scale-95 shadow-sm relative"
                    style={{
                      borderTop: `4px solid #9333EA`,
                      backgroundColor: isSelected ? "#9333EA10" : "white",
                    }}
                  >
                    <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleCategory("Custom")}
                      />
                    </div>
                    <div className="text-center space-y-1.5 pt-2">
                      <div className="mb-1 flex justify-center">
                        <CategoryIcon
                          iconName="Star"
                          size={48}
                          color="#9333EA"
                        />
                      </div>
                      <h4 className="text-sm text-[#312E81]">Custom</h4>
                    </div>
                  </div>
                );
              })()} */}
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleContinue}
                disabled={selectedCategories.length === 0}
                className="w-full h-12 bg-[#312E81] text-[#F8FAFC] hover:bg-[#4338CA]"
              >
                Continue
              </Button>
              <Button
                onClick={onDemoMode}
                variant="outline"
                className="w-full h-12 border-[#312E81] text-[#312E81] hover:bg-[#312E81]/10"
              >
                Try me in Demo Mode
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              {/* <Sparkles className="h-12 w-12 text-[#2C7A7B] mx-auto" /> */}
              <img width={60} src="logo.webp" className="mx-auto" />
              <h2 className="text-[#312E81] text-2xl">Personalize</h2>
              <p className="text-[#4C4799] text-sm">
                Optional. Helps us give better suggestions.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-[#312E81]">
                  Age Range
                </Label>
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
                <Label htmlFor="gender" className="text-[#312E81]">
                  Gender
                </Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender" className="h-12">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleContinue}
                className="w-full h-12 bg-[#312E81] text-[#F8FAFC] hover:bg-[#4338CA]"
              >
                Get Started
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="w-full h-12 border-[#312E81] text-[#312E81] hover:bg-[#312E81]/10"
              >
                Skip
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
