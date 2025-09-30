"use client";

import { useState } from "react";
import VideoLoading from "@/app/ui/video-loading";
import { useTheme } from "@/app/lib/theme-context";

export default function TestThemeVideoPage() {
  const [showVideo, setShowVideo] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState<
    "blend" | "overlay" | "solid"
  >("blend");
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        transition: "all 0.3s ease",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: colors.primary }}
          >
            Video Theme Integration Test
          </h1>
          <p className="text-lg mb-6" style={{ color: colors.text }}>
            Current Theme: <span className="font-semibold">{theme}</span>
          </p>
        </div>

        {/* Theme Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: colors.primary }}
            >
              Theme Controls
            </h3>
            <button
              onClick={toggleTheme}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </button>
          </div>

          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: colors.primary }}
            >
              Background Mode
            </h3>
            <div className="space-y-2">
              {(["blend", "overlay", "solid"] as const).map((mode) => (
                <label key={mode} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value={mode}
                    checked={backgroundMode === mode}
                    onChange={(e) => setBackgroundMode(e.target.value as any)}
                    className="text-primary"
                  />
                  <span style={{ color: colors.text }} className="capitalize">
                    {mode} Mode
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Video Test Controls */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="px-8 py-4 text-lg font-medium rounded-lg transition-all duration-200 hover:opacity-80"
            style={{
              backgroundColor: showVideo ? colors.secondary : colors.tertiary,
              color: colors.background,
            }}
          >
            {showVideo ? "Hide" : "Show"} Video Loading
          </button>
        </div>

        {/* Theme Information */}
        <div
          className="p-6 rounded-lg mb-8"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: colors.primary }}
          >
            Current Theme Colors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="text-center">
                <div
                  className="w-full h-16 rounded-lg mb-2 border"
                  style={{
                    backgroundColor: value,
                    border: `1px solid ${colors.border}`,
                  }}
                />
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  {key}
                </p>
                <p
                  className="text-xs opacity-70"
                  style={{ color: colors.text }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Behavior */}
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: colors.primary }}
          >
            Expected Behavior
          </h3>
          <div className="space-y-2 text-sm" style={{ color: colors.text }}>
            <p>
              <strong>Dark Theme:</strong> Video should have light/white
              background
            </p>
            <p>
              <strong>Light Theme:</strong> Video should have dark/black
              background
            </p>
            <p>
              <strong>Page Background:</strong> Should match theme consistently
            </p>
            <p>
              <strong>Smooth Transitions:</strong> All changes should animate
              smoothly
            </p>
          </div>
        </div>
      </div>

      {/* Video Loading Overlay */}
      {showVideo && (
        <VideoLoading autoHide={false} onComplete={() => setShowVideo(false)} />
      )}
    </div>
  );
}
