"use client";

import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface Service {
  id: number;
  title: string;
  category: string;
  provider: string;
  rating: number;
  reviews: number;
  price: string;
  description: string;
  image: string;
  features: string[];
}

export default function Catalog() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      title: "Complete Kitchen Renovation",
      category: "Renovation",
      provider: "Modern Kitchens Inc.",
      rating: 4.8,
      reviews: 124,
      price: "$15,000 - $25,000",
      description: "Full kitchen renovation including cabinets, countertops, appliances, and flooring. Our team handles everything from design to installation.",
      image: "/assets/images/kitchen-renovation.jpg",
      features: ["Custom cabinet design", "Premium countertop options", "Appliance installation", "Plumbing and electrical work", "Project management"]
    },
    {
      id: 2,
      title: "Bathroom Remodeling",
      category: "Renovation",
      provider: "Luxury Bathrooms LLC",
      rating: 4.9,
      reviews: 87,
      price: "$8,000 - $15,000",
      description: "Transform your bathroom with our complete remodeling service. Includes new fixtures, tile work, vanities, and lighting.",
      image: "/assets/images/bathroom-remodel.jpg",
      features: ["Custom shower design", "Tile installation", "Vanity selection and installation", "Lighting upgrades", "Water-efficient fixtures"]
    },
    {
      id: 3,
      title: "Electrical System Upgrade",
      category: "Electrical",
      provider: "PowerUp Electrical",
      rating: 4.7,
      reviews: 56,
      price: "$2,500 - $5,000",
      description: "Comprehensive electrical system upgrade for older homes. Bring your home up to code and improve safety and efficiency.",
      image: "/assets/images/electrical-upgrade.jpg",
      features: ["Panel replacement", "Rewiring", "GFCI installation", "Surge protection", "Safety inspection"]
    },
    {
      id: 4,
      title: "Interior Painting",
      category: "Painting",
      provider: "Perfect Finish Painters",
      rating: 4.6,
      reviews: 92,
      price: "$1,800 - $3,500",
      description: "Professional interior painting service for your entire home. We use premium paints and provide meticulous preparation and cleanup.",
      image: "/assets/images/interior-painting.jpg",
      features: ["Color consultation", "Surface preparation", "Premium paint options", "Trim and detail work", "Cleanup and touch-ups"]
    },
    {
      id: 5,
      title: "Hardwood Floor Installation",
      category: "Flooring",
      provider: "Classic Hardwoods",
      rating: 4.8,
      reviews: 73,
      price: "$6 - $12 per sq ft",
      description: "Professional hardwood floor installation with a variety of wood species and finish options. Includes removal of existing flooring.",
      image: "/assets/images/hardwood-floor.jpg",
      features: ["Wood species selection", "Finish options", "Subfloor preparation", "Removal of existing flooring", "Baseboard installation"]
    },
    {
      id: 6,
      title: "Roof Replacement",
      category: "Roofing",
      provider: "Reliable Roofing Co.",
      rating: 4.7,
      reviews: 118,
      price: "$8,000 - $15,000",
      description: "Complete roof replacement with high-quality materials and expert installation. Includes removal of old roofing and debris cleanup.",
      image: "/assets/images/roof-replacement.jpg",
      features: ["Material selection", "Old roof removal", "Underlayment installation", "Flashing and ventilation", "Warranty options"]
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [sortBy, setSortBy] = useState('recommended');
  
  const categories = ['All', 'Renovation', 'Electrical', 'Plumbing', 'Painting', 'Flooring', 'Roofing', 'Landscaping'];
  
  const filteredServices = services.filter(service => {
    // Filter by search query
    if (searchQuery && !service.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !service.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !service.provider.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'All' && service.category !== selectedCategory) {
      return false;
    }
    
    // Filter by price range (approximate since price is a string)
    const estimatedPrice = parseInt(service.price.replace(/[^0-9]/g, '')) || 0;
    if (estimatedPrice < priceRange[0] || estimatedPrice > priceRange[1]) {
      return false;
    }
    
    return true;
  });
  
  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (parseInt(a.price.replace(/[^0-9]/g, '')) || 0) - (parseInt(b.price.replace(/[^0-9]/g, '')) || 0);
      case 'price-high':
        return (parseInt(b.price.replace(/[^0-9]/g, '')) || 0) - (parseInt(a.price.replace(/[^0-9]/g, '')) || 0);
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviews - a.reviews;
      default: // recommended
        return (b.rating * 0.7 + b.reviews * 0.3) - (a.rating * 0.7 + a.reviews * 0.3);
    }
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };
  
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value);
    const newRange = [...priceRange] as [number, number];
    newRange[index] = newValue;
    setPriceRange(newRange);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  
  const formatPrice = (price: string) => {
    return price;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Service Catalog</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              
              <div className="mb-4">
                <label htmlFor="search" className="block text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <button
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedCategory === category
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="min-price" className="block text-sm text-gray-600">
                      Min Price: ${priceRange[0].toLocaleString()}
                    </label>
                    <input
                      type="range"
                      id="min-price"
                      min="0"
                      max="30000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(e, 0)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-price" className="block text-sm text-gray-600">
                      Max Price: ${priceRange[1].toLocaleString()}
                    </label>
                    <input
                      type="range"
                      id="max-price"
                      min="0"
                      max="30000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(e, 1)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Sort By</h3>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>
              
              <button className="w-full mt-4 bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors">
                Apply Filters
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
              <div className="bg-gray-100 rounded-md p-3">
                <p className="text-sm text-gray-700 mb-2">
                  Get personalized service recommendations based on your project needs.
                </p>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  rows={3}
                  placeholder="Describe your project..."
                ></textarea>
                <button className="w-full mt-2 bg-primary text-white py-1.5 rounded-md hover:bg-primary-dark transition-colors text-sm">
                  Get AI Recommendations
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content - Service Listings */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Showing <span className="font-medium">{sortedServices.length}</span> services
                </p>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">View:</span>
                  <button className="p-1 bg-primary text-white rounded mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button className="p-1 bg-gray-200 text-gray-700 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {sortedServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedServices.map((service) => (
                  <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium">
                        {service.category}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-1">{service.title}</h3>
                      <p className="text-gray-600 mb-2">by {service.provider}</p>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(service.rating) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-600">
                          {service.rating} ({service.reviews} reviews)
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3 line-clamp-2">{service.description}</p>
                      
                      <div className="mb-3">
                        <h4 className="font-medium mb-1">Features:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          {service.features.slice(0, 3).map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                          {service.features.length > 3 && (
                            <li className="text-primary cursor-pointer">
                              +{service.features.length - 3} more
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(service.price)}
                        </div>
                        <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">No services found matching your criteria</p>
                <button
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setPriceRange([0, 30000]);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
