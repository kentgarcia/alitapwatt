import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Sparkles, TrendingUp, Zap, Bell, Thermometer, Fan, ChefHat,
  Refrigerator, WashingMachine, Lightbulb, ArrowRight, ChevronRight,
  Leaf, Users, Target, Award, MessageCircle, X, Send,
  Clock, BarChart3, AlertTriangle, CheckCircle2,
  Moon, Home
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { useState, useEffect, useRef } from "react";
import happyImg from "../../assets/happy.png";
import ideaImg from "../../assets/idea.png";
import sadImg from "../../assets/sad.png";
import teachImg from "../../assets/teach.png";
import thinkingImg from "../../assets/thinking.png";

export const Route = createFileRoute("/insights")({ component: AIEnergyHub });

/* ── data ── */
const quickInsights = [
  { label: "Biggest Energy Consumer", icon: Thermometer, value: "Air Conditioner", detail: "38% · ₱1,240/mo", color: "from-orange-500 to-red-500" },
  { label: "Hidden Energy Waste", icon: Moon, value: "Idle appliances overnight", detail: "~₱85/month lost", color: "from-violet-500 to-purple-500" },
  { label: "Best Time to Save", icon: Clock, value: "9PM – 6AM", detail: "Off-peak rates apply", color: "from-blue-500 to-cyan-500" },
  { label: "Weekly Improvement", icon: TrendingUp, value: "8% more efficient", detail: "Than last week", color: "from-emerald-500 to-green-500" },
  { label: "Community Rank", icon: Users, value: "Top 28%", detail: "More efficient than neighbors", color: "from-amber-500 to-yellow-500" },
];

const appliances = [
  { name: "Air Conditioner", icon: Thermometer, usage: "120 kWh", cost: "₱1,540", rating: "Moderate", suggestion: "Increasing to 24°C may reduce costs by ₱300/mo.", iconColor: "text-sky-400" },
  { name: "Refrigerator", icon: Refrigerator, usage: "52 kWh", cost: "₱624", rating: "Fair", suggestion: "Check door seal for cooling leaks.", iconColor: "text-cyan-400" },
  { name: "Washing Machine", icon: WashingMachine, usage: "18 kWh", cost: "₱216", rating: "Good", suggestion: "Use cold wash cycle to save ₱80/mo.", iconColor: "text-indigo-400" },
  { name: "Electric Fan", icon: Fan, usage: "12 kWh", cost: "₱144", rating: "Excellent", suggestion: "Optimal usage — keep it up!", iconColor: "text-emerald-400" },
  { name: "Rice Cooker", icon: ChefHat, usage: "9 kWh", cost: "₱108", rating: "Excellent", suggestion: "Unplug when not in use.", iconColor: "text-amber-400" },
];

const recommendations = [
  { title: "Switch to LED Bulbs", save: "₱180/mo", diff: "Easy", impact: "Medium", color: "from-emerald-500 to-teal-500" },
  { title: "Avoid peak hour simultaneous usage", save: "₱320/mo", diff: "Moderate", impact: "High", color: "from-blue-500 to-indigo-500" },
  { title: "Use fan instead of AC at night", save: "₱500/mo", diff: "Easy", impact: "High", color: "from-violet-500 to-purple-500" },
  { title: "Unplug idle appliances", save: "₱85/mo", diff: "Easy", impact: "Low", color: "from-amber-500 to-orange-500" },
];

const suggestedPrompts = [
  "Why is my bill high?",
  "How to lower AC usage?",
  "Best appliance to upgrade?",
  "Stay under ₱3,000 this month",
];

const badges = [
  { name: "Tipid Master", icon: Award, desc: "Saved ₱500+ this month" },
  { name: "Low Consumer", icon: Leaf, desc: "Below average usage" },
  { name: "Budget Protector", icon: Target, desc: "Stayed under budget" },
  { name: "Eco Household", icon: Sparkles, desc: "Reduced carbon footprint" },
];

/* ── components ── */

function AIOrb({ size = 80 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary-soft to-primary-dark animate-pulse blur-sm" style={{ animationDuration: "3s" }} />
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/80 to-primary-dark/80 backdrop-blur-sm flex items-center justify-center">
        <Brain size={size * 0.4} className="text-white drop-shadow-lg" />
      </div>
      <div className="absolute -inset-4 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: "4s" }} />
      <div className="absolute -inset-8 rounded-full border border-primary/10 animate-ping" style={{ animationDuration: "4s", animationDelay: "1s" }} />
    </div>
  );
}

function StatusBadge({ label, type }: { label: string; type: "excellent" | "stable" | "warning" | "critical" }) {
  const colors = {
    excellent: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    stable: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${colors[type]}`}>
      <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${type === "excellent" ? "bg-emerald-400" : type === "stable" ? "bg-blue-400" : type === "warning" ? "bg-amber-400" : "bg-red-400"}`} />
      {label}
    </span>
  );
}

function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Hi Kent! I'm your AI energy assistant. Ask me anything about your electricity usage." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

  const send = (msg?: string) => {
    const text = (msg || input).trim();
    if (!text || thinking) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setThinking(true);
    setTimeout(() => {
      const replies: Record<string, string> = {
        "why is my bill high": "Your bill increased mainly due to longer aircon usage this month (up 18%). Try setting it to 24°C — you could save around ₱300.",
        "how to lower ac usage": "Set your AC to 24-25°C, use a fan to circulate air, and turn it off 30min before leaving the room. Estimated savings: ₱400/mo.",
        "best appliance to upgrade": "Your refrigerator is 8 years old — newer models use 40% less energy. Upgrading could save you ₱250/mo.",
        "stay under 3000 this month": "You've used ₱2,485 so far. Reduce AC by 2hrs/day and unplug idle devices to stay under ₱3,000.",
      };
      const reply = Object.entries(replies).find(([k]) => text.toLowerCase().includes(k))?.[1] || "I can help with specific topics! Please try one of the suggested questions above: why your bill is high, how to lower AC usage, which appliance to upgrade, or how to stay under your monthly budget.";
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
      setThinking(false);
    }, 1500);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-72 rounded-2xl bg-card shadow-2xl border border-primary/20 overflow-hidden animate-float-up">
          <div className="bg-gradient-to-r from-primary to-primary-dark p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={happyImg} alt="" className="h-5 w-5 object-contain" />
              <p className="text-xs font-semibold text-white">AlitapWatt AI</p>
            </div>
            <button onClick={() => setOpen(false)}><X size={16} className="text-white/70" /></button>
          </div>
          <div className="h-56 overflow-y-auto p-3 space-y-2 bg-card">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}>{m.text}</div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl px-3 py-2 bg-muted flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
            <div ref={chatEnd} />
          </div>
          <div className="p-3 border-t border-border">
            <div className="flex flex-wrap gap-1 mb-2">
              {suggestedPrompts.map((p, i) => (
                <button key={i} onClick={() => send(p)} className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] text-primary font-medium hover:bg-primary/20 transition">{p}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask AI..." className="flex-1 rounded-xl bg-muted px-3 py-2 text-xs outline-none" />
              <button onClick={() => send()} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><Send size={14} /></button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-glow hover:scale-105 transition">
        {open ? <X size={20} className="text-white" /> : <MessageCircle size={20} className="text-white" />}
      </button>
    </>
  );
}

/* ── main page ── */

function AIEnergyHub() {
  const [greeting, setGreeting] = useState("loading");
  const [activeChart, setActiveChart] = useState<"hourly" | "appliance" | "daily">("hourly");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening");
  }, []);

  return (
    <AppShell>
      <div className="px-4 pt-5 pb-6 space-y-5 relative">
        {/* ── header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-soft bg-clip-text text-transparent">AI Energy Hub</h1>
            <p className="text-[11px] text-muted-foreground">Your personal energy intelligence center</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary border border-primary/20">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
          </span>
        </div>

        {/* ── hero ai section ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-primary p-6 shadow-glow">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img src={happyImg} alt="" className="h-20 w-20 object-contain drop-shadow-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold">{greeting}, Kent <span className="inline-block animate-wave">👋</span></p>
              <div className="mt-2 bg-white/15 backdrop-blur-sm rounded-xl px-3.5 py-2.5">
                <p className="text-xs text-white/90 leading-relaxed">
                  Your household energy usage increased by <span className="font-bold text-white">12%</span> this week, mainly due to longer air conditioner usage during hotter evenings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── quick access cards ── */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/appliances" className="rounded-2xl bg-card p-4 shadow-card border border-primary/5 active:scale-[0.98] transition">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground shadow-glow">
              <Zap size={18} />
            </span>
            <p className="text-sm font-bold mt-3">Appliance Tracker</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Calculate & monitor appliance costs</p>
          </Link>
          <Link to="/forecast" className="rounded-2xl bg-card p-4 shadow-card border border-primary/5 active:scale-[0.98] transition">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground shadow-glow">
              <BarChart3 size={18} />
            </span>
            <p className="text-sm font-bold mt-3">Forecast Usage</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Predict & simulate future bills</p>
          </Link>
        </div>

        {/* ── quick insights carousel ── */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">AI Quick Insights</h3>
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {quickInsights.map((q, i) => {
              const Icon = q.icon;
              return (
                <div key={i} className="shrink-0 w-48 rounded-2xl bg-card p-4 shadow-card border border-primary/5 hover:border-primary/20 transition">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${q.color} text-white shadow-glow`}>
                    <Icon size={16} />
                  </span>
                  <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide mt-3">{q.label}</p>
                  <p className="text-sm font-bold mt-0.5">{q.value}</p>
                  <p className="text-[10px] text-muted-foreground">{q.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ai energy analysis ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">How Your Home Uses Energy</h3>
            <div className="flex gap-1">
              {(["hourly", "appliance", "daily"] as const).map(c => (
                <button key={c} onClick={() => setActiveChart(c)} className={`rounded-lg px-2.5 py-1 text-[9px] font-medium transition ${
                  activeChart === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            {activeChart === "hourly" && (
              <div className="space-y-2">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={[18, 22, 35, 48, 62, 75, 68, 55, 40, 30, 20, 15].map((v, i) => ({ hour: ["6A","8A","10A","12P","2P","4P","6P","8P","10P","12A","2A","4A"][i], kw: v }))} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <XAxis dataKey="hour" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} formatter={(v: number) => [`${v.toFixed(1)} kW`, "Load"]} />
              <Bar dataKey="kw" radius={[4, 4, 0, 0]}>
                {[18, 22, 35, 48, 62, 75, 68, 55, 40, 30, 20, 15].map((v, i) => (
                  <Cell key={i} fill={v > 60 ? "#ef4444" : v > 40 ? "#eab308" : "#F97316"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
                <p className="text-[10px] text-muted-foreground italic flex items-center gap-2">
                  <img src={thinkingImg} alt="" className="h-4 w-4 object-contain" />
                  Your peak electricity usage occurs between 7PM and 10PM when multiple appliances operate simultaneously.
                </p>
              </div>
            )}
            {activeChart === "appliance" && (
              <div className="space-y-1">
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={[
                    { name: "Air Conditioner", pct: 38 },
                    { name: "Refrigerator", pct: 22 },
                    { name: "TV & Devices", pct: 15 },
                    { name: "Washing Machine", pct: 12 },
                    { name: "Lights & Others", pct: 13 },
                  ]} layout="vertical" margin={{ top: 0, right: 5, bottom: 0, left: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={95} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, "Usage"]} />
                    <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                      {[
                        { name: "Air Conditioner", pct: 38, color: "#F97316" },
                        { name: "Refrigerator", pct: 22, color: "#06b6d4" },
                        { name: "TV & Devices", pct: 15, color: "#8b5cf6" },
                        { name: "Washing Machine", pct: 12, color: "#10b981" },
                        { name: "Lights & Others", pct: 13, color: "#eab308" },
                      ].map((a, i) => (
                        <Cell key={i} fill={a.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {activeChart === "daily" && (
              <div className="space-y-1">
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={[28, 35, 22, 40, 32, 48, 55].map((v, i) => ({ day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], kwh: v }))} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} formatter={(v: number) => [`${v.toFixed(1)} kWh`, "Usage"]} />
                    <Bar dataKey="kwh" radius={[4, 4, 0, 0]} fill="#F97316">
                      {[28, 35, 22, 40, 32, 48, 55].map((v, i) => (
                        <Cell key={i} fill={i >= 5 ? "#F97316" : "#FDBA74"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-[10px] text-muted-foreground italic">Weekend usage tends to be higher — try scheduling heavy appliances on weekdays.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── smart home energy control center ── */}
        <Link to="/smart-home" className="block rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-4 shadow-glow active:scale-[0.99] transition">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Home size={22} className="text-white" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Smart Home Energy</p>
              <p className="text-[10px] text-white/70">Monitor and control your appliances in real time.</p>
            </div>
            <ArrowRight size={18} className="text-white/60 shrink-0" />
          </div>
        </Link>

        {/* ── smart appliance intelligence ── */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Smart Appliance Intelligence</h3>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left font-semibold text-muted-foreground py-2.5 px-3">Appliance</th>
                  <th className="text-right font-semibold text-muted-foreground py-2.5 px-2">Usage</th>
                  <th className="text-right font-semibold text-muted-foreground py-2.5 px-2">Cost</th>
                  <th className="text-right font-semibold text-muted-foreground py-2.5 px-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {appliances.map((a, i) => {
                  const Icon = a.icon;
                  const rateColor = a.rating === "Excellent" ? "text-emerald-600 bg-emerald-50" : a.rating === "Good" ? "text-blue-600 bg-blue-50" : a.rating === "Moderate" ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
                  return (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 ${a.iconColor}`}>
                            <Icon size={15} />
                          </span>
                          <span className="font-semibold text-foreground">{a.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right font-semibold">{a.usage}</td>
                      <td className="py-3 px-2 text-right font-semibold">{a.cost}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${rateColor}`}>{a.rating}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── ai savings recommendations ── */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Smart Tipid Recommendations</h3>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left font-semibold text-muted-foreground py-2.5 px-3">Recommendation</th>
                  <th className="text-right font-semibold text-muted-foreground py-2.5 px-2">Savings</th>
                  <th className="text-right font-semibold text-muted-foreground py-2.5 px-2">Difficulty</th>
                  <th className="text-right font-semibold text-muted-foreground py-2.5 px-3">Impact</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((r, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={ideaImg} alt="" className="h-6 w-6 object-contain shrink-0" />
                        <span className="font-semibold text-foreground">{r.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-success">{r.save}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{r.diff}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${
                        r.impact === "High" ? "text-emerald-600 bg-emerald-50" : r.impact === "Medium" ? "text-amber-600 bg-amber-50" : "text-blue-600 bg-blue-50"
                      }`}>{r.impact}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── ai bill explainer ── */}
        <div className="rounded-2xl bg-card p-5 shadow-card border border-primary/5">
          <div className="flex items-start gap-3 mb-3">
            <img src={sadImg} alt="" className="h-8 w-8 object-contain shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide">Why Your Bill Changed</h3>
            </div>
          </div>
          <div className="bg-muted rounded-xl px-4 py-3 space-y-2">
            <p className="text-xs text-foreground leading-relaxed">
              Your bill increased by <span className="font-bold text-primary">₱420</span> compared to last month.
            </p>
            <div className="space-y-1 text-[11px] text-muted-foreground">
              <p className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-primary" /> Increased evening appliance usage</p>
              <p className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-primary" /> Longer air conditioner runtime (+18%)</p>
              <p className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-primary" /> Higher regional electricity rates</p>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Your overall consumption increased from <span className="font-semibold text-foreground">182 kWh</span> to <span className="font-semibold text-foreground">214 kWh</span>.
            </p>
          </div>
          <details className="mt-3">
            <summary className="text-[10px] text-primary font-semibold cursor-pointer">Sa madaling salita (Taglish)</summary>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              Tumaas ang bill mo ng ₱420 kumpara noong nakaraang buwan. Dahil ito sa mas matagal na paggamit ng aircon at ibang appliances sa gabi. Mas marami kang nagamit na kuryente — 214 kWh ngayon vs 182 kWh last month.
            </p>
          </details>
        </div>

        {/* ── energy saver gamification ── */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Your Energy Saver Journey</h3>
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-5 shadow-glow">
            <div className="flex items-start gap-3 mb-3">
              <img src={happyImg} alt="" className="h-10 w-10 object-contain shrink-0 drop-shadow-lg" />
              <div>
                <p className="text-[10px] text-white/60 uppercase tracking-wide font-semibold">Level 4</p>
                <p className="text-lg font-bold text-white">Tipid Saver</p>
              </div>
              <div className="text-right ml-auto">
                <p className="text-[10px] text-white/60">XP</p>
                <p className="text-sm font-bold text-white">1,240 / 2,000</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400" style={{ width: "62%" }} />
            </div>
            <div className="flex gap-2 mt-3">
              {badges.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex-1 rounded-xl bg-white/10 backdrop-blur-sm p-2 text-center">
                    <Icon size={16} className="mx-auto text-white/80" />
                    <p className="text-[8px] text-white/60 mt-1 font-medium">{b.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── community impact ── */}
        <div className="rounded-2xl bg-card p-5 shadow-card border border-primary/5 text-center">
          <img src={happyImg} alt="" className="h-12 w-12 object-contain mx-auto" />
          <h3 className="text-xs font-semibold uppercase tracking-wide mt-2">Community Energy Impact</h3>
          <p className="text-2xl font-bold text-primary mt-2">₱125,000</p>
          <p className="text-[11px] text-muted-foreground">saved by AlitapWatt users in Laguna this month</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Leaf size={12} /> 1,200 trees planted</span>
            <span className="flex items-center gap-1"><Users size={12} /> 2,450 households</span>
          </div>
        </div>
      </div>

      {/* ── floating chat ── */}
      <FloatingChat />
    </AppShell>
  );
}

/* inline helper for unused icon references */
function FileText(props: any) { return (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);}
