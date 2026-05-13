import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Sparkles, FileText, Check, Loader2, Lightbulb, Zap, DollarSign, Radio, Receipt, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/scan")({ component: Scan });

const breakdowns = [
  { name: "Generation", icon: Zap, amount: "₱1,206", pct: 42, desc: "Bayad sa paggawa ng kuryente (power plants)" },
  { name: "Distribution", icon: Radio, amount: "₱574", pct: 20, desc: "Bayad sa pagpapanatili ng mga poste at wirings" },
  { name: "Transmission", icon: Receipt, amount: "₱430", pct: 15, desc: "Bayad para maihatid ang kuryente sa inyong bahay" },
  { name: "Taxes & Others", icon: DollarSign, amount: "₱402", pct: 14, desc: "Mga buwis at iba pang regulatory charges" },
  { name: "Subsidies", icon: HelpCircle, amount: "₱260", pct: 9, desc: "Diskwento mula sa government subsidies" },
];

const steps = [
  { label: "Uploading bill image…", sub: "Preparing your file for processing" },
  { label: "Detecting text fields…", sub: "Reading kWh, charges, and dates" },
  { label: "Analyzing charges…", sub: "Breaking down generation, tax, and fees" },
  { label: "Generating AI explanation…", sub: "Creating personalized insights" },
];

function Scan() {
  const [stage, setStage] = useState<"upload" | "scanning" | "result">("upload");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (stage !== "scanning") return;
    if (step >= steps.length) { setStage("result"); return; }
    const t = setTimeout(() => setStep(s => s + 1), step === 0 ? 1800 : 1200);
    return () => clearTimeout(t);
  }, [stage, step]);

  const startScan = () => { setStage("scanning"); setStep(0); };
  const reset = () => setStage("upload");

  return (
    <AppShell>
      <div className="px-4 pt-6 pb-6 space-y-4">
        <header>
          <h1 className="text-2xl font-bold">Scan Your Bill</h1>
          <p className="text-sm text-muted-foreground">Snap a photo and let AI break it down for you.</p>
        </header>

        {/* ===== UPLOAD STAGE ===== */}
        {stage === "upload" && (
          <div className="space-y-4 animate-float-up">
            {/* Hero camera area */}
            <div className="relative rounded-3xl border-2 border-dashed border-primary/40 bg-card overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
              <div className="relative flex flex-col items-center gap-4 py-12 px-6">
                <div className="relative">
                  <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-warm text-primary-foreground shadow-glow animate-pulse">
                    <Camera size={36} />
                  </span>
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-success animate-ping" />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold">Tap to capture bill</p>
                  <p className="text-xs text-muted-foreground mt-1">Position your Meralco bill within the frame</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="default" size="lg" className="py-4 text-sm" onClick={startScan}>
                <Camera size={16} /> Take Photo
              </Button>
              <Button variant="outline" size="lg" className="py-4 text-sm" onClick={startScan}>
                <Upload size={16} /> Upload from Gallery
              </Button>
            </div>

            <div className="rounded-2xl bg-primary/5 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1.5">📸 Tips for best results</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-primary" /> Use bright, even lighting</li>
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-primary" /> Capture the whole bill</li>
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-primary" /> Avoid glare and shadows</li>
              </ul>
            </div>
          </div>
        )}

        {/* ===== SCANNING STAGE ===== */}
        {stage === "scanning" && (
          <div className="rounded-3xl bg-card p-6 shadow-card animate-float-up">
            <div className="relative mx-auto h-40 w-32 rounded-xl bg-muted overflow-hidden mb-6">
              <FileText size={32} className="absolute inset-0 m-auto text-muted-foreground/30" />
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-glow animate-scan top-1/2" />
            </div>
            <div className="space-y-4">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                    i < step ? "bg-success text-white" :
                    i === step ? "bg-primary text-primary-foreground animate-pulse" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {i < step ? <Check size={14} /> : i === step ? <Loader2 size={14} className="animate-spin" /> : <span className="text-[10px] font-semibold">{i + 1}</span>}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                    <p className={`text-[10px] ${i <= step ? "text-muted-foreground" : "text-muted-foreground/50"}`}>{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== RESULT STAGE ===== */}
        {stage === "result" && (
          <div className="space-y-4 animate-float-up">
            {/* Scanned Bill Preview */}
            <div className="rounded-2xl bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-success/10 text-success"><Check size={14} /></span>
                <p className="text-sm font-semibold">Bill Scanned Successfully</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gradient-to-br from-primary to-primary-dark p-3 text-primary-foreground">
                  <p className="text-[9px] opacity-80 uppercase tracking-wide">Total Amount</p>
                  <p className="text-xl font-bold mt-0.5">₱2,872</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide">kWh Used</p>
                  <p className="text-xl font-bold mt-0.5">215</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Due Date</p>
                  <p className="text-base font-bold mt-0.5">Nov 15</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Generation</p>
                  <p className="text-base font-bold mt-0.5">₱1,206</p>
                </div>
              </div>
            </div>

            {/* AI Bill Explanation */}
            <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-5 shadow-glow">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-white/80" />
                <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wide">AI Bill Explanation</p>
              </div>
              <div className="space-y-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
                <p className="text-xs text-white leading-relaxed">
                  Your bill increased because your air conditioning usage was significantly higher during hotter days this month.
                </p>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Generation charges accounted for <span className="font-semibold text-white">42%</span> of your total bill.
                </p>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Your household consumed <span className="font-semibold text-white">215 kWh</span>, which is above your normal monthly average.
                </p>
              </div>
            </div>

            {/* Bill Breakdown Cards */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Bill Breakdown</h3>
              <div className="space-y-2">
                {breakdowns.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div key={i} className="rounded-2xl bg-card p-3.5 shadow-card flex items-center gap-3">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        i === 0 ? "bg-gradient-warm text-primary-foreground shadow-glow" : "bg-primary/10 text-primary"
                      }`}>
                        <Icon size={16} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">{b.name}</p>
                          <span className="text-sm font-bold">{b.amount}</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-warm" style={{ width: `${b.pct}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">{b.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Easy Mode */}
            <div className="rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-primary" />
                <p className="text-[10px] font-semibold text-primary uppercase tracking-wide">Easy Mode — Intindihin ang bill mo</p>
              </div>
              <div className="space-y-1.5 text-xs text-foreground">
                <p><span className="font-semibold">Generation Charge</span> — Bayad sa mga power plant na gumagawa ng kuryente.</p>
                <p><span className="font-semibold">Transmission Charge</span> — Bayad para maihatid ang kuryente sa inyong bahay.</p>
                <p><span className="font-semibold">Distribution Charge</span> — Bayad sa pagpapanatili ng mga poste at wirings sa inyong lugar.</p>
                <p><span className="font-semibold">Taxes & Other Charges</span> — Mga buwis at regulatory fees na ipinapataw ng gobyerno.</p>
              </div>
            </div>

            <Button variant="outline" size="lg" className="w-full py-4 text-sm" onClick={reset}>
              Scan Another Bill
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
