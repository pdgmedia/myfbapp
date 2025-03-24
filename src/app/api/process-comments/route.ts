import { NextRequest } from 'next/server';
import { getLatestAccessToken, logActivity } from '@/lib/database';
import { getPostComments, extractNumbersFromComment, isNumberAvailable, updatePostWithName, getPost, updatePost } from '@/lib/facebook/api';
import { getContestById, getEntryByCommentId, getEntryByNumber, createEntry } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { contestId } = await request.json();
    
    if (!contestId) {
      return Response.json(
        { error: 'Contest ID is required' },
        { status: 400 }
      );
    }
    
    // Get the contest
    const contest = await getContestById(parseInt(contestId));
    
    if (!contest) {
      return Response.json(
        { error: 'Contest not found' },
        { status: 404 }
      );
    }
    
    // Get the latest access token
    const tokenData = await getLatestAccessToken();
    
    if (!tokenData) {
      return Response.json(
        { error: 'No Facebook access token found' },
        { status: 400 }
      );
    }
    
    // Get the post content
    const post = await getPost(contest.postId, tokenData.token);
    
    if (!post) {
      return Response.json(
        { error: 'Failed to get Facebook post' },
        { status: 500 }
      );
    }
    
    // Get all comments on the post
    const comments = await getPostComments(contest.postId, tokenData.token);
    
    // Process each comment
    type DetailItem = {
      commentId: string;
      userName: string;
      status: string;
      reason?: string;
      number?: string;
      error?: string;
    };
    
    const results = {
      processed: 0,
      assigned: 0,
      skipped: 0,
      errors: 0,
      details: [] as DetailItem[]
    };
    
    let postContentUpdated = false;
    let currentPostContent = post.message;
    
    for (const comment of comments) {
      results.processed++;
      
      try {
        // Skip if this comment already has an entry
        const existingEntry = await getEntryByCommentId(parseInt(contestId), comment.id);
        
        if (existingEntry) {
          results.skipped++;
          results.details.push({
            commentId: comment.id,
            userName: comment.from.name,
            status: 'skipped',
            reason: 'Already processed'
          });
          continue;
        }
        
        // Extract numbers from the comment
        const numbers = extractNumbersFromComment(comment.message);
        
        if (numbers.length === 0) {
          results.skipped++;
          results.details.push({
            commentId: comment.id,
            userName: comment.from.name,
            status: 'skipped',
            reason: 'No numbers found in comment'
          });
          continue;
        }
        
        // Try each number in the comment
        let assigned = false;
        
        for (const number of numbers) {
          // Check if this number is already assigned
          const existingNumberEntry = await getEntryByNumber(parseInt(contestId), number);
          
          if (existingNumberEntry) {
            continue; // Try the next number
          }
          
          // Check if this number is available in the post
          if (isNumberAvailable(currentPostContent, number)) {
            // Create an entry for this comment
            await createEntry(
              parseInt(contestId),
              comment.id,
              comment.from.name,
              number
            );
            
            // Update the post content
            currentPostContent = updatePostWithName(currentPostContent, number, comment.from.name);
            postContentUpdated = true;
            
            results.assigned++;
            results.details.push({
              commentId: comment.id,
              userName: comment.from.name,
              status: 'assigned',
              number: number.toString()
            });
            
            assigned = true;
            break; // Stop after assigning one number
          }
        }
        
        if (!assigned) {
          results.skipped++;
          results.details.push({
            commentId: comment.id,
            userName: comment.from.name,
            status: 'skipped',
            reason: 'No available numbers found'
          });
        }
      } catch (error: unknown) {
        console.error(`Error processing comment ${comment.id}:`, error);
        results.errors++;
        results.details.push({
          commentId: comment.id,
          userName: comment.from.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Update the Facebook post if needed
    if (postContentUpdated) {
      await updatePost(contest.postId, currentPostContent, tokenData.token);
    }
    
    // Log the activity
    await logActivity(
      'process_comments',
      `Processed ${results.processed} comments for contest "${contest.name}"`,
      parseInt(contestId),
      request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || null
    );
    
    return Response.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error processing comments:', error);
    return Response.json(
      { error: 'Failed to process comments' },
      { status: 500 }
    );
  }
}
