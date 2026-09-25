"use client";

import { Moon, Sun } from "lucide-react";
import { copy } from "@/lib/copy";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-pressed={dark}
      className="type-small inline-flex items-center gap-1.5 rounded-sm text-text-muted hover:text-text focus-ring"
    >
      {dark ? <Sun className="size-3.5" aria-hidden="true" /> : <Moon className="size-3.5" aria-hidden="true" />}
      {dark ? copy.footer.lightTheme : copy.footer.darkTheme}
    </button>
  );
}
