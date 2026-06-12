"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type BootState = {
  booted: boolean;
  setBooted: (v: boolean) => void;
};

const BootContext = createContext<BootState>({ booted: false, setBooted: () => {} });

export function BootProvider({ children }: { children: ReactNode }) {
  const [booted, setBooted] = useState(false);
  return <BootContext.Provider value={{ booted, setBooted }}>{children}</BootContext.Provider>;
}

export function useBoot() {
  return useContext(BootContext);
}
