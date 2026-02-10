import { NextResponse } from 'next/server';

/**
 * Mock API: Submit revision status (accept/reject)
 * POST /api/delivery/[projectId]/revisions
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const body = await request.json();

    console.log('Mock API: Received revision submission:', {
      projectId,
      body,
    });

    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Revision status updated successfully',
      data: {
        projectId,
        accepted: body.accepted_revision_ids || [],
        rejected: body.rejected_revision_ids || [],
      },
    });
  } catch (error) {
    console.error('Error updating revision status:', error);
    return NextResponse.json(
      { error: 'Failed to update revision status' },
      { status: 500 }
    );
  }
}
