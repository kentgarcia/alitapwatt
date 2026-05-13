import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AlertTriangle, TrendingUp, Bell, Zap, Calendar } from "lucide-react";
import thinkingImg from "../../assets/thinking.png";
import sadImg from "../../assets/sad.png";

export const Route = createFileRoute("/forecast")({ component: Forecast });

const alerts = [
  { type: "warn", icon: AlertTriangle, title: "Projected bill exceeds budget", time: "2 hours ago", desc: "Your forecast (₱3,180) is over your ₱3,000 target." },
  { type: "info", icon: Zap, title: "Aircon spike detected", time: "Yesterday", desc: "Used for 9 hours — 30% above average." },
  { type: "good", icon: TrendingUp, title: "Saved ₱120 this week", time: "2 days ago", desc: "Switching to fan helped. Keep it up!" },
  { type: "info", icon: Bell, title: "New tip available", time: "3 days ago", desc: "Personalized recommendation based on your usage." },
];

function Forecast() {
  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-5">
        <header>
          <h1 className="text-2xl font-bold">Forecast & Alerts</h1>
          <p className="text-sm text-muted-foreground">Stay on top of your kuryente.</p>
        </header>

        {/* Forecast card */}
        <div className="rounded-3xl bg-gradient-warm p-6 text-primary-foreground shadow-glow relative overflow-hidden">
          <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <Calendar size={14} /> Forecast for November
              </div>
              <p className="mt-2 text-4xl font-bold">₱3,180</p>
              <p className="text-xs opacity-90 mt-1">Based on current usage trend</p>
            </div>
            <img src={thinkingImg} alt="" className="h-14 w-14 object-contain opacity-90" />
          </div>
        </div>

        {/* Budget progress */}
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm">Budget Progress</h3>
            <span className="text-xs font-semibold text-destructive">106%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-destructive" style={{ width: "100%" }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Spent ₱3,180</span>
            <span>Budget ₱3,000</span>
          </div>
        </div>

        {/* Warning banner */}
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <img src={sadImg} alt="" className="h-6 w-6 object-contain mt-0.5 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">Warning: Bill may exceed ₱3,000</p>
            <p className="text-muted-foreground mt-0.5">Reduce aircon use to stay under budget this month.</p>
          </div>
        </div>

        {/* Notifications timeline */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Recent Notifications</h3>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="flex gap-3 rounded-2xl bg-card p-4 shadow-card">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  a.type === "warn" ? "bg-warning/15 text-warning" :
                  a.type === "good" ? "bg-success/15 text-success" :
                  "bg-primary/10 text-primary"
                }`}>
                  <a.icon size={16} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-tight">{a.title}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
