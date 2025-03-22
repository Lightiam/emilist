"use client";
"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaMicrophone, 
  FaShoppingCart, 
  FaSpinner 
} from 'react-icons/fa';
import Header from '../../app/components/layout/Header';
import Footer from '../../app/components/layout/Footer';

// Define types for the materials page
interface Material {
  id: number | string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating?: number;
  description?: string;
  estimatedQuantity?: string;
}

interface CartItem extends Material {
  quantity: number;
}

interface RecommendedMaterial {
  name: string;
  description: string;
  estimatedQuantity: string;
}

// AI-powered Materials Page for Emilist
const BuyMaterialsPage = () => {
  const [projectDescription, setProjectDescription] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedMaterial[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // Fetch popular materials on page load
  useEffect(() => {
    const fetchPopularMaterials = async () => {
      try {
        // In production, this would be an actual API call
        // For now, using mock data
        setMaterials([
          { id: 1, name: 'Lumber - 2x4 Pine', price: 5.98, category: 'Wood', image: '/assets/images/people/worker1.jpg', rating: 4.5 },
          { id: 2, name: 'Drywall Sheet - 4x8', price: 12.98, category: 'Construction', image: '/assets/images/people/worker2.jpg', rating: 4.2 },
          { id: 3, name: 'PVC Pipe - 10ft', price: 7.49, category: 'Plumbing', image: '/assets/images/people/worker3.jpg', rating: 4.7 },
          { id: 4, name: 'Electrical Wire - 14 AWG', price: 32.99, category: 'Electrical', image: '/assets/images/people/worker4.jpg', rating: 4.8 },
          { id: 5, name: 'Tile Adhesive - 1 Gallon', price: 18.97, category: 'Flooring', image: '/assets/images/people/worker5.jpg', rating: 4.3 },
          { id: 6, name: 'Paint - Interior Eggshell', price: 24.98, category: 'Paint', image: '/assets/images/people/worker6.jpg', rating: 4.6 }
        ]);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchPopularMaterials();
  }, []);

  // Get AI recommendations based on project description
  const getRecommendations = async () => {
    if (!projectDescription.trim()) return;
    
    setIsLoading(true);
    
    try {
      // In production this would be an actual API call to your Groq integration
      // Simulating for now
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock recommendations based on project description
      const mockRecommendations = [
        {
          name: 'Ceramic Floor Tiles',
          description: 'Water-resistant ceramic tiles ideal for bathroom flooring.',
          estimatedQuantity: '40-50 sq ft'
        },
        {
          name: 'Tile Adhesive',
          description: 'Premium adhesive for ceramic and porcelain tiles.',
          estimatedQuantity: '2 gallons'
        },
        {
          name: 'Tile Grout',
          description: 'Waterproof grout for bathroom applications.',
          estimatedQuantity: '10 lbs'
        },
        {
          name: 'PVC Drain Pipe',
          description: 'Standard bathroom drain pipe for sink and shower.',
          estimatedQuantity: '15 ft'
        },
        {
          name: 'Bathroom Vanity Sink',
          description: 'Modern ceramic sink for bathroom renovation.',
          estimatedQuantity: '1 unit'
        }
      ];
      
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start voice recording for input
  const startRecording = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        setAudioChunks([]);

        recorder.ondataavailable = e => {
          if (e.data.size > 0) {
            setAudioChunks(prev => [...prev, e.data]);
          }
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          processAudioInput(audioBlob);
        };

        recorder.start();
        setIsRecording(true);
      } else {
        console.error('Media devices not available in this browser');
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Process audio input with speech-to-text
  const processAudioInput = async (audioBlob: Blob) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      // In production, this would call your speech-to-text endpoint
      // For now, simulating a response
      setTimeout(() => {
        setProjectDescription('I need materials for a bathroom renovation, including new tile flooring and plumbing fixtures');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error processing speech:', error);
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = (item: Material) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buy Materials</h1>
        <p className="text-lg text-gray-600 mb-6">
          Find the right materials for your project with AI-powered recommendations.
        </p>
        
        {/* AI-Powered Search and Input */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Describe your project (e.g., bathroom renovation, deck building)..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-4 py-3 pr-24 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
            />
            
            <button 
              className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={isRecording ? stopRecording : startRecording}
              title="Describe with voice"
            >
              <FaMicrophone />
            </button>
            
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full"
              onClick={getRecommendations}
              disabled={isLoading || !projectDescription.trim()}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
            </button>
          </div>
        </div>
        
        {/* AI Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Materials for Your Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((material, index) => (
                <div className="bg-gray-50 rounded-lg p-4" key={`rec-${index}`}>
                  <div className="mb-3">
                    <img src={`/assets/images/people/worker${(index % 6) + 1}.jpg`} alt={material.name} className="w-full h-40 object-cover rounded-md" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{material.name}</h3>
                    <p className="text-sm text-gray-700 mb-2">{material.description}</p>
                    <p className="text-sm font-medium text-primary mb-3">Est. Quantity: {material.estimatedQuantity}</p>
                    <button 
                      className="w-full bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 flex items-center justify-center"
                      onClick={() => addToCart({
                        id: `rec-${index}`,
                        name: material.name,
                        price: 19.99, // Sample price
                        image: `/assets/images/people/worker${(index % 6) + 1}.jpg`,
                        category: 'Recommended'
                      })}
                    >
                      <FaShoppingCart className="mr-2" /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Popular Materials Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map(material => (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden" key={material.id}>
                <div className="mb-3">
                  <img src={material.image} alt={material.name} className="w-full h-40 object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{material.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{material.category}</p>
                  <div className="flex mb-2">
                    {material.rating && [...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(material.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                    {material.rating && (
                      <span className="text-sm text-gray-700 ml-1">{material.rating}</span>
                    )}
                  </div>
                  <p className="text-base font-medium text-gray-900 mb-3">${material.price.toFixed(2)}</p>
                  <button 
                    className="w-full bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 flex items-center justify-center"
                    onClick={() => addToCart(material)}
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Shopping Cart Summary */}
        {cart.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Cart Summary ({cart.reduce((total, item) => total + item.quantity, 0)} items)
            </h2>
            <ul className="divide-y divide-gray-200 mb-6">
              {cart.map(item => (
                <li key={item.id} className="py-4 flex items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                  <div className="flex-grow">
                    <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="text-base font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-xl font-bold text-gray-900 mb-4 md:mb-0">
                Total: ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
              </p>
              <button className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BuyMaterialsPage;
