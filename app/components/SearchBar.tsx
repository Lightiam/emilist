"use client";

import React, { useState, useCallback } from 'react';
import VoiceSearch from './VoiceSearch';
import LanguageSelector from './LanguageSelector';

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', query, 'in language:', language);
  };
  
  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI anything..."
          className="w-full px-5 py-3 pr-24 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
        />
        
        {/* Language selector */}
        <div className="absolute top-full left-2 mt-1.5">
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
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          aria-label="Search"
        >
          <img 
            src="/assets/icons/search-icon.svg" 
            alt="Search" 
            className="w-5 h-5"
          />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
