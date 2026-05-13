import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Bell, TrendingUp, Sparkles, AlertTriangle, Camera, Zap } from "lucide-react";

export const Route = createFileRoute("/home")({ component: Home });

const trend = [42, 55, 48, 62, 58, 75, 70];

function Home() {
  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-5">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Magandang araw,</p>
            <h1 className="text-xl font-bold">Juan 👋</h1>
          </div>
          <button className="relative h-10 w-10 rounded-full bg-card shadow-card flex items-center justify-center">
            <Bell size={18} className="text-foreground" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </header>

        {/* Estimated Bill Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-warm p-6 text-primary-foreground shadow-glow">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          <p className="text-xs uppercase tracking-wide opacity-90">Estimated Monthly Bill</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold">₱2,485</span>
            <span className="text-sm opacity-90">.50</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <TrendingUp size={14} />
            <span>12% lower than last month</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Zap size={16} />} label="Today's Usage" value="8.4 kWh" sub="₱94 today" />
          <StatCard icon={<TrendingUp size={16} />} label="This Month" value="186 kWh" sub="of 250 budget" />
        </div>

        {/* Alert */}
        <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4">
          <AlertTriangle size={18} className="text-warning mt-0.5 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">Mataas na konsumo kagabi</p>
            <p className="text-muted-foreground">Aircon ran for 8 hours overnight (~₱180).</p>
          </div>
        </div>

        {/* Trend graph */}
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Usage Trend</h3>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {trend.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-soft transition-all"
                  style={{ height: `${v}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div className="rounded-2xl border border-primary/20 bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-warm text-primary-foreground">
              <Sparkles size={14} />
            </span>
            <h3 className="font-semibold text-sm">AI Insight</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Switching to your electric fan from 6–10 PM could save you around <span className="font-semibold text-primary">₱320 this month</span>.
          </p>
          <Link to="/insights" className="mt-3 inline-block text-xs font-semibold text-primary">
            See all tips →
          </Link>
        </div>

        {/* Upload bill quick action */}
        <Link
          to="/scan"
          className="flex items-center justify-between rounded-2xl border-2 border-dashed border-primary/40 bg-card p-4 active:scale-[0.99] transition"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Camera size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold">Upload your bill</p>
              <p className="text-xs text-muted-foreground">Scan to get instant AI breakdown</p>
            </div>
          </div>
          <span className="text-primary text-sm">→</span>
        </Link>
      </div>
    </AppShell>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <span className="text-primary">{icon}</span>
        <span className="text-[11px]">{label}</span>
      </div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}
