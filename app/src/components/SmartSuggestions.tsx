import { Suggestion } from "../types";
import Slider from "react-slick";
import { Button } from "./ui/button"; // (you can remove this if it's unused)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useState } from "react";

export default function SmartSuggestions({
  suggestions,
  onDismissSuggestion,
  onCreateTaskFromSuggestion,
  onCreateTemplateFromSuggestion
}: {
  suggestions: Suggestion[];
  onDismissSuggestion: (
    suggestionId: string,
    options?: { temporary?: boolean }
  ) => void;
  onCreateTaskFromSuggestion: (s: Suggestion) => void;
  onCreateTemplateFromSuggestion: (s: Suggestion) => void;
}) {
  const sliderSettings = {
    dots: true,
    infinite: suggestions.length > 1,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 10,
    adaptiveHeight: false,
  };
  
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);

  function openCreateChooser(s: Suggestion) {
    setSelectedSuggestion(s);
    setCreateOpen(true);
  }

  function handleCreateTask() {
    if (!selectedSuggestion) return;
    onCreateTaskFromSuggestion(selectedSuggestion);
    setCreateOpen(false);
    setSelectedSuggestion(null);
  }
  function handleCreateTemplate() {
    if (!selectedSuggestion) return;
    onCreateTemplateFromSuggestion(selectedSuggestion);
    setCreateOpen(false);
    setSelectedSuggestion(null);
  }
  
  return (
    <>
      {suggestions.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <h3 className="text-sm mb-1 text-[#312E81]">Smart Suggestions</h3>
              <p className="text-xs text-[#4C4799]">Tips from your assistant. Tap to create a task or template from a smart suggestion</p>
            </div>
          </div>

          <Slider {...sliderSettings} className="suggestions-carousel">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="px-1">
                <div className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between gap-3">
                  {/* Left: Snooze */}
                  <button
                    type="button"
                    onClick={() =>
                      onDismissSuggestion(suggestion.id, { temporary: true })
                    }
                    className="flex flex-col items-center text-xs text-blue-600"
                  >
                    <span className="leading-none text-sm tracking-tight">
                      Zzz
                    </span>
                    <span className="mt-1 text-[10px] text-[#4C4799]">
                      Snooze
                    </span>
                  </button>

                  {/* Middle: message */}
                  <button
                    type="button"
                    onClick={() => openCreateChooser(suggestion)}
                      className="flex-1 text-left"
                  >
                    <p className="flex-1 text-sm text-[#312E81]"> {suggestion.message}</p>
                  </button>

                  {/* Right: Dismiss */}
                  <button
                    type="button"
                    onClick={() => onDismissSuggestion(suggestion.id)}
                    className="flex flex-col items-center text-xs text-secondary"
                  >
                    <span className="leading-none text-sm">✕</span>
                    <span className="mt-1 text-[10px] text-[#4C4799]">
                      Dismiss
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
      {/* Create-from-suggestion chooser dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create from suggestion</DialogTitle>
            <DialogDescription>
              Choose whether to create a task or save as a reusable template.
            </DialogDescription>
          </DialogHeader>

          {selectedSuggestion && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm text-[#312E81]">{selectedSuggestion.message}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate} variant="secondary" className="text-white">
                  Save as Template
                </Button>
                <Button onClick={handleCreateTask}>
                  Create Task
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
