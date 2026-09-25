"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { Role } from "@/lib/data/types";

const STORAGE_KEY = "bap-role";
const ROLES: Role[] = ["university", "lab", "pharma", "investor"];

type RoleContextValue = { role: Role; setRole: (role: Role) => void };

const RoleContext = createContext<RoleContextValue | null>(null);

/** The role the visitor is viewing the demo as (RoleSwitcher). Persisted locally. */
export function RoleProvider({ children }: PropsWithChildren) {
  const [role, setRoleState] = useState<Role>("investor");

  // Restore after hydration so server and first client render match.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Role | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from localStorage
      if (stored && ROLES.includes(stored)) setRoleState(stored);
    } catch {
      /* storage blocked */
    }
  }, []);

  const setRole = useCallback((next: Role) => {
    setRoleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked */
    }
  }, []);

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}

export { ROLES };
