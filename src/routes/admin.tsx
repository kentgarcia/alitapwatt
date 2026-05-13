import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { ArrowLeft, Users, TrendingUp, PiggyBank, Activity, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: Admin });

const months = [62, 70, 68, 78, 85, 92, 88, 95];
const issues = [
  { label: "Bill not readable", count: 124, pct: 38 },
  { label: "Wrong period detected", count: 86, pct: 26 },
  { label: "Missing kWh value", count: 64, pct: 19 },
  { label: "Other OCR errors", count: 56, pct: 17 },
];

function Admin() {
  return (
    <MobileFrame>
      <div className="px-5 pt-8 pb-10 space-y-5">
        <header className="flex items-center gap-3">
          <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-card">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Admin Analytics</h1>
            <p className="text-xs text-muted-foreground">System overview</p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3">
          <Metric icon={<Users size={16} />} label="Total Users" value="12,486" delta="+8.2%" />
          <Metric icon={<Activity size={16} />} label="Active Today" value="3,241" delta="+12%" />
          <Metric icon={<PiggyBank size={16} />} label="Avg Savings" value="₱412" delta="+₱48" />
          <Metric icon={<TrendingUp size={16} />} label="Bills Scanned" value="48,920" delta="+1,204" />
        </div>

        <div className="rounded-2xl bg-card p-5 shadow-card">
          <h3 className="font-semibold text-sm mb-1">Active Users</h3>
          <p className="text-xs text-muted-foreground mb-4">Last 8 months</p>
          <div className="flex items-end gap-2 h-32">
            {months.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary-soft transition-all hover:opacity-80"
                  style={{ height: `${v}%` }}
                />
                <span className="text-[9px] text-muted-foreground">{["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-warning" />
            <h3 className="font-semibold text-sm">Common Bill Issues</h3>
          </div>
          <div className="space-y-3">
            {issues.map((it) => (
              <div key={it.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{it.label}</span>
                  <span className="text-muted-foreground">{it.count} ({it.pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-warm rounded-full" style={{ width: `${it.pct * 2.5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <SmallStat label="Uptime" value="99.9%" />
          <SmallStat label="Avg Response" value="184ms" />
          <SmallStat label="API Calls" value="2.4M" />
        </div>
      </div>
    </MobileFrame>
  );
}

function Metric({ icon, label, value, delta }: { icon: React.ReactNode; label: string; value: string; delta: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <span className="text-primary">{icon}</span>
        <span className="text-[11px]">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] text-success font-semibold mt-0.5">{delta}</p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card p-3 shadow-card text-center">
      <p className="text-sm font-bold text-primary">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
