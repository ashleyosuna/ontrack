import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Card } from "./ui/card";
import { Plus, FileText, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface TaskCreationModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMode: (mode: "quick" | "template" | "create-template") => void;
  onCancel: () => void;
}

export function TaskCreationModeDialog({
  open,
  onOpenChange,
  onSelectMode,
  onCancel,
}: TaskCreationModeDialogProps) {
  const [selectedOption, setSelectedOption] = useState();

  const handleNext = () => {
    if (!selectedOption) return;
    onSelectMode(selectedOption);
  };
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold">
        Create a New Task
      </h1>
      <h2 className="text-secondary">
        Choose how you'd like to create your task
      </h2>
      <div className="grid gap-3 py-4 max-w-md">
        {/* Quick Add */}
        <Card
          className={`p-6 cursor-pointer hover:border-primary hover:shadow-md transition-all active:scale-[0.98] border-2 ${
            selectedOption === "quick"
              ? "bg-gradient-to-r from-blue-50 to-green-50 border-primary shadow-md"
              : "bg-white text-[#312E81]"
          }`}
          onClick={() => {
            // onSelectMode("quick");
            // onOpenChange(false);
            setSelectedOption("quick");
          }}
        >
          <div className="flex items-start gap-4">
            <div className="bg-[#312E81] p-3 rounded-xl">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#312E81] mb-1">Quick Add</h3>
              <p className="text-sm text-[#4C4799]">
                Start from scratch and create a custom task
              </p>
            </div>
          </div>
        </Card>

        {/* Add from Template */}
        <Card
          className={`p-6 cursor-pointer hover:border-primary hover:shadow-md transition-all active:scale-[0.98] border-2 ${
            selectedOption === "template"
              ? "bg-gradient-to-r from-blue-50 to-green-50 border-primary shadow-md"
              : "bg-white text-[#312E81]"
          }`}
          onClick={() => {
            // onSelectMode("template");
            // onOpenChange(false);
            setSelectedOption("template");
          }}
        >
          <div className="flex items-start gap-4">
            <div className="bg-[#2C7A7B] p-3 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#312E81] mb-1">Add from Template</h3>
              <p className="text-sm text-[#4C4799]">
                Choose from pre-built or custom templates
              </p>
            </div>
          </div>
        </Card>

        {/* Create Template */}
        <Card
          className={`p-6 cursor-pointer hover:border-primary hover:shadow-md transition-all active:scale-[0.98] border-2 ${
            selectedOption === "create-template"
              ? "bg-gradient-to-r from-blue-50 to-green-50 border-primary shadow-md"
              : "bg-white text-[#312E81]"
          }`}
          onClick={() => {
            // onSelectMode("create-template");
            // onOpenChange(false);
            setSelectedOption("create-template");
          }}
        >
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-3 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className=" mb-1">Create Template</h3>
              <p className="text-sm">
                Build a reusable template for recurring tasks
              </p>
            </div>
          </div>
        </Card>

        <Button
          className="mt-4"
          onClick={handleNext}
          disabled={!selectedOption}
        >
          Next <ArrowRight />
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
