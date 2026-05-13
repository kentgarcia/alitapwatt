import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Bell, TrendingUp, ArrowRight, Zap, Wallet, PiggyBank,
  CloudSun, Upload, Lightbulb, Monitor, Calculator, Calendar,
  Thermometer, Refrigerator, WashingMachine, Fan, ChefHat,
  AlertTriangle, Users, Sparkles, Clock
} from "lucide-react";
import happyImg from "../../assets/happy.png";
import { useState, useEffect } from "react";
import { useEnergyData } from "@/lib/storage/context";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, Cell,
} from "recharts";

export const Route = createFileRoute("/home")({
  component: Home,
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("alitapwatt_data");
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data.onboardingComplete) window.location.href = "/onboarding";
    } catch {}
  },
});

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

function Home() {
  const { data } = useEnergyData();
  const [greeting, setGreeting] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const e = data.energy;
  const notifications = e.notifications;
  const filtered = filter === "All" ? appliances : appliances.filter(a => a.efficiency === filter);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening");
  }, []);

  return (
    <AppShell>
      <div className="px-4 pt-6 pb-6 space-y-4">
        {/* ===== HEADER ===== */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{greeting},</p>
            <h1 className="text-xl font-bold">{e.userName} 👋</h1>
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
                      const Icon = n.type === "warn" ? AlertTriangle : n.type === "good" ? TrendingUp : Zap;
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
            <p className="text-2xl font-bold mt-1">₱{e.estimatedBill.toLocaleString()}</p>
            <p className="text-[10px] opacity-70 mt-0.5">vs ₱{e.lastMonthBill.toLocaleString()} last month</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Zap size={14} className="text-primary" />
              <span className="text-[10px] font-medium uppercase tracking-wide">Consumption</span>
            </div>
            <p className="text-2xl font-bold">{e.currentUsage}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">kWh this month</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Wallet size={14} className="text-primary" />
              <span className="text-[10px] font-medium uppercase tracking-wide">Budget Left</span>
            </div>
            <p className="text-2xl font-bold text-success">₱{e.budgetLeft.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">of ₱{e.budgetTotal.toLocaleString()} budget</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <PiggyBank size={14} className="text-primary" />
              <span className="text-[10px] font-medium uppercase tracking-wide">Savings</span>
            </div>
            <p className="text-2xl font-bold text-success">₱{e.savings.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{e.savingsPct}% less than last month</p>
          </div>
        </div>

        {/* ===== AI INSIGHT CARD ===== */}
        <div className="rounded-2xl bg-card border border-primary/10 p-4 shadow-card flex items-start gap-3">
          <img src={happyImg} alt="" className="h-20 w-20 object-contain shrink-0 mt-1" />
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
              <CircularScore score={e.energyScore} size={110} stroke={9} />
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
                    <span className="font-semibold text-primary">{e.scoreEfficiency}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${e.scoreEfficiency}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-foreground">Budget Adherence</span>
                    <span className="font-semibold text-success">{e.scoreBudget}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-success" style={{ width: `${e.scoreBudget}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-foreground">Peak Hour Avoidance</span>
                    <span className="font-semibold text-warning">{e.scorePeak}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-warning" style={{ width: `${e.scorePeak}%` }} />
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
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Daily</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={e.dailyData.map((v, i) => ({ day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], kwh: v }))} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <XAxis dataKey="day" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, border: "1px solid oklch(0.92 0.03 70)" }} formatter={(v: number) => [`${v.toFixed(1)} kWh`, "Usage"]} />
              <Bar dataKey="kwh" radius={[4, 4, 0, 0]} fill="#F97316">
                {e.dailyData.map((_, i) => (
                  <Cell key={i} fill={i >= 5 ? "#F97316" : "#FDBA74"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Weekly Trend</h3>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={e.weeklyData.map((v, i) => ({ day: ["M","T","W","T","F","S","S"][i], kwh: v }))} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <defs>
                  <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} formatter={(v: number) => [`${v.toFixed(1)} kWh`, "Usage"]} />
                <Area type="monotone" dataKey="kwh" stroke="#F97316" fill="url(#weeklyGrad)" strokeWidth={2} dot={{ r: 2, fill: "#F97316" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Peak Hours</h3>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={e.peakHours.map((v, i) => ({ hour: peakLabels[i], kw: v }))} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <XAxis dataKey="hour" tick={{ fontSize: 7 }} axisLine={false} tickLine={false} interval={2} />
                <YAxis hide />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} formatter={(v: number) => [`${v.toFixed(1)} kW`, "Load"]} />
                <Bar dataKey="kw" radius={[3, 3, 0, 0]}>
                  {e.peakHours.map((v, i) => (
                    <Cell key={i} fill={v > 60 ? "#ef4444" : v > 40 ? "#eab308" : "#F97316"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Appliance Monitoring</h3>
            <Link to="/appliances" className="text-[10px] font-semibold text-primary">View All →</Link>
          </div>

          {/* filter tabs */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
            {["All", "Excellent", "Good", "Moderate"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1 text-[10px] font-medium whitespace-nowrap transition ${
                  filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >{f}</button>
            ))}
          </div>

          {/* table */}
          <div className="rounded-2xl bg-card shadow-card overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left font-semibold text-muted-foreground py-2.5 px-3">Appliance</th>
                  <th className="text-left font-semibold text-muted-foreground py-2.5 px-2">Status</th>
                  <th className="text-right font-semibold text-muted-foreground py-2.5 px-2">kWh</th>
                  <th className="text-right font-semibold text-muted-foreground py-2.5 px-2">Cost</th>
                  <th className="text-right font-semibold text-muted-foreground py-2.5 px-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => {
                  const Icon = a.icon;
                  const effColor = a.efficiency === "Excellent" ? "text-emerald-600" : a.efficiency === "Good" ? "text-primary" : "text-amber-600";
                  const effBg = a.efficiency === "Excellent" ? "bg-emerald-50" : a.efficiency === "Good" ? "bg-primary/10" : "bg-amber-50";
                  return (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-warm text-primary-foreground shadow-glow">
                            <Icon size={15} />
                          </span>
                          <span className="font-semibold text-foreground">{a.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{a.hours}</td>
                      <td className="py-3 px-2 text-right font-semibold">{a.kwh}</td>
                      <td className="py-3 px-2 text-right font-semibold">₱{a.cost.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${effBg} ${effColor}`}>{a.efficiency}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
