// src/lib/facebook/api.ts
import { prisma } from '@/lib/database';

export interface FacebookPost {
  id: string;
  message: string;
  created_time: string;
}

export interface FacebookComment {
  id: string;
  message: string;
  from: {
    id: string;
    name: string;
  };
  created_time: string;
}

// Make a request to the Facebook Graph API
export async function facebookRequest(
  endpoint: string,
  accessToken: string,
  method: string = 'GET',
  params: Record<string, string> = {}
) {
  try {
    const url = new URL(`https://graph.facebook.com/v18.0${endpoint}`);
    
    // Add access token to params
    params.access_token = accessToken;
    
    // Add params to URL for GET requests
    if (method === 'GET') {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // Add body for non-GET requests
    if (method !== 'GET') {
      options.body = JSON.stringify(params);
    }
    
    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Facebook API error: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Facebook API request failed:', error);
    throw error;
  }
}

// Get the latest access token from the database
export async function getLatestAccessToken() {
  try {
    return prisma.facebookToken.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

// Get a Facebook post by ID
export async function getPost(postId: string, accessToken: string): Promise<FacebookPost> {
  try {
    const data = await facebookRequest(`/${postId}`, accessToken, 'GET', {
      fields: 'id,message,created_time',
    });
    
    return data as FacebookPost;
  } catch (error) {
    console.error(`Error getting post ${postId}:`, error);
    throw error;
  }
}

// Update a Facebook post
export async function updatePost(postId: string, message: string, accessToken: string): Promise<boolean> {
  try {
    await facebookRequest(`/${postId}`, accessToken, 'POST', {
      message,
    });
    
    return true;
  } catch (error) {
    console.error(`Error updating post ${postId}:`, error);
    throw error;
  }
}

// Get comments for a post
export async function getPostComments(
  postId: string,
  accessToken: string,
  since?: string
): Promise<FacebookComment[]> {
  try {
    const params: Record<string, string> = {
      fields: 'id,message,from,created_time',
      limit: '100',
      order: 'chronological',
    };
    
    if (since) {
      params.since = since;
    }
    
    const data = await facebookRequest(`/${postId}/comments`, accessToken, 'GET', params);
    
    let comments = data.data || [];
    let nextPage = data.paging?.next;
    
    // Handle pagination to get all comments
    while (nextPage) {
      const response = await fetch(nextPage);
      const pageData = await response.json();
      
      comments = [...comments, ...(pageData.data || [])];
      nextPage = pageData.paging?.next;
    }
    
    return comments as FacebookComment[];
  } catch (error) {
    console.error(`Error getting comments for post ${postId}:`, error);
    throw error;
  }
}

// Reply to a comment
export async function replyToComment(
  commentId: string,
  message: string,
  accessToken: string
): Promise<boolean> {
  try {
    await facebookRequest(`/${commentId}/comments`, accessToken, 'POST', {
      message,
    });
    
    return true;
  } catch (error) {
    console.error(`Error replying to comment ${commentId}:`, error);
    throw error;
  }
}

// Extract numbers from a comment message
export function extractNumbersFromComment(commentText: string): number[] {
  const numberRegex = /\b\d+\b/g;
  const matches = commentText.match(numberRegex);
  
  if (!matches) {
    return [];
  }
  
  return matches.map(num => parseInt(num, 10));
}

// Check if a number is available in the post content
export function isNumberAvailable(postContent: string, number: number): boolean {
  const lines = postContent.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Look for lines that start with the number followed by a period
    if (trimmedLine.startsWith(`${number}.`)) {
      // If there's nothing after the number and period except whitespace
      // or if there's just a space after the period
      if (
        trimmedLine === `${number}.` ||
        new RegExp(`^${number}\\.\\s*$`).test(trimmedLine)
      ) {
        return true;
      }
    }
  }
  
  return false;
}

// Update post content with a name next to a specific number
export function updatePostWithName(postContent: string, number: number, name: string): string {
  const lines = postContent.split('\n');
  const updatedLines = [];
  
  for (const line of lines) {
    // Look for the line with this number
    if (line.trim().startsWith(`${number}.`)) {
      // Update the line with the name
      updatedLines.push(`${number}. ${name}`);
    } else {
      updatedLines.push(line);
    }
  }
  
  return updatedLines.join('\n');
}
