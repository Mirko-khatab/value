import { NextRequest, NextResponse } from "next/server";
import { fetchMachines } from "@/app/lib/data";
import { getConnection } from "@/app/lib/serverutils";
import { Machine, ParentType } from "@/app/lib/definitions";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";

async function fetchMachinesByGroup(groupId: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT 
        m.*,
        (SELECT image_url FROM galleries WHERE parent_id = m.id AND parent_type = '${ParentType.Machine}' ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = m.id AND parent_type = '${ParentType.Machine}' ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = m.id AND parent_type = '${ParentType.Machine}' ORDER BY order_index ASC LIMIT 1) as gallery_order_index
      FROM machines m
      WHERE m.machine_group_id = ?
      ORDER BY m.title_en
    `,
      [groupId]
    );
    return rows as Machine[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch machines by group.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    let machines;
    if (groupId) {
      machines = await fetchMachinesByGroup(groupId);
    } else {
      machines = await fetchMachines();
    }

    const response = NextResponse.json(machines);

    // Add caching headers for better performance
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("Error fetching machines:", error);
    return NextResponse.json(
      { error: "Failed to fetch machines" },
      { status: 500 }
    );
  }
}
