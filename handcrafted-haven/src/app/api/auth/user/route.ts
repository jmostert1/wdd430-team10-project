import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

// Force Node.js runtime for jsonwebtoken compatibility
export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function GET(request: NextRequest) {
  try {
    // Read talken
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    if (!payload?.userId) {
      return NextResponse.json({ success: false, error: "Invalid token payload" }, { status: 401 });
    }

    // Load user from DB
    const client = await clientPromise;
    const db = client.db("cse430");

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(payload.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Return user
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
  }
}
