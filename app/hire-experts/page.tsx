"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Define Expert interface
interface Expert {
  id: number;
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  location: string;
  skills: string[];
  hourlyRate: string;
  availability: string;
  image: string;
  matchScore: number;
}

export default function HireExperts() {
  const router = useRouter();
  const [projectDescription, setProjectDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/expert-matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectDescription,
          location,
          budget: budget ? parseInt(budget, 10) : 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to find matching experts');
      }

      // In a real implementation, this would use the project analysis to fetch experts
      // For now, we'll use mock data
      setExperts([
        {
          id: 1,
          name: 'John Smith',
          profession: 'General Contractor',
          rating: 4.8,
          reviews: 124,
          location: 'New York, NY',
          skills: ['Kitchen Renovation', 'Bathroom Remodeling', 'Flooring'],
          hourlyRate: '$75-95',
          availability: 'Available from June 15',
          image: '/assets/images/person1.jpg',
          matchScore: 0.92
        },
        {
          id: 2,
          name: 'Maria Rodriguez',
          profession: 'Interior Designer',
          rating: 4.9,
          reviews: 87,
          location: 'Miami, FL',
          skills: ['Space Planning', 'Color Consultation', 'Furniture Selection'],
          hourlyRate: '$65-85',
          availability: 'Available now',
          image: '/assets/images/person2.jpg',
          matchScore: 0.89
        },
        {
          id: 3,
          name: 'David Chen',
          profession: 'Electrical Contractor',
          rating: 4.7,
          reviews: 56,
          location: 'San Francisco, CA',
          skills: ['Electrical Wiring', 'Lighting Installation', 'Smart Home Systems'],
          hourlyRate: '$85-110',
          availability: 'Available from June 5',
          image: '/assets/images/person3.jpg',
          matchScore: 0.85
        }
      ]);
    } catch (err: unknown) {
      console.error('Error finding experts:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to find matching experts');
      } else {
        setError('Failed to find matching experts');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Find the Perfect Expert for Your Project</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Describe Your Project</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="projectDescription" className="block text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                id="projectDescription"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="Describe your project in detail. What are you looking to accomplish? What specific skills are required?"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                <label htmlFor="budget" className="block text-gray-700 mb-2">
                  Budget (USD)
                </label>
                <input
                  type="number"
                  id="budget"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your estimated budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
                disabled={loading}
              >
                {loading ? 'Finding Experts...' : 'Find Matching Experts'}
              </button>
            </div>
          </form>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {experts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">AI-Matched Experts for Your Project</h2>
            <p className="mb-4 text-gray-600">
              Our AI has analyzed your project requirements and found these experts who match your needs:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map((expert) => (
                <div key={expert.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative">
                    <div className="absolute top-2 right-2 bg-primary text-white text-sm px-2 py-1 rounded-full">
                      {Math.round(expert.matchScore * 100)}% Match
                    </div>
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{expert.name}</h3>
                    <p className="text-gray-600 mb-2">{expert.profession}</p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 mr-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(expert.rating) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-600">
                        {expert.rating} ({expert.reviews} reviews)
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-1">
                      <strong>Location:</strong> {expert.location}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Rate:</strong> {expert.hourlyRate}/hour
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Availability:</strong> {expert.availability}
                    </p>
                    
                    <div className="mb-3">
                      <strong className="block mb-1">Skills:</strong>
                      <div className="flex flex-wrap gap-1">
                        {expert.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <button className="bg-white border border-primary text-primary px-3 py-1 rounded hover:bg-gray-50">
                        View Profile
                      </button>
                      <button className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark">
                        Contact
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
