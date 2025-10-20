import { NextResponse } from "next/server";
import { fetchAboutStats } from "@/app/lib/data";
import { getConnection } from "@/app/lib/serverutils";

export async function GET() {
  try {
    const stats = await fetchAboutStats();

    // Transform the properties data to include labels
    const statsWithLabels = await Promise.all(
      stats.map(async (stat) => {
        // Get the label for this stat
        const labelKey = `${stat.key}_label`;
        const connection = await getConnection();

        try {
          const [labelRows] = await connection.execute(
            "SELECT * FROM properties WHERE `key` = ?",
            [labelKey]
          );
          const label = (labelRows as any[])[0];

          return {
            id: stat.id,
            key: stat.key,
            stat_value: stat.value_en, // Use the value as stat_value
            label_ku: label?.value_ku || stat.key,
            label_ar: label?.value_ar || stat.key,
            label_en: label?.value_en || stat.key,
          };
        } finally {
          await connection.end();
        }
      })
    );

    return NextResponse.json(statsWithLabels);
  } catch (error) {
    console.error("Error fetching about stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch about stats" },
      { status: 500 }
    );
  }
}
