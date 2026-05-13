import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Thermometer, Fan, ChefHat, WashingMachine,
  Lightbulb, Tv, Plug, Zap, ArrowLeft,
  Moon, Volume2, Radio, Shield,
  AlertTriangle, CheckCircle2, Monitor, Refrigerator
} from "lucide-react";
import { useEnergyData } from "@/lib/storage/context";

export const Route = createFileRoute("/smart-home")({
  component: SmartHome,
  head: () => ({ meta: [{ title: "Smart Home Energy — AlitapWatt" }] }),
});

const integrations = ["Smart Plugs", "IoT Sensors", "Smart Meters", "Utility API", "Solar Panels"];

function SmartHome() {
  const { data } = useEnergyData();
  const { smartDevices: devices, automationRules: rules, liveCost, liveKw, projectedDaily } = data.energy;
  return (
    <AppShell>
      <div className="px-4 pt-6 pb-6 space-y-5">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/insights" className="flex h-8 w-8 items-center justify-center rounded-lg bg-card shadow-card">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-lg font-bold">Smart Home</h1>
              <p className="text-[10px] text-muted-foreground">Monitor and control your appliances</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[9px] font-semibold text-success border border-success/20">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Connected
          </span>
        </div>

        {/* live cost tracker */}
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-5 shadow-glow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-white/60 uppercase tracking-wide font-semibold">Live Consumption</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-bold text-white">₱{liveCost.toFixed(2)}</span>
                <span className="text-sm text-white/60">/hour</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-white/70">
                <span className="flex items-center gap-1"><Zap size={14} /> {liveKw} kW</span>
                <span>Projected daily: ₱{projectedDaily}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/60">
              <span className="h-2 w-2 rounded-full bg-success animate-ping" /> LIVE
            </div>
          </div>
        </div>

        {/* device grid */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Connected Devices</h3>
          <div className="grid grid-cols-2 gap-2">
            {devices.map((d, i) => {
              const iconMap: Record<string, any> = { "Air Conditioner": Thermometer, "Refrigerator": Refrigerator, "Smart Plug": Plug, "Television": Tv, "Rice Cooker": ChefHat, "Washing Machine": WashingMachine, "Electric Fan": Fan, "Lights": Lightbulb, "Gaming PC": Monitor, "Water Heater": Zap };
              const Icon = iconMap[d.name] || Zap;
              const statusColor = d.status === "ON" ? "text-success bg-success/10" : "text-muted-foreground bg-muted";
              const ratingColor = d.rating === "Excellent" ? "text-emerald-400" : d.rating === "High" ? "text-destructive" : d.rating === "Good" ? "text-primary" : "text-muted-foreground";
              return (
                <div key={i} className="rounded-xl bg-card p-3 shadow-card border border-primary/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-warm text-primary-foreground">
                      <Icon size={13} />
                    </span>
                    <p className="text-[10px] font-semibold flex-1 truncate">{d.name}</p>
                    <span className={`rounded-full px-1.5 py-0.5 text-[7px] font-semibold ${statusColor}`}>{d.status}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold">{d.watts > 0 ? `${d.watts}W` : "—"}</span>
                    <span className="text-[8px] text-muted-foreground">{d.cost}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[8px] text-muted-foreground">{d.daily}</span>
                    <span className={`text-[8px] font-semibold ${ratingColor}`}>{d.rating}</span>
                  </div>
                  {d.suggestion && (
                    <p className="text-[8px] text-primary mt-1.5 border-t border-border pt-1">💡 {d.suggestion}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* automation rules */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Automation Rules</h3>
          <div className="space-y-1.5">
            {rules.map((r, i) => {
              const ruleIconMap: Record<string, any> = { "Turn off lights at 12AM": Moon, "Alert if AC runs > 8 hours": Thermometer, "Notify on refrigerator spike": Refrigerator };
              const Icon = ruleIconMap[r.label] || Zap;
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-card p-3.5 shadow-card border border-primary/5">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${r.active ? "bg-gradient-warm text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"}`}>
                    <Icon size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{r.label}</p>
                  </div>
                  <span className={`text-[10px] font-semibold ${r.active ? "text-success" : "text-muted-foreground"}`}>{r.active ? "Active" : "Off"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* voice ai & integrations row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-muted p-4">
            <Volume2 size={16} className="text-primary mb-2" />
            <p className="text-[10px] font-semibold mb-1.5">Voice AI Control</p>
            <div className="space-y-1">
              {["Which appliance consumes the most?", "Turn off living room lights"].map((q, i) => (
                <p key={i} className="text-[9px] text-muted-foreground bg-card rounded-lg px-2 py-1.5">"{q}"</p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <Radio size={16} className="text-primary mb-2" />
            <p className="text-[10px] font-semibold mb-1.5">Integrations</p>
            <div className="flex flex-wrap gap-1">
              {integrations.map((f, i) => (
                <span key={i} className="rounded-md bg-muted px-2 py-0.5 text-[8px] text-muted-foreground font-medium">{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* device health summary */}
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-primary" />
            <p className="text-xs font-semibold">Device Health Overview</p>
          </div>
          <div className="space-y-2">
            {devices.filter(d => d.health < 80).slice(0, 3).map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-warning/10 text-warning">
                  <AlertTriangle size={12} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-warning">{d.health}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden mt-0.5">
                    <div className="h-full rounded-full bg-warning" style={{ width: `${d.health}%` }} />
                  </div>
                </div>
              </div>
            ))}
            {devices.filter(d => d.health >= 80).length > 0 && (
              <div className="flex items-center gap-2 text-[10px] text-success">
                <CheckCircle2 size={12} />
                <span>{devices.filter(d => d.health >= 80).length} devices in good health</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
