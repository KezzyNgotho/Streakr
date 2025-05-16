"use client";
import { createContext, useContext, useState, type ReactNode, useEffect } from "react";

interface AvatarContextType {
  avatar: string;
  setAvatar: (a: string) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [avatar, setAvatarState] = useState<string>("🦸‍♂️");

  useEffect(() => {
    const stored = localStorage.getItem("streakrs_avatar");
    if (stored) setAvatarState(stored);
  }, []);

  const setAvatar = (a: string) => {
    setAvatarState(a);
    localStorage.setItem("streakrs_avatar", a);
  };

  return (
    <AvatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("useAvatar must be used within AvatarProvider");
  return ctx;
} 