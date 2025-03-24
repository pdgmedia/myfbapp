'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ProcessComments() {
  const searchParams = useSearchParams();
  const initialContestId = searchParams.get('contestId');
  
  const [contests, setContests] = useState([]);
  const [selectedContestId, setSelectedContestId] = useState(initialContestId || '');
  const [loading, setLoading] = useState(false);
  const [contestsLoading, setContestsLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [contestDetails, setContestDetails] = useState(null);

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    if (selectedContestId) {
      fetchContestDetails(selectedContestId);
    } else {
      setContestDetails(null);
    }
  }, [selectedContestId]);

  const fetchContests = async () => {
    try {
      setContestsLoading(true);
      const response = await fetch('/api/contests/list');
      const data = await response.json();
      
      if (response.ok) {
        setContests(data.contests || []);
      } else {
        setError(data.error || 'Failed to fetch contests');
      }
    } catch (error) {
      setError('An error occurred while fetching contests');
    } finally {
      setContestsLoading(false);
    }
  };

  const fetchContestDetails = async (id) => {
    try {
      const response = await fetch(`/api/contests/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setContestDetails(data.contest);
      } else {
        setError(data.error || 'Failed to fetch contest details');
      }
    } catch (error) {
      setError('An error occurred while fetching contest details');
    }
  };

  const processComments = async () => {
    if (!selectedContestId) {
      setError('Please select a contest first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResults(null);
      
      const response = await fetch('/api/process-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contestId: selectedContestId
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResults(data.results);
      } else {
        setError(data.error || 'Failed to process comments');
      }
    } catch (error) {
      setError('An error occurred while processing comments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Process Comments</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">How This Works</h2>
        <p className="mb-4">
          This tool scans comments on your Facebook post and automatically assigns numbers to commenters.
          When a user comments with a number, the app will update your original post to show their name next to that number.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">
            <strong>Note:</strong> Make sure you have connected your Facebook account and created a contest before processing comments.
          </p>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Contest</h2>
        
        {contestsLoading ? (
          <p className="text-gray-500">Loading contests...</p>
        ) : contests.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">
              No contests found. Please create a contest first.
            </p>
            <Link href="/contests" className="text-blue-600 hover:underline mt-2 inline-block">
              Create a Contest
            </Link>
          </div>
        ) : (
          <div className="mb-6">
            <label htmlFor="contestSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Select a Contest to Process
            </label>
            <select
              id="contestSelect"
              value={selectedContestId}
              onChange={(e) => setSelectedContestId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a Contest --</option>
              {contests.map((contest) => (
                <option key={contest.id} value={contest.id}>
                  {contest.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {contestDetails && (
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-medium mb-2">Contest Details</h3>
            <p><strong>Name:</strong> {contestDetails.name}</p>
            <p><strong>Post ID:</strong> {contestDetails.postId}</p>
            {contestDetails.description && (
              <p><strong>Description:</strong> {contestDetails.description}</p>
            )}
          </div>
        )}
        
        <button
          onClick={processComments}
          disabled={loading || !selectedContestId}
          className={`w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${(loading || !selectedContestId) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : 'Process Comments Now'}
        </button>
        
        {error && (
          <div className="mt-4 bg-red-50 text-red-800 p-4 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {results && (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Processing Results</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-md text-center">
              <p className="text-2xl font-bold">{results.processed}</p>
              <p className="text-sm text-gray-600">Comments Processed</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md text-center">
              <p className="text-2xl font-bold">{results.assigned}</p>
              <p className="text-sm text-gray-600">Numbers Assigned</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md text-center">
              <p className="text-2xl font-bold">{results.skipped}</p>
              <p className="text-sm text-gray-600">Comments Skipped</p>
            </div>
            <div className="bg-red-50 p-4 rounded-md text-center">
              <p className="text-2xl font-bold">{results.errors}</p>
              <p className="text-sm text-gray-600">Errors</p>
            </div>
          </div>
          
          <h3 className="font-medium mb-2">Details</h3>
          {results.details.length === 0 ? (
            <p className="text-gray-500">No details available</p>
          ) : (
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.details.map((detail, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap">{detail.userName}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${detail.status === 'assigned' ? 'bg-green-100 text-green-800' : 
                            detail.status === 'skipped' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {detail.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {detail.status === 'assigned' && (
                          <span>Assigned number {detail.number}</span>
                        )}
                        {detail.status === 'skipped' && (
                          <span>{detail.reason}</span>
                        )}
                        {detail.status === 'error' && (
                          <span>{detail.error}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={processComments}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Process Again
            </button>
            
            <Link href="/contests" className="text-blue-600 hover:underline flex items-center">
              Back to Contests
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
