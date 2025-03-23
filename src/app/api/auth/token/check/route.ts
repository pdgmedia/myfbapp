import { getLatestAccessToken } from '@/lib/database';

export async function GET() {
  try {
    // Get the latest access token
    const token = await getLatestAccessToken();
    
    if (!token) {
      return Response.json(
        { exists: false },
        { status: 200 }
      );
    }
    
    return Response.json({
      exists: true,
      tokenType: token.tokenType,
      createdAt: token.createdAt
    });
  } catch (error) {
    console.error('Error checking token:', error);
    return Response.json(
      { error: 'Failed to check token' },
      { status: 500 }
    );
  }
}
