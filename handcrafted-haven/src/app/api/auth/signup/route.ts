import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Force Node.js runtime for jsonwebtoken and bcryptjs compatibility
export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, seller, country, bio, rating } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password strength validation (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('cse430');

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      name,
      email,
      country,
      bio,
      rating: rating || 0,
      avatar: "/users/default-avatar.png",
      password: hashedPassword,
      seller: seller || false
    };

    const result = await db.collection('users').insertOne(newUser);

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: result.insertedId,
        email: newUser.email,
        name: newUser.name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    ); 

    // Return user data (without password) and token
    const userWithoutPassword: Omit<typeof newUser, "password"> & { password?: string } = {
  ...newUser };
    delete userWithoutPassword.password;

    return NextResponse.json(
      {
        success: true,
        token,
        user: { ...userWithoutPassword, _id: result.insertedId },
      },
      { status: 201 }
    );

    } catch (error: unknown) {
      console.error("Signup error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during signup";

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
