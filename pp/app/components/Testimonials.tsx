import { Card } from "./ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "The fact that things are organized into categories is the main improvement over a spreadsheet. I can actually see what's coming up at a glance.",
    name: "Sarah, 27",
    role: "Recent Grad",
    color: "from-emerald-400 to-cyan-500",
  },
  {
    quote: "I always forget to change my car's oil. With OnTrack, I get a notification based on mileage and other car-related things. That's exactly what I need.",
    name: "Marcus, 26",
    role: "New Car Owner",
    color: "from-emerald-300 to-cyan-400",
  },
  {
    quote: "I have lists everywhere. Notes, Google Calendar, random papers. OnTrack helps me keep everything in one place which is such a relief.",
    name: "Jamie, 29",
    role: "Massage Therapist",
    color: "from-sky-300 to-emerald-400",
  },
  {
    quote: "I didn't even know I should be tracking half these things. The templates show me what I'm missing and the reminders are so helpful for keeping me on track.",
    name: "Alex, 24",
    role: "First-Time Renter",
    color: "from-teal-500 to-cyan-400",
  },
];

export function Testimonials() {
  return (
    <section className="py-15 bg-white relative overflow-hidden">

  
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-slate-900 mb-4 text-4xl font-bold">
            What early users are saying
          </h2>
          <p className="text-slate-600 text-lg">
            Real feedback from our customer validation interviews
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 border-2 border-slate-200 hover:shadow-xl hover:border-primary transition-all duration-300 relative"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center mb-4`}
              >
                <Quote className="w-6 h-6 text-white" />
              </div>
              <p className="text-slate-700 text-lg mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-slate-200 pt-4">
                <p className="text-slate-900 font-semibold">
                  {testimonial.name}
                </p>
                <p className="text-slate-500 text-sm">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}