"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion as useSystemReducedMotion } from "motion/react";

const STORAGE_KEY = "canvas-user-reduce-motion";

type MotionPreferenceContextValue = {
  /** True when OS prefers reduced motion or the user enabled the site toggle. */
  reducedMotion: boolean;
  /** User explicitly chose extra reduction (stored in localStorage). */
  userBoostActive: boolean;
  /** Flip the user toggle (persists). OS preference always wins if it requests reduce. */
  toggleUserBoost: () => void;
};

const MotionPreferenceContext = createContext<MotionPreferenceContextValue | null>(
  null,
);

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const systemPrefers = useSystemReducedMotion();
  const systemReduced = Boolean(systemPrefers);

  const [userBoost, setUserBoost] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setUserBoost(raw === "1");
    } catch {
      /* private mode / SSR */
    }
  }, []);

  const reducedMotion = systemReduced || userBoost;

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = reducedMotion ? "true" : "false";
  }, [reducedMotion]);

  const toggleUserBoost = useCallback(() => {
    setUserBoost((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      reducedMotion,
      userBoostActive: userBoost,
      toggleUserBoost,
    }),
    [reducedMotion, userBoost, toggleUserBoost],
  );

  return (
    <MotionPreferenceContext.Provider value={value}>{children}</MotionPreferenceContext.Provider>
  );
}

export function useMotionPreference(): MotionPreferenceContextValue {
  const ctx = useContext(MotionPreferenceContext);
  if (!ctx) {
    throw new Error("useMotionPreference must be used inside MotionPreferenceProvider");
  }
  return ctx;
}

/**
 * Use instead of `useReducedMotion()` from Motion so the edge toggle is honoured.
 * Outside a provider (e.g. tests), falls back to the OS setting only.
 */
export function useEffectiveReducedMotion(): boolean {
  const ctx = useContext(MotionPreferenceContext);
  const systemReduced = Boolean(useSystemReducedMotion());
  return ctx?.reducedMotion ?? systemReduced;
}
