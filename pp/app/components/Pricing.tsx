import { Card } from "./ui/card";
import { Check, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const features = [
  "Unlimited tasks and categories",
  "Pre-made templates for common life tasks",
  "Smart suggestions and reminders",
  "Document storage and attachments",
  "Calendar integration",
  "Customizable reminder settings",
  "100% local data storage—complete privacy",
  "Export your data anytime",
];

export function Pricing() {
  return (
    <section className="py-20 bg-gradient-to-b from-cyan-50 to-emerald-50 relative overflow-hidden">
      {/* Decorative shapes */}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-slate-900 mb-4 text-4xl font-bold">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-600 text-lg">
            Try OnTrack today! 
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-10 border-2 border-[#43797A] shadow-2xl bg-white relative overflow-hidden">
            {/* Accent decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-100 to-blue-100 opacity-50 rounded-bl-full"></div>

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-200 text-primary rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Best Choice</span>
              </div>

              {/* Pricing header */}
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-slate-900 mb-2">
                  What OnTrack Offers
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-[#43797A]">
                    $0.99
                  </span>
                  <span className="text-slate-600 text-lg">/month</span>
                </div>
                <p className="text-slate-600 text-lg">
                  <strong className="text-[#43797A]">Free to download.</strong> Pay to use.
                </p>
              </div>

              {/* Features list */}
              <div className="space-y-4 mb-8">
                <p className="text-slate-900 font-semibold text-lg mb-4">
                  Everything you need to stay organized:
                </p>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#a2cecf] flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-[#43797A]" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-[#F9FAFC] to-[#a2cecf]/10 rounded-2xl p-6 border-2 border-[#a2cecf]/30">
                <p className="text-slate-700 mb-4 text-center">
                  Join the waitlist to be notified when we launch
                </p>
                <a href="#waitlist">
                  <Button className="w-full h-12 bg-gradient-to-r from-[#43797A] to-[#2d5f60] hover:from-[#2d5f60] hover:to-[#43797A] text-white font-semibold text-lg">
                    Get Early Access
                  </Button>
                </a>


              </div>
            </div>
          </Card>

          {/* Additional info */}
          <p className="text-center text-slate-500 text-sm mt-6">
            No credit card required to download. Cancel anytime—your data stays with you.
          </p>
        </div>
      </div>
    </section>
  );
}