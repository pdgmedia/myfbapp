import { NextRequest } from 'next/server';
import { getContests, logActivity } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get all contests
    const contests = await getContests();
    
    // Log the activity
    await logActivity(
      'list_contests',
      `Listed ${contests.length} contests`,
      null,
      request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || null
    );
    
    return Response.json({ contests });
  } catch (error) {
    console.error('Error listing contests:', error);
    return Response.json(
      { error: 'Failed to list contests' },
      { status: 500 }
    );
  }
}
