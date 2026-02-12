import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, category, quantity, imageUrl, sellerId } = body;

    // Validate required fields
    if (!name || !description || !price || !category || !sellerId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cse430");

    // Create new product
    const newProduct = {
      name,
      description,
      price: Number(price),
      category,
      quantity: Number(quantity) || 1,
      rating: 5.0,
      imageUrl: imageUrl || ["/products/default-product.png"],
      sellerId: new ObjectId(sellerId),
    };

    const result = await db.collection("products").insertOne(newProduct);

    return NextResponse.json({ 
      success: true, 
      product: { ...newProduct, _id: result.insertedId }
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
