import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/serverutils";

export async function GET(request: Request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const useFor = searchParams.get("use_for");

    connection = await getConnection();

    let query = "SELECT * FROM audios WHERE is_active = 1";
    const params: string[] = [];

    if (useFor) {
      query += " AND use_for = ?";
      params.push(useFor);
    }

    query += " ORDER BY id DESC";

    const [rows] = await connection.execute(query, params);

    return NextResponse.json(rows || []);
  } catch (error) {
    console.error("Failed to fetch audios:", error);
    // Return empty array instead of 500
    return NextResponse.json([]);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.warn("Error closing connection:", closeError);
      }
    }
  }
}
