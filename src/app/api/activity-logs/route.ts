import { NextRequest } from 'next/server';
import { getRecentActivityLogs } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contestId = searchParams.get('contestId');
    const limit = searchParams.get('limit');
    
    // Get activity logs
    const logs = await getRecentActivityLogs(
      limit ? parseInt(limit) : 50,
      contestId ? parseInt(contestId) : null
    );
    
    return Response.json({ logs });
  } catch (error) {
    console.error('Error getting activity logs:', error);
    return Response.json(
      { error: 'Failed to get activity logs' },
      { status: 500 }
    );
  }
}
