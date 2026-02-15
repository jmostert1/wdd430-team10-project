import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('cse430');
    
    // Find user by email
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const userWithoutPassword: Omit<typeof user, "password"> & { password?: string } = {
      ...user,
    };

    delete userWithoutPassword.password;

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword
    });

  } catch (error: unknown) {
    console.error('Login error:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An error occurred during login';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
