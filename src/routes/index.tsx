import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { Logo } from "@/components/Logo";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Splash,
  head: () => ({
    meta: [
      { title: "AlitapWatt — A small light for your home's energy" },
      { name: "description", content: "AI-powered energy assistant helping Filipino households see, understand, and reduce electricity use." },
    ],
  }),
});

function Splash() {
  return (
    <MobileFrame>
      <div className="relative flex min-h-screen lg:min-h-full flex-col items-center justify-between px-8 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />

        {/* Floating fireflies */}
        <span className="absolute top-24 left-10 h-2 w-2 rounded-full bg-primary-soft animate-firefly" />
        <span className="absolute top-44 right-12 h-1.5 w-1.5 rounded-full bg-primary animate-firefly" style={{ animationDelay: "0.6s" }} />
        <span className="absolute bottom-48 left-16 h-2 w-2 rounded-full bg-primary-soft animate-firefly" style={{ animationDelay: "1.2s" }} />

        <div className="relative flex-1 flex flex-col items-center justify-center gap-6">
          <Logo size={120} />
          <div className="space-y-2 animate-float-up">
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="bg-gradient-warm bg-clip-text text-transparent">AlitapWatt</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              A small light that helps Filipino homes see, understand, and control their energy use.
            </p>
          </div>
        </div>

        <div className="relative w-full space-y-3 animate-float-up" style={{ animationDelay: "0.2s" }}>
          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-warm px-6 py-4 text-base font-semibold text-primary-foreground shadow-glow active:scale-[0.98] transition"
          >
            Get Started <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-muted-foreground">Powered by AI · Made for Pinoy households</p>
        </div>
      </div>
    </MobileFrame>
  );
}
