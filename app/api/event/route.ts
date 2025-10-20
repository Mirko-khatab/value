import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/app/lib/serverutils";
import { ParentType } from "@/app/lib/definitions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const connection = await getConnection();

    let query = `
      SELECT 
        e.id,
        e.title_ku,
        e.title_ar,
        e.title_en,
        e.description_ku,
        e.description_ar,
        e.description_en,
        e.created_at,
        (SELECT image_url FROM galleries WHERE parent_id = e.id AND parent_type = '${ParentType.Blog}' ORDER BY CAST(order_index AS UNSIGNED) ASC LIMIT 1) as gallery_image_url
      FROM event e
      ORDER BY e.created_at DESC
    `;

    if (limit) {
      query += ` LIMIT ${parseInt(limit)}`;
    }

    const [rows] = await connection.execute(query);
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
