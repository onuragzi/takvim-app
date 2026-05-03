"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <button
      onClick={() => setTheme(next)}
      className="w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      aria-label="Tema değiştir"
    >
      <Icon className="w-4 h-4" style={{ color: "var(--text3)" }} />
    </button>
  );
}
