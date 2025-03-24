'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FacebookConnect() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', type: '' });

    try {
      // Calculate expiry date (90 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 90);

      const response = await fetch('/api/auth/token/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          expiresAt: expiryDate.toISOString()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          message: 'Facebook token saved successfully!',
          type: 'success'
        });
        setToken('');
      } else {
        setStatus({
          message: data.error || 'Failed to save token',
          type: 'error'
        });
      }
    } catch (error) {
      setStatus({
        message: 'An error occurred while saving the token',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Connect to Facebook</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">How to Get a Facebook Access Token</h2>
        <ol className="list-decimal list-inside space-y-3 mb-4">
          <li>Go to <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Graph API Explorer</a></li>
          <li>Select your app from the dropdown menu</li>
          <li>Click on "Generate Access Token"</li>
          <li>Make sure to request these permissions:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>pages_read_engagement (to read comments)</li>
              <li>pages_manage_posts (to update posts)</li>
              <li>pages_show_list (to see your pages)</li>
            </ul>
          </li>
          <li>Copy the generated token and paste it below</li>
        </ol>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">
            <strong>Note:</strong> For security reasons, never share your access token with others.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
              Facebook Access Token
            </label>
            <textarea
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Paste your Facebook access token here"
              required
            />
          </div>
          
          {status.message && (
            <div className={`p-4 mb-4 rounded-md ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {status.message}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save Token'}
            </button>
            
            <Link href="/contests" className="text-blue-600 hover:underline">
              Continue to Contests →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
