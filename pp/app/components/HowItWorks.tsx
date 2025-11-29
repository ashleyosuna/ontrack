import { ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Add your tasks",
    description:
      "Create tasks manually or import them from your calendar. OnTrack will automatically categorize them.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    step: "02",
    title: "Get smart suggestions",
    description:
      "The assistant analyzes your tasks and provides timely, context-aware reminders and helpful tips.",
    color: "bg-teal-100 text-teal-700",
  },
  {
    step: "03",
    title: "Stay on track",
    description:
      "Review your dashboard, react to suggestions, and let OnTrack keep you organized automatically.",
    color: "bg-[#E4F8F0] text-teal-700",
  }
];

export function HowItWorks() {
  return (
   
   <section className="py-20 bg-gradient-to-br from-cyan-600 to-teal-500 relative overflow-hidden text-white">
     
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-white mb-4 text-3xl font-semibold">
            How it works
          </h2>

          <p className="text-white/90 text-lg">
            Three simple steps to a more organized life
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center`}
                  >
                    <span className="text-xl">{item.step}</span>
                  </div>
                  <h3 className="text-white-900">{item.title}</h3>
                  <p className="text-white-600">{item.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%]">
                    <ArrowRight className="w-8 h-6 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
