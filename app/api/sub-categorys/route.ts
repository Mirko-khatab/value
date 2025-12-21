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
    return NextResponse.json(rows || []);
  } catch (error) {
    console.error("Database Error in sub-categorys API:", error);
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

