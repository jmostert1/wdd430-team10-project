import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: "sellerId is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cse430");

    const products = await db
      .collection("products")
      .find({ sellerId: new ObjectId(sellerId) })
      .project({ name: 1, price: 1, category: 1, quantity: 1, rating: 1, imageUrl: 1, sellerId: 1 })
      .toArray();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("by-seller error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load seller products" },
      { status: 500 }
    );
  }
}
