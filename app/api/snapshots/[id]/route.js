import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import WrappedSnapshot from '../../../../models/WrappedSnapshot';

// GET /api/snapshots/[id] - Get a specific snapshot
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const snapshot = await WrappedSnapshot.findById(id).lean();
    
    if (!snapshot) {
      return NextResponse.json(
        { error: 'Snapshot not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Error fetching snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snapshot' },
      { status: 500 }
    );
  }
}

// DELETE /api/snapshots/[id] - Delete a specific snapshot
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    console.log('Attempting to delete snapshot:', id);
    
    const snapshot = await WrappedSnapshot.findByIdAndDelete(id);
    
    if (!snapshot) {
      return NextResponse.json(
        { error: 'Snapshot not found' },
        { status: 404 }
      );
    }
    
    console.log('Snapshot deleted successfully:', id);
    
    return NextResponse.json(
      { message: 'Snapshot deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to delete snapshot' },
      { status: 500 }
    );
  }
}

 