import { Link, useLocation } from "@tanstack/react-router";
import { Home, ScanLine, Lightbulb, Bell, User } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/scan", label: "Scan", icon: ScanLine },
  { to: "/insights", label: "Tips", icon: Lightbulb },
  { to: "/forecast", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md pb-safe">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className="flex flex-col items-center gap-1 py-3 text-xs transition-colors"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                    active
                      ? "bg-gradient-warm text-primary-foreground shadow-glow"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span className={active ? "text-primary font-semibold" : "text-muted-foreground"}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
