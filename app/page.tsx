import React from 'react';
import Layout from '@/app/components/layout/Layout';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-4xl mx-auto">
              {/* Hero content with surrounding images */}
              <div className="flex flex-col md:flex-row items-center">
                {/* Left side images */}
                <div className="hidden md:flex md:w-1/4 flex-col space-y-4 items-end">
                  <img src="/assets/images/hero/person1.jpg" alt="Professional" className="w-32 h-32 rounded-tl-3xl object-cover" />
                  <img src="/assets/images/hero/person2.jpg" alt="Professional" className="w-32 h-32 rounded-full object-cover" />
                  <img src="/assets/images/hero/person3.jpg" alt="Professional" className="w-32 h-32 rounded-bl-3xl object-cover" />
                </div>
                
                {/* Center content */}
                <div className="md:w-1/2 text-center py-8 px-4 z-10">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
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
                
                {/* Right side images */}
                <div className="hidden md:flex md:w-1/4 flex-col space-y-4 items-start">
                  <img src="/assets/images/hero/person4.jpg" alt="Professional" className="w-32 h-32 rounded-tr-3xl object-cover" />
                  <img src="/assets/images/hero/person5.jpg" alt="Professional" className="w-32 h-32 rounded-full object-cover" />
                  <img src="/assets/images/hero/person6.jpg" alt="Professional" className="w-32 h-32 rounded-br-3xl object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Service Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-16">
          <Link href="/hire-experts" className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="mb-4">
              <div className="w-12 h-12 bg-[#E6F7EC] rounded-full flex items-center justify-center">
                <img src="/assets/icons/service-providers.svg" alt="Service Providers" className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-sm font-medium">Service Providers</h3>
          </Link>
          
          <Link href="/find-job" className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="mb-4">
              <div className="w-12 h-12 bg-[#E6F7EC] rounded-full flex items-center justify-center">
                <img src="/assets/icons/job-opportunities.svg" alt="Job Opportunities" className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-sm font-medium">Job Opportunities</h3>
          </Link>
          
          <Link href="/buy-materials" className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="mb-4">
              <div className="w-12 h-12 bg-[#E6F7EC] rounded-full flex items-center justify-center">
                <img src="/assets/icons/materials.svg" alt="Materials" className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-sm font-medium">Materials</h3>
          </Link>
          
          <Link href="/expert/private-expert" className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="mb-4">
              <div className="w-12 h-12 bg-[#E6F7EC] rounded-full flex items-center justify-center">
                <img src="/assets/icons/customized-service.svg" alt="Customized Service" className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-sm font-medium">Customized<br/>Service Request</h3>
          </Link>
          
          <Link href="/dashboard/planned-maintenance" className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="mb-4">
              <div className="w-12 h-12 bg-[#E6F7EC] rounded-full flex items-center justify-center">
                <img src="/assets/icons/planned-maintenance.svg" alt="Planned Maintenance" className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-sm font-medium">Planned<br/>Maintenance</h3>
          </Link>
        </div>
        
        {/* Services around you */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Services around you</h2>
            <Link href="/dashboard/expert" className="text-primary hover:underline text-sm">See more</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Service cards would go here */}
          </div>
        </div>
        
        {/* Materials you may need */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Materials you may need</h2>
            <Link href="/dashboard/material" className="text-primary hover:underline text-sm">See more</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Material cards would go here */}
          </div>
        </div>
        
        {/* Find jobs around you */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Find jobs around you</h2>
            <Link href="/find-job" className="text-primary hover:underline text-sm">See more</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Job cards would go here */}
          </div>
        </div>
        
        {/* EmiList Private Expert */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">EmiList Private expert</h2>
              <p className="text-gray-600 mb-6">
                Hire private investigators, supervisors, project managers, and other professionals to facilitate the successful execution of your project.
              </p>
              <Link href="/expert/private-expert">
                <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all font-medium">
                  Get Started
                </button>
              </Link>
            </div>
            <div className="flex justify-center">
              <img src="/assets/images/workers.svg" alt="Workers" className="max-w-full h-auto" />
            </div>
          </div>
        </div>
        
        {/* Mobile App Section */}
        <div className="bg-[#F9FAFB] rounded-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-4">Manage your projects from your mobile</h3>
              <p className="text-gray-600 mb-6">
                Download the app to manage your projects, keep track of the progress and complete tasks without procastinating. Stay on track and complete on time!
              </p>
              <div>
                <h4 className="text-sm font-bold mb-4">GET THE APP</h4>
                <div className="flex space-x-4">
                  <Link href="/">
                    <img src="/assets/images/app-store.png" alt="App Store" className="h-10" />
                  </Link>
                  <Link href="/">
                    <img src="/assets/images/google-play.png" alt="Google Play" className="h-10" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <img src="/assets/images/phone.png" alt="Mobile App" className="max-w-full h-auto" />
            </div>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16 text-center">
          <h4 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h4>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Be the first to get latest updates from us and get more information about our products
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter Email Address" 
              className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button 
              type="submit" 
              className="bg-primary text-white px-6 py-2 rounded-r-md hover:bg-opacity-90 transition-all font-medium mt-2 sm:mt-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
