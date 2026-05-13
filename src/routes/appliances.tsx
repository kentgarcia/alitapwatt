import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Thermometer, Refrigerator, Fan, ChefHat, WashingMachine,
  Lightbulb, Monitor, Tv, Zap, ArrowLeft,
  Calculator, TrendingUp, TrendingDown,
  PiggyBank, Leaf, Plus, Trash2, BarChart3,
  AlertTriangle, CheckCircle2, Sparkles, Home
} from "lucide-react";
import { useState } from "react";
import { useEnergyData } from "@/lib/storage/context";

export const Route = createFileRoute("/appliances")({
  component: ApplianceTracker,
  head: () => ({ meta: [{ title: "Appliance Tracker — AlitapWatt" }] }),
});

const appliancePresets = [
  { name: "Air Conditioner", watts: 1200 },
  { name: "Refrigerator", watts: 180 },
  { name: "Television", watts: 120 },
  { name: "Electric Fan", watts: 75 },
  { name: "Rice Cooker", watts: 700 },
  { name: "Washing Machine", watts: 500 },
  { name: "Gaming PC", watts: 450 },
  { name: "Water Heater", watts: 3000 },
  { name: "Lights (per room)", watts: 100 },
  { name: "Laptop", watts: 65 },
  { name: "Microwave Oven", watts: 1200 },
  { name: "Electric Kettle", watts: 1500 },
  { name: "Electric Iron", watts: 1200 },
  { name: "Hair Dryer", watts: 1500 },
  { name: "Water Pump", watts: 800 },
  { name: "DVD/Karaoke", watts: 50 },
  { name: "Aircon (1HP)", watts: 1000 },
  { name: "Aircon (2HP)", watts: 2000 },
  { name: "Ref (7-9 cu.ft)", watts: 120 },
  { name: "Ref (11-15 cu.ft)", watts: 180 },
  { name: "LED TV (32\")", watts: 60 },
  { name: "LED TV (50\")", watts: 120 },
  { name: "Stand Fan", watts: 75 },
  { name: "Ceiling Fan", watts: 85 },
];

const ratePerKwh = 12;

type Appliance = { name: string; watts: number; hrs: number; days: number; weeks: number; qty: number; cost: number; kwh: number };

function ApplianceTracker() {
  const { data, setTrackedAppliances } = useEnergyData();
  const appliances = data.trackedAppliances;
  const [selectedPreset, setSelectedPreset] = useState(appliancePresets[0].name);
  const [wattage, setWattage] = useState(appliancePresets[0].watts);
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [daysPerWeek, setDaysPerWeek] = useState(7);
  const [weeksPerMonth, setWeeksPerMonth] = useState(4);
  const [quantity, setQuantity] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const selectPreset = (name: string) => {
    const p = appliancePresets.find(a => a.name === name);
    if (p) { setSelectedPreset(name); setWattage(p.watts); }
  };

  const calcKwh = (w: number, h: number, d: number, wk: number, q: number) =>
    (w * h * d * wk * q) / 1000;

  const calcCost = (kwh: number) => kwh * ratePerKwh;

  const addAppliance = () => {
    const kwh = calcKwh(wattage, hoursPerDay, daysPerWeek, weeksPerMonth, quantity);
    const cost = calcCost(kwh);
    setTrackedAppliances(prev => [...prev, { name: selectedPreset, watts: wattage, hrs: hoursPerDay, days: daysPerWeek, weeks: weeksPerMonth, qty: quantity, cost, kwh }]);
    setShowForm(false);
  };

  const removeAppliance = (idx: number) =>
    setTrackedAppliances(prev => prev.filter((_, i) => i !== idx));

  const currentKwh = calcKwh(wattage, hoursPerDay, daysPerWeek, weeksPerMonth, quantity);
  const currentCost = calcCost(currentKwh);
  const totalCost = appliances.reduce((s, a) => s + a.cost, 0);
  const totalKwh = appliances.reduce((s, a) => s + a.kwh, 0);
  const dailyKwh = appliances.reduce((s, a) => s + (a.watts * a.hrs * a.qty) / 1000, 0);

  const sorted = [...appliances].sort((a, b) => b.kwh - a.kwh);
  const highest = sorted[0];

  const getAiInsight = (a: Appliance) => {
    const pct = totalKwh > 0 ? ((a.kwh / totalKwh) * 100) : 0;
    if (pct > 40) return `This appliance contributes ${pct.toFixed(0)}% of your projected bill.`;
    if (a.watts > 2000) return `High-wattage device. Consider limiting usage to save ₱${(a.cost * 0.2).toFixed(0)}.`;
    return `Runs ${a.hrs}hrs/day, ${a.days}days/wk — ${pct.toFixed(0)}% of total usage.`;
  };

  // simulation
  const [simAcHrs, setSimAcHrs] = useState(8);
  const [simFanHrs, setSimFanHrs] = useState(10);
  const [simLed, setSimLed] = useState(false);
  const acInAppliances = appliances.filter(a => a.name.includes("Air") || a.name.includes("Aircon"));
  const acSavings = acInAppliances.reduce((s, a) => {
    const cur = a.kwh * ratePerKwh;
    const sim = ((a.watts * Math.max(1, simAcHrs) * a.days * a.weeks * a.qty) / 1000) * ratePerKwh;
    return s + Math.max(0, cur - sim);
  }, 0);
  const fanKwh = appliances.filter(a => a.name.includes("Fan")).reduce((s, a) => s + ((a.watts * Math.max(1, simFanHrs) * a.days * a.weeks * a.qty) / 1000) * ratePerKwh, 0);
  const currentFanKwh = appliances.filter(a => a.name.includes("Fan")).reduce((s, a) => s + a.cost, 0);
  const fanSavings = Math.max(0, currentFanKwh - fanKwh);
  const ledSavings = simLed ? 150 : 0;

  return (
    <AppShell>
      <div className="px-4 pt-6 pb-6 space-y-5">
        {/* header */}
        <div className="flex items-center gap-3">
          <Link to="/home" className="flex h-8 w-8 items-center justify-center rounded-lg bg-card shadow-card">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-lg font-bold">Appliance Tracker</h1>
            <p className="text-[10px] text-muted-foreground">Estimate how much electricity your appliances consume.</p>
          </div>
        </div>

        {/* top summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-4 text-primary-foreground shadow-glow">
            <PiggyBank size={16} className="opacity-80" />
            <p className="text-2xl font-bold mt-2">₱{totalCost.toFixed(0) || "0"}</p>
            <p className="text-[10px] opacity-80">Est. Monthly Cost</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <BarChart3 size={16} className="text-primary" />
            <p className="text-2xl font-bold mt-2">{totalKwh.toFixed(1)}</p>
            <p className="text-[10px] text-muted-foreground">Monthly kWh</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <Zap size={16} className="text-primary" />
            <p className="text-2xl font-bold mt-2">{dailyKwh.toFixed(1)}</p>
            <p className="text-[10px] text-muted-foreground">Daily kWh</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <TrendingUp size={16} className="text-primary" />
            <p className="text-sm font-bold mt-2 truncate">{highest ? highest.name : "—"}</p>
            <p className="text-[10px] text-muted-foreground">Highest Consumer</p>
          </div>
        </div>

        {/* add appliance button */}
        {!showForm && appliances.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-primary/30 p-8 text-center">
            <Zap size={32} className="mx-auto text-muted-foreground/40" />
            <p className="text-sm font-semibold mt-2">No appliances tracked yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add your appliances to calculate energy costs.</p>
          </div>
        )}
        {!showForm && (
          <Button variant="default" size="lg" className="w-full py-4 text-base" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Add Appliance
          </Button>
        )}

        {showForm && (
          <div className="rounded-2xl bg-card p-5 shadow-card border-2 border-primary/20 animate-float-up">
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={16} className="text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide">Add New Appliance</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-medium text-muted-foreground">Appliance Type</label>
                <select value={selectedPreset} onChange={e => selectPreset(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-muted px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                  {appliancePresets.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground">Wattage (W)</label>
                  <input type="number" value={wattage} onChange={e => setWattage(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl bg-muted px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground">Quantity</label>
                  <input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                    min={1} className="mt-1 w-full rounded-xl bg-muted px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground">Hrs/Day</label>
                  <input type="number" value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))}
                    min={0} max={24} className="mt-1 w-full rounded-xl bg-muted px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground">Days/Week</label>
                  <input type="number" value={daysPerWeek} onChange={e => setDaysPerWeek(Number(e.target.value))}
                    min={0} max={7} className="mt-1 w-full rounded-xl bg-muted px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground">Weeks/Month</label>
                  <input type="number" value={weeksPerMonth} onChange={e => setWeeksPerMonth(Number(e.target.value))}
                    min={0} max={5} className="mt-1 w-full rounded-xl bg-muted px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              {/* live calculation result */}
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-[9px] text-muted-foreground">Daily</p>
                    <p className="text-sm font-bold">{((wattage * hoursPerDay * quantity) / 1000).toFixed(2)} kWh</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground">Monthly</p>
                    <p className="text-sm font-bold">{currentKwh.toFixed(1)} kWh</p>
                  </div>
                </div>
                <div className="text-center mt-2 pt-2 border-t border-primary/10">
                  <p className="text-[9px] text-muted-foreground">Estimated Cost</p>
                  <p className="text-2xl font-bold text-primary">₱{currentCost.toFixed(2)}</p>
                  <p className="text-[9px] text-muted-foreground">Carbon impact: {(currentKwh * 0.4).toFixed(1)} kg CO₂</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="default" size="lg" className="py-3 text-sm" onClick={addAppliance}>
                  <Plus size={16} /> Add
                </Button>
                <Button variant="outline" size="lg" className="py-3 text-sm" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* tracked appliances */}
        {appliances.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tracked Appliances</h3>
            <div className="space-y-2">
              {sorted.map((a, i) => (
                <div key={i} className="rounded-xl bg-card p-3.5 shadow-card border border-primary/5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-warm text-primary-foreground shadow-glow font-bold text-xs">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{a.name} {a.qty > 1 && `×${a.qty}`}</p>
                        <button onClick={() => removeAppliance(i)} className="text-muted-foreground hover:text-destructive transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[9px] text-muted-foreground">{a.watts}W · {a.hrs}hrs/day · {a.days}days/wk</p>
                      <div className="flex items-center gap-3 mt-1 text-[10px]">
                        <span className="font-semibold text-primary">₱{a.cost.toFixed(0)}/mo</span>
                        <span className="text-muted-foreground">{a.kwh.toFixed(1)} kWh</span>
                      </div>
                      {/* ai analysis per appliance */}
                      <div className="mt-1.5 bg-primary/5 rounded-lg px-2 py-1 flex items-start gap-1.5">
                        <Sparkles size={10} className="text-primary shrink-0 mt-0.5" />
                        <p className="text-[8px] text-muted-foreground leading-relaxed">{getAiInsight(a)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* total card */}
              <div className="rounded-xl bg-gradient-to-r from-primary to-primary-dark p-4 text-primary-foreground mt-2 shadow-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] opacity-80">Total Monthly Estimate</p>
                    <p className="text-xl font-bold">{totalKwh.toFixed(1)} kWh</p>
                    <p className="text-[10px] opacity-70">~{(totalKwh * 0.4).toFixed(0)} kg CO₂/mo</p>
                  </div>
                  <p className="text-3xl font-bold">₱{totalCost.toFixed(0)}</p>
                </div>
              </div>
            </div>

            {/* consumption breakdown bar */}
            {appliances.length > 1 && (
              <div className="mt-3 rounded-xl bg-card p-4 shadow-card">
                <p className="text-[10px] font-semibold mb-2">Consumption Breakdown</p>
                <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                  {sorted.map((a, i) => {
                    const pct = totalKwh > 0 ? (a.kwh / totalKwh) * 100 : 0;
                    const colors = ["#F97316", "#06b6d4", "#8b5cf6", "#10b981", "#eab308", "#ef4444", "#ec4899", "#6366f1"];
                    return (
                      <div key={i} key={i} style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }} title={`${a.name}: ${pct.toFixed(0)}%`} />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                  {sorted.map((a, i) => {
                    const pct = totalKwh > 0 ? (a.kwh / totalKwh) * 100 : 0;
                    const colors = ["#F97316", "#06b6d4", "#8b5cf6", "#10b981", "#eab308", "#ef4444", "#ec4899", "#6366f1"];
                    return (
                      <span key={i} className="flex items-center gap-1 text-[8px] text-muted-foreground">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                        {a.name} ({pct.toFixed(0)}%)
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* scenario simulation */}
            <div className="rounded-2xl bg-card p-5 shadow-card border border-primary/5 mt-3">
              <div className="flex items-center gap-2 mb-3">
                <Calculator size={16} className="text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide">Energy Savings Simulator</p>
              </div>
              <p className="text-[10px] text-muted-foreground mb-4">Adjust sliders to see how changes affect your bill.</p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>AC usage (hrs/day)</span>
                    <span className="font-semibold">{simAcHrs}h</span>
                  </div>
                  <input type="range" min={1} max={12} value={simAcHrs} onChange={e => setSimAcHrs(Number(e.target.value))}
                    className="w-full accent-primary" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>Fan usage (hrs/day)</span>
                    <span className="font-semibold">{simFanHrs}h</span>
                  </div>
                  <input type="range" min={1} max={12} value={simFanHrs} onChange={e => setSimFanHrs(Number(e.target.value))}
                    className="w-full accent-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px]">Switch to LED bulbs</span>
                  <button onClick={() => setSimLed(!simLed)}
                    className={`relative h-5 w-9 rounded-full transition ${simLed ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${simLed ? "left-4" : "left-0.5"}`} />
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-gradient-to-r from-success/10 to-success/5 border border-success/20 p-3">
                <p className="text-[10px] text-muted-foreground">Projected Savings</p>
                <p className="text-xl font-bold text-success">
                  ₱{(acSavings + fanSavings + ledSavings).toFixed(0)}
                </p>
                <p className="text-[10px] text-muted-foreground">per month with these adjustments</p>
                <div className="flex flex-wrap gap-2 mt-2 text-[9px]">
                  {acSavings > 0 && <span className="rounded-full bg-success/10 px-2 py-0.5 text-success">AC: -₱{acSavings.toFixed(0)}</span>}
                  {fanSavings > 0 && <span className="rounded-full bg-success/10 px-2 py-0.5 text-success">Fan: -₱{fanSavings.toFixed(0)}</span>}
                  {ledSavings > 0 && <span className="rounded-full bg-success/10 px-2 py-0.5 text-success">LED: -₱{ledSavings}</span>}
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2 bg-primary/5 rounded-xl px-3 py-2">
                <Sparkles size={12} className="text-primary shrink-0 mt-0.5" />
                <p className="text-[9px] text-muted-foreground leading-relaxed">
                  {acSavings > 0
                    ? `Reducing AC usage by ${8 - simAcHrs}h/day could save you around ₱${acSavings.toFixed(0)} monthly.`
                    : "Adjust the sliders above to see personalized savings."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ai tip */}
        <div className="rounded-2xl bg-card p-4 shadow-card border border-primary/5 flex items-start gap-3">
          <Leaf size={16} className="text-primary shrink-0 mt-0.5" />
          <div className="text-[10px] text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground mb-0.5">Tipid Tips</p>
            <p>Appliances with heating elements (water heater, electric iron, hair dryer) consume the most power. Reducing usage by just 1 hour/day can save up to ₱360/month.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
