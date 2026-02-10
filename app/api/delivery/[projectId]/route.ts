import { NextResponse } from 'next/server';
import { getMockDeliveryData } from '@/mockData/deliveryData';

/**
 * Mock API: Get delivery data for a project
 * GET /api/delivery/[projectId]?revision=0
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const { searchParams } = new URL(request.url);
    const revisionParam = searchParams.get('revision');
    
    // Parse revision number (default to 0 if not provided)
    const revisionNumber = revisionParam !== null 
      ? parseInt(revisionParam, 10) 
      : null;
    
    // Validate revision number
    if (revisionParam !== null && isNaN(revisionNumber)) {
      return NextResponse.json(
        { error: 'Invalid revision number' },
        { status: 400 }
      );
    }

    // Get mock delivery data
    const deliveryData = getMockDeliveryData(projectId, revisionNumber);

    return NextResponse.json(deliveryData);
  } catch (error) {
    console.error('Error fetching delivery data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery data' },
      { status: 500 }
    );
  }
}
