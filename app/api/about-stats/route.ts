import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/serverutils";

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    
    // Fetch all about-related properties
    const [allProperties] = await connection.execute(
      "SELECT * FROM properties WHERE `key` LIKE 'about_%' ORDER BY `key` ASC"
    );
    
    // Transform the data: pair values with their labels
    const propertiesArray = allProperties as any[];
    const statsMap = new Map();
    
    // First pass: collect all base keys (without _label)
    propertiesArray.forEach((prop) => {
      const key = prop.key;
      if (!key.endsWith('_label')) {
        // This is a value entry
        statsMap.set(key, {
          id: prop.id,
          key: key,
          stat_value: prop.value_en || prop.value_ar || prop.value_ku || '',
        });
      }
    });
    
    // Second pass: add labels
    propertiesArray.forEach((prop) => {
      const key = prop.key;
      if (key.endsWith('_label')) {
        // This is a label entry - find its corresponding value entry
        const baseKey = key.replace('_label', '');
        const stat = statsMap.get(baseKey);
        if (stat) {
          stat.label_en = prop.value_en;
          stat.label_ar = prop.value_ar;
          stat.label_ku = prop.value_ku;
        }
      }
    });
    
    // Convert map to array and return only complete stats (with labels)
    const stats = Array.from(statsMap.values()).filter(
      stat => stat.label_en || stat.label_ar || stat.label_ku
    );
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch about stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch about stats" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
