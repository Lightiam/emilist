"use client";
"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaTrash, 
  FaShoppingCart, 
  FaStar, 
  FaCheck, 
  FaTimes, 
  FaSpinner 
} from 'react-icons/fa';
import Header from '../../app/components/layout/Header';
import Footer from '../../app/components/layout/Footer';

// Define types for the compare page
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
}

interface ComparisonEvaluation {
  productId: number;
  rating: number;
  note: string;
}

interface ComparisonRecommendation {
  productId: number;
  reason: string;
}

interface ComparisonData {
  summary: string;
  criteria: Record<string, ComparisonEvaluation[]>;
  recommendations: ComparisonRecommendation[];
}

interface ComparisonCriterion {
  id: string;
  name: string;
  selected: boolean;
}

// AI-enhanced Compare Products Page for Emilist
const ComparePage = () => {
  const [productsToCompare, setProductsToCompare] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isGeneratingComparison, setIsGeneratingComparison] = useState(false);
  const [comparisonCriteria, setComparisonCriteria] = useState<ComparisonCriterion[]>([
    { id: 'price', name: 'Price', selected: true },
    { id: 'quality', name: 'Quality', selected: true },
    { id: 'durability', name: 'Durability', selected: true },
    { id: 'installation', name: 'Ease of Installation', selected: true },
    { id: 'maintenance', name: 'Maintenance', selected: true },
    { id: 'warranty', name: 'Warranty', selected: false },
    { id: 'eco', name: 'Eco-Friendliness', selected: false },
    { id: 'appearance', name: 'Appearance', selected: false },
  ]);
  
  // Search for products to compare
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // In production, this would call your AI-enhanced search API
      // Simulating with mock data for demo purposes
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock search results
      const mockResults: Product[] = [
        { id: 1, name: 'Premium Hardwood Flooring', category: 'Flooring', price: 5.99, rating: 4.8, image: '/assets/images/people/worker1.jpg' },
        { id: 2, name: 'Luxury Vinyl Plank Flooring', category: 'Flooring', price: 3.99, rating: 4.6, image: '/assets/images/people/worker2.jpg' },
        { id: 3, name: 'Ceramic Tile Flooring', category: 'Flooring', price: 2.49, rating: 4.5, image: '/assets/images/people/worker3.jpg' },
        { id: 4, name: 'Laminate Flooring', category: 'Flooring', price: 1.99, rating: 4.2, image: '/assets/images/people/worker4.jpg' },
        { id: 5, name: 'Engineered Hardwood Flooring', category: 'Flooring', price: 4.79, rating: 4.7, image: '/assets/images/people/worker5.jpg' },
        { id: 6, name: 'Bamboo Flooring', category: 'Flooring', price: 4.29, rating: 4.4, image: '/assets/images/people/worker6.jpg' },
      ].filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Add product to comparison
  const addToComparison = (product: Product) => {
    if (productsToCompare.length >= 4) {
      alert('You can compare up to 4 products at a time.');
      return;
    }
    
    // Check if product is already in comparison
    if (productsToCompare.some(p => p.id === product.id)) {
      alert('This product is already in your comparison.');
      return;
    }
    
    setProductsToCompare([...productsToCompare, product]);
    setComparisonData(null); // Reset comparison data when products change
  };
  
  // Remove product from comparison
  const removeFromComparison = (productId: number) => {
    setProductsToCompare(productsToCompare.filter(p => p.id !== productId));
    setComparisonData(null); // Reset comparison data when products change
  };
  
  // Toggle comparison criteria
  const toggleCriterion = (criterionId: string) => {
    setComparisonCriteria(comparisonCriteria.map(criterion => 
      criterion.id === criterionId 
        ? { ...criterion, selected: !criterion.selected } 
        : criterion
    ));
    setComparisonData(null); // Reset comparison data when criteria change
  };
  
  // Generate AI-powered comparison
  const generateComparison = async () => {
    if (productsToCompare.length < 2) {
      alert('Please select at least 2 products to compare.');
      return;
    }
    
    setIsGeneratingComparison(true);
    
    try {
      // In production, this would call your Groq API endpoint
      // Simulating with mock data for demo purposes
      
      // Get selected criteria
      const selectedCriteria = comparisonCriteria
        .filter(criterion => criterion.selected)
        .map(criterion => criterion.name);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock comparison data generated by AI
      const mockComparisonData: ComparisonData = {
        summary: "Based on your selected criteria, Premium Hardwood Flooring offers the best quality and appearance but at a higher price point. Luxury Vinyl Plank provides excellent durability and water resistance at a mid-range price. Laminate Flooring is the most budget-friendly option but may not last as long as the others.",
        criteria: {
          'Price': [
            { productId: 1, rating: 2, note: "Most expensive option at $5.99/sq ft" },
            { productId: 2, rating: 3, note: "Mid-range price at $3.99/sq ft" },
            { productId: 3, rating: 4, note: "Affordable option at $2.49/sq ft" },
            { productId: 4, rating: 5, note: "Most budget-friendly at $1.99/sq ft" }
          ],
          'Quality': [
            { productId: 1, rating: 5, note: "Premium natural wood with excellent grain patterns" },
            { productId: 2, rating: 4, note: "High-quality synthetic material that mimics wood well" },
            { productId: 3, rating: 4, note: "Durable ceramic material with consistent quality" },
            { productId: 4, rating: 3, note: "Good quality for the price point" }
          ],
          'Durability': [
            { productId: 1, rating: 4, note: "Can last 25+ years with proper care, may dent or scratch" },
            { productId: 2, rating: 5, note: "Extremely durable, water-resistant, 15-20 year lifespan" },
            { productId: 3, rating: 5, note: "Very hard and durable, can last decades" },
            { productId: 4, rating: 3, note: "7-10 year typical lifespan, susceptible to moisture damage" }
          ],
          'Ease of Installation': [
            { productId: 1, rating: 2, note: "Requires professional installation in most cases" },
            { productId: 2, rating: 4, note: "DIY-friendly click-lock system" },
            { productId: 3, rating: 2, note: "Requires specialized tools and skills" },
            { productId: 4, rating: 5, note: "Very easy DIY installation with floating floor system" }
          ],
          'Maintenance': [
            { productId: 1, rating: 2, note: "Requires regular maintenance and refinishing every 7-10 years" },
            { productId: 2, rating: 5, note: "Very low maintenance, just sweep and occasional mopping" },
            { productId: 3, rating: 4, note: "Durable and easy to clean, grout requires occasional sealing" },
            { productId: 4, rating: 3, note: "Easy to clean but careful moisture management required" }
          ],
        },
        recommendations: [
          { productId: 2, reason: "Best overall value considering durability, price, and maintenance" },
          { productId: 1, reason: "Best option if quality and natural materials are your priority" },
          { productId: 3, reason: "Best for high-moisture areas like bathrooms" },
          { productId: 4, reason: "Best budget option for short to medium-term use" }
        ]
      };
      
      setComparisonData(mockComparisonData);
    } catch (error) {
      console.error('Comparison error:', error);
      alert('Failed to generate comparison. Please try again.');
    } finally {
      setIsGeneratingComparison(false);
    }
  };
  
  // Add product to cart
  const addToCart = (productId: number) => {
    // In production, this would call your cart API
    alert(`Product ${productId} added to cart.`);
  };
  
  // Render functions
  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <FaSpinner className="animate-spin text-2xl text-primary mb-2" />
          <p className="text-gray-600">Searching products...</p>
        </div>
      );
    }
    
    if (searchResults.length === 0 && searchQuery.trim() !== '') {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found matching "{searchQuery}"</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {searchResults.map(product => (
          <div className="bg-white rounded-lg shadow-sm p-4 flex" key={product.id}>
            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
            <div className="flex-grow">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <div className="flex items-center mt-1">
                <FaStar className="text-yellow-400 mr-1" /> 
                <span className="text-sm text-gray-700">{product.rating}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mt-1">${product.price.toFixed(2)}/sq ft</p>
            </div>
            <button 
              className={`self-center ml-2 px-3 py-2 rounded-md text-xs font-medium ${
                productsToCompare.some(p => p.id === product.id)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-opacity-90'
              }`}
              onClick={() => addToComparison(product)}
              disabled={productsToCompare.some(p => p.id === product.id)}
            >
              <FaPlus className="inline-block mr-1" /> Compare
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  const renderComparisonTable = () => {
    if (!comparisonData) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">AI Analysis</h3>
          <p className="text-gray-700">{comparisonData.summary}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 bg-gray-50 font-medium text-gray-700">Criteria</th>
                {productsToCompare.map(product => (
                  <th key={product.id} className="py-3 px-4 bg-gray-50">
                    <div className="flex items-center">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-full object-cover mr-2" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                        <p className="text-xs text-gray-600">${product.price.toFixed(2)}/sq ft</p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(comparisonData.criteria).map(([criterionName, evaluations]) => (
                <tr key={criterionName} className="border-t border-gray-200">
                  <td className="py-4 px-4 font-medium text-gray-700">{criterionName}</td>
                  {productsToCompare.map(product => {
                    const evaluation = evaluations.find(item => item.productId === product.id);
                    return (
                      <td key={`${criterionName}-${product.id}`} className="py-4 px-4">
                        <div className="flex mb-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span 
                              key={star} 
                              className={`text-lg ${star <= (evaluation?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{evaluation?.note}</p>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">AI Recommendations</h3>
          <ul className="space-y-4">
            {comparisonData.recommendations.map((rec, index) => {
              const product = productsToCompare.find(p => p.id === rec.productId);
              return product ? (
                <li key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-md">
                  <div>
                    <strong className="text-gray-900">{product.name}:</strong> {rec.reason}
                  </div>
                  <button 
                    className="bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-opacity-90 flex items-center"
                    onClick={() => addToCart(product.id)}
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Products</h1>
        <p className="text-lg text-gray-600 mb-6">
          Use our AI-powered comparison tool to find the best products for your needs.
        </p>
        
        {/* Search Bar */}
        <div className="w-full max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products to compare..."
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full"
              disabled={isSearching}
            >
              {isSearching ? <FaSpinner className="animate-spin" /> : <FaSearch />}
            </button>
          </form>
        </div>
        
        {/* Search Results */}
        {renderSearchResults()}
        
        {/* Products to Compare */}
        {productsToCompare.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Selected Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {productsToCompare.map(product => (
                <div className="bg-white rounded-lg shadow-sm p-4 relative" key={product.id}>
                  <button 
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    onClick={() => removeFromComparison(product.id)}
                  >
                    <FaTrash />
                  </button>
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-md mb-3" />
                  <h3 className="text-base font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm font-medium text-primary">${product.price.toFixed(2)}/sq ft</p>
                </div>
              ))}
              {[...Array(4 - productsToCompare.length)].map((_, index) => (
                <div 
                  className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-4 flex items-center justify-center" 
                  key={`empty-${index}`}
                >
                  <div className="text-gray-400 text-center">Add product</div>
                </div>
              ))}
            </div>
            
            {/* Comparison Criteria */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Comparison Criteria</h3>
              <div className="flex flex-wrap gap-3">
                {comparisonCriteria.map(criterion => (
                  <div 
                    className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium ${
                      criterion.selected 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    key={criterion.id}
                    onClick={() => toggleCriterion(criterion.id)}
                  >
                    {criterion.selected && <FaCheck className="inline-block mr-1" />}
                    {criterion.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Generate Comparison Button */}
            <button 
              className="mt-8 bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 flex items-center justify-center w-full md:w-auto"
              onClick={generateComparison}
              disabled={isGeneratingComparison || productsToCompare.length < 2}
            >
              {isGeneratingComparison ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Generating AI Comparison...
                </>
              ) : (
                'Generate AI-Powered Comparison'
              )}
            </button>
          </div>
        )}
        
        {/* Comparison Results */}
        {renderComparisonTable()}
      </main>
      <Footer />
    </div>
  );
};

export default ComparePage;
