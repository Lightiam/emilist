import React from 'react';
import Layout from '@/app/components/layout/Layout';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-xs p-6 mb-8">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-4xl mx-auto">
              {/* Surrounding images */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img src="/assets/images/people/worker1.jpg" alt="Professional" className="absolute top-0 left-0 w-32 h-32 rounded-tl-3xl object-cover" />
                <img src="/assets/images/people/worker2.jpg" alt="Professional" className="absolute top-32 left-16 w-32 h-32 rounded-full object-cover" />
                <img src="/assets/images/people/worker3.jpg" alt="Professional" className="absolute top-0 right-0 w-32 h-32 rounded-tr-3xl object-cover" />
                <img src="/assets/images/people/worker4.jpg" alt="Professional" className="absolute bottom-0 left-0 w-32 h-32 rounded-bl-3xl object-cover" />
                <img src="/assets/images/people/worker5.jpg" alt="Professional" className="absolute bottom-32 right-12 w-32 h-32 rounded-full object-cover" />
                <img src="/assets/images/people/worker6.jpg" alt="Professional" className="absolute bottom-0 right-0 w-32 h-32 rounded-br-3xl object-cover" />
              </div>
              
              {/* Center content */}
              <div className="text-center py-16 px-4 md:px-16 z-10 relative">
                <h1 className="text-4xl font-bold mb-6 text-gray-900">
                  Discover Your Project<br />Dream Team Here.
                </h1>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                  This platform connects homeowners, contractors, businesses, and 
                  customers with skilled artisans, handymen, and project experts for 
                  renovations, custom-builds, and repairs.
                </p>
                
                {/* Search Bar */}
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
        
        {/* Service Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Link href="/service-providers" className="bg-white rounded-lg shadow-xs p-4 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
            <div className="mb-3">
              <div className="w-10 h-10 bg-[#E6F7EC] rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6C10.34 6 9 7.34 9 9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9C15 7.34 13.66 6 12 6ZM12 10C11.45 10 11 9.55 11 9C11 8.45 11.45 8 12 8C12.55 8 13 8.45 13 9C13 9.55 12.55 10 12 10Z" fill="#22C55E"/>
                  <path d="M12 13C9.33 13 4 14.34 4 17V19H20V17C20 14.34 14.67 13 12 13ZM6 17C6.22 16.28 9.31 15 12 15C14.7 15 17.8 16.29 18 17H6Z" fill="#22C55E"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xs font-medium">Service Providers</h3>
          </Link>
          
          <Link href="/job-opportunities" className="bg-white rounded-lg shadow-xs p-4 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
            <div className="mb-3">
              <div className="w-10 h-10 bg-[#E6F7EC] rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6H17V4C17 2.89 16.11 2 15 2H9C7.89 2 7 2.89 7 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM9 4H15V6H9V4ZM20 19H4V8H20V19Z" fill="#22C55E"/>
                  <path d="M11 11H9V17H11V11Z" fill="#22C55E"/>
                  <path d="M15 15H13V17H15V15Z" fill="#22C55E"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xs font-medium">Job Opportunities</h3>
          </Link>
          
          <Link href="/materials" className="bg-white rounded-lg shadow-xs p-4 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
            <div className="mb-3">
              <div className="w-10 h-10 bg-[#E6F7EC] rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z" stroke="#22C55E" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M3 7.5L12 12L21 7.5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12V22" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xs font-medium">Materials</h3>
          </Link>
          
          <Link href="/customized-service" className="bg-white rounded-lg shadow-xs p-4 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
            <div className="mb-3">
              <div className="w-10 h-10 bg-[#E6F7EC] rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H16.83L15 2H9L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.35 9 9 10.35 9 12C9 13.65 10.35 15 12 15C13.65 15 15 13.65 15 12C15 10.35 13.65 9 12 9Z" fill="#22C55E"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xs font-medium">Customized<br/>Service Request</h3>
          </Link>
          
          <Link href="/planned-maintenance" className="bg-white rounded-lg shadow-xs p-4 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
            <div className="mb-3">
              <div className="w-10 h-10 bg-[#E6F7EC] rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#22C55E"/>
                  <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#22C55E"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xs font-medium">Planned<br/>Maintenance</h3>
          </Link>
        </div>
        
        {/* Services around you */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Services around you</h2>
            <Link href="/services" className="text-primary hover:underline text-sm">See more</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Service cards would go here */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
