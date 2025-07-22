import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow in development or with a secret key
  if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_SECRET) {
    return NextResponse.json({ error: 'Debug endpoint not available in production' }, { status: 403 });
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    hasMongoDBUri: !!process.env.MONGODB_URI,
    mongoDBUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform
  });
} 