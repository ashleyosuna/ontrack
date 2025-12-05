import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Bell,
  Home,
  Calendar,
  Plus,
  Settings,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Shield,
} from "lucide-react";
import { ImageWithFallback } from "./ui/ImageWithFallback";

export function ScreenShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-slate-900 mb-4 text-2xl font-semibold">
            Beautifully designed, thoughtfully crafted
          </h2>
          <p className="text-slate-600 text-lg">
            Every screen is designed to help you get things done quickly and
            intuitively
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto justify-items-center">
          {/* Home Dashboard Mockup */}
          <ImageWithFallback
            className="rounded-lg border border-[#403ca1] md:w-[300px]"
            src={"home.png"}
          />
          <ImageWithFallback
            className="rounded-lg border border-[#403ca1] md:w-[272px]"
            src={"create2.png"}
          />
          <ImageWithFallback
            className="rounded-lg border border-[#403ca1] sm:w-[360px]"
            src="sampleCategory.png"
          />
          
        </div>
      </div>
    </section>
  );
}
