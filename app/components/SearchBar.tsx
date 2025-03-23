"use client";

import React, { useState, useCallback, useEffect } from 'react';
import VoiceSearch, { SUPPORTED_LANGUAGES } from './VoiceSearch';
import LanguageSelector from './LanguageSelector';
import searchService from '../services/search-service';

interface SearchResult {
  query: string;
  searchParams: any;
  response: string;
  results: {
    serviceProviders: any[];
    materials: any[];
    jobs: any[];
  };
  totalResults: number;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Handle language change
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
  }, []);
  
  // Handle transcript from voice search
  const handleTranscript = useCallback((text: string) => {
    setQuery(text);
    // Auto-submit search when using voice input
    if (text.trim()) {
      handleSearch(text);
    }
  }, []);
  
  // Handle language detection from voice search
  const handleLanguageDetected = useCallback((detectedLanguage: string) => {
    setLanguage(detectedLanguage);
  }, []);
  
  // Handle search
  const handleSearch = useCallback(async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      // Extract language code from the full language string
      const languageCode = language.split('-')[0] || 'en';
      
      // Call the search service
      const results = await searchService.universalSearch(searchQuery, languageCode);
      setSearchResults(results);
      
      // Emit a custom event for other components to listen to
      const searchEvent = new CustomEvent('emilist:search', { 
        detail: { results, query: searchQuery, language } 
      });
      window.dispatchEvent(searchEvent);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [query, language]);
  
  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };
  
  // Display search results
  useEffect(() => {
    if (searchResults) {
      console.log('Search results:', searchResults);
      // In a real implementation, you would update the UI with the search results
      // For now, we'll just log them to the console
    }
  }, [searchResults]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI anything..."
          className="w-full px-5 py-3 pr-20 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent shadow-sm text-sm"
        />
        
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
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full w-8 h-8 flex items-center justify-center shadow-sm ${isSearching ? 'animate-pulse' : ''}`}
          aria-label="Search"
          disabled={isSearching}
        >
          <img 
            src="/assets/icons/search-icon.svg" 
            alt="Search" 
            className="w-4 h-4"
          />
        </button>
      </form>
      
      {/* Error message */}
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {/* Search results preview (in a real implementation, this would be more elaborate) */}
      {searchResults && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
          <p className="text-sm text-gray-600 mt-1">{searchResults.response}</p>
          
          <div className="mt-3 text-xs text-gray-500">
            Found {searchResults.totalResults} results across {Object.keys(searchResults.results).filter(key => 
              searchResults.results[key as keyof typeof searchResults.results].length > 0
            ).length} categories
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
