import { NextRequest } from 'next/server';
import { getContestById, getContestEntries, logActivity } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return Response.json(
        { error: 'Invalid contest ID' },
        { status: 400 }
      );
    }
    
    // Get the contest
    const contest = await getContestById(id);
    
    if (!contest) {
      return Response.json(
        { error: 'Contest not found' },
        { status: 404 }
      );
    }
    
    // Get the entries
    const entries = await getContestEntries(id);
    
    // Log the activity
    await logActivity(
      'view_contest',
      `Viewed contest "${contest.name}"`,
      contest.id,
      request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || null
    );
    
    return Response.json({
      contest,
      entries
    });
  } catch (error) {
    console.error('Error getting contest:', error);
    return Response.json(
      { error: 'Failed to get contest' },
      { status: 500 }
    );
  }
}
