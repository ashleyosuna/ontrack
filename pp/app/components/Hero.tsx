"use client";

import { Button } from "./ui/button";
import { Sparkles, Calendar, Bell } from "lucide-react";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { Input } from "./ui/input";
import { addToNewsletter } from "../actions/newsletter";

export function Hero() {
  const formAction = (formData: FormData) => {
    const email = formData.get("email");
    try {
      addToNewsletter(email as string);
    } catch (err) {
      console.error("Error adding to newsletter");
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="lg:py-10 bg-gradient-to-br from-purple-100 to-cyan-100">
        {/* Logo Banner */}
        <div className="w-full">
          <div className="container mx-auto px-6 flex justify-center">
            <img 
              src="OnTrack_Banner_Logo.webp" 
              alt="OnTrack logo" 
              className="h-37 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 mt-5 mb-15">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-200 text-slate-900 rounded-full">
              <Bell className="w-4 h-4" />
              <span className="text-sm">
                Your data stays on your device • 100% private
              </span>
            </div>

            <div className="text-slate-900">
              <h1 className="text-3xl font-semibold">
                Your personal assistant for life tasks
              </h1>
              <span className="block text-primary mt-2">
                Never miss a renewal, deadline, or checkup again.
              </span>
            </div>

            <p className="text-slate-800 text-lg max-w-lg">
              Your digital filing cabinet in one device. With OnTrack,
              set smart reminders for everything life throws at you.
              From passport renewals, car insurance, annual checkups. 
              OnTrack keeps you organized with context-aware suggestions 
              and zero hassle.
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
              <span className="text-slate-800 text-lg max-w-lg">
                We're almost ready to launch! Be the first to know.
              </span>
              <form
                className="flex flex-col md:flex-row gap-2"
                action={formAction}
              >
                <Input
                  className="md:w-2/3 border-[#403ca1] bg-white h-[40px]"
                  placeholder="Enter your email"
                  name="email"
                  // onChange={(e) => setEmail(e.target.value)}
                />
                <Button className="h-[40px]">Submit</Button>
              </form>
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
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-4 aspect-[14/8.5]">
              <ImageWithFallback
                src={"heroimage.png"}
                alt="OnTrack app interface"
                className="w-full h-full object-cover rounded-2xl"
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
