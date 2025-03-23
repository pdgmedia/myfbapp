import { NextRequest } from 'next/server';
import { saveAccessToken, logActivity } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, tokenType = 'page', expiresAt = null } = await request.json();
    
    if (!accessToken) {
      return Response.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }
    
    // Save the access token to the database
    const tokenId = await saveAccessToken(
      tokenType,
      accessToken,
      expiresAt
    );
    
    // Log the activity
    await logActivity(
      'save_token',
      `Saved new ${tokenType} access token`,
      null,
      request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || null
    );
    
    return Response.json({
      success: true,
      tokenId
    });
  } catch (error) {
    console.error('Error saving access token:', error);
    return Response.json(
      { error: 'Failed to save access token' },
      { status: 500 }
    );
  }
}
