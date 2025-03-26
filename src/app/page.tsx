import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Facebook Contest Manager</h1>
        
        <p className="text-xl mb-8">
          Easily manage Facebook contests and automatically assign numbers to commenters.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li>Connect your Facebook account to get access to your posts</li>
            <li>Create a contest linked to a specific Facebook post</li>
            <li>When users comment with numbers, the app automatically assigns those numbers</li>
            <li>The original post is updated with the commenter&apos;s name next to their chosen number</li>
          </ol>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">Connect Facebook</h3>
            <p className="mb-4">Link your Facebook account to manage your contests.</p>
            <Link href="/facebook-connect" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
              Connect Now
            </Link>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">Manage Contests</h3>
            <p className="mb-4">Create and manage your Facebook contests.</p>
            <Link href="/contests" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
              View Contests
            </Link>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">Process Comments</h3>
            <p className="mb-4">Scan comments and update your Facebook posts.</p>
            <Link href="/process-comments" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
              Process Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
