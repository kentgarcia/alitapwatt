import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Eraser } from "lucide-react";
import { useState } from "react";
import { useEnergyData } from "@/lib/storage/context";
import teachImg from "../../assets/teach.png";
import ideaImg from "../../assets/idea.png";
import thinkingImg from "../../assets/thinking.png";
import happyImg from "../../assets/happy.png";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("alitapwatt_data");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.onboardingComplete) throw redirect({ to: "/home" });
      } catch (e) {
        if (e instanceof redirect) throw e;
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Welcome to AlitapWatt — Quick Tour" },
      { name: "description", content: "Discover how AlitapWatt helps you scan, understand, and reduce your electricity bill." },
    ],
  }),
});

const slides = [
  {
    img: teachImg,
    title: "Scan your Meralco bill",
    desc: "Just snap a photo. AlitapWatt reads your kWh, charges, and due date in seconds.",
  },
  {
    img: ideaImg,
    title: "AI-powered Tipid Tips",
    desc: "Get personalized insights on which appliances eat the most kuryente and how to save.",
  },
  {
    img: thinkingImg,
    title: "Stay ahead of your bill",
    desc: "Smart forecasts and alerts so you never get surprised at the end of the month.",
  },
];

const TOTAL_STEPS = 4;

function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useEnergyData();
  const [step, setStep] = useState(0);
  const isLastSlide = step === slides.length - 1;
  const isChoiceScreen = step === TOTAL_STEPS - 1;
  const slide = slides[step];

  const next = () => {
    if (isLastSlide) setStep(step + 1);
    else setStep((s) => s + 1);
  };

  const choose = (seed: boolean) => {
    completeOnboarding(seed);
    navigate({ to: "/home" });
  };

  if (isChoiceScreen) {
    return (
      <MobileFrame>
        <div className="relative flex min-h-screen lg:min-h-full flex-col px-6 py-8 overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
            <img src={happyImg} alt="" className="h-24 w-24 object-contain" />
            <div className="space-y-2 max-w-xs">
              <h1 className="text-2xl font-bold tracking-tight">You're all set!</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Would you like to start with sample data or begin fresh?
              </p>
            </div>
            <div className="w-full space-y-3 max-w-xs">
              <Button variant="default" size="lg" className="w-full py-5 text-base" onClick={() => choose(true)}>
                <Sparkles size={18} /> Try with Sample Data
              </Button>
              <Button variant="outline" size="lg" className="w-full py-5 text-base" onClick={() => choose(false)}>
                <Eraser size={18} /> Start Fresh
              </Button>
            </div>
          </div>
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <div className="relative flex min-h-screen lg:min-h-full flex-col px-6 py-8 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-8 bg-primary" : "w-4 bg-primary/20"
                }`}
              />
            ))}
          </div>
          <button onClick={() => choose(true)} className="text-xs font-medium text-muted-foreground hover:text-primary transition">
            Skip
          </button>
        </div>

        {/* Floating fireflies */}
        <span className="absolute top-32 left-8 h-2 w-2 rounded-full bg-primary-soft animate-firefly" />
        <span className="absolute top-52 right-10 h-1.5 w-1.5 rounded-full bg-primary animate-firefly" style={{ animationDelay: "0.8s" }} />
        <span className="absolute bottom-56 left-14 h-2 w-2 rounded-full bg-primary-soft animate-firefly" style={{ animationDelay: "1.4s" }} />

        {/* Content */}
        <div className="relative flex-1 flex flex-col items-center justify-center text-center">
          <div
            key={step}
            className="animate-float-up flex flex-col items-center gap-8"
          >
            <div className="h-56 w-56">
              <img src={slide.img} alt="" className="h-full w-full object-contain" />
            </div>

            <div className="space-y-3 max-w-xs">
              <h1 className="text-2xl font-bold tracking-tight">{slide.title}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">{slide.desc}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative space-y-3">
          <Button variant="default" size="lg" className="w-full py-4 text-base active:scale-[0.98]" onClick={next}>
            {isLastSlide ? "Continue" : "Next"} <ArrowRight size={18} />
          </Button>
          {!isLastSlide && (
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="w-full text-xs text-muted-foreground disabled:opacity-0 transition"
            >
              Back
            </button>
          )}
          {isLastSlide && <div className="h-[18px]" />}
        </div>
      </div>
    </MobileFrame>
  );
}
