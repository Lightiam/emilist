"use client";

import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface Material {
  id: number;
  name: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  price: number;
  unit: string;
  description: string;
  image: string;
  inStock: boolean;
  deliveryTime: string;
  specifications: Record<string, string>;
}

export default function BuyMaterials() {
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 1,
      name: "Premium Hardwood Flooring",
      category: "Flooring",
      brand: "NaturalWood",
      rating: 4.8,
      reviews: 124,
      price: 8.99,
      unit: "sq ft",
      description: "Premium oak hardwood flooring with a natural finish. Durable and easy to maintain.",
      image: "/assets/images/hardwood-flooring.jpg",
      inStock: true,
      deliveryTime: "3-5 business days",
      specifications: {
        "Material": "Oak",
        "Thickness": "3/4 inch",
        "Width": "5 inches",
        "Length": "Random (1-7 feet)",
        "Finish": "Natural matte",
        "Installation": "Tongue and groove"
      }
    },
    {
      id: 2,
      name: "Ceramic Wall Tile",
      category: "Tile",
      brand: "TileMaster",
      rating: 4.6,
      reviews: 87,
      price: 3.49,
      unit: "sq ft",
      description: "White ceramic subway tile, perfect for kitchen backsplashes and bathroom walls.",
      image: "/assets/images/ceramic-tile.jpg",
      inStock: true,
      deliveryTime: "2-4 business days",
      specifications: {
        "Material": "Ceramic",
        "Color": "White",
        "Size": "3x6 inches",
        "Thickness": "5/16 inch",
        "Finish": "Glossy",
        "Water Resistance": "High"
      }
    },
    {
      id: 3,
      name: "Interior Paint",
      category: "Paint",
      brand: "ColorPro",
      rating: 4.7,
      reviews: 215,
      price: 42.99,
      unit: "gallon",
      description: "Premium interior paint with excellent coverage and low VOC. Eggshell finish.",
      image: "/assets/images/interior-paint.jpg",
      inStock: true,
      deliveryTime: "1-2 business days",
      specifications: {
        "Type": "Latex",
        "Finish": "Eggshell",
        "Coverage": "400 sq ft per gallon",
        "Dry Time": "1-2 hours",
        "VOC": "Low",
        "Base": "Water"
      }
    },
    {
      id: 4,
      name: "Granite Countertop",
      category: "Countertops",
      brand: "StoneCraft",
      rating: 4.9,
      reviews: 68,
      price: 59.99,
      unit: "sq ft",
      description: "Natural granite countertop slab. Elegant and durable for kitchen and bathroom applications.",
      image: "/assets/images/granite-countertop.jpg",
      inStock: false,
      deliveryTime: "10-14 business days",
      specifications: {
        "Material": "Natural Granite",
        "Color": "Baltic Brown",
        "Thickness": "3 cm",
        "Finish": "Polished",
        "Edge": "Straight (custom available)",
        "Sealing": "Required annually"
      }
    },
    {
      id: 5,
      name: "Vinyl Plank Flooring",
      category: "Flooring",
      brand: "FloorTech",
      rating: 4.5,
      reviews: 156,
      price: 3.99,
      unit: "sq ft",
      description: "Waterproof vinyl plank flooring with wood-look finish. Easy click-lock installation.",
      image: "/assets/images/vinyl-flooring.jpg",
      inStock: true,
      deliveryTime: "2-3 business days",
      specifications: {
        "Material": "Vinyl",
        "Thickness": "5mm",
        "Width": "7 inches",
        "Length": "48 inches",
        "Wear Layer": "20 mil",
        "Installation": "Click-lock"
      }
    },
    {
      id: 6,
      name: "Drywall Sheet",
      category: "Building Materials",
      brand: "WallPro",
      rating: 4.4,
      reviews: 92,
      price: 12.99,
      unit: "sheet",
      description: "Standard 4x8 drywall sheet for interior walls and ceilings.",
      image: "/assets/images/drywall.jpg",
      inStock: true,
      deliveryTime: "Same day pickup",
      specifications: {
        "Size": "4ft x 8ft",
        "Thickness": "1/2 inch",
        "Type": "Regular",
        "Edge": "Tapered",
        "Fire Rating": "Standard",
        "Weight": "52 lbs"
      }
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [projectDescription, setProjectDescription] = useState('');
  
  const categories = ['All', 'Flooring', 'Tile', 'Paint', 'Countertops', 'Building Materials', 'Plumbing', 'Electrical'];
  
  const filteredMaterials = materials.filter(material => {
    // Filter by search query
    if (searchQuery && !material.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !material.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !material.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'All' && material.category !== selectedCategory) {
      return false;
    }
    
    // Filter by price range
    if (material.price < priceRange[0] || material.price > priceRange[1]) {
      return false;
    }
    
    return true;
  });
  
  // Sort materials
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
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
  
  const handleMaterialClick = (material: Material) => {
    setSelectedMaterial(material);
  };
  
  const handleCloseModal = () => {
    setSelectedMaterial(null);
  };
  
  const handleGetAIRecommendations = () => {
    if (!projectDescription.trim()) return;
    
    setShowAIRecommendations(true);
    // In a real implementation, this would call the AI service
    // For now, we'll just show the UI
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Buy Construction Materials</h1>
        
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
                  placeholder="Search materials..."
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
                <h3 className="font-medium mb-2">Price Range (per unit)</h3>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="min-price" className="block text-sm text-gray-600">
                      Min Price: ${priceRange[0].toLocaleString()}
                    </label>
                    <input
                      type="range"
                      id="min-price"
                      min="0"
                      max="100"
                      step="5"
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
                      max="100"
                      step="5"
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
              <h2 className="text-xl font-semibold mb-4">AI Material Recommendations</h2>
              <div className="bg-gray-100 rounded-md p-3">
                <p className="text-sm text-gray-700 mb-2">
                  Describe your project and get AI-recommended materials tailored to your needs.
                </p>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  rows={3}
                  placeholder="Describe your project (e.g., 'I'm renovating a 200 sq ft kitchen with modern style')"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                ></textarea>
                <button 
                  className="w-full mt-2 bg-primary text-white py-1.5 rounded-md hover:bg-primary-dark transition-colors text-sm"
                  onClick={handleGetAIRecommendations}
                >
                  Get AI Recommendations
                </button>
              </div>
              
              {showAIRecommendations && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-medium mb-2">AI Recommendations</h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 border-l-4 border-green-500 p-3">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-green-800">
                            <strong>Primary Recommendation:</strong> Based on your kitchen renovation, we recommend premium vinyl flooring for durability and water resistance.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-blue-800">
                            <strong>Alternative Option:</strong> For a higher-end look, consider our ceramic tile options which work well with modern kitchen designs.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-yellow-800">
                            <strong>Additional Suggestion:</strong> Don't forget to include waterproof underlayment for any flooring in kitchen areas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Main Content - Material Listings */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Showing <span className="font-medium">{sortedMaterials.length}</span> materials
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
            
            {sortedMaterials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedMaterials.map((material) => (
                  <div 
                    key={material.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleMaterialClick(material)}
                  >
                    <div className="relative h-48">
                      <img
                        src={material.image}
                        alt={material.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium">
                        {material.category}
                      </div>
                      {!material.inStock && (
                        <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-1">{material.name}</h3>
                      <p className="text-gray-600 mb-2">by {material.brand}</p>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(material.rating) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-600">
                          {material.rating} ({material.reviews} reviews)
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3 line-clamp-2">{material.description}</p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-lg font-bold text-primary">
                          ${material.price.toFixed(2)}/{material.unit}
                        </div>
                        <div className="text-sm text-gray-600">
                          {material.inStock ? `Delivery: ${material.deliveryTime}` : 'Currently Unavailable'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">No materials found matching your criteria</p>
                <button
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setPriceRange([0, 100]);
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
      
      {/* Material Detail Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedMaterial.name}</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCloseModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedMaterial.image}
                    alt={selectedMaterial.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(selectedMaterial.rating) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {selectedMaterial.rating} ({selectedMaterial.reviews} reviews)
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{selectedMaterial.description}</p>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Specifications:</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <table className="w-full text-sm">
                        <tbody>
                          {Object.entries(selectedMaterial.specifications).map(([key, value]) => (
                            <tr key={key} className="border-b border-gray-200 last:border-0">
                              <td className="py-2 font-medium">{key}</td>
                              <td className="py-2 text-gray-600">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-2xl font-bold text-primary mb-1">
                      ${selectedMaterial.price.toFixed(2)}/{selectedMaterial.unit}
                    </div>
                    <div className="text-gray-600 mb-4">
                      Brand: {selectedMaterial.brand}
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className={`w-3 h-3 rounded-full mr-2 ${selectedMaterial.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={selectedMaterial.inStock ? 'text-green-700' : 'text-red-700'}>
                          {selectedMaterial.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        {selectedMaterial.inStock ? `Delivery: ${selectedMaterial.deliveryTime}` : 'Currently Unavailable'}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="quantity" className="block text-gray-700 mb-1">
                        Quantity ({selectedMaterial.unit})
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          id="quantity"
                          min="1"
                          defaultValue="1"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button className="bg-gray-100 border border-gray-300 border-l-0 px-3 rounded-r-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      className={`w-full py-2 rounded-md mb-2 ${
                        selectedMaterial.inStock 
                          ? 'bg-primary text-white hover:bg-primary-dark' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!selectedMaterial.inStock}
                    >
                      Add to Cart
                    </button>
                    
                    <button className="w-full bg-white border border-primary text-primary py-2 rounded-md hover:bg-gray-50">
                      Save for Later
                    </button>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <h3 className="font-medium text-blue-800 mb-2">AI Material Analysis</h3>
                    <p className="text-sm text-blue-700 mb-2">
                      This {selectedMaterial.category.toLowerCase()} is ideal for {selectedMaterial.category === 'Flooring' ? 'high-traffic areas' : 'standard residential use'} with excellent durability ratings.
                    </p>
                    <p className="text-sm text-blue-700">
                      Based on your browsing history, this material is compatible with your recent project interests.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Frequently Bought Together:</h3>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 bg-gray-50 rounded-md">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Installation Kit (+$24.99)</span>
                      </div>
                      <div className="flex items-center p-2 bg-gray-50 rounded-md">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Maintenance Supplies (+$19.99)</span>
                      </div>
                      <div className="flex items-center p-2 bg-gray-50 rounded-md">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Professional Installation Service (Quote)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
