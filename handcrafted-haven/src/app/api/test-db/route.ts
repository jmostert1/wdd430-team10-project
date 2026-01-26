import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('cse430');
    
    // Test connection by listing collections
    const collections = await db.listCollections().toArray();
    
    // Get users count
    const usersCount = await db.collection('users').countDocuments();
    const users = await db.collection('users').find({}).project({ password: 0 }).toArray();
    
    return NextResponse.json({ 
      success: true,
      message: 'MongoDB connection successful!',
      database: 'cse430',
      collections: collections.map(c => c.name),
      usersCount,
      users,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to connect to MongoDB',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
