import { Suggestion } from "../types";
import Slider from "react-slick";
import { Button } from "./ui/button";

export default function SmartSuggestions({
  suggestions,
  onDismissSuggestion,
}: {
  suggestions: Suggestion[];
  onDismissSuggestion: (suggestionId: string) => void;
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

  return (
    <>
      {suggestions.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <h3 className="text-sm mb-1 text-[#312E81]">Smart Suggestions</h3>
              <p className="text-xs text-[#4C4799]">Tips from your assistant</p>
            </div>
          </div>

          <Slider {...sliderSettings} className="suggestions-carousel">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="px-1">
                <div className="bg-white rounded-xl p-3 shadow-sm flex items-center">
                  <p className="text-sm text-[#312E81] w-[95%]">
                    {suggestion.message}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDismissSuggestion(suggestion.id)}
                    className="h-8 text-secondary"
                  >
                    ✕
                  </Button>
                  {/* </div> */}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </>
  );
}
