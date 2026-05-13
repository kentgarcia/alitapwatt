import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users, Globe, Bell, LogOut, Target, Snowflake, Tv, Refrigerator, WashingMachine, Microwave, Lightbulb, BarChart3, Check, X, Zap } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "@/lib/storage/hooks";
import { useEnergyData } from "@/lib/storage/context";

export const Route = createFileRoute("/profile")({ component: Profile });

const allAppliances = [
  { name: "Aircon", icon: Snowflake, watts: 1200, hrs: 8 },
  { name: "Refrigerator", icon: Refrigerator, watts: 180, hrs: 24 },
  { name: "TV", icon: Tv, watts: 120, hrs: 6 },
  { name: "Washing Machine", icon: WashingMachine, watts: 500, hrs: 1 },
  { name: "Microwave", icon: Microwave, watts: 1200, hrs: 0.5 },
  { name: "LED Lights", icon: Lightbulb, watts: 100, hrs: 8 },
];

const sizeOptions = ["1-2 people", "3-5 people", "6-8 people", "9+ people"];

function Profile() {
  const { data, updateEnergy } = useEnergyData();
  const e = data.energy;
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>("alitapwatt_profile_checked", { Aircon: true, Refrigerator: true, TV: true, "LED Lights": true });
  const [budget, setBudget] = useLocalStorage("alitapwatt_profile_budget", 3000);
  const [householdSize, setHouseholdSize] = useLocalStorage("alitapwatt_household_size", "3-5 people");
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [pendingSize, setPendingSize] = useState(householdSize);

  const handleBudgetChange = (val: number) => {
    setBudget(val);
    updateEnergy(prev => ({
      ...prev,
      budgetTotal: val,
      budgetLeft: Math.max(0, val - prev.estimatedBill),
    }));
  };

  const handleSizeConfirm = () => {
    setHouseholdSize(pendingSize);
    setShowSizeModal(false);
  };

  const calcMonthlyKwh = (watts: number, hrs: number) => (watts * hrs * 30) / 1000;
  const rate = 12;

  const checkedAppliances = allAppliances.filter(a => checked[a.name]);
  const totalAppKwh = checkedAppliances.reduce((s, a) => s + calcMonthlyKwh(a.watts, a.hrs), 0);
  const totalAppCost = totalAppKwh * rate;

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
          <button onClick={() => { setPendingSize(householdSize); setShowSizeModal(true); }} className="w-full flex items-center justify-between px-4 py-4 active:bg-muted transition">
            <span className="text-sm flex items-center gap-3"><Users size={16} className="text-primary" /> Household size</span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">{householdSize} <ChevronRight size={16} /></span>
          </button>
          <div className="px-4 py-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm flex items-center gap-2"><Target size={16} className="text-primary" /> Monthly budget</span>
              <span className="text-sm font-semibold text-primary">₱{budget.toLocaleString()}</span>
            </div>
            <input
              type="range" min={1000} max={10000} step={500}
              value={budget} onChange={(e) => handleBudgetChange(+e.target.value)}
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
                  className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2 text-xs transition active:scale-[0.97] ${
                    active ? "bg-gradient-warm text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-medium">{name}</span>
                  {active && <span className="text-[8px] opacity-80">{calcMonthlyKwh(allAppliances.find(a => a.name === name)!.watts, allAppliances.find(a => a.name === name)!.hrs).toFixed(0)} kWh</span>}
                </button>
              );
            })}
          </div>
          {checkedAppliances.length > 0 && (
            <div className="px-4 pb-4 pt-1">
              <div className="rounded-xl bg-primary/5 px-3.5 py-2.5 text-xs flex items-center justify-between">
                <span className="text-muted-foreground">Estimated total ({checkedAppliances.length} appliances)</span>
                <span className="font-bold text-primary">{totalAppKwh.toFixed(0)} kWh · ₱{totalAppCost.toLocaleString()}</span>
              </div>
            </div>
          )}
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

        <Button asChild variant="ghost" size="lg" className="w-full py-3.5 text-sm active:scale-[0.99]">
          <Link to="/">
            <LogOut size={16} /> Sign Out
          </Link>
        </Button>

        <ResetDataButton />
        <p className="text-center text-[10px] text-muted-foreground">AlitapWatt v1.0 · A small light for your home</p>
      </div>

      {/* Household size modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowSizeModal(false)}>
          <div className="w-full max-w-xs rounded-2xl bg-card p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">Household Size</h3>
              <button onClick={() => setShowSizeModal(false)} className="flex h-6 w-6 items-center justify-center rounded-full bg-muted"><X size={14} /></button>
            </div>
            <div className="space-y-1.5 mb-5">
              {sizeOptions.map(s => (
                <button key={s} onClick={() => setPendingSize(s)}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-medium text-left transition ${
                    pendingSize === s ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-foreground"
                  }`}
                >{s}</button>
              ))}
            </div>
            <Button variant="default" size="lg" className="w-full py-3 text-sm" onClick={handleSizeConfirm}>
              <Check size={16} /> Confirm
            </Button>
          </div>
        </div>
      )}
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

function ResetDataButton() {
  const { resetData } = useEnergyData();
  const [confirm, setConfirm] = useState(false);
  if (!confirm) return (
    <button onClick={() => setConfirm(true)} className="w-full text-center text-[10px] text-muted-foreground hover:text-destructive transition py-1">
      Reset all data
    </button>
  );
  return (
    <div className="text-center space-y-1">
      <p className="text-[10px] text-destructive">This will erase all your data!</p>
      <div className="flex items-center justify-center gap-2">
        <button onClick={resetData} className="text-[10px] font-semibold text-destructive">Confirm Reset</button>
        <span className="text-muted-foreground">·</span>
        <button onClick={() => setConfirm(false)} className="text-[10px] text-muted-foreground">Cancel</button>
      </div>
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
