"use client";
"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaStar, 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart,
  FaSpinner
} from 'react-icons/fa';
import Header from '../../app/components/layout/Header';
import Footer from '../../app/components/layout/Footer';

// Define types for the catalog page
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

// AI-enhanced Catalog Page for Emilist
const CatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [personalRecommendations, setPersonalRecommendations] = useState<Product[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  
  // Fetch catalog data on component mount
  useEffect(() => {
    const fetchCatalogData = async () => {
      setLoading(true);
      try {
        // In production, these would be actual API calls
        // Using mock data for demonstration
        
        // Mock products data
        const mockProducts: Product[] = [
          { id: 1, name: 'Premium Hardwood Flooring', category: 'Flooring', price: 5.99, unit: 'sq ft', rating: 4.8, reviews: 124, image: '/assets/images/people/worker1.jpg', description: 'High-quality oak hardwood flooring with natural finish.', stock: 745 },
          { id: 2, name: 'Ceramic Bathroom Tiles', category: 'Tiles', price: 2.49, unit: 'sq ft', rating: 4.5, reviews: 89, image: '/assets/images/people/worker2.jpg', description: 'Water-resistant ceramic tiles, perfect for bathrooms and kitchens.', stock: 1200 },
          { id: 3, name: 'Interior Latex Paint', category: 'Paint', price: 28.99, unit: 'gallon', rating: 4.7, reviews: 215, image: '/assets/images/people/worker3.jpg', description: 'Low-VOC interior paint with excellent coverage and washability.', stock: 68 },
          { id: 4, name: 'PEX Plumbing Pipe', category: 'Plumbing', price: 0.89, unit: 'ft', rating: 4.9, reviews: 76, image: '/assets/images/people/worker4.jpg', description: 'Flexible, durable PEX piping for water supply lines.', stock: 3500 },
          { id: 5, name: 'LED Recessed Lighting Kit', category: 'Electrical', price: 24.95, unit: 'each', rating: 4.6, reviews: 112, image: '/assets/images/people/worker5.jpg', description: 'Energy-efficient LED lighting with dimmer compatibility.', stock: 42 },
          { id: 6, name: 'Granite Countertop', category: 'Countertops', price: 45.99, unit: 'sq ft', rating: 4.8, reviews: 67, image: '/assets/images/people/worker6.jpg', description: 'Natural granite countertop with sealed finish, stain-resistant.', stock: 23 },
          { id: 7, name: 'Exterior Wood Stain', category: 'Paint', price: 32.99, unit: 'gallon', rating: 4.3, reviews: 92, image: '/assets/images/people/worker1.jpg', description: 'Weather-resistant wood stain for decks and outdoor furniture.', stock: 55 },
          { id: 8, name: 'Bathroom Vanity Cabinet', category: 'Cabinets', price: 249.99, unit: 'each', rating: 4.7, reviews: 43, image: '/assets/images/people/worker2.jpg', description: 'Pre-assembled bathroom vanity with soft-close doors and drawers.', stock: 12 },
          { id: 9, name: 'Kitchen Faucet - Stainless', category: 'Plumbing', price: 119.95, unit: 'each', rating: 4.5, reviews: 138, image: '/assets/images/people/worker3.jpg', description: 'Pull-down kitchen faucet with spot-resistant stainless finish.', stock: 31 },
          { id: 10, name: 'Wall Insulation Panels', category: 'Insulation', price: 39.99, unit: 'pack', rating: 4.8, reviews: 57, image: '/assets/images/people/worker4.jpg', description: 'High R-value insulation panels for improved energy efficiency.', stock: 86 },
          { id: 11, name: 'Power Drill - Cordless', category: 'Tools', price: 129.99, unit: 'each', rating: 4.9, reviews: 245, image: '/assets/images/people/worker5.jpg', description: '20V cordless drill with lithium battery and accessory kit.', stock: 19 },
          { id: 12, name: 'Composite Decking', category: 'Decking', price: 7.49, unit: 'sq ft', rating: 4.6, reviews: 72, image: '/assets/images/people/worker6.jpg', description: 'Low-maintenance composite decking resistant to rot and insects.', stock: 340 },
        ];
        
        // Extract unique categories
        const uniqueCategories = [...new Set(mockProducts.map(product => product.category))];
        
        // Simulate AI-powered recommendations
        const mockRecommendations: Product[] = [
          { id: 5, name: 'LED Recessed Lighting Kit', category: 'Electrical', price: 24.95, unit: 'each', rating: 4.6, reviews: 112, image: '/assets/images/people/worker5.jpg', description: 'Energy-efficient LED lighting with dimmer compatibility.', stock: 42 },
          { id: 9, name: 'Kitchen Faucet - Stainless', category: 'Plumbing', price: 119.95, unit: 'each', rating: 4.5, reviews: 138, image: '/assets/images/people/worker3.jpg', description: 'Pull-down kitchen faucet with spot-resistant stainless finish.', stock: 31 },
          { id: 2, name: 'Ceramic Bathroom Tiles', category: 'Tiles', price: 2.49, unit: 'sq ft', rating: 4.5, reviews: 89, image: '/assets/images/people/worker2.jpg', description: 'Water-resistant ceramic tiles, perfect for bathrooms and kitchens.', stock: 1200 },
        ];
        
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setCategories(['all', ...uniqueCategories]);
        setPersonalRecommendations(mockRecommendations);
      } catch (error) {
        console.error('Error fetching catalog data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCatalogData();
  }, []);
  
  // Handle search and filtering
  useEffect(() => {
    let result = [...products];
    
    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sortBy]);
  
  // Handle AI-powered search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // In a production environment, this would use your AI search functionality
    // For now, the filtering is handled in the useEffect above
    
    try {
      // Simulate AI-powered search enhancement
      // This would call your Groq integration endpoint
      console.log(`Searching for: ${searchQuery}`);
      
      // The results are already filtered in the useEffect
    } catch (error) {
      console.error('Search error:', error);
    }
  };
  
  // Toggle product as favorite
  const toggleFavorite = (productId: number) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };
  
  // Add product to cart
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  // Change sort method
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Catalog</h1>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full"
              >
                <FaSearch />
              </button>
            </div>
          </form>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <FaFilter className="text-gray-500 mr-2" />
              <label className="text-gray-700 mr-2">Category:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border border-gray-200 px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="text-gray-700 mr-2">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={handleSortChange}
                className="rounded-md border border-gray-200 px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* AI Recommendations Section */}
        {showRecommendations && personalRecommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
              <button 
                className="text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowRecommendations(false)}
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personalRecommendations.map(product => (
                <div className="bg-gray-50 rounded-lg p-4 relative" key={`rec-${product.id}`}>
                  <button 
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    {favorites.includes(product.id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                  </button>
                  <div className="mb-3">
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{product.category}</p>
                    <div className="flex items-center mb-2">
                      <FaStar className="text-yellow-400 mr-1" /> 
                      <span className="text-sm text-gray-700">{product.rating} ({product.reviews} reviews)</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-3">${product.price.toFixed(2)} per {product.unit}</p>
                    <button 
                      className="w-full bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 flex items-center justify-center"
                      onClick={() => addToCart(product)}
                    >
                      <FaShoppingCart className="mr-2" /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Main Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <FaSpinner className="animate-spin text-3xl text-primary mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600 mb-2">No products match your search criteria.</p>
              <p className="text-gray-600">Try different keywords or filters.</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden" key={product.id}>
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  <button 
                    className="absolute top-2 right-2 text-white hover:text-red-500"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    {favorites.includes(product.id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{product.category}</p>
                  <div className="flex items-center mb-2">
                    <FaStar className="text-yellow-400 mr-1" /> 
                    <span className="text-sm text-gray-700">{product.rating} ({product.reviews} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{product.description}</p>
                  <p className="text-base font-medium text-gray-900 mb-1">${product.price.toFixed(2)} per {product.unit}</p>
                  <p className="text-sm mb-3">
                    {product.stock > 50 ? (
                      <span className="text-green-600">In Stock</span>
                    ) : product.stock > 0 ? (
                      <span className="text-orange-500">Only {product.stock} left</span>
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </p>
                  <button 
                    className={`w-full px-4 py-2 rounded-md text-sm flex items-center justify-center ${
                      product.stock === 0 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-primary text-white hover:bg-opacity-90'
                    }`}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Cart summary widget */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-md p-4 z-10">
            <div className="flex items-center mb-2">
              <FaShoppingCart className="text-primary mr-2" />
              <span className="font-medium">{cart.reduce((total, item) => total + item.quantity, 0)} items</span>
            </div>
            <div className="text-lg font-bold text-gray-900 mb-3">
              ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
            </div>
            <button className="w-full bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90">
              View Cart
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CatalogPage;
