import { ReactNode } from "react";
import { MobileFrame } from "./MobileFrame";
import { BottomNav } from "./BottomNav";

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <MobileFrame>
      <div className="flex min-h-full flex-col">
        <main className="flex-1">{children}</main>
        {!hideNav && <BottomNav />}
      </div>
    </MobileFrame>
  );
}
