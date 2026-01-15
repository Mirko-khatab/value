"use client";

import { useState, useEffect } from "react";
import { SparklesIcon, CalendarIcon } from "@heroicons/react/24/outline";

export default function ThemeSettingsPage() {
  const [isChristmasEnabled, setIsChristmasEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  async function fetchThemeSettings() {
    try {
      const response = await fetch('/api/theme-settings');
      const data = await response.json();
      setIsChristmasEnabled(data.enabled || false);
    } catch (error) {
      console.error('Failed to fetch theme settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/theme-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: !isChristmasEnabled,
        }),
      });

      if (response.ok) {
        setIsChristmasEnabled(!isChristmasEnabled);
        setMessage({
          type: 'success',
          text: `Christmas theme ${!isChristmasEnabled ? 'enabled' : 'disabled'} successfully! Refresh the page to see changes.`,
        });
        
        // Auto-refresh after 2 seconds to show theme change
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to update theme settings',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error updating theme settings',
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Theme Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Control seasonal themes and decorations on your website
        </p>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Christmas Theme Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <SparklesIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Christmas Theme
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Festive snowfall and Christmas lights decoration
              </p>

              {/* Auto-Enable Info */}
              <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <CalendarIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Automatic Schedule:</p>
                  <p>
                    Enabled: <span className="font-semibold">December 27 - January 1</span> (every year)
                  </p>
                  <p className="text-xs mt-1 text-gray-400">
                    Theme will automatically activate during this period
                  </p>
                </div>
              </div>

              {/* Current Status */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isChristmasEnabled
                      ? 'bg-green-500 animate-pulse'
                      : 'bg-gray-400'
                  }`}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {isChristmasEnabled ? 'Currently Active' : 'Currently Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggle}
            disabled={saving}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isChristmasEnabled
                ? 'bg-green-600'
                : 'bg-gray-300 dark:bg-gray-600'
            } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                isChristmasEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Theme Preview */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme Preview:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>❄️ Gentle snowfall animation</li>
            <li>🎄 Christmas lights at top of page</li>
            <li>✨ Festive colors (Red, Gold, Green)</li>
            <li>🎨 Non-intrusive (pointer-events: none)</li>
          </ul>
        </div>

        {/* Manual Override Notice */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold">💡 Note:</span> Manual toggle overrides automatic schedule. 
            Use this to enable/disable the theme anytime, regardless of the date.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          How Automatic Themes Work
        </h2>
        
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-3">
            <span className="text-xl">📅</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Automatic Schedule</p>
              <p>
                The Christmas theme automatically enables from <strong>December 27 to January 1</strong> every year.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">🎯</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Manual Control</p>
              <p>
                You can override the automatic schedule anytime using the toggle switch above.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">🔄</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Instant Changes</p>
              <p>
                Changes take effect immediately. The page will automatically refresh to show the theme.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Performance</p>
              <p>
                Theme is optimized with requestAnimationFrame and won't slow down your site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
