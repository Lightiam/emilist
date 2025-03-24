"use client";

import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  applicationDeadline: string;
  contactEmail: string;
  relevanceScore: number;
}

export default function FindJob() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          location,
          jobType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to find jobs');
      }

      // In a real implementation, this would use the AI search to fetch jobs
      // For now, we'll use mock data
      setJobs([
        {
          id: 1,
          title: 'Senior Carpenter',
          company: 'BuildRight Construction',
          location: 'Boston, MA',
          salary: '$35-45/hr',
          description: 'Experienced carpenter needed for high-end residential projects. Must have 5+ years experience with finish carpentry and custom cabinetry.',
          requirements: ['5+ years experience', 'Own tools', 'Valid driver\'s license', 'Portfolio of past work'],
          postedDate: '2025-03-10',
          applicationDeadline: '2025-04-10',
          contactEmail: 'jobs@buildright.com',
          relevanceScore: 0.95
        },
        {
          id: 2,
          title: 'Plumbing Technician',
          company: 'Reliable Plumbing Services',
          location: 'Cambridge, MA',
          salary: '$30-40/hr',
          description: 'Looking for licensed plumbers to join our growing team. Residential and light commercial work. Emergency on-call rotation required.',
          requirements: ['Licensed plumber', '3+ years experience', 'Clean driving record', 'Customer service skills'],
          postedDate: '2025-03-15',
          applicationDeadline: '2025-04-15',
          contactEmail: 'careers@reliableplumbing.com',
          relevanceScore: 0.88
        },
        {
          id: 3,
          title: 'Electrical Apprentice',
          company: 'PowerUp Electrical',
          location: 'Somerville, MA',
          salary: '$22-28/hr',
          description: 'Seeking apprentice electricians to train under our master electricians. Great opportunity to learn and advance your career.',
          requirements: ['High school diploma', 'Basic electrical knowledge', 'Willingness to learn', 'Reliable transportation'],
          postedDate: '2025-03-18',
          applicationDeadline: '2025-04-18',
          contactEmail: 'hr@powerupelectrical.com',
          relevanceScore: 0.82
        }
      ]);
    } catch (err: unknown) {
      console.error('Error finding jobs:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to find jobs');
      } else {
        setError('Failed to find jobs');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Find Your Next Job</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Jobs</h2>
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="searchQuery" className="block text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  id="searchQuery"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Job title, skills, or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="City, State or 'Remote'"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="jobType" className="block text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  id="jobType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="apprenticeship">Apprenticeship</option>
                </select>
              </div>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Jobs'}
              </button>
            </div>
          </form>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {jobs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">AI-Matched Jobs for You</h2>
            <p className="mb-4 text-gray-600">
              Our AI has analyzed your search criteria and found these jobs that match your skills and interests:
            </p>
            
            <div className="space-y-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <p className="text-gray-600">{job.company} - {job.location}</p>
                      </div>
                      <div className="bg-primary text-white text-sm px-2 py-1 rounded-full">
                        {Math.round(job.relevanceScore * 100)}% Match
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    
                    <div className="mb-4">
                      <strong className="block mb-2">Requirements:</strong>
                      <ul className="list-disc pl-5 space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="text-gray-700">{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 mb-4">
                      <div>
                        <strong>Salary:</strong> {job.salary}
                      </div>
                      <div>
                        <strong>Posted:</strong> {new Date(job.postedDate).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <button className="bg-white border border-primary text-primary px-4 py-2 rounded hover:bg-gray-50">
                        Save Job
                      </button>
                      <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
