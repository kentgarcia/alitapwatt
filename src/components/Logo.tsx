import { Zap } from "lucide-react";

export function Logo({ size = 88, glow = true }: { size?: number; glow?: boolean }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {glow && (
        <span
          className="absolute inset-0 rounded-full bg-primary-soft/60 blur-2xl animate-firefly"
          aria-hidden
        />
      )}
      <span className="relative flex h-full w-full items-center justify-center rounded-3xl bg-gradient-warm shadow-glow">
        <Zap size={size * 0.5} className="text-primary-foreground" fill="currentColor" />
      </span>
    </div>
  );
}
