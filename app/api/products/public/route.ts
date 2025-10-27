import { NextResponse } from "next/server";
import { fetchProducts } from "@/app/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

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
