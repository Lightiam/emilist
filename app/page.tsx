"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/app/components/layout/Layout';
import SearchBar from '@/app/components/SearchBar';

export default function Home() {

  return (
    <Layout>
      <div className="container max-w-[1200px] mx-auto px-4 py-8">
        <div className="hero bg-white rounded-[20px] p-8 mb-10 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <div className="hero-content max-w-[1000px] mx-auto relative">
            <div className="hero-images flex justify-between relative">
              <div className="left-images flex flex-col justify-between w-[180px]">
                <div className="image-container w-[160px] h-[140px] bg-[#f0f0f0] rounded-[15px] overflow-hidden">
                  <img src="/assets/images/black-artisans/artisan1.png" alt="Black artisan working" className="w-full h-full object-cover" />
                </div>
                <div className="image-container w-[160px] h-[140px] bg-[#f0f0f0] rounded-[15px] overflow-hidden mt-4">
                  <img src="/assets/images/black-artisans/artisan2.png" alt="Black professional artisan" className="w-full h-full object-cover" />
                </div>
                <div className="image-container w-[160px] h-[140px] bg-[#f0f0f0] rounded-[15px] overflow-hidden mt-4">
                  <img src="/assets/images/black-artisans/artisan3.png" alt="Black artisan at work" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="hero-text text-center max-w-[600px] mx-auto py-10">
                <h1 className="hero-title text-[42px] font-bold mb-6 text-gray-800">
                  Discover Your Project Dream Team Here.
                </h1>
                <p className="hero-description text-base text-gray-600 leading-relaxed mb-8">
                  This platform connects homeowners, contractors, businesses, and
                  customers with skilled artisans, handymen, and project experts for
                  renovations, custom-builds, and repairs.
                </p>
                <div className="search-container max-w-[400px] mx-auto">
                  <SearchBar />
                </div>
              </div>
              
              <div className="right-images flex flex-col justify-between w-[180px]">
                <div className="image-container w-[160px] h-[140px] bg-[#f0f0f0] rounded-[15px] overflow-hidden">
                  <img src="/assets/images/black-artisans/artisan4.png" alt="Black artisan with tools" className="w-full h-full object-cover" />
                </div>
                <div className="image-container w-[160px] h-[140px] bg-[#f0f0f0] rounded-[15px] overflow-hidden mt-4">
                  <img src="/assets/images/black-artisans/artisan5.png" alt="Black artisan working" className="w-full h-full object-cover" />
                </div>
                <div className="image-container w-[160px] h-[140px] bg-[#f0f0f0] rounded-[15px] overflow-hidden mt-4">
                  <img src="/assets/images/black-artisans/artisan6.png" alt="Black artisan at work" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="categories grid grid-cols-5 gap-5 mb-10">
          <div className="category-card bg-white rounded-[10px] py-7 px-5 text-center shadow-[0_2px_5px_rgba(0,0,0,0.05)]">
            <div className="category-icon w-12 h-12 bg-[#e8f5e9] rounded-full mx-auto mb-4 flex items-center justify-center text-[#4caf50]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="M6.5 14a1 1 0 0 1-1-1V5h-2a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2h-2v8a1 1 0 0 1-1 1h-2z"/>
              </svg>
            </div>
            <h3 className="category-title text-base font-bold text-gray-800">Service Provider</h3>
          </div>
          
          <div className="category-card bg-white rounded-[10px] py-7 px-5 text-center shadow-[0_2px_5px_rgba(0,0,0,0.05)]">
            <div className="category-icon w-12 h-12 bg-[#e8f5e9] rounded-full mx-auto mb-4 flex items-center justify-center text-[#4caf50]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
              </svg>
            </div>
            <h3 className="category-title text-base font-bold text-gray-800">Job Opportunities</h3>
          </div>
          
          <div className="category-card bg-white rounded-[10px] py-7 px-5 text-center shadow-[0_2px_5px_rgba(0,0,0,0.05)]">
            <div className="category-icon w-12 h-12 bg-[#e8f5e9] rounded-full mx-auto mb-4 flex items-center justify-center text-[#4caf50]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
              </svg>
            </div>
            <h3 className="category-title text-base font-bold text-gray-800">Materials</h3>
          </div>
          
          <div className="category-card bg-white rounded-[10px] py-7 px-5 text-center shadow-[0_2px_5px_rgba(0,0,0,0.05)]">
            <div className="category-icon w-12 h-12 bg-[#e8f5e9] rounded-full mx-auto mb-4 flex items-center justify-center text-[#4caf50]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>
                <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
              </svg>
            </div>
            <h3 className="category-title text-base font-bold text-gray-800">Customized Service Request</h3>
          </div>
          
          <div className="category-card bg-white rounded-[10px] py-7 px-5 text-center shadow-[0_2px_5px_rgba(0,0,0,0.05)]">
            <div className="category-icon w-12 h-12 bg-[#e8f5e9] rounded-full mx-auto mb-4 flex items-center justify-center text-[#4caf50]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
              </svg>
            </div>
            <h3 className="category-title text-base font-bold text-gray-800">Planned Maintenance</h3>
          </div>
        </div>
      </div>
    </Layout>
  );
}
