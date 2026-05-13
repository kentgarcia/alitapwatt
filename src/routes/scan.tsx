import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Sparkles, FileText, Check, Loader2, Lightbulb, Zap, DollarSign, Radio, Receipt, HelpCircle, X, Calendar, Clock, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/storage/hooks";
import bill1 from "../../assets/bills/1.png";
import bill2 from "../../assets/bills/2.png";
import bill3 from "../../assets/bills/3.png";

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

type SavedBill = {
  month: string; year: number; amount: number; kwh: number; dueDate: string; generation: number; savedAt: string;
  breakdowns: { name: string; amount: string; pct: number; desc: string }[];
  aiExplanation: string[];
};

function Scan() {
  const [stage, setStage] = useState<"upload" | "scanning" | "result">("upload");
  const [step, setStep] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  const [captured, setCaptured] = useState(false);
  const [tab, setTab] = useState<"scan" | "history">("scan");
  const [savedBills, setSavedBills] = useLocalStorage<SavedBill[]>("alitapwatt_bill_history", []);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [saveMonth, setSaveMonth] = useState(new Date().getMonth());
  const [saveYear, setSaveYear] = useState(new Date().getFullYear());
  const [selectedHistoryBill, setSelectedHistoryBill] = useState<SavedBill | null>(null);
  const sampleBills = [
    { src: bill1, label: "Bill #1" },
    { src: bill2, label: "Bill #2" },
    { src: bill3, label: "Bill #3" },
  ];

  useEffect(() => {
    if (stage !== "scanning") return;
    if (step >= steps.length) { setStage("result"); setShowSavePrompt(true); return; }
    const t = setTimeout(() => setStep(s => s + 1), step === 0 ? 1800 : 1200);
    return () => clearTimeout(t);
  }, [stage, step]);

  const startScan = () => { setStage("scanning"); setStep(0); setShowSavePrompt(false); };
  const reset = () => { setStage("upload"); setCaptured(false); setSelectedBill(null); setShowSavePrompt(false); };
  const pickCameraBill = () => {
    const randomBill = sampleBills[Math.floor(Math.random() * sampleBills.length)];
    setSelectedBill(randomBill.label);
    setCaptured(true);
    setTimeout(() => { setCameraOpen(false); startScan(); }, 600);
  };

  const saveBill = () => {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const newBill: SavedBill = {
      month: months[saveMonth],
      year: saveYear,
      amount: 2872,
      kwh: 215,
      dueDate: "Nov 15",
      generation: 1206,
      savedAt: new Date().toISOString(),
      breakdowns: breakdowns.map(b => ({ name: b.name, amount: b.amount, pct: b.pct, desc: b.desc })),
      aiExplanation: [
        "Your bill increased because your air conditioning usage was significantly higher during hotter days this month.",
        "Generation charges accounted for 42% of your total bill.",
        "Your household consumed 215 kWh, which is above your normal monthly average.",
      ],
    };
    setSavedBills(prev => {
      const existing = prev.filter(b => b.month !== newBill.month || b.year !== newBill.year);
      return [newBill, ...existing];
    });
    setShowSavePrompt(false);
  };

  return (
    <AppShell>
      <div className="px-4 pt-6 pb-6 space-y-4">
        {/* header */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold">Scan Your Bill</h1>
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary">{savedBills.length} saved</span>
        </div>
        <p className="text-sm text-muted-foreground -mt-2">Snap a photo and let AI break it down for you.</p>

        {/* tabs */}
        <div className="flex rounded-xl bg-muted p-1">
          <button onClick={() => setTab("scan")} className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${tab === "scan" ? "bg-card shadow-card text-foreground" : "text-muted-foreground"}`}><Camera size={14} className="inline mr-1" /> Scan</button>
          <button onClick={() => setTab("history")} className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${tab === "history" ? "bg-card shadow-card text-foreground" : "text-muted-foreground"}`}><Clock size={14} className="inline mr-1" /> Bill History</button>
        </div>

        {/* ===== HISTORY TAB ===== */}
        {tab === "history" && (
          <div className="space-y-3 animate-float-up">
            {selectedHistoryBill ? (
              <div>
                <button onClick={() => setSelectedHistoryBill(null)} className="text-xs text-primary font-semibold mb-3 flex items-center gap-1">
                  ← Back to history
                </button>
                <div className="rounded-2xl bg-card p-5 shadow-card space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-primary" />
                    <p className="text-base font-bold">{selectedHistoryBill.month} {selectedHistoryBill.year}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-primary to-primary-dark p-3 text-primary-foreground">
                      <p className="text-[9px] opacity-80 uppercase tracking-wide">Total Amount</p>
                      <p className="text-xl font-bold mt-0.5">₱{selectedHistoryBill.amount.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-muted p-3">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wide">kWh Used</p>
                      <p className="text-xl font-bold mt-0.5">{selectedHistoryBill.kwh}</p>
                    </div>
                    <div className="rounded-xl bg-muted p-3">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Due Date</p>
                      <p className="text-base font-bold mt-0.5">{selectedHistoryBill.dueDate}</p>
                    </div>
                    <div className="rounded-xl bg-muted p-3">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Generation</p>
                      <p className="text-base font-bold mt-0.5">₱{selectedHistoryBill.generation.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-muted-foreground">Saved on {new Date(selectedHistoryBill.savedAt).toLocaleDateString()}</p>
                </div>

                {/* AI Bill Explanation */}
                <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-5 shadow-glow">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-white/80" />
                    <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wide">AI Bill Explanation</p>
                  </div>
                  <div className="space-y-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
                    {selectedHistoryBill.aiExplanation.map((line, i) => (
                      <p key={i} className={`text-xs leading-relaxed ${i === 0 ? "text-white" : "text-white/70"}`}>{line}</p>
                    ))}
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Bill Breakdown</h3>
                  <div className="space-y-2">
                    {selectedHistoryBill.breakdowns.map((b, i) => (
                      <div key={i} className="rounded-2xl bg-card p-3.5 shadow-card flex items-center gap-3">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          i === 0 ? "bg-gradient-warm text-primary-foreground shadow-glow" : "bg-primary/10 text-primary"
                        }`}>
                          <Zap size={16} className={i === 0 ? "" : "text-primary"} />
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
                    ))}
                  </div>
                </div>
              </div>
            ) : savedBills.length === 0 ? (
              <div className="rounded-2xl bg-muted p-8 text-center">
                <FileText size={32} className="mx-auto text-muted-foreground/40" />
                <p className="text-sm font-semibold mt-2">No bills saved yet</p>
                <p className="text-xs text-muted-foreground mt-1">Scan your first bill to start tracking.</p>
              </div>
            ) : (
              savedBills.map((b, i) => (
                <button key={i} onClick={() => setSelectedHistoryBill(b)} className="w-full rounded-2xl bg-card p-4 shadow-card flex items-center gap-3 text-left active:scale-[0.99] transition">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground shadow-glow">
                    <Calendar size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{b.month} {b.year}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                      <span>₱{b.amount.toLocaleString()}</span>
                      <span>{b.kwh} kWh</span>
                      <span>Due {b.dueDate}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </button>
              ))
            )}
          </div>
        )}

        {/* ===== SCAN CONTENT ===== */}
        {tab === "scan" && (<>

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
                  <p className="text-xs text-muted-foreground mt-1">Position your bill within the frame</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="default" size="lg" className="py-4 text-sm" onClick={() => setCameraOpen(true)}>
                <Camera size={16} /> Take Photo
              </Button>
              <Button variant="outline" size="lg" className="py-4 text-sm" onClick={() => setGalleryOpen(true)}>
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

        {/* ===== GALLERY PICKER ===== */}
        {galleryOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-float-up" onClick={() => setGalleryOpen(false)}>
            <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-card p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold">Select a sample bill</p>
                <button onClick={() => setGalleryOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {sampleBills.map((b, i) => (
                  <button key={i} onClick={() => { setSelectedBill(b.label); setGalleryOpen(false); startScan(); }}
                    className={`rounded-xl overflow-hidden border-2 transition ${
                      selectedBill === b.label ? "border-primary" : "border-border"
                    } active:scale-[0.97]`}
                  >
                    <img src={b.src} alt={b.label} className="h-28 w-full object-cover" />
                    <p className="text-[9px] font-medium text-center py-1.5 bg-muted">{b.label}</p>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-3">Tap a bill to start scanning</p>
            </div>
          </div>
        )}

        {/* ===== CAMERA VIEWFINDER ===== */}
        {cameraOpen && (
          <div className="fixed inset-0 z-50 bg-black animate-float-up" onClick={() => setCameraOpen(false)}>
            <div className="relative h-full flex flex-col" onClick={e => e.stopPropagation()}>
              {/* top bar */}
              <div className="flex items-center justify-between px-5 pt-12 pb-4">
                <button onClick={() => setCameraOpen(false)} className="text-white/70 text-sm">Cancel</button>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-white/50 text-xs">Live</span>
                </div>
              </div>

              {/* viewfinder */}
              <div className="flex-1 flex items-center justify-center px-6">
                <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <img src={sampleBills[0].src} alt="" className={`w-full h-72 object-cover transition-all ${captured ? "scale-105 brightness-90" : ""}`} />
                  {/* corner guides */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-3 left-3 h-6 w-6 border-t-2 border-l-2 border-white/60 rounded-tl" />
                    <div className="absolute top-3 right-3 h-6 w-6 border-t-2 border-r-2 border-white/60 rounded-tr" />
                    <div className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-white/60 rounded-bl" />
                    <div className="absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-white/60 rounded-br" />
                  </div>
                  {/* scanning hint */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-1.5">
                    <p className="text-white/80 text-[10px] font-medium">Position bill within frame</p>
                  </div>
                </div>
              </div>

              {/* capture button */}
              <div className="flex items-center justify-center pb-12 pt-4">
                <button onClick={pickCameraBill}
                  className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 active:scale-90 transition">
                  <span className="h-12 w-12 rounded-full bg-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== SCANNING STAGE ===== */}
        {stage === "scanning" && (
          <div className="rounded-3xl bg-card p-6 shadow-card animate-float-up">
            <div className="relative mx-auto h-40 w-32 rounded-xl bg-muted overflow-hidden mb-4">
              {selectedBill && (
                <img src={sampleBills.find(b => b.label === selectedBill)?.src} alt="" className="h-full w-full object-cover opacity-40" />
              )}
              {!selectedBill && <FileText size={32} className="absolute inset-0 m-auto text-muted-foreground/30" />}
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

            {/* ===== SAVE BILL SECTION ===== */}
            {showSavePrompt && (
              <div className="rounded-2xl bg-card p-4 shadow-card border border-primary/10">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-primary" />
                  <p className="text-xs font-semibold">Save this bill for tracking</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="text-[9px] text-muted-foreground font-medium">Month</label>
                    <select value={saveMonth} onChange={e => setSaveMonth(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg bg-muted px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20">
                      {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
                        <option key={i} value={i}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-muted-foreground font-medium">Year</label>
                    <input type="number" value={saveYear} onChange={e => setSaveYear(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg bg-muted px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="default" size="sm" className="py-2.5 text-xs" onClick={saveBill}>
                    <Check size={14} /> Save Bill
                  </Button>
                  <Button variant="outline" size="sm" className="py-2.5 text-xs" onClick={reset}>
                    Discard
                  </Button>
                </div>
              </div>
            )}

            <Button variant="outline" size="lg" className="w-full py-4 text-sm" onClick={reset}>
              Scan Another Bill
            </Button>
          </div>
        )}</>
        )}
      </div>
    </AppShell>
  );
}
