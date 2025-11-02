import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/serverutils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  let connection;
  try {
    const { categoryId } = await params;
    
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT id, category_id, title_ku, title_en, title_ar
       FROM sub_categorys
       WHERE category_id = ?
       ORDER BY title_en ASC`,
      [categoryId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sub categories" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}

