import { NextRequest, NextResponse } from "next/server";
import { fetchProductById } from "@/app/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = await fetchProductById(id);
    if (!products || products.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    // Return as array to match frontend expectations
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
