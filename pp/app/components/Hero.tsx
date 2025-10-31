import { Button } from "./ui/button";
import { Sparkles, Calendar, Bell } from "lucide-react";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { Input } from "./ui/input";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-slate-900">OnTrack</span>
          </div>
          {/* <Button variant="outline" className="rounded-full" disabled>
            Get Started
          </Button> */}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="container mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-primary rounded-full">
              <Bell className="w-4 h-4" />
              <span className="text-sm">
                No account required • 100% private
              </span>
            </div>

            <div className="text-slate-900">
              <h1 className="text-2xl font-semibold">
                Life admin, simplified.
              </h1>
              <span className="block text-primary mt-2">
                Stay on track, effortlessly.
              </span>
            </div>

            <p className="text-slate-600 text-lg max-w-lg">
              Smart reminders for everything life throws at you. From passport
              renewals to dental checkups, OnTrack keeps you organized with
              context-aware suggestions and zero hassle.
            </p>

            {/* TODO: uncomment once we have an MVP */}
            {/* <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="rounded-full bg-primary hover:from-emerald-600 hover:to-teal-700"
              >
                Download for iOS
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                Download for Android
              </Button>
            </div> */}

            <div className="flex flex-col gap-4">
              <span className="text-slate-600 text-lg max-w-lg">
                We're almost ready to launch! Be the first one to be notified.
              </span>
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  className="md:w-2/3 border-primary bg-white h-[40px]"
                  placeholder="Enter your email"
                />
                <Button className="h-[40px]">Submit</Button>
              </div>
            </div>

            {/* <div className="flex items-center gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Syncs with your calendar</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Context-aware suggestions</span>
              </div>
            </div> */}
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1657040298726-7189d3090d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbml6ZWQlMjB0YXNrcyUyMGNhbGVuZGFyfGVufDF8fHx8MTc2MTU3NzY4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="OnTrack app interface"
                className="w-full h-auto rounded-2xl"
              />
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
