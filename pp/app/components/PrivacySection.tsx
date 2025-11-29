import { Card } from "./ui/card";
import { Shield, Lock, Database, Eye } from "lucide-react";

const privacyFeatures = [
  {
    icon: Shield,
    title: "No Account Required",
    description:
      "Start using OnTrack immediately. No signup, no password, no hassle.",
  },
  {
    icon: Database,
    title: "Local-First Storage",
    description:
      "All your data lives on your device. We never see or store your personal information.",
  },
  {
    icon: Lock,
    title: "Zero Tracking",
    description:
      "No analytics, no cookies, no tracking. Your activity is completely private.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description:
      "You're always in control. Export or delete your data anytime.",
  },
];

export function PrivacySection() {
  return (
    <section
      className="py-20 bg-gradient-to-b from-[#1b1944] to-[#141231] text-white"
      id="privacy"
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-base font-semibold text-lg">Privacy First</span>
          </div>
          <h2 className="text-white mb-4 text-4xl md:text-3xl font-semibold">Your data belongs to you</h2>
          <p className="text-slate-300 text-lg">
            OnTrack is built with privacy at its core. Store personal documents
            and tasks with ease. Everything stays on your device, giving you 
            complete control and peace of mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {privacyFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-8 bg-white/10 border-2 border-white/20 backdrop-blur-md hover:bg-white/15 hover:border-white/30 transition-all duration-300"
            >
              <feature.icon className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-6">
            Built for people who value their privacy without compromising on
            functionality.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 font-semibold text-lg">
              100% offline-capable • No cloud required
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
