import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-4 sm:mb-0">
          <Link href="/" className="hover:text-blue-200">
            Facebook Contest App
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <Link href="/" className="hover:text-blue-200 px-3 py-2 rounded hover:bg-blue-700">
            Home
          </Link>
          <Link href="/facebook-connect" className="hover:text-blue-200 px-3 py-2 rounded hover:bg-blue-700">
            Connect Facebook
          </Link>
          <Link href="/contests" className="hover:text-blue-200 px-3 py-2 rounded hover:bg-blue-700">
            Manage Contests
          </Link>
          <Link href="/process-comments" className="hover:text-blue-200 px-3 py-2 rounded hover:bg-blue-700">
            Process Comments
          </Link>
        </div>
      </div>
    </nav>
  );
}
