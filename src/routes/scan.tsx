import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Camera, Upload, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/scan")({ component: Scan });

function Scan() {
  const [stage, setStage] = useState<"upload" | "scanning" | "result">("upload");

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-5">
        <header>
          <h1 className="text-2xl font-bold">Scan Your Bill</h1>
          <p className="text-sm text-muted-foreground">Upload a photo to get an AI breakdown.</p>
        </header>

        {stage === "upload" && (
          <div className="space-y-4 animate-float-up">
            <button
              onClick={() => { setStage("scanning"); setTimeout(() => setStage("result"), 2400); }}
              className="w-full rounded-3xl border-2 border-dashed border-primary/50 bg-card p-8 flex flex-col items-center gap-3 active:scale-[0.99] transition"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-warm text-primary-foreground shadow-glow">
                <Camera size={28} />
              </span>
              <div className="text-center">
                <p className="font-semibold">Tap to capture bill</p>
                <p className="text-xs text-muted-foreground mt-1">or drag and drop a photo here</p>
              </div>
            </button>

            <button
              onClick={() => { setStage("scanning"); setTimeout(() => setStage("result"), 2400); }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-card border border-border py-3.5 text-sm font-medium active:scale-[0.99] transition"
            >
              <Upload size={16} /> Choose from gallery
            </button>

            <div className="rounded-2xl bg-primary/5 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">📸 Tips for best results</p>
              <ul className="space-y-1">
                <li>• Use bright, even lighting</li>
                <li>• Capture the whole Meralco/utility bill</li>
                <li>• Avoid glare and shadows</li>
              </ul>
            </div>
          </div>
        )}

        {stage === "scanning" && (
          <div className="rounded-3xl bg-card p-6 shadow-card text-center space-y-4 animate-float-up">
            <div className="relative mx-auto h-48 w-36 rounded-xl bg-muted overflow-hidden">
              <div className="absolute inset-0 skeleton opacity-60" />
              <FileText size={40} className="absolute inset-0 m-auto text-muted-foreground/40" />
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-glow animate-scan" />
            </div>
            <div>
              <p className="font-semibold">Scanning your bill…</p>
              <p className="text-xs text-muted-foreground">AI is reading kWh, total, and billing period.</p>
            </div>
          </div>
        )}

        {stage === "result" && (
          <div className="space-y-4 animate-float-up">
            <div className="rounded-3xl bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={18} className="text-success" />
                <p className="text-sm font-semibold">Bill scanned successfully</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Field label="kWh" value="248" />
                <Field label="Total" value="₱2,872" />
                <Field label="Period" value="Oct 15" />
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-warm p-5 text-primary-foreground shadow-glow">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} /> <p className="text-xs font-semibold uppercase tracking-wide">AI Explanation</p>
              </div>
              <p className="text-sm leading-relaxed">
                Your bill increased by <span className="font-bold">18%</span> mainly due to higher appliance usage during evening hours (6–11 PM). Aircon and TV combined account for ~62% of the spike.
              </p>
            </div>

            <button
              onClick={() => setStage("upload")}
              className="w-full rounded-2xl border border-border bg-card py-3.5 text-sm font-medium active:scale-[0.99] transition"
            >
              Scan another bill
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted py-3">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="text-sm font-bold mt-0.5">{value}</p>
    </div>
  );
}
