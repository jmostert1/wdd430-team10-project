// Finds user by id

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type User = {
  name: string;
  bio: string;
  country: string;
  avatar?: string;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid id" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cse430");

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid id" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, bio, country, avatar } = body;

    // Build update object with only provided fields
    const updateFields: Partial<User> = {};
    if (name !== undefined) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    if (country !== undefined) updateFields.country = country;
    if (avatar !== undefined) updateFields.avatar = avatar;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cse430");

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch updated user
    const updatedUser = await db.collection("users").findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
