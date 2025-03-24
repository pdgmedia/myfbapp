import { NextRequest } from 'next/server';
import { getContestEntries } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const contestId = parseInt(resolvedParams.id, 10);
    
    if (isNaN(contestId)) {
      return Response.json({ error: 'Invalid contest ID' }, { status: 400 });
    }
    
    // Get the entries for this contest
    const entries = await getContestEntries(contestId);
    
    return Response.json({
      success: true,
      entries
    });
  } catch (error) {
    console.error('Error getting contest entries:', error);
    return Response.json({ error: 'Failed to get contest entries' }, { status: 500 });
  }
}
