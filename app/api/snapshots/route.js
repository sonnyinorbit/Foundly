import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import WrappedSnapshot from '../../../models/WrappedSnapshot';

// GET /api/snapshots - Get all snapshots for an org
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');
    
    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }
    
    const snapshots = await WrappedSnapshot.find({ orgId })
      .sort({ month: -1 })
      .lean();
    
    return NextResponse.json(snapshots);
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snapshots' },
      { status: 500 }
    );
  }
}

// POST /api/snapshots - Create a new snapshot
export async function POST(request) {
  try {
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');
    
    const body = await request.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
    const {
      orgId,
      orgName,
      orgLocation,
      month,
      hoursVolunteered,
      memberCount,
      eventCount,
      fundsRaised = 0,
      orgVibe,
      quoteOfTheMonth,
      highlightBlurbs = [],
      topInitiatives = [],
      adviceForOthers,
      theme = 'sunset'
    } = body;
    
    // Validate required fields
    if (!orgId || !month || hoursVolunteered === undefined || 
        memberCount === undefined || eventCount === undefined) {
      console.error('Missing required fields:', { orgId, month, hoursVolunteered, memberCount, eventCount });
      return NextResponse.json(
        { error: 'Missing required fields: orgId, month, hoursVolunteered, memberCount, and eventCount are required' },
        { status: 400 }
      );
    }
    
    // Validate and sanitize data
    const sanitizedData = {
      orgId: String(orgId).trim(),
      orgName: orgName ? String(orgName).trim() : undefined,
      orgLocation: orgLocation ? String(orgLocation).trim() : undefined,
      month: String(month).trim(),
      hoursVolunteered: Math.max(0, Number(hoursVolunteered) || 0),
      memberCount: Math.max(0, Number(memberCount) || 0),
      eventCount: Math.max(0, Number(eventCount) || 0),
      fundsRaised: Math.max(0, Number(fundsRaised) || 0),
      orgVibe: orgVibe ? String(orgVibe).trim() : undefined,
      quoteOfTheMonth: quoteOfTheMonth ? String(quoteOfTheMonth).trim() : undefined,
      highlightBlurbs: Array.isArray(highlightBlurbs) ? highlightBlurbs.filter(blurb => blurb && blurb.trim()) : [],
      topInitiatives: Array.isArray(topInitiatives) ? topInitiatives.filter(initiative => initiative && initiative.trim()) : [],
      adviceForOthers: adviceForOthers ? String(adviceForOthers).trim() : undefined,
      theme: theme || 'sunset'
    };
    
    console.log('Sanitized data:', JSON.stringify(sanitizedData, null, 2));
    
    // Check if snapshot already exists for this org/month (disabled to allow multiple snapshots)
    console.log('Checking for existing snapshot:', { orgId, month });
    const existingSnapshot = await WrappedSnapshot.findOne({ orgId, month });
    console.log('Existing snapshot found:', existingSnapshot ? existingSnapshot._id : 'none');
    
    // Removed restriction to allow multiple snapshots per org per month
    // if (existingSnapshot) {
    //   return NextResponse.json(
    //     { error: 'Your organization already has a snapshot for this month. You can update the existing one instead.' },
    //     { status: 409 }
    //   );
    // }
    
    // Create new snapshot with unique identifier to allow multiple snapshots per month
    const uniqueId = `${sanitizedData.orgId}-${sanitizedData.month}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const snapshotData = {
      ...sanitizedData,
      uniqueSnapshotId: uniqueId // Add unique identifier
    };
    
    console.log('Creating snapshot with data:', JSON.stringify(snapshotData, null, 2));
    const snapshot = new WrappedSnapshot(snapshotData);
    
    console.log('Snapshot model created, attempting to save...');
    
    // Try to save with retry logic - keep trying until it succeeds
    let savedSnapshot;
    let retryCount = 0;
    const maxRetries = 10; // Increased retries to ensure success
    
    while (retryCount < maxRetries) {
      try {
        savedSnapshot = await snapshot.save();
        console.log('Snapshot saved successfully:', savedSnapshot._id);
        break;
      } catch (saveError) {
        retryCount++;
        console.log(`Save attempt ${retryCount} failed:`, saveError.message);
        
        if (saveError.code === 11000) {
          // Duplicate key error, generate new unique ID and retry
          const newUniqueId = `${sanitizedData.orgId}-${sanitizedData.month}-${Date.now()}-${Math.random().toString(36).substr(2, 15)}`;
          snapshot.uniqueSnapshotId = newUniqueId;
          console.log(`Retrying with new unique ID: ${newUniqueId}`);
          
          // Add a small delay to ensure timestamp uniqueness
          await new Promise(resolve => setTimeout(resolve, 10));
          continue;
        }
        
        // For any other error, throw it immediately
        throw saveError;
      }
    }
    
    // If we've exhausted all retries, create a completely unique ID
    if (!savedSnapshot) {
      const finalUniqueId = `${sanitizedData.orgId}-${sanitizedData.month}-${Date.now()}-${Math.random().toString(36).substr(2, 20)}-${Math.random().toString(36).substr(2, 20)}`;
      snapshot.uniqueSnapshotId = finalUniqueId;
      savedSnapshot = await snapshot.save();
      console.log('Snapshot saved with final unique ID:', savedSnapshot._id);
    }
    
    return NextResponse.json(savedSnapshot, { status: 201 });
  } catch (error) {
    console.error('Error creating snapshot:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors by just logging them (no user-facing error)
    if (error.code === 11000) {
      console.log('Duplicate key error detected, but this should be handled by retry logic above');
      // Don't return an error to the user, let the retry logic handle it
    }
    
    if (error.message.includes('MONGODB_URI')) {
      return NextResponse.json(
        { error: 'Database connection not configured. Please check environment variables.' },
        { status: 500 }
      );
    }
    
    // Log the full error for debugging
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    return NextResponse.json(
      { error: 'Failed to create snapshot. Please try again or contact support.' },
      { status: 500 }
    );
  }
}

// PUT /api/snapshots - Update an existing snapshot
export async function PUT(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Snapshot ID is required' },
        { status: 400 }
      );
    }
    
    const snapshot = await WrappedSnapshot.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!snapshot) {
      return NextResponse.json(
        { error: 'Snapshot not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Error updating snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to update snapshot' },
      { status: 500 }
    );
  }
} 