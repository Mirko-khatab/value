import { NextRequest, NextResponse } from "next/server";
import { fetchProducts } from "@/app/lib/data";
import { getConnection } from "@/app/lib/serverutils";
import { Product, ParentType } from "@/app/lib/definitions";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";

async function fetchProductsByGroup(groupId: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT 
        p.*,
        (SELECT image_url FROM galleries WHERE parent_id = p.id AND parent_type = '${ParentType.Product}' ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = p.id AND parent_type = '${ParentType.Product}' ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = p.id AND parent_type = '${ParentType.Product}' ORDER BY order_index ASC LIMIT 1) as gallery_order_index
      FROM products p
      WHERE p.product_group_id = ?
      ORDER BY p.title_en
    `,
      [groupId]
    );
    return rows as Product[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products by group.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    let products;
    if (groupId) {
      products = await fetchProductsByGroup(groupId);
    } else {
      products = await fetchProducts();
    }

    const response = NextResponse.json(products);

    // Add caching headers for better performance
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
