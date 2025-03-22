import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="py-2 px-4 md:px-6 flex justify-between items-center bg-white shadow-xs sticky top-0 z-50">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">e</span>
          </div>
          <span className="ml-2 text-base font-medium text-black">emilist</span>
        </Link>
      </div>
      
      <nav className="flex items-center space-x-3">
        <Link href="/expert" className="bg-primary text-white px-3 py-1.5 rounded-md hover:bg-opacity-90 transition-all text-xs font-medium">
          Join as an Expert
        </Link>
        <Link href="/job/new" className="text-gray-700 hover:text-gray-900 text-xs font-medium">
          List New Job
        </Link>
        <div className="relative group">
          <button className="flex items-center text-gray-700 hover:text-gray-900 text-xs font-medium">
            Explore Emilist
            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <Link href="/login" className="text-gray-700 hover:text-gray-900 text-xs font-medium">
          Log in
        </Link>
        <Link href="/signup" className="text-gray-700 hover:text-gray-900 text-xs font-medium">
          Sign up
        </Link>
      </nav>
    </header>
  );
};

export default Header;
