import { Button } from "./ui/button";
import { Sparkles, Calendar, Bell } from "lucide-react";
import { ImageWithFallback } from "./ui/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-slate-900">OnTrack</span>
          </div>
          <Button variant="outline" className="rounded-full">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="container mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full">
              <Bell className="w-4 h-4" />
              <span className="text-sm">
                No account required • 100% private
              </span>
            </div>

            <h1 className="text-slate-900">
              Life admin, simplified.
              <span className="block text-emerald-600 mt-2">
                Stay on track, effortlessly.
              </span>
            </h1>

            <p className="text-slate-600 text-lg max-w-lg">
              Smart reminders for everything life throws at you. From passport
              renewals to dental checkups, OnTrack keeps you organized with
              context-aware suggestions and zero hassle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                Download for iOS
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                Download for Android
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Syncs with your calendar</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>AI-powered suggestions</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-4">
              {/* <ImageWithFallback
                src="https://images.unsplash.com/photo-1657040298726-7189d3090d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbml6ZWQlMjB0YXNrcyUyMGNhbGVuZGFyfGVufDF8fHx8MTc2MTU3NzY4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="OnTrack app interface"
                className="w-full h-auto rounded-2xl"
              /> */}
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-200 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-200 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
