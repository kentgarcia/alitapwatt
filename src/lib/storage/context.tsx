import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "./hooks";
import { STORAGE_KEY, SEED_ENERGY, EMPTY_ENERGY } from "./seed";
import type { AppData, TrackedAppliance } from "./schema";

const DATA_VERSION = 1;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

const defaultData: AppData = {
  energy: EMPTY_ENERGY,
  trackedAppliances: [],
  onboardingComplete: false,
  hasSeeded: false,
  version: DATA_VERSION,
};

interface EnergyDataContextType {
  data: AppData;
  updateEnergy: (updater: (prev: AppData["energy"]) => AppData["energy"]) => void;
  setTrackedAppliances: (value: TrackedAppliance[] | ((prev: TrackedAppliance[]) => TrackedAppliance[])) => void;
  completeOnboarding: (seed: boolean) => void;
  resetData: () => void;
}

const EnergyDataContext = createContext<EnergyDataContextType | null>(null);

export function EnergyDataProvider({ children }: { children: ReactNode }) {
  // SSR safety: return a no-op provider on the server
  if (!isBrowser()) {
    return <>{children}</>;
  }

  const [rawData, setData] = useLocalStorage<AppData>(STORAGE_KEY, defaultData);

  // schema version mismatch → reset
  const data = rawData.version === DATA_VERSION ? rawData : defaultData;
  if (rawData.version !== DATA_VERSION && isBrowser()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  }

  const updateEnergy = (updater: (prev: AppData["energy"]) => AppData["energy"]) => {
    setData(prev => ({ ...prev, energy: updater(prev.energy) }));
  };

  const setTrackedAppliances = (value: TrackedAppliance[] | ((prev: TrackedAppliance[]) => TrackedAppliance[])) => {
    setData(prev => ({
      ...prev,
      trackedAppliances: value instanceof Function ? value(prev.trackedAppliances) : value,
    }));
  };

  const completeOnboarding = (seed: boolean) => {
    setData(prev => ({
      ...prev,
      energy: seed ? SEED_ENERGY : EMPTY_ENERGY,
      onboardingComplete: true,
      hasSeeded: seed,
    }));
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <EnergyDataContext.Provider value={{ data, updateEnergy, setTrackedAppliances, completeOnboarding, resetData }}>
      {children}
    </EnergyDataContext.Provider>
  );
}

export function useEnergyData(): EnergyDataContextType {
  const ctx = useContext(EnergyDataContext);
  if (!ctx) throw new Error("useEnergyData must be used within EnergyDataProvider");
  return ctx;
}
