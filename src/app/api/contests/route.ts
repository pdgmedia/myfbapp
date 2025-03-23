import { NextRequest } from 'next/server';
import { createContest, logActivity } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { name, postId, description } = await request.json();
    
    if (!name || !postId) {
      return Response.json(
        { error: 'Name and postId are required' },
        { status: 400 }
      );
    }
    
    // Create the contest
    const contest = await createContest(name, postId, description);
    
    // Log the activity
    await logActivity(
      'create_contest',
      `Created contest "${name}"`,
      contest.id,
      request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || null
    );
    
    return Response.json({
      success: true,
      contest
    });
  } catch (error) {
    console.error('Error creating contest:', error);
    return Response.json(
      { error: 'Failed to create contest' },
      { status: 500 }
    );
  }
}
