import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ChevronRight, Users, Globe, Bell, LogOut, Target, Snowflake, Tv, Refrigerator, WashingMachine, Microwave, Lightbulb, BarChart3 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/profile")({ component: Profile });

const allAppliances = [
  { name: "Aircon", icon: Snowflake },
  { name: "Refrigerator", icon: Refrigerator },
  { name: "TV", icon: Tv },
  { name: "Washing Machine", icon: WashingMachine },
  { name: "Microwave", icon: Microwave },
  { name: "LED Lights", icon: Lightbulb },
];

function Profile() {
  const [checked, setChecked] = useState<Record<string, boolean>>({ Aircon: true, Refrigerator: true, TV: true, "LED Lights": true });
  const [budget, setBudget] = useState(3000);

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-5">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-warm flex items-center justify-center text-primary-foreground text-xl font-bold shadow-glow">
            J
          </div>
          <div>
            <h1 className="text-lg font-bold">Juan Dela Cruz</h1>
            <p className="text-xs text-muted-foreground">juan@email.com</p>
          </div>
        </div>

        {/* Household */}
        <Section title="Household">
          <Row icon={<Users size={16} />} label="Household size" value="4 members" />
          <div className="px-4 py-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm flex items-center gap-2"><Target size={16} className="text-primary" /> Monthly budget</span>
              <span className="text-sm font-semibold text-primary">₱{budget.toLocaleString()}</span>
            </div>
            <input
              type="range" min={1000} max={10000} step={500}
              value={budget} onChange={(e) => setBudget(+e.target.value)}
              className="w-full accent-primary"
            />
          </div>
        </Section>

        {/* Appliance checklist */}
        <Section title="My Appliances">
          <div className="grid grid-cols-3 gap-2 p-3">
            {allAppliances.map(({ name, icon: Icon }) => {
              const active = checked[name];
              return (
                <button
                  key={name}
                  onClick={() => setChecked({ ...checked, [name]: !active })}
                  className={`flex flex-col items-center gap-2 rounded-2xl py-3 px-2 text-xs transition ${
                    active ? "bg-gradient-warm text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-medium">{name}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Preferences */}
        <Section title="Preferences">
          <Row icon={<Globe size={16} />} label="Language" value="English" chevron />
          <Row icon={<Bell size={16} />} label="Notifications" value="On" chevron />
          <Link to="/admin" className="flex items-center justify-between px-4 py-4 border-t border-border active:bg-muted transition">
            <span className="text-sm flex items-center gap-3"><BarChart3 size={16} className="text-primary" /> Admin Dashboard</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </Link>
        </Section>

        <Link
          to="/"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-card py-3.5 text-sm font-semibold text-destructive active:scale-[0.99] transition"
        >
          <LogOut size={16} /> Sign Out
        </Link>

        <p className="text-center text-[10px] text-muted-foreground">AlitapWatt v1.0 · A small light for your home</p>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-2">{title}</h3>
      <div className="rounded-2xl bg-card shadow-card overflow-hidden">{children}</div>
    </div>
  );
}

function Row({ icon, label, value, chevron }: { icon: React.ReactNode; label: string; value: string; chevron?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 [&:not(:first-child)]:border-t border-border">
      <span className="text-sm flex items-center gap-3"><span className="text-primary">{icon}</span> {label}</span>
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        {value} {chevron && <ChevronRight size={16} />}
      </span>
    </div>
  );
}
