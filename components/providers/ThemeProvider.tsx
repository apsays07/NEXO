"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // On mount, sync React state with stored preference or active document class
  useEffect(() => {
    let initial: Theme = "dark";
    try {
      const stored = localStorage.getItem("nexo-theme");
      if (stored === "light" || stored === "dark") {
        initial = stored;
      } else if (document.documentElement.classList.contains("dark")) {
        initial = "dark";
      }
    } catch {}

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    setMounted(true);
  }, []);

  // Apply theme changes to DOM + localStorage
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("nexo-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Global keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    let lastToggle = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        e.stopPropagation();

        // Prevent key-repeat double-toggles (300ms debounce)
        const now = Date.now();
        if (now - lastToggle < 300) return;
        lastToggle = now;

        setTheme((prev) => (prev === "light" ? "dark" : "light"));
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
