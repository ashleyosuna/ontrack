import { Card } from "./ui/card";
import {
  Home,
  Heart,
  FileText,
  Calendar,
  Sparkles,
  ScanLine,
  Tag,
  ThumbsUp,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Tag,
    title: "Smart Categorization",
    description:
      "Organize tasks by home maintenance, health, taxes, subscriptions, warranties, and more. Use our templates or create your own custom categories.",
    color: "from-teal-400 to-blue-300",
  },
  {
    icon: Calendar,
    title: "Calendar Integration",
    description:
      "Seamlessly sync with Google Calendar and other services. OnTrack automatically categorizes and organizes imported events.",
    color: "from-emerald-400 to-cyan-500",
  },
  {
    icon: ScanLine,
    title: "Document Scanning",
    description:
      "Scan or upload photos of receipts, warranties, insurance cards, and other paperwork. Keep everything organized and in one place.",
    color: "from-cyan-400 to-teal-400",
  },
  {
    icon: Sparkles,
    title: "Context-Aware Assistant",
    description:
      'Get smart suggestions of other things you might forget to keep track of. "Your trip is in 3 months—make sure your passport is renewed!" and more.',
    color: "from-emerald-300 to-cyan-400",
  },
  {
    icon: ThumbsUp,
    title: "Your Life Admin in One Place",
    description:
      "Stop juggling Google Calendar, Notes, banking apps, and email. OnTrack ensures you're not constantly switching between apps trying to remember where you wrote something down.",
    color: "from-cyan-300 to-blue-400",
  },
  {
    icon: Shield,
    title: "100% Private",
    description:
      "Everything stays on your device. No accounts necessary, no cloud storage, no one tracking your data. Your privacy is guaranteed.",
    color: "from-cyan-400 to-cyan-600",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-slate-900 mb-4 text-3xl font-semibold">
            Everything you need to stay organized
          </h2>
          <p className="text-slate-600 text-lg">
            OnTrack combines smart automation with intuitive design to help you
            manage life's important tasks without the overwhelm.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
