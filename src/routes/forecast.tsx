import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, TrendingDown, Download, Share2,
  Award, Leaf, PiggyBank, Zap,
  Thermometer, Lightbulb, Sparkles,
  ChevronRight, BarChart3, AlertTriangle, CheckCircle2,
  Star, Trophy, X, Calendar, ArrowLeft
} from "lucide-react";
import happyImg from "../../assets/happy.png";
import ideaImg from "../../assets/idea.png";
import teachImg from "../../assets/teach.png";
import { useEnergyData } from "@/lib/storage/context";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

export const Route = createFileRoute("/forecast")({ component: EnergyHistory });

function EnergyHistory() {
  const { data } = useEnergyData();
  const e = data.energy;
  const [selectedMonth, setSelectedMonth] = useState<typeof e.months[0] | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showSharePreview, setShowSharePreview] = useState(false);
  const monthLabels = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  return (
    <AppShell>
      <div className="px-4 pt-6 pb-6 space-y-5">
        {/* ── header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Energy History</h1>
            <p className="text-xs text-muted-foreground">Track how your household energy habits change over time.</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary border border-primary/20">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Synced
          </span>
        </div>

        {/* ── energy consumption forecast ── */}
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-5 shadow-glow">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-white/80" />
            <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wide">Energy Consumption Forecast</p>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-white/60">Predicted Next Bill</p>
              <p className="text-3xl font-bold text-white mt-1">₱{e.predictedBill.toLocaleString()}</p>
              <p className="text-[10px] text-white/70 mt-1">Based on current {e.currentUsage} kWh/month trend</p>
              <div className="flex items-center gap-3 mt-2 text-[10px]">
                <span className="flex items-center gap-1 text-emerald-400"><TrendingDown size={12} /> {Math.abs(e.months[0]?.change || 8)}% vs last month</span>
                <span className="text-white/50">|</span>
                <span className="text-amber-400">Above budget by ₱{e.predictedBill - e.budgetTotal}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
            <div className="flex justify-between text-[10px] text-white/70 mb-1">
              <span>Current usage</span>
              <span>{e.currentUsage} kWh</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full bg-white/40" style={{ width: `${Math.min(100, (e.currentUsage / 250) * 100)}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-white/70 mt-1">
              <span>Budget</span>
              <span>250 kWh</span>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-white/50 italic">Reduce AC usage by 1 hour/day to save ~₱280 next month.</p>
        </div>

        {/* ── top KPI cards ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-4 text-primary-foreground shadow-glow">
            <PiggyBank size={16} className="opacity-80" />
            <p className="text-2xl font-bold mt-2">₱{e.totalSavingsYear.toLocaleString()}</p>
            <p className="text-[10px] opacity-80">Total Savings This Year</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <BarChart3 size={16} className="text-primary" />
            <p className="text-2xl font-bold mt-2">₱{e.avgBill.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Average Monthly Bill</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <TrendingDown size={16} className="text-success" />
            <p className="text-2xl font-bold mt-2 text-success">₱{e.lowestMonth.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Lowest Month ({e.lowestMonthLabel})</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <TrendingUp size={16} className="text-destructive" />
            <p className="text-2xl font-bold mt-2 text-destructive">₱{e.highestMonth.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Highest Month ({e.highestMonthLabel})</p>
          </div>
        </div>

        {/* ── yearly chart ── */}
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide">Monthly Bill Trends</h3>
            <div className="flex gap-1 text-[9px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> This Year</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={e.monthlyData.map((v, i) => ({ month: monthLabels[i], bill: v }))} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <XAxis dataKey="month" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} formatter={(v: number) => [`₱${v.toLocaleString()}`, "Bill"]} />
              <Bar dataKey="bill" radius={[4, 4, 0, 0]}>
                {e.monthlyData.map((v, i) => (
                  <Cell key={i} fill={v > 2900 ? "#ef4444" : v > 2650 ? "#eab308" : "#F97316"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── monthly breakdown ── */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Monthly Breakdown</h3>
          {selectedMonth ? (
            <div className="animate-float-up">
              <button onClick={() => setSelectedMonth(null)} className="text-xs text-primary font-semibold mb-3 flex items-center gap-1"><ArrowLeft size={14} /> Back to all months</button>
              <div className="rounded-2xl bg-card p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-primary" />
                    <p className="text-base font-bold">{selectedMonth.name}</p>
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-semibold ${selectedMonth.change < 0 ? "text-success" : "text-destructive"}`}>
                    {selectedMonth.change < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                    {Math.abs(selectedMonth.change)}% vs prev
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-primary to-primary-dark p-3 text-primary-foreground">
                    <p className="text-[9px] opacity-80 uppercase">Total Bill</p>
                    <p className="text-xl font-bold mt-0.5">₱{selectedMonth.bill.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl bg-muted p-3">
                    <p className="text-[9px] text-muted-foreground uppercase">kWh Used</p>
                    <p className="text-xl font-bold mt-0.5">{selectedMonth.kwh}</p>
                  </div>
                </div>
                <div className="bg-muted rounded-xl px-4 py-3 flex items-start gap-2">
                  <img src={ideaImg} alt="" className="h-4 w-4 object-contain shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedMonth.insight}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-card shadow-card overflow-hidden">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left font-semibold text-muted-foreground py-2.5 px-3">Month</th>
                    <th className="text-right font-semibold text-muted-foreground py-2.5 px-2">Bill</th>
                    <th className="text-right font-semibold text-muted-foreground py-2.5 px-2">kWh</th>
                    <th className="text-right font-semibold text-muted-foreground py-2.5 px-3">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {e.months.map((m, i) => (
                    <tr key={i} onClick={() => setSelectedMonth(m)} className="border-b border-border last:border-0 hover:bg-muted/30 transition cursor-pointer">
                      <td className="py-3 px-3 font-semibold">{m.name}</td>
                      <td className="py-3 px-2 text-right font-semibold">₱{m.bill.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right text-muted-foreground">{m.kwh}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`flex items-center justify-end gap-0.5 text-xs font-semibold ${m.change < 0 ? "text-success" : "text-destructive"}`}>
                          {m.change < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                          {Math.abs(m.change)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── AI comparison engine ── */}
        <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-5 shadow-glow">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-white/80" />
            <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wide">How You've Improved</p>
          </div>
          <div className="space-y-2">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
              <p className="text-xs text-white leading-relaxed">
                Your energy consumption decreased by <span className="font-bold text-white">18%</span> over the last 6 months.
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
              <p className="text-xs text-white leading-relaxed">
                You are consistently staying under your budget since <span className="font-bold text-white">March</span>.
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
              <p className="text-xs text-white leading-relaxed">
                Air conditioner usage dropped after applying AI recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* ── smart insights timeline ── */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Energy Journey Timeline</h3>
          <div className="space-y-0 relative before:absolute before:left-4 before:top-0 before:h-full before:w-px before:bg-border">
            {e.timeline.map((t, i) => {
              const Icon = t.type === "good" ? CheckCircle2 : t.type === "warn" ? AlertTriangle : Lightbulb;
              const dotColor = t.type === "good" ? "bg-success" : t.type === "warn" ? "bg-warning" : "bg-primary";
              const bgColor = t.type === "good" ? "bg-success/10 border-success/20" : t.type === "warn" ? "bg-warning/10 border-warning/20" : "bg-primary/10 border-primary/20";
              return (
                <div key={i} className="relative pl-10 pb-4 last:pb-0">
                  <span className={`absolute left-2.5 top-1 h-3 w-3 rounded-full ${dotColor} ring-4 ring-background`} />
                  <div className={`rounded-xl border ${bgColor} p-3`}>
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={t.type === "good" ? "text-success" : t.type === "warn" ? "text-warning" : "text-primary"} />
                      <span className="text-[10px] text-muted-foreground">{t.date}</span>
                    </div>
                    <p className="text-xs text-foreground mt-1">{t.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── savings achievements ── */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Savings Achievements</h3>
          <div className="grid grid-cols-2 gap-2">
            {e.achievements.map((a, i) => {
              const Icon = i === 0 ? Trophy : i === 1 ? Star : i === 2 ? Leaf : Award;
              return (
                <div key={i} className="rounded-2xl bg-card p-4 shadow-card text-center border border-primary/5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground shadow-glow mx-auto">
                    <Icon size={18} />
                  </span>
                  <p className="text-xs font-bold mt-2">{a.label}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── export section ── */}
        <div className="rounded-2xl bg-card p-5 shadow-card border border-primary/5">
          <div className="flex items-center gap-3 mb-3">
            <img src={teachImg} alt="" className="h-8 w-8 object-contain" />
            <div>
              <p className="text-sm font-semibold">Export Your Energy Report</p>
              <p className="text-[10px] text-muted-foreground">Download or share your household analytics</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="default" size="sm" className="py-3 text-xs" onClick={() => setShowPdfPreview(true)}>
              <Download size={14} /> PDF Report
            </Button>
            <Button variant="outline" size="sm" className="py-3 text-xs" onClick={() => setShowSharePreview(true)}>
              <Share2 size={14} /> Share Summary
            </Button>
          </div>
        </div>

        {/* ===== PDF PREVIEW MODAL ===== */}
        {showPdfPreview && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-float-up" onClick={() => setShowPdfPreview(false)}>
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-primary to-primary-dark p-5 text-white text-center">
                <p className="text-xs font-semibold uppercase tracking-wider">Energy Report</p>
                <p className="text-lg font-bold mt-1">AlitapWatt</p>
                <p className="text-[10px] opacity-80">{e.userName}'s Household</p>
              </div>
              <div className="p-5 space-y-3 text-[11px] text-gray-700">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span>Estimated Monthly Bill</span>
                  <span className="font-bold">₱{e.estimatedBill.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span>Current Consumption</span>
                  <span className="font-bold">{e.currentUsage} kWh</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span>Monthly Budget</span>
                  <span className="font-bold">₱{e.budgetTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span>Total Savings</span>
                  <span className="font-bold text-green-600">₱{e.totalSavingsYear.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span>Energy Score</span>
                  <span className="font-bold">{e.energyScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Monthly Bill</span>
                  <span className="font-bold">₱{e.avgBill.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 text-center">
                <p className="text-[9px] text-gray-400">Generated by AlitapWatt · alitapwatt.app</p>
                <Button size="sm" className="mt-3 w-full text-xs" onClick={() => { setShowPdfPreview(false); window.print(); }}>
                  <Download size={14} /> Download PDF
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ===== SHARE PREVIEW MODAL ===== */}
        {showSharePreview && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-float-up" onClick={() => setShowSharePreview(false)}>
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="relative bg-gradient-to-br from-primary via-primary-dark to-primary p-6 text-white text-center overflow-hidden">
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <img src={happyImg} alt="" className="h-12 w-12 object-contain mx-auto" />
                <p className="text-lg font-bold mt-2">AlitapWatt</p>
                <p className="text-[10px] opacity-80">Energy Summary · {new Date().toLocaleDateString()}</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500">Monthly Energy Bill</p>
                  <p className="text-3xl font-bold text-gray-900">₱{e.estimatedBill.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="rounded-lg bg-orange-50 p-2">
                    <p className="font-bold text-gray-900">{e.currentUsage}</p>
                    <p className="text-gray-500">kWh</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-2">
                    <p className="font-bold text-green-700">₱{e.savings.toLocaleString()}</p>
                    <p className="text-gray-500">Saved</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-2">
                    <p className="font-bold text-blue-700">{e.energyScore}</p>
                    <p className="text-gray-500">Score</p>
                  </div>
                </div>
                <p className="text-center text-[10px] text-gray-400 pt-2 border-t border-gray-100">
                  🇵🇭 Powered by AlitapWatt · Making Filipino homes energy-efficient
                </p>
              </div>
              <div className="p-4 bg-gray-50 flex gap-2">
                <Button size="sm" className="flex-1 text-xs" onClick={() => { setShowSharePreview(false); }}>
                  <Share2 size={14} /> Share Now
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setShowSharePreview(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
