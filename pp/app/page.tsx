import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { ScreenShowcase } from "./components/ScreenShowcase";
import { PrivacySection } from "./components/PrivacySection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <Hero />
      <HowItWorks />
      <Features />
      <ScreenShowcase />
      <PrivacySection />
      <Footer />
    </div>
  );
}
