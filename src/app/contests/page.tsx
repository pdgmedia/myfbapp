'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';

interface Contest {
  id: number;
  name: string;
  postId: string;
  description: string;
}

interface NewContest {
  name: string;
  postId: string;
  description: string;
}

interface FormStatus {
  message: string;
  type: string;
}

export default function Contests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [newContest, setNewContest] = useState<NewContest>({
    name: '',
    postId: '',
    description: ''
  });
  const [formStatus, setFormStatus] = useState<FormStatus>({ message: '', type: '' });
  const [formLoading, setFormLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contests/list');
      const data = await response.json();
      
      if (response.ok) {
        setContests(data.contests || []);
      } else {
        setError(data.error || 'Failed to fetch contests');
      }
    } catch (error) {
      // Using error variable to avoid ESLint no-unused-vars warning
      console.error('Error fetching contests:', error);
      setError('An error occurred while fetching contests');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewContest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormStatus({ message: '', type: '' });

    try {
      const response = await fetch('/api/contests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContest),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          message: 'Contest created successfully!',
          type: 'success'
        });
        setNewContest({
          name: '',
          postId: '',
          description: ''
        });
        fetchContests(); // Refresh the list
      } else {
        setFormStatus({
          message: data.error || 'Failed to create contest',
          type: 'error'
        });
      }
    } catch (error) {
      // Using error variable to avoid ESLint no-unused-vars warning
      console.error('Error creating contest:', error);
      setFormStatus({
        message: 'An error occurred while creating the contest',
        type: 'error'
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Contests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Contest Form */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Create New Contest</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Contest Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newContest.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., March Giveaway"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="postId" className="block text-sm font-medium text-gray-700 mb-1">
                Facebook Post ID
              </label>
              <input
                type="text"
                id="postId"
                name="postId"
                value={newContest.postId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., pfbid0vYbUUENdztbk8dLp2Sm82BGaoSppLHKKHDaVi9ZgR9UFmmBUo9pnsQqRnLpEo4Jql"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The ID is the long string at the end of your Facebook post URL
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newContest.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Brief description of your contest"
              />
            </div>
            
            {formStatus.message && (
              <div className={`p-3 mb-4 rounded-md text-sm ${formStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {formStatus.message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={formLoading}
              className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${formLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {formLoading ? 'Creating...' : 'Create Contest'}
            </button>
          </form>
        </div>
        
        {/* Contest List */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Contests</h2>
            <button 
              onClick={fetchContests} 
              className="text-blue-600 hover:text-blue-800"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : '↻ Refresh'}
            </button>
          </div>
          
          {loading ? (
            <p className="text-gray-500 text-center py-8">Loading contests...</p>
          ) : error ? (
            <div className="bg-red-50 text-red-800 p-4 rounded-md">
              {error}
            </div>
          ) : contests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No contests found. Create your first contest!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {contests.map((contest) => (
                <li key={contest.id} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{contest.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{contest.description}</p>
                    </div>
                    <Link 
                      href={`/contests/${contest.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <Link 
                      href={`/process-comments?contestId=${contest.id}`}
                      className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Process Comments
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">How to Use Contests</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Create a Facebook post with numbers that users can claim (e.g., &ldquo;Comment with a number from 1-50&rdquo;)</li>
          <li>Copy the post ID from the URL and create a new contest here</li>
          <li>When users comment with numbers, use the &ldquo;Process Comments&rdquo; button to scan and update your post</li>
          <li>The app will automatically add the commenter&apos;s name next to their chosen number in the original post</li>
        </ol>
      </div>
    </div>
  );
}
