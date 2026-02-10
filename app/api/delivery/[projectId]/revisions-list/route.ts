import { NextResponse } from 'next/server';
import { mockRevisionsList } from '@/mockData/deliveryData';

/**
 * Mock API: Get revisions list for a project
 * GET /api/delivery/[projectId]/revisions-list
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    // Update URLs to use the provided projectId
    const revisions = mockRevisionsList.map(rev => ({
      ...rev,
      deliveryUrl: rev.deliveryUrl.replace('demo-project-123', projectId),
    }));

    return NextResponse.json({
      revisions,
    });
  } catch (error) {
    console.error('Error fetching revisions list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revisions list' },
      { status: 500 }
    );
  }
}
