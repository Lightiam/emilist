"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import VoiceSearch from './VoiceSearch';
import LanguageSelector from './LanguageSelector';
import enhancedSearchService from '../services/ai/enhancedSearchService';
import geoLocationService from '../services/ai/geoLocationService';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [isSearching, setIsSearching] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle language change
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
  }, []);
  
  // Handle transcript from voice search
  const handleTranscript = useCallback((text: string) => {
    setQuery(text);
    
    // Auto-submit search when voice input contains "Hi Emi"
    if (text.toLowerCase().startsWith('hi emi')) {
      // Add a small delay to allow the UI to update before submitting
      setTimeout(() => {
        const event = new Event('submit') as unknown as React.FormEvent;
        handleSubmit(event);
      }, 300);
    }
  }, []);
  
  // Handle language detection from voice search
  const handleLanguageDetected = useCallback((detectedLanguage: string) => {
    setLanguage(detectedLanguage);
  }, []);
  
  // Detect user's language based on geolocation on component mount
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        const detectedLanguage = await geoLocationService.detectUserLanguage();
        if (detectedLanguage) {
          setLanguage(detectedLanguage);
          console.log('Language automatically set based on location:', detectedLanguage);
        }
      } catch (error) {
        console.error('Error detecting user language:', error);
      }
    };
    
    // Detect language on initial load
    detectLanguage();
  }, []);
  
  // Show hint when input is focused and empty
  const handleInputFocus = useCallback(() => {
    if (!query) {
      setShowHint(true);
    }
  }, [query]);
  
  // Hide hint when input is blurred
  const handleInputBlur = useCallback(() => {
    // Small delay to allow clicking on the hint
    setTimeout(() => {
      setShowHint(false);
    }, 200);
  }, []);
  
  // Insert "Hi Emi" prefix when hint is clicked
  const handleHintClick = useCallback(() => {
    setQuery('Hi Emi ');
    setShowHint(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Handle search submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchResults(null);
    
    try {
      // Automatically prefix with "Hi Emi" if not already present
      const processedQuery = query.toLowerCase().startsWith('hi emi') 
        ? query 
        : `Hi Emi ${query}`;
      
      if (processedQuery !== query) {
        setQuery(processedQuery);
      }
      
      // Call the enhanced search service with the query and language
      const results = await enhancedSearchService.enhanceSearchQuery(processedQuery, language);
      
      // Log the enhanced search results
      console.log('Enhanced search results:', results);
      
      // In a real implementation, we would update the UI with search results
      // For now, we'll just set mock results
      setSearchResults([
        { id: 1, title: 'Expert auto mechanics in Ikoyi Lagos', rating: 4.8 },
        { id: 2, title: 'Premium auto repair services', rating: 4.7 },
        { id: 3, title: 'Certified mechanics with 10+ years experience', rating: 4.9 }
      ]);
    } catch (error) {
      console.error('Search error:', error);
      
      // Fallback to basic search if enhanced search fails
      console.log('Falling back to basic search for:', query, 'in language:', language);
    } finally {
      setIsSearching(false);
    }
  }, [query, language]);
  
  // Clear search results when query changes
  useEffect(() => {
    if (searchResults) {
      setSearchResults(null);
    }
  }, [query]);
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Ask AI anything..."
          className="w-full px-4 py-2 pr-20 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-sm"
          aria-label="Search query"
        />
        
        {/* Voice command hint */}
        {showHint && !query && (
          <div 
            className="absolute top-full left-0 mt-1 bg-white p-2 rounded-md shadow-md text-xs text-gray-600 border border-gray-100 z-10 cursor-pointer hover:bg-gray-50"
            onClick={handleHintClick}
          >
            <span className="font-medium">Tip:</span> Try starting with "Hi Emi" followed by your request
          </div>
        )}
        
        {/* Language selector */}
        <div className="absolute bottom-full left-2 mb-1">
          <LanguageSelector 
            selectedLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        </div>
        
        {/* Voice search button */}
        <VoiceSearch 
          onTranscript={handleTranscript}
          onLanguageDetected={handleLanguageDetected}
          selectedLanguage={language}
        />
        
        {/* Search button */}
        <button 
          type="submit"
          disabled={isSearching || !query.trim()}
          className={`absolute right-1 top-1/2 transform -translate-y-1/2 ${
            !query.trim() ? 'bg-gray-300' : 'bg-primary hover:bg-primary-dark'
          } text-white p-2 rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-colors`}
          aria-label="Search"
        >
          {isSearching ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <img 
              src="/assets/icons/search-icon.svg" 
              alt="Search" 
              className="w-4 h-4"
            />
          )}
        </button>
      </form>
      
      {/* Search results */}
      {searchResults && (
        <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700">Results for "{query}"</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {searchResults.map(result => (
              <li key={result.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-800">{result.title}</span>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {result.rating}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
