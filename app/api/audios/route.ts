import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/serverutils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const useFor = searchParams.get("use_for");

    const connection = await getConnection();

    let query = "SELECT * FROM audios";
    const params: string[] = [];

    if (useFor) {
      query += " WHERE use_for = ?";
      params.push(useFor);
    }

    query += " ORDER BY id DESC";

    const [rows] = await connection.execute(query, params);
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch audios:", error);
    return NextResponse.json(
      { error: "Failed to fetch audios" },
      { status: 500 }
    );
  }
}
