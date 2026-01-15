import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

/**
 * Check if a theme should be active based on:
 * 1. Manual enable/disable in dashboard
 * 2. Automatic date-based enable (e.g., Christmas: Dec 27 - Jan 1)
 */
function isThemeActive(settings: any): boolean {
  // If auto_enable is false, use manual is_enabled setting
  if (!settings.auto_enable) {
    return settings.is_enabled;
  }

  // If auto_enable is true, check date range
  if (settings.start_date && settings.end_date) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentDay = now.getDate(); // 1-31

    // Parse start and end dates (format: "MM-DD")
    const [startMonth, startDay] = settings.start_date.split('-').map(Number);
    const [endMonth, endDay] = settings.end_date.split('-').map(Number);

    // Check if current date is within range
    // Handle year-crossing (e.g., Dec 27 - Jan 1)
    if (startMonth > endMonth) {
      // Year-crossing range (e.g., 12-27 to 01-01)
      const inFirstPart = 
        currentMonth > startMonth || 
        (currentMonth === startMonth && currentDay >= startDay);
      const inSecondPart = 
        currentMonth < endMonth || 
        (currentMonth === endMonth && currentDay <= endDay);
      
      return inFirstPart || inSecondPart;
    } else {
      // Same year range
      const afterStart = 
        currentMonth > startMonth || 
        (currentMonth === startMonth && currentDay >= startDay);
      const beforeEnd = 
        currentMonth < endMonth || 
        (currentMonth === endMonth && currentDay <= endDay);
      
      return afterStart && beforeEnd;
    }
  }

  // If no date range, fall back to manual setting
  return settings.is_enabled;
}

export async function GET() {
  try {
    const result = await query(
      "SELECT * FROM theme_settings WHERE theme_name = ?",
      ["christmas"]
    );

    if (!result || result.length === 0) {
      // No settings found - default to disabled
      return NextResponse.json({
        enabled: false,
        theme: "christmas",
        reason: "No settings found",
      });
    }

    const settings = result[0];
    const enabled = isThemeActive(settings);

    return NextResponse.json({
      enabled,
      theme: "christmas",
      settings: {
        manual: settings.is_enabled,
        auto: settings.auto_enable,
        startDate: settings.start_date,
        endDate: settings.end_date,
      },
    });
  } catch (error) {
    console.error("Error fetching theme settings:", error);
    return NextResponse.json(
      {
        enabled: false,
        error: "Failed to fetch theme settings",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { enabled } = await request.json();

    await query(
      "UPDATE theme_settings SET is_enabled = ? WHERE theme_name = ?",
      [enabled ? 1 : 0, "christmas"]
    );

    return NextResponse.json({
      success: true,
      enabled,
    });
  } catch (error) {
    console.error("Error updating theme settings:", error);
    return NextResponse.json(
      {
        error: "Failed to update theme settings",
      },
      { status: 500 }
    );
  }
}
