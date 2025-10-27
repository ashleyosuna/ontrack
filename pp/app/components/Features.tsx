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
      "Organize tasks by home maintenance, health, taxes, subscriptions, warranties, and more. Use templates or create custom categories.",
    color: "from-blue-400 to-blue-500",
  },
  {
    icon: Calendar,
    title: "Calendar Integration",
    description:
      "Seamlessly sync with Google Calendar and other services. OnTrack automatically categorizes and organizes imported events.",
    color: "from-emerald-400 to-emerald-500",
  },
  {
    icon: ScanLine,
    title: "Document Scanning",
    description:
      "Scan and attach important documents to tasks. Keep receipts, warranties, and paperwork organized in one place.",
    color: "from-teal-400 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "Context-Aware Assistant",
    description:
      'Get intelligent suggestions based on your tasks. "Your trip is in 3 months—check your passport expiry" and more.',
    color: "from-purple-400 to-purple-500",
  },
  {
    icon: ThumbsUp,
    title: "Learning Preferences",
    description:
      "React with 'more like this' or 'less like this' to train the assistant to match your preferences perfectly.",
    color: "from-pink-400 to-pink-500",
  },
  {
    icon: Shield,
    title: "100% Local Storage",
    description:
      "All your data stays on your device. No accounts, no cloud, no tracking. Your privacy is guaranteed.",
    color: "from-slate-400 to-slate-500",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-slate-900 mb-4">
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
