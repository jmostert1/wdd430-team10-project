import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('cse430');

    // Find user's profile
    console.log('Looking for profile with userId:', decoded.userId);
    const profile = await db.collection('profiles').findOne({
      userId: new ObjectId(decoded.userId)
    });

    console.log('Profile found:', profile);

    if (!profile) {
      // Also check if user is actually a seller
      const user = await db.collection('users').findOne({
        _id: new ObjectId(decoded.userId)
      });
      console.log('User found:', user);
      
      return NextResponse.json(
        { error: 'Profile not found', debug: { userId: decoded.userId, userExists: !!user, userIsSeller: user?.seller } },
        { status: 404 }
      );
    }

    // Fetch seller's products
    const products = await db.collection('products').find({
      sellerId: new ObjectId(decoded.userId)
    }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      profile,
      products
    });

  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching profile', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { location, bio } = await request.json();

    const client = await clientPromise;
    const db = client.db('cse430');

    // Update user's profile
    const result = await db.collection('profiles').updateOne(
      { userId: new ObjectId(decoded.userId) },
      {
        $set: {
          location: location || '',
          bio: bio || '',
          updatedAt: new Date().toISOString(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating profile', details: error.message },
      { status: 500 }
    );
  }
}
