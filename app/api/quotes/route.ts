import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/serverutils";

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT id, title_ku, title_en, title_ar, image_url FROM quotes ORDER BY id DESC"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
