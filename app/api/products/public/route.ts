import { NextRequest, NextResponse } from "next/server";
import { fetchProducts } from "@/app/lib/data";
import { Product } from "@/app/lib/definitions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = searchParams.get("limit");

    let products: Product[] = await fetchProducts();

    // Apply search filter if provided
    if (search) {
      products = products.filter(
        (product) =>
          product.title_en.toLowerCase().includes(search.toLowerCase()) ||
          product.title_ar.toLowerCase().includes(search.toLowerCase()) ||
          product.title_ku.toLowerCase().includes(search.toLowerCase()) ||
          product.description_en.toLowerCase().includes(search.toLowerCase()) ||
          product.description_ar.toLowerCase().includes(search.toLowerCase()) ||
          product.description_ku.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply limit if specified
    const result = limit ? products.slice(0, parseInt(limit)) : products;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch public products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
