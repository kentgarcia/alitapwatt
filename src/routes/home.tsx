import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Bell, TrendingUp, ArrowRight, Zap, Wallet, PiggyBank,
  CloudSun, Upload, Lightbulb, Monitor, Calculator, Calendar,
  Thermometer, Refrigerator, WashingMachine, Fan, ChefHat,
  AlertTriangle, Users, Sparkles, Clock, Gauge
} from "lucide-react";
import happyImg from "../../assets/happy.png";
import { useState } from "react";

export const Route = createFileRoute("/home")({ component: Home });

const dailyData = [28, 35, 22, 40, 32, 48, 55];
const weeklyData = [42, 55, 48, 62, 58, 75, 70];
const prevWeek = [50, 60, 55, 68, 65, 80, 78];
const peakHours = [18, 22, 35, 48, 62, 75, 68, 55, 40, 30, 20, 15];
const peakLabels = ["6AM","8AM","10AM","12PM","2PM","4PM","6PM","8PM","10PM","12AM","2AM","4AM"];

const appliances = [
  { name: "Refrigerator", icon: Refrigerator, kwh: 52, cost: 624, hours: "24 hrs/day", efficiency: "Good" },
  { name: "Air Conditioner", icon: Thermometer, kwh: 85, cost: 1020, hours: "8 hrs/day", efficiency: "Moderate" },
  { name: "Washing Machine", icon: WashingMachine, kwh: 18, cost: 216, hours: "4 hrs/week", efficiency: "Excellent" },
  { name: "Electric Fan", icon: Fan, kwh: 12, cost: 144, hours: "10 hrs/day", efficiency: "Excellent" },
  { name: "Rice Cooker", icon: ChefHat, kwh: 9, cost: 108, hours: "1 hr/day", efficiency: "Excellent" },
];

function CircularScore({ score, size = 100, stroke = 8 }: { score: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const label = score >= 80 ? "Excellent" : score >= 50 ? "Moderate" : "High Usage";
  const color = score >= 80 ? "text-success" : score >= 50 ? "text-warning" : "text-destructive";
  const strokeColor = score >= 80 ? "#16a34a" : score >= 50 ? "#eab308" : "#ef4444";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="oklch(0.92 0.03 70)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={strokeColor} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{score}</span>
          <span className="text-[9px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className={`text-xs font-semibold ${color}`}>{label}</span>
    </div>
  );
}

function DailyChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t" style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.7 + (v / max) * 0.3 }} />
        </div>
      ))}
    </div>
  );
}

function Home() {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifications = [
    { type: "warn", icon: AlertTriangle, title: "Near budget limit", desc: "You've used 85% of your ₱3,000 monthly budget.", time: "2h ago" },
    { type: "info", icon: Zap, title: "Usage spike detected", desc: "Today's consumption is 23% higher than usual.", time: "5h ago" },
    { type: "good", icon: TrendingUp, title: "Savings milestone", desc: "You saved ₱335 this month — 15% less than last month!", time: "1d ago" },
    { type: "info", icon: Lightbulb, title: "New AI tip available", desc: "Try setting AC to 24°C to save ₱300/month.", time: "2d ago" },
  ];

  return (
    <AppShell>
      <div className="px-4 pt-6 pb-6 space-y-4">
        {/* ===== HEADER ===== */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Good Evening,</p>
            <h1 className="text-xl font-bold">Kent 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CloudSun size={14} className="text-primary" />
              <span>27°C</span>
            </div>
            <span className="h-5 w-px bg-border" />
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-[10px] font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Active
            </span>
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative h-9 w-9 rounded-full bg-card shadow-card flex items-center justify-center">
                <Bell size={16} className="text-foreground" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-72 rounded-2xl bg-card shadow-2xl border border-primary/10 overflow-hidden z-50 animate-float-up">
                  <div className="bg-gradient-to-r from-primary to-primary-dark p-3">
                    <p className="text-xs font-semibold text-white">Notifications</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n, i) => {
                      const Icon = n.icon;
                      const dotColor = n.type === "warn" ? "bg-warning" : n.type === "good" ? "bg-success" : "bg-primary";
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 border-b border-border last:border-0">
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${n.type === "warn" ? "bg-warning/10 text-warning" : n.type === "good" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                            <Icon size={13} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold">{n.title}</p>
                              <span className="text-[9px] text-muted-foreground shrink-0">{n.time}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{n.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Link to="/forecast" className="block text-center text-[10px] font-semibold text-primary p-3 border-t border-border hover:bg-muted transition" onClick={() => setNotifOpen(false)}>
                    View all notifications →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ===== TOP SUMMARY CARDS ===== */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-4 text-primary-foreground shadow-glow">
            <p className="text-[10px] opacity-80 font-medium uppercase tracking-wide">Est. Bill</p>
            <p className="text-2xl font-bold mt-1">₱2,485</p>
            <p className="text-[10px] opacity-70 mt-0.5">vs ₱2,820 last month</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Zap size={14} className="text-primary" />
              <span className="text-[10px] font-medium uppercase tracking-wide">Consumption</span>
            </div>
            <p className="text-2xl font-bold">186</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">kWh this month</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Wallet size={14} className="text-primary" />
              <span className="text-[10px] font-medium uppercase tracking-wide">Budget Left</span>
            </div>
            <p className="text-2xl font-bold text-success">₱515</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">of ₱3,000 budget</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <PiggyBank size={14} className="text-primary" />
              <span className="text-[10px] font-medium uppercase tracking-wide">Savings</span>
            </div>
            <p className="text-2xl font-bold text-success">₱335</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">15% less than last month</p>
          </div>
        </div>

        {/* ===== AI INSIGHT CARD ===== */}
        <div className="rounded-2xl bg-card border border-primary/10 p-4 shadow-card flex items-start gap-3">
          <img src={happyImg} alt="" className="h-12 w-12 object-contain shrink-0 mt-1" />
          <div className="space-y-2 flex-1">
            <p className="text-[10px] text-primary/60 font-semibold uppercase tracking-wider">AlitapWatt AI Insight</p>
            <div className="bg-primary/5 rounded-xl px-3.5 py-2.5 space-y-1.5">
              <p className="text-xs text-foreground leading-relaxed">
                Your electricity usage increased by <span className="font-bold text-primary text-sm">18%</span> this week due to extended appliance usage during evening hours.
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Your refrigerator and air conditioner are consuming the most power.
              </p>
            </div>
          </div>
        </div>

        {/* ===== QUICK ACCESS CARDS ===== */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/appliances" className="rounded-2xl bg-card p-4 shadow-card border border-primary/5 active:scale-[0.98] transition">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground shadow-glow">
              <Zap size={18} />
            </span>
            <p className="text-sm font-bold mt-3">Appliance Tracker</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Track & calculate appliance costs</p>
          </Link>
          <Link to="/forecast" className="rounded-2xl bg-card p-4 shadow-card border border-primary/5 active:scale-[0.98] transition">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground shadow-glow">
              <Calendar size={18} />
            </span>
            <p className="text-sm font-bold mt-3">Forecast Usage</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Predict & simulate your energy bill</p>
          </Link>
        </div>

        {/* ===== SMART ENERGY SCORE ===== */}
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Smart Energy Score</h3>
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              <CircularScore score={72} size={110} stroke={9} />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Breakdown</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Based on your daily consumption patterns</p>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-foreground">Usage Efficiency</span>
                    <span className="font-semibold text-primary">78%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: "78%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-foreground">Budget Adherence</span>
                    <span className="font-semibold text-success">82%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-success" style={{ width: "82%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-foreground">Peak Hour Avoidance</span>
                    <span className="font-semibold text-warning">55%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-warning" style={{ width: "55%" }} />
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground italic">Tip: Shifting usage to off-peak hours can boost your score.</p>
            </div>
          </div>
        </div>

        {/* ===== MAIN GRAPH SECTION ===== */}
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide">Daily Consumption</h3>
            <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Today</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground/30" /> Yesterday</span>
            </div>
          </div>
          <DailyChart data={dailyData} color="#F97316" />
          <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <span key={d}>{d}</span>)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Weekly Trend</h3>
            <div className="flex items-end gap-1 h-20">
              {weeklyData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full rounded-t bg-primary transition-all" style={{ height: `${v}%`, opacity: 0.6 + (v / 100) * 0.4 }} />
                  <span className="text-[8px] text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Peak Hours</h3>
            <div className="flex items-end gap-0.5 h-20">
              {peakHours.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full rounded-t" style={{ height: `${v}%`, backgroundColor: v > 60 ? "#ef4444" : v > 40 ? "#eab308" : "#F97316", opacity: 0.5 + (v / 100) * 0.5 }} />
                  {i % 3 === 0 && <span className="text-[6px] text-muted-foreground mt-0.5">{peakLabels[i]}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== LIVE ALERT BANNER ===== */}
        <div className="rounded-2xl bg-gradient-to-r from-warning/15 to-warning/5 border border-warning/30 p-3.5 flex items-start gap-3">
          <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">Warning: You are close to exceeding your monthly budget.</p>
            <p className="text-muted-foreground mt-0.5">Today's usage is 23% higher than usual.</p>
          </div>
        </div>

        {/* ===== QUICK ACTION BUTTONS ===== */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Actions</h3>
          <div className="grid grid-cols-5 gap-2">
            <Link to="/scan" className="flex flex-col items-center gap-1.5 rounded-xl bg-card p-3 shadow-card active:scale-[0.97] transition">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-warm text-primary-foreground shadow-glow"><Upload size={16} /></span>
              <span className="text-[9px] font-medium text-center leading-tight">Upload Bill</span>
            </Link>
            <Link to="/insights" className="flex flex-col items-center gap-1.5 rounded-xl bg-card p-3 shadow-card active:scale-[0.97] transition">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Lightbulb size={16} /></span>
              <span className="text-[9px] font-medium text-center leading-tight">View Insights</span>
            </Link>
            <Link to="/appliances" className="flex flex-col items-center gap-1.5 rounded-xl bg-card p-3 shadow-card active:scale-[0.97] transition">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Monitor size={16} /></span>
              <span className="text-[9px] font-medium text-center leading-tight">Appliance Tracker</span>
            </Link>
            <Link to="/appliances" className="flex flex-col items-center gap-1.5 rounded-xl bg-card p-3 shadow-card active:scale-[0.97] transition">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Calculator size={16} /></span>
              <span className="text-[9px] font-medium text-center leading-tight">Energy Calculator</span>
            </Link>
            <Link to="/forecast" className="flex flex-col items-center gap-1.5 rounded-xl bg-card p-3 shadow-card active:scale-[0.97] transition">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Calendar size={16} /></span>
              <span className="text-[9px] font-medium text-center leading-tight">Forecast Bill</span>
            </Link>
          </div>
        </div>

        {/* ===== APPLIANCE MONITORING ===== */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Appliance Monitoring</h3>
          <div className="space-y-2">
            {appliances.map((a, i) => {
              const Icon = a.icon;
              const effColor = a.efficiency === "Excellent" ? "text-success" : a.efficiency === "Good" ? "text-primary" : "text-warning";
              const effBg = a.efficiency === "Excellent" ? "bg-success/10" : a.efficiency === "Good" ? "bg-primary/10" : "bg-warning/10";
              return (
                <div key={i} className="rounded-2xl bg-card p-3.5 shadow-card flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground shadow-glow">
                    <Icon size={18} />
                  </span>
                  <div className="flex-1 min-w-0 grid grid-cols-4 gap-2 text-[10px]">
                    <div>
                      <p className="font-semibold text-foreground">{a.name}</p>
                      <p className="text-muted-foreground mt-0.5">{a.hours}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">kWh</p>
                      <p className="font-semibold text-foreground">{a.kwh}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cost</p>
                      <p className="font-semibold text-foreground">₱{a.cost}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold ${effBg} ${effColor}`}>{a.efficiency}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== AI TIP OF THE DAY ===== */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-4 flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-warm text-primary-foreground shadow-glow">
            <Sparkles size={14} />
          </span>
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wide">AI Tip of the Day</p>
            <p className="text-xs text-foreground mt-1 leading-relaxed">
              Using your washing machine after peak hours may reduce costs by up to <span className="font-semibold text-primary">₱120 monthly</span>.
            </p>
          </div>
        </div>

        {/* ===== COMMUNITY SAVINGS ===== */}
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-5 shadow-glow text-center text-primary-foreground">
          <Users size={24} className="mx-auto opacity-80" />
          <p className="text-xs font-semibold mt-2 uppercase tracking-wide opacity-80">Community Savings</p>
          <p className="text-lg font-bold mt-1">₱125,000</p>
          <p className="text-[11px] opacity-70">saved by AlitapWatt users in Laguna this month</p>
        </div>
      </div>
    </AppShell>
  );
}
