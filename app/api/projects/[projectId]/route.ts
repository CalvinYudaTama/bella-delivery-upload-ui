import { NextResponse } from 'next/server';
import { mockProjectData } from '@/mockData/deliveryData';

/**
 * Mock API: Get project data
 * GET /api/projects/[projectId]
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    // Return mock project data
    return NextResponse.json({
      ...mockProjectData,
      id: projectId,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
