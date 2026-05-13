import appIcon from "../../assets/app.png";

export function Logo({ size = 88, glow = true }: { size?: number; glow?: boolean }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {glow && (
        <span
          className="absolute inset-0 rounded-full bg-primary-soft/60 blur-2xl animate-firefly"
          aria-hidden
        />
      )}
      <img src={appIcon} alt="AlitapWatt" className="relative h-full w-full object-contain rounded-2xl" />
    </div>
  );
}
