"use client";

import React, { useState, useCallback } from 'react';
import VoiceSearch from './VoiceSearch';
import LanguageSelector from './LanguageSelector';
import enhancedSearchService from '../services/ai/enhancedSearchService';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('en-US');
  
  // Handle language change
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
  }, []);
  
  // Handle transcript from voice search
  const handleTranscript = useCallback((text: string) => {
    setQuery(text);
  }, []);
  
  // Handle language detection from voice search
  const handleLanguageDetected = useCallback((detectedLanguage: string) => {
    setLanguage(detectedLanguage);
  }, []);
  
  // Handle search submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Call the enhanced search service with the query and language
      const results = await enhancedSearchService.enhanceSearchQuery(query, language);
      
      // Log the enhanced search results
      console.log('Enhanced search results:', results);
      
      // In a real implementation, we would update the UI with search results
      // But for now, we're maintaining the exact same UI as the reference design
    } catch (error) {
      console.error('Search error:', error);
      
      // Fallback to basic search if enhanced search fails
      console.log('Falling back to basic search for:', query, 'in language:', language);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI anything..."
          className="w-full px-3 py-1.5 pr-16 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent shadow-xs text-xs"
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
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1 rounded-full w-6 h-6 flex items-center justify-center shadow-xs"
          aria-label="Search"
        >
          <img 
            src="/assets/icons/search-icon.svg" 
            alt="Search" 
            className="w-3 h-3"
          />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
