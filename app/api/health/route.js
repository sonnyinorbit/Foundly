import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';

export async function GET() {
  try {
    // Test MongoDB connection
    await connectDB();
    
  return NextResponse.json({ 
      status: 'healthy',
      database: 'connected',
    timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
} 