"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    text: string;
    background: string;
    surface: string;
    border: string;
  };
}

const defaultContext: ThemeContextType = {
  theme: "light",
  toggleTheme: () => {},
  colors: {
    primary: "#2E5A7A",
    secondary: "#7B7B85",
    tertiary: "#4FBADB",
    text: "#636464",
    background: "#FFFFFF",
    surface: "#F9FAFB",
    border: "#E5E7EB",
  },
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Update document class and save preference
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = {
    primary: theme === "dark" ? "#4FBADB" : "#2E5A7A",
    secondary: theme === "dark" ? "#9CA3AF" : "#7B7B85",
    tertiary: theme === "dark" ? "#60A5FA" : "#4FBADB",
    text: theme === "dark" ? "#F3F4F6" : "#636464",
    background: theme === "dark" ? "#FFFFFF" : "#FFFFFF",
    surface: theme === "dark" ? "#1F2937" : "#F9FAFB",
    border: theme === "dark" ? "#374151" : "#E5E7EB",
  };

  const contextValue = mounted
    ? { theme, toggleTheme, colors }
    : defaultContext;

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
