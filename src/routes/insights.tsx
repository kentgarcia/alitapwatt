import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Snowflake, Tv, Refrigerator, Lightbulb, WashingMachine, Sparkles } from "lucide-react";

export const Route = createFileRoute("/insights")({ component: Insights });

const appliances = [
  { name: "Aircon", icon: Snowflake, pct: 42, cost: 1043 },
  { name: "Refrigerator", icon: Refrigerator, pct: 22, cost: 547 },
  { name: "TV & Devices", icon: Tv, pct: 14, cost: 348 },
  { name: "Washing Machine", icon: WashingMachine, pct: 12, cost: 298 },
  { name: "Lights", icon: Lightbulb, pct: 10, cost: 249 },
];

const tips = [
  { title: "Use electric fan during cooler hours", save: "₱8/day", desc: "Switch off aircon between 5–9 AM when it's naturally cool." },
  { title: "Unplug idle appliances", save: "₱5–10/day", desc: "Phantom load from chargers and TVs adds up monthly." },
  { title: "Switch to LED bulbs", save: "₱150/mo", desc: "LEDs use 75% less electricity than incandescent." },
  { title: "Set aircon to 25°C", save: "₱200/mo", desc: "Each degree below 25°C raises consumption ~10%." },
];

function Insights() {
  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-5">
        <header>
          <h1 className="text-2xl font-bold">Insights & Tipid Tips</h1>
          <p className="text-sm text-muted-foreground">Personalized for your home.</p>
        </header>

        <div className="rounded-3xl bg-card p-5 shadow-card">
          <h3 className="font-semibold text-sm mb-4">Top Energy Consumers</h3>
          <div className="space-y-3">
            {appliances.map((a) => (
              <div key={a.name} className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <a.icon size={16} />
                  </span>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{a.name}</span>
                    <span className="text-xs text-muted-foreground">₱{a.cost} · {a.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden ml-12">
                  <div className="h-full bg-gradient-warm rounded-full transition-all" style={{ width: `${a.pct * 2}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 px-1 pt-2">
          <Sparkles size={16} className="text-primary" />
          <h3 className="font-semibold text-sm">AI-generated Tipid Tips</h3>
        </div>

        <div className="space-y-3">
          {tips.map((t, i) => (
            <div key={i} className="rounded-2xl bg-card p-4 shadow-card flex gap-3 active:scale-[0.99] transition">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground shadow-glow">
                <Lightbulb size={18} />
              </span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-tight">{t.title}</p>
                  <span className="shrink-0 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                    Save {t.save}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
