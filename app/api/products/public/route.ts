import { NextResponse } from "next/server";
import { fetchProducts, fetchProductsPaginated } from "@/app/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    // If page is provided, use paginated fetch
    if (page) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit || "12");
      const result = await fetchProductsPaginated(pageNum, limitNum);
      return NextResponse.json(result);
    }

    // Legacy support - return all products
    const products = await fetchProducts();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      return NextResponse.json(limitedProducts);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
