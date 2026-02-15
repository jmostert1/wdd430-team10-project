import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// This is a one-time setup route to import users with hashed passwords
export async function POST() {
  try {
    const users = [
      {
        name: "Mira Halden",
        birthYear: 1984,
        email: "mira.halden@email.com",
        password: "SecurePass123!",
        seller: true
      },
      {
        name: "Elias Renford",
        birthYear: 1976,
        email: "elias.renford@email.com",
        password: "MyPassword456#",
        seller: false
      },
      {
        name: "Hana Lior",
        birthYear: 1991,
        email: "hana.lior@email.com",
        password: "StrongPass789$",
        seller: true
      }
    ];

    const client = await clientPromise;
    const db = client.db('cse430');

    // Hash passwords and insert users
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
        createdAt: new Date().toISOString()
      }))
    );

    // Clear existing users (optional - remove if you want to keep existing users)
    await db.collection('users').deleteMany({});

    // Insert users with hashed passwords
    const result = await db.collection('users').insertMany(usersWithHashedPasswords);

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${result.insertedCount} users`,
      users: usersWithHashedPasswords.map(u => ({
        name: u.name,
        email: u.email,
        seller: u.seller
      }))
    });

  } catch (error: unknown) {
    console.error("Import error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to import users";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
