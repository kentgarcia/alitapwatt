import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Eraser, Check, Home, Zap, Users, Lightbulb, Target, Thermometer, Refrigerator, Tv, Fan, ChefHat, WashingMachine, Monitor, Microwave, ChefHat as WaterHeater } from "lucide-react";
import { useState } from "react";
import { useEnergyData } from "@/lib/storage/context";
import { EMPTY_ENERGY } from "@/lib/storage/seed";
import type { AppEnergyData } from "@/lib/storage/schema";
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
  { img: teachImg, title: "Scan your electricity bill", desc: "Just snap a photo. AlitapWatt reads your kWh, charges, and due date in seconds." },
  { img: ideaImg, title: "AI-powered Tipid Tips", desc: "Get personalized insights on which appliances eat the most kuryente and how to save." },
  { img: thinkingImg, title: "Stay ahead of your bill", desc: "Smart forecasts and alerts so you never get surprised at the end of the month." },
];

const householdTypes = ["Family Home", "Apartment / Condo", "Boarding House", "Dormitory", "Shared Household", "Small Business + Home"];
const energyConcerns = ["My bill is too high", "I don't understand my bill", "I want to track appliance usage", "I want to avoid bill shock", "I want to stay within budget", "I share a meter with others", "I just want to monitor usage"];
const billRanges = ["Below ₱1,000", "₱1,000 – ₱3,000", "₱3,000 – ₱5,000", "₱5,000 – ₱8,000", "₱8,000+"];
const householdSizes = ["1–2", "3–5", "6–8", "9+"];
const goals = ["Save money monthly", "Reduce appliance usage", "Understand my bill better", "Avoid surprise bills", "Monitor household consumption", "Build better energy habits"];

const allApplianceOptions = [
  { name: "Air Conditioner", icon: Thermometer },
  { name: "Refrigerator", icon: Refrigerator },
  { name: "Rice Cooker", icon: ChefHat },
  { name: "Electric Fan", icon: Fan },
  { name: "Television", icon: Tv },
  { name: "Washing Machine", icon: WashingMachine },
  { name: "Gaming PC", icon: Monitor },
  { name: "Water Heater", icon: Zap },
  { name: "Microwave", icon: Microwave },
  { name: "Lights", icon: Lightbulb },
];

const billRangeValues = [500, 2000, 4000, 6500, 10000];

type Answers = {
  householdType: string;
  energyConcern: string;
  billRange: string;
  householdSize: string;
  appliances: string[];
  goal: string;
};

function generateProfile(a: Answers): { estimatedBill: number; usage: number; highConsumer: string; savingsRange: string } {
  const billIdx = Math.max(0, billRanges.indexOf(a.billRange));
  const estimatedBill = billRangeValues[billIdx] || 2500;
  const usage = Math.round(estimatedBill / 12);
  const highConsumer = a.appliances.includes("Air Conditioner") ? "Air Conditioner" : a.appliances[0] || "Refrigerator";
  const savingsMin = Math.round(estimatedBill * 0.08);
  const savingsMax = Math.round(estimatedBill * 0.22);
  return { estimatedBill, usage, highConsumer, savingsRange: `₱${savingsMin}–₱${savingsMax}` };
}

function generateDailyData(base: number): number[] {
  const variance = [0.7, 0.9, 0.6, 1.0, 0.8, 1.2, 1.4];
  return variance.map(v => Math.round(base * v));
}

function generateWeekData(base: number): number[] {
  const variance = [1.1, 1.3, 0.9, 1.5, 1.2, 1.7, 1.8];
  return variance.map(v => Math.round(base * v));
}

function generatePeakHours(base: number): number[] {
  const hourly = [0.2, 0.15, 0.1, 0.1, 0.3, 0.6, 0.8, 1.0, 0.9, 0.7, 0.4, 0.2];
  return hourly.map(h => Math.round(base * h));
}

function buildEnergyData(a: Answers): AppEnergyData {
  const profile = generateProfile(a);
  const dailyKwh = profile.usage / 30;
  const weekKwh = dailyKwh * 7;

  return {
    ...EMPTY_ENERGY,
    estimatedBill: profile.estimatedBill,
    lastMonthBill: Math.round(profile.estimatedBill * 1.12),
    currentUsage: profile.usage,
    budgetTotal: profile.estimatedBill + 500,
    budgetLeft: Math.max(0, (profile.estimatedBill + 500) - profile.estimatedBill),
    savings: Math.round(profile.estimatedBill * 0.08),
    savingsPct: 8,
    energyScore: 65,
    scoreEfficiency: 60,
    scoreBudget: 75,
    scorePeak: 55,
    dailyAverage: +dailyKwh.toFixed(1),
    daysElapsed: 18,
    lastMonthKwh: Math.round(profile.usage * 1.12),
    dailyData: generateDailyData(dailyKwh),
    weeklyData: generateWeekData(weekKwh / 7),
    prevWeek: generateWeekData(weekKwh / 7).map(v => Math.round(v * 1.15)),
    peakHours: generatePeakHours(dailyKwh),
    predictedBill: Math.round(profile.estimatedBill * 1.08),
    totalSavingsYear: Math.round(profile.estimatedBill * 0.08 * 6),
    avgBill: profile.estimatedBill,
    lowestMonth: Math.round(profile.estimatedBill * 0.85),
    lowestMonthLabel: "January",
    highestMonth: Math.round(profile.estimatedBill * 1.15),
    highestMonthLabel: "August",
    months: [
      { name: "This Month", bill: profile.estimatedBill, kwh: profile.usage, change: -12, insight: "Based on your household profile." },
    ],
    notifications: [
      { type: "info", title: "Welcome to AlitapWatt!", desc: "Start by uploading your first bill to get AI insights.", time: "Just now" },
      { type: "good", title: "Profile created", desc: "Your energy profile is ready. Track your usage to save more.", time: "Just now" },
    ],
    monthlyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, profile.estimatedBill],
    liveCost: +(dailyKwh * 12 / 24).toFixed(2),
    liveKw: +(dailyKwh / 24).toFixed(1),
    projectedDaily: Math.round(profile.estimatedBill / 30),
    userName: "User",
  };
}

function ChoiceScreen({ choose }: { choose: (seed: boolean) => void }) {
  return (
    <MobileFrame>
      <div className="relative flex min-h-screen lg:min-h-full flex-col px-6 py-8 overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
          <img src={happyImg} alt="" className="h-24 w-24 object-contain" />
          <div className="space-y-2 max-w-xs">
            <h1 className="text-2xl font-bold tracking-tight">You're all set!</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Would you like to try with sample data or tell us about your home?
            </p>
          </div>
          <div className="w-full space-y-3 max-w-xs">
            <Button variant="default" size="lg" className="w-full py-5 text-base" onClick={() => choose(true)}>
              <Sparkles size={18} /> Try with Sample Data
            </Button>
            <Button variant="outline" size="lg" className="w-full py-5 text-base" onClick={() => choose(false)}>
              <Eraser size={18} /> Tell Us About Your Home
            </Button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

function QuestionSlide({ title, question, children, onNext, onBack, canNext, isLast }: {
  title: string; question: string; children: React.ReactNode;
  onNext: () => void; onBack?: () => void; canNext: boolean; isLast?: boolean;
}) {
  return (
    <MobileFrame>
      <div className="relative flex min-h-screen lg:min-h-full flex-col px-6 py-8 overflow-hidden">
        <div className="flex-1 flex flex-col justify-center gap-6 max-w-sm mx-auto w-full">
          <div className="text-center">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-2">{title}</p>
            <h2 className="text-xl font-bold tracking-tight">{question}</h2>
          </div>
          <div className="animate-float-up">{children}</div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <button onClick={onBack} className="text-xs text-muted-foreground hover:text-foreground transition disabled:opacity-0" disabled={!onBack}>Back</button>
          <Button variant="default" size="sm" className="px-6" onClick={onNext} disabled={!canNext}>
            {isLast ? "Finish" : "Next"} <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </MobileFrame>
  );
}

function AppliancePicker({ selected, onToggle }: { selected: string[]; onToggle: (name: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {allApplianceOptions.map((a) => {
        const Icon = a.icon;
        const active = selected.includes(a.name);
        return (
          <button key={a.name} onClick={() => onToggle(a.name)}
            className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition active:scale-[0.97] ${
              active ? "bg-primary text-primary-foreground shadow-glow" : "bg-card border border-border text-foreground"
            }`}
          >
            <Icon size={24} />
            <span className="text-[10px] font-medium text-center leading-tight">{a.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function OptionGrid({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => onSelect(o)}
          className={`rounded-xl px-4 py-3.5 text-sm font-medium text-center transition active:scale-[0.97] ${
            selected === o ? "bg-primary text-primary-foreground shadow-glow" : "bg-card border border-border text-foreground hover:border-primary/30"
          }`}
        >{o}</button>
      ))}
    </div>
  );
}

function ProfileSummary({ answers, onFinish }: { answers: Answers; onFinish: () => void }) {
  const profile = generateProfile(answers);
  return (
    <div className="relative flex flex-col min-h-screen lg:min-h-full px-6 py-8 overflow-auto">
      <div className="flex-1 flex flex-col justify-center gap-6 max-w-sm mx-auto w-full">
        <div className="text-center">
          <img src={happyImg} alt="" className="h-16 w-16 object-contain mx-auto" />
          <h2 className="text-xl font-bold tracking-tight mt-3">Your Household Energy Profile</h2>
          <p className="text-xs text-muted-foreground mt-1">Personalized for your home.</p>
        </div>
        <div className="space-y-3 animate-float-up">
          <div className="rounded-2xl bg-card p-4 shadow-card flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Est. Monthly Consumption</span>
            <span className="text-sm font-bold">{profile.usage}–{Math.round(profile.usage * 1.3)} kWh</span>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Est. Monthly Bill</span>
            <span className="text-sm font-bold">₱{profile.estimatedBill.toLocaleString()}</span>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Highest Energy User</span>
            <span className="text-sm font-bold">{profile.highConsumer}</span>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Potential Monthly Savings</span>
            <span className="text-sm font-bold text-success">{profile.savingsRange}</span>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Household Type</span>
            <span className="text-sm font-bold">{answers.householdType}</span>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Your Goal</span>
            <span className="text-sm font-bold">{answers.goal}</span>
          </div>
        </div>
        <Button variant="default" size="lg" className="w-full py-5 text-base" onClick={onFinish}>
          <Check size={18} /> Start Using AlitapWatt
        </Button>
      </div>
    </div>
  );
}
function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useEnergyData();
  const [step, setStep] = useState(0);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [qStep, setQStep] = useState(0);
  const isLastSlide = step === slides.length - 1;

  const [answers, setAnswers] = useState<Answers>({
    householdType: "", energyConcern: "", billRange: "", householdSize: "", appliances: [], goal: "",
  });

  const choose = (seed: boolean) => {
    if (seed) {
      completeOnboarding(true);
      navigate({ to: "/home" });
    } else {
      setShowQuestionnaire(true);
    }
  };

  const toggleAppliance = (name: string) => {
    setAnswers(prev => ({
      ...prev,
      appliances: prev.appliances.includes(name)
        ? prev.appliances.filter(a => a !== name)
        : [...prev.appliances, name],
    }));
  };

  const finishQuestionnaire = () => {
    const energy = buildEnergyData(answers);
    const raw = localStorage.getItem("alitapwatt_data");
    const existing = raw ? JSON.parse(raw) : {};
    localStorage.setItem("alitapwatt_data", JSON.stringify({
      ...existing,
      energy,
      trackedAppliances: [],
      onboardingComplete: true,
      hasSeeded: false,
    }));
    completeOnboarding(false);
    navigate({ to: "/home" });
  };

  if (showQuestionnaire) {
    // After questionnaire is done, show profile summary
    if (qStep > 5) {
      return <ProfileSummary answers={answers} onFinish={finishQuestionnaire} />;
    }

    const qs = [
      { title: "YOUR HOME", question: "Which best describes your household?", comp: <OptionGrid options={householdTypes} selected={answers.householdType} onSelect={(v) => setAnswers(prev => ({ ...prev, householdType: v }))} /> },
      { title: "YOUR CONCERN", question: "What's your biggest problem with your electricity bill?", comp: <OptionGrid options={energyConcerns} selected={answers.energyConcern} onSelect={(v) => setAnswers(prev => ({ ...prev, energyConcern: v }))} /> },
      { title: "YOUR BILL", question: "How much is your average monthly electricity bill?", comp: <OptionGrid options={billRanges} selected={answers.billRange} onSelect={(v) => setAnswers(prev => ({ ...prev, billRange: v }))} /> },
      { title: "YOUR HOME", question: "How many people live in your household?", comp: <OptionGrid options={householdSizes} selected={answers.householdSize} onSelect={(v) => setAnswers(prev => ({ ...prev, householdSize: v }))} /> },
      { title: "YOUR APPLIANCES", question: "Which appliances do you use regularly?", comp: <AppliancePicker selected={answers.appliances} onToggle={toggleAppliance} /> },
      { title: "YOUR GOAL", question: "What would you like AlitapWatt to help you achieve?", comp: <OptionGrid options={goals} selected={answers.goal} onSelect={(v) => setAnswers(prev => ({ ...prev, goal: v }))} /> },
    ];

    const q = qs[qStep];
    const canNext = qStep === 4 ? answers.appliances.length > 0 : true;

    return (
      <QuestionSlide
        title={q.title}
        question={q.question}
        onNext={() => setQStep(s => s + 1)}
        onBack={qStep > 0 ? () => setQStep(s => s - 1) : undefined}
        canNext={canNext}
        isLast={qStep === qs.length - 1}
      >
        {q.comp}
      </QuestionSlide>
    );
  }

  // Choice screen
  if (step >= 3) {
    return <ChoiceScreen choose={choose} />;
  }

  // Tutorial slides
  const slide = slides[step];
  return (
    <MobileFrame>
      <div className="relative flex min-h-screen lg:min-h-full flex-col px-6 py-8 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-primary" : "w-4 bg-primary/20"}`} />
            ))}
          </div>
          <button onClick={() => setStep(3)} className="text-xs font-medium text-muted-foreground hover:text-primary transition">Skip</button>
        </div>
        <span className="absolute top-32 left-8 h-2 w-2 rounded-full bg-primary-soft animate-firefly" />
        <span className="absolute top-52 right-10 h-1.5 w-1.5 rounded-full bg-primary animate-firefly" style={{ animationDelay: "0.8s" }} />
        <span className="absolute bottom-56 left-14 h-2 w-2 rounded-full bg-primary-soft animate-firefly" style={{ animationDelay: "1.4s" }} />
        <div className="relative flex-1 flex flex-col items-center justify-center text-center">
          <div key={step} className="animate-float-up flex flex-col items-center gap-8">
            <div className="h-56 w-56"><img src={slide.img} alt="" className="h-full w-full object-contain" /></div>
            <div className="space-y-3 max-w-xs">
              <h1 className="text-2xl font-bold tracking-tight">{slide.title}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">{slide.desc}</p>
            </div>
          </div>
        </div>
        <div className="relative space-y-3">
          <Button variant="default" size="lg" className="w-full py-4 text-base active:scale-[0.98]" onClick={() => isLastSlide ? setStep(3) : setStep(s => s + 1)}>
            {isLastSlide ? "Continue" : "Next"} <ArrowRight size={18} />
          </Button>
          {!isLastSlide && (
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="w-full text-xs text-muted-foreground disabled:opacity-0 transition">Back</button>
          )}
        </div>
      </div>
    </MobileFrame>
  );
}
