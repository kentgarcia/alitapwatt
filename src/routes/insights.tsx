import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ScanLine, Sparkles, TrendingUp, Bell, Zap } from "lucide-react";
import happyImg from "../../assets/happy.png";

export const Route = createFileRoute("/insights")({ component: Insights });

const features = [
  {
    icon: ScanLine,
    title: "Smart Bill Scanning",
    desc: "Snap your Meralco bill and AI reads your kWh, charges, and due date instantly.",
  },
  {
    icon: Sparkles,
    title: "Personalized Tipid Tips",
    desc: "AI analyzes your usage patterns and gives custom tips to lower your bill.",
  },
  {
    icon: TrendingUp,
    title: "Consumption Analysis",
    desc: "See which appliances drive your bill with AI-powered breakdowns by category.",
  },
  {
    icon: Bell,
    title: "Smart Alerts & Forecast",
    desc: "AI predicts next month's bill and warns you before you exceed your budget.",
  },
  {
    icon: Zap,
    title: "Anomaly Detection",
    desc: "AI spots unusual spikes and notifies you when something's off.",
  },
];

function Insights() {
  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-5">
        {/* Header with mascot */}
        <div className="flex items-center gap-4">
          <img src={happyImg} alt="" className="h-14 w-14 object-contain" />
          <div>
            <h1 className="text-2xl font-bold">AlitapWatt</h1>
            <p className="text-sm text-muted-foreground">AI-powered features for your home.</p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="space-y-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="rounded-2xl bg-card p-4 shadow-card flex items-start gap-4 active:scale-[0.99] transition">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground shadow-glow">
                  <Icon size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
