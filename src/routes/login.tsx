import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { Logo } from "@/components/Logo";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [tab, setTab] = useState<"email" | "phone">("email");
  return (
    <MobileFrame>
      <div className="flex min-h-screen lg:min-h-full flex-col px-6 py-10">
        <div className="flex flex-col items-center gap-3 mb-8">
          <Logo size={64} />
          <h1 className="text-2xl font-bold">Welcome to AlitapWatt</h1>
          <p className="text-sm text-muted-foreground text-center">Sign in to start saving on your kuryente.</p>
        </div>

        <div className="flex rounded-full bg-muted p-1 mb-6">
          <button
            onClick={() => setTab("email")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition ${
              tab === "email" ? "bg-card shadow-card text-primary" : "text-muted-foreground"
            }`}
          >
            <Mail size={16} /> Email
          </button>
          <button
            onClick={() => setTab("phone")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition ${
              tab === "phone" ? "bg-card shadow-card text-primary" : "text-muted-foreground"
            }`}
          >
            <Phone size={16} /> Mobile
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              {tab === "email" ? "Email address" : "Mobile number"}
            </label>
            <input
              type={tab === "email" ? "email" : "tel"}
              placeholder={tab === "email" ? "juan@email.com" : "+63 9XX XXX XXXX"}
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>

          <Link
            to="/onboarding"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-warm px-6 py-4 font-semibold text-primary-foreground shadow-glow active:scale-[0.98] transition"
          >
            Sign In <ArrowRight size={18} />
          </Link>

          <div className="flex items-center gap-3 my-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Link
            to="/onboarding"
            className="flex w-full items-center justify-center rounded-2xl border-2 border-primary/30 bg-card px-6 py-3.5 text-sm font-semibold text-primary active:scale-[0.98] transition"
          >
            Continue as Guest
          </Link>

          <p className="text-center text-xs text-muted-foreground pt-2">
            New here? <span className="text-primary font-semibold">Create an account</span>
          </p>
        </div>
      </div>
    </MobileFrame>
  );
}
