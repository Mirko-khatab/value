import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/serverutils";

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT sc.id, sc.category_id, sc.title_ku, sc.title_en, sc.title_ar,
              pc.title_en as category_name_en,
              pc.title_ku as category_name_ku,
              pc.title_ar as category_name_ar
       FROM sub_categorys sc
       LEFT JOIN project_categories pc ON sc.category_id = pc.id
       ORDER BY sc.id DESC`
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

