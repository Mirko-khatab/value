import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/serverutils";

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const [properties] = await connection.execute(
      `SELECT * FROM properties ORDER BY id DESC`
    );
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}

