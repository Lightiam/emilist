"use client";

import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface ServiceProvider {
  id: number;
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  location: string;
  hourlyRate: string;
  experience: number;
  responseTime: string;
  completionRate: number;
  skills: string[];
  image: string;
}

export default function Compare() {
  const [providers, setProviders] = useState<ServiceProvider[]>([
    {
      id: 1,
      name: "John Smith",
      profession: "General Contractor",
      rating: 4.8,
      reviews: 124,
      location: "New York, NY",
      hourlyRate: "$75-95",
      experience: 12,
      responseTime: "Within 2 hours",
      completionRate: 97,
      skills: ["Kitchen Renovation", "Bathroom Remodeling", "Flooring"],
      image: "/assets/images/person1.jpg"
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      profession: "Interior Designer",
      rating: 4.9,
      reviews: 87,
      location: "Miami, FL",
      hourlyRate: "$65-85",
      experience: 8,
      responseTime: "Within 1 hour",
      completionRate: 99,
      skills: ["Space Planning", "Color Consultation", "Furniture Selection"],
      image: "/assets/images/person2.jpg"
    },
    {
      id: 3,
      name: "David Chen",
      profession: "Electrical Contractor",
      rating: 4.7,
      reviews: 56,
      location: "San Francisco, CA",
      hourlyRate: "$85-110",
      experience: 15,
      responseTime: "Within 4 hours",
      completionRate: 95,
      skills: ["Electrical Wiring", "Lighting Installation", "Smart Home Systems"],
      image: "/assets/images/person3.jpg"
    }
  ]);
  
  const [selectedProviders, setSelectedProviders] = useState<number[]>([1, 2]);
  
  const toggleProviderSelection = (providerId: number) => {
    if (selectedProviders.includes(providerId)) {
      setSelectedProviders(selectedProviders.filter(id => id !== providerId));
    } else {
      if (selectedProviders.length < 3) {
        setSelectedProviders([...selectedProviders, providerId]);
      }
    }
  };
  
  const getStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`}>★</span>
        ))}
        {halfStar && <span>★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`}>☆</span>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Compare Service Providers</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Providers to Compare (Max 3)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedProviders.includes(provider.id)
                    ? 'border-primary bg-primary bg-opacity-5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleProviderSelection(provider.id)}
              >
                <div className="flex items-center">
                  <div className="relative w-16 h-16 mr-4">
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                    {selectedProviders.includes(provider.id) && (
                      <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                        ✓
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{provider.name}</h3>
                    <p className="text-gray-600 text-sm">{provider.profession}</p>
                    <div className="flex items-center text-sm">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{provider.rating}</span>
                      <span className="text-gray-500 ml-1">({provider.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {selectedProviders.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criteria
                    </th>
                    {selectedProviders.map((id) => {
                      const provider = providers.find(p => p.id === id);
                      return provider ? (
                        <th key={id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex flex-col items-center">
                            <img
                              src={provider.image}
                              alt={provider.name}
                              className="w-12 h-12 object-cover rounded-full mb-2"
                            />
                            {provider.name}
                          </div>
                        </th>
                      ) : null;
                    })}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Profession</td>
                    {selectedProviders.map((id) => {
                      const provider = providers.find(p => p.id === id);
                      return provider ? (
                        <td key={id} className="px-6 py-4 whitespace-nowrap text-center">
                          {provider.profession}
                        </td>
                      ) : null;
                    })}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Rating</td>
                    {selectedProviders.map((id) => {
                      const provider = providers.find(p => p.id === id);
                      return provider ? (
                        <td key={id} className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col items-center">
                            {getStarRating(provider.rating)}
                            <span className="text-sm text-gray-500 mt-1">
                              ({provider.reviews} reviews)
                            </span>
                          </div>
                        </td>
                      ) : null;
                    })}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Location</td>
                    {selectedProviders.map((id) => {
                      const provider = providers.find(p => p.id === id);
                      return provider ? (
                        <td key={id} className="px-6 py-4 whitespace-nowrap text-center">
                          {provider.location}
                        </td>
                      ) : null;
                    })}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Hourly Rate</td>
                    {selectedProviders.map((id) => {
                      const provider = providers.find(p => p.id === id);
                      return provider ? (
                        <td key={id} className="px-6 py-4 whitespace-nowrap text-center">
                          {provider.hourlyRate}
                        </td>
                      ) : null;
                    })}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Experience</td>
                    {selectedProviders.map((id) => {
                      const provider = providers.find(p => p.id === id);
                      return provider ? (
                        <td key={id} className="px-6 py-4 whitespace-nowrap text-center">
                          {provider.experience} years
                        </td>
                      ) : null;
                    })}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Response Time</td>
                    {selectedProviders.map((id) => {
                      const provider = providers.find(p => p.id === id);
                      return provider ? (
                        <td key={id} className="px-6 py-4 whitespace-nowrap text-center">
                          {provider.responseTime}
                        </td>
                      ) : null;
                    })}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Completion Rate</td>
                    {selectedProviders.map((id) => {
                      const provider = providers.find(p => p.id === id);
                      return provider ? (
                        <td key={id} className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 max-w-[100px]">
                              <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{ width: `${provider.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{provider.completionRate}%</span>
                          </div>
                        </td>
                      ) : null;
                    })}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Skills</td>
                    {selectedProviders.map((id) => {
                      const provider = providers.find(p => p.id === id);
                      return provider ? (
                        <td key={id} className="px-6 py-4">
                          <div className="flex flex-wrap justify-center gap-1">
                            {provider.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                      ) : null;
                    })}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">AI Recommendation</td>
                    {selectedProviders.map((id) => {
                      const provider = providers.find(p => p.id === id);
                      if (!provider) return null;
                      
                      // Simulate AI recommendation based on provider data
                      let recommendation = '';
                      let recommendationClass = '';
                      
                      if (provider.rating >= 4.8 && provider.completionRate >= 97) {
                        recommendation = 'Highly Recommended';
                        recommendationClass = 'bg-green-100 text-green-800';
                      } else if (provider.rating >= 4.5 && provider.completionRate >= 90) {
                        recommendation = 'Recommended';
                        recommendationClass = 'bg-blue-100 text-blue-800';
                      } else {
                        recommendation = 'Good Option';
                        recommendationClass = 'bg-yellow-100 text-yellow-800';
                      }
                      
                      return (
                        <td key={id} className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 rounded-full text-sm ${recommendationClass}`}>
                            {recommendation}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Contact</td>
                    {selectedProviders.map((id) => {
                      const provider = providers.find(p => p.id === id);
                      return provider ? (
                        <td key={id} className="px-6 py-4 whitespace-nowrap text-center">
                          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
                            Contact
                          </button>
                        </td>
                      ) : null;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            Please select at least one provider to compare
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
