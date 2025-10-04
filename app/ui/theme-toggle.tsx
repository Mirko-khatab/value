"use client";

import { useTheme } from "@/app/lib/theme-context";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        <div className="w-5 h-5 bg-gray-600 border-2 border-gray-300  rounded-full" />
      </button>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        <div className="w-5 h-5 bg-white border-2 border-gray-300  rounded-full" />
      </button>
    </div>
  );
}
