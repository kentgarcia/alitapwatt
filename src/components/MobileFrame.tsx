import { ReactNode } from "react";

/**
 * On mobile/tablet: fills viewport responsively.
 * On desktop: centers a fixed phone-sized viewport with soft glow background.
 */
export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background lg:bg-gradient-to-br lg:from-orange-50 lg:via-amber-50 lg:to-orange-100">
      {/* Desktop ambient glow */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary-soft/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full lg:flex lg:min-h-screen lg:items-center lg:justify-center lg:py-8">
        <div className="relative w-full lg:w-[420px] lg:h-[860px] lg:max-h-[92vh] lg:rounded-[2.75rem] lg:border-[10px] lg:border-neutral-900 lg:bg-background lg:shadow-2xl lg:overflow-hidden">
          {/* Notch on desktop */}
          <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 z-50 h-6 w-32 rounded-b-2xl bg-neutral-900" />
          <div className="h-screen lg:h-full overflow-y-auto overflow-x-hidden no-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
