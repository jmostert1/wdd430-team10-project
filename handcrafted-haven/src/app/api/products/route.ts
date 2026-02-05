import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("cse430");

    const products = await db
      .collection("products")
      .find({})
      .project({ name: 1, price: 1, category: 1, quantity: 1, rating: 1, imageUrl: 1, sellerId: 1 })
      .toArray();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load products" },
      { status: 500 }
    );
  }
}
