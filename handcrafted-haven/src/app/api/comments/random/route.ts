import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId || !ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: "Valid productId is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cse430");

    const result = await db
      .collection("comments")
      .aggregate([
        { $match: { productId: new ObjectId(productId) } },
        { $sample: { size: 1 } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            rating: 1,
            text: 1,
            createdAt: 1,
            "user.name": 1,
            "user.avatar": 1,
          },
        },
      ])
      .toArray();

    if (result.length === 0) {
      return NextResponse.json({ success: true, comment: null });
    }

    return NextResponse.json({ success: true, comment: result[0] });
  } catch (error) {
    console.error("comments/random error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load comment" },
      { status: 500 }
    );
  }
}
