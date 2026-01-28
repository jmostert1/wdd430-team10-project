import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seller = searchParams.get("seller"); // seller NAME (string) Should chnge to ID later

    if (!seller) {
      return NextResponse.json(
        { success: false, error: "seller is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cse430");

    const products = await db
      .collection("products")
      .find({ seller }) // matches "Mira Halden"
      .project({ name: 1, price: 1, category: 1, quantity: 1, seller: 1 })
      .toArray();

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("by-seller error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load seller products" },
      { status: 500 }
    );
  }
}
