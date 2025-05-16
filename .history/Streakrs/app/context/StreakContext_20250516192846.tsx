"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

export interface Streak {
  id: string;
  name: string;
  frequency: "daily" | "weekly";
  count: number;
  completed: boolean;
  minted: boolean;
}

interface StreakContextType {
  streaks: Streak[];
  addStreak: (name: string, frequency: "daily" | "weekly") => void;
  completeStreak: (id: string) => void;
  resetStreak: (id: string) => void;
  mintStreak: (id: string) => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export function StreakProvider({ children }: { children: ReactNode }) {
  const [streaks, setStreaks] = useState<Streak[]>([]);

  function addStreak(name: string, frequency: "daily" | "weekly") {
    setStreaks((prev) => [
      ...prev,
      { id: Date.now().toString(), name, frequency, count: 0, completed: false, minted: false },
    ]);
  }
  function completeStreak(id: string) {
    setStreaks((prev) => prev.map(s => {
      if (s.id === id) {
        const newCount = s.count + 1;
        return {
          ...s,
          count: newCount,
          completed: newCount >= 7,
        };
      }
      return s;
    }));
  }
  function resetStreak(id: string) {
    setStreaks((prev) => prev.map(s => s.id === id ? { ...s, count: 0, completed: false } : s));
  }
  function mintStreak(id: string) {
    setStreaks((prev) => prev.map(s => s.id === id ? { ...s, minted: true } : s));
  }

  return (
    <StreakContext.Provider value={{ streaks, addStreak, completeStreak, resetStreak, mintStreak }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreaks() {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error("useStreaks must be used within StreakProvider");
  return ctx;
} 