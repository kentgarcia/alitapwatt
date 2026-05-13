import { useState, useCallback, useEffect } from "react";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item) as T);
    } catch {}
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue(prev => {
        const next = value instanceof Function ? value(prev) : value;
        if (isBrowser()) {
          try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
        }
        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
