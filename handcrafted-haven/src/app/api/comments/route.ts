import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(req: Request) {
  try {
    // 1) Get token
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Parse body (NO userId from client)
    const body = await req.json();
    const { productId, rating, text } = body as {
      productId?: string;
      rating?: number;
      text?: string;
    };

    // 3) Validate
    if (!productId || !ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const safeRating = Number(rating);
    if (!safeRating || safeRating < 1 || safeRating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const safeText = (text || "").trim();
    if (safeText.length < 5) {
      return NextResponse.json({ error: "Comment is too short" }, { status: 400 });
    }

    // 4) Verify token and get userId directly
    let userId: string;
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: any };
      if (!payload?.userId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      // Convert to string - handle both string and ObjectId formats
      userId = String(payload.userId);
    } catch (err) {
      console.error("JWT verification error:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 5) Save comment
    const client = await clientPromise;
    const db = client.db("cse430");

    const newComment = {
      productId: new ObjectId(productId),
      userId: new ObjectId(userId),
      rating: safeRating,
      text: safeText,
      createdAt: new Date(),
    };

    const result = await db.collection("comments").insertOne(newComment);
    
    // Recalculate product rating based on all comments for this product
    const stats = await db
      .collection("comments")
      .aggregate([
        { $match: { productId: new ObjectId(productId) } },
        {
          $group: {
            _id: "$productId",
            avgRating: { $avg: "$rating" },
            ratingCount: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const avgRating = stats[0]?.avgRating ?? safeRating;

    // Update product document with new average rating
    await db.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: {
          rating: Number(avgRating.toFixed(1)), // round to 1 decimal
        },
      }
    );

    return NextResponse.json(
      { ok: true, commentId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comment submission error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
