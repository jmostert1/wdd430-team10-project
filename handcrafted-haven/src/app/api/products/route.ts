import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
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

    const { name, description, price, category, imageUrl } = await request.json();

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      );
    }

    // Validate price
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('cse430');

    // Verify user is a seller
    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId)
    });

    if (!user || !user.seller) {
      return NextResponse.json(
        { error: 'Only sellers can add products' },
        { status: 403 }
      );
    }

    // Create new product
    const newProduct = {
      sellerId: new ObjectId(decoded.userId),
      sellerName: user.name,
      name,
      description,
      price,
      category,
      imageUrl: imageUrl || '',
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('products').insertOne(newProduct);

    return NextResponse.json({
      success: true,
      productId: result.insertedId,
      message: 'Product added successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Add product error:', error);
    return NextResponse.json(
      { error: 'An error occurred while adding product' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('cse430');

    // Fetch all products, sorted by newest first
    const products = await db.collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      products
    });

  } catch (error: any) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching products' },
      { status: 500 }
    );
  }
}
