import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/serverutils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const useFor = searchParams.get("use_for");

  let connection;
  try {
    connection = await getConnection();

    let query = `
      SELECT id, title_ku, title_en, title_ar, audio_url, is_active, use_for 
      FROM audios 
      WHERE is_active = true
    `;

    const params: string[] = [];
    if (
      useFor &&
      (useFor === "landing" || useFor === "intro" || useFor === "both")
    ) {
      query += ` AND (use_for = ? OR use_for = 'both')`;
      params.push(useFor);
    }

    query += ` ORDER BY id DESC LIMIT 1`;

    const [rows] =
      params.length > 0
        ? await connection.execute(query, params)
        : await connection.execute(query);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audios" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
