"use client";

import React, { useState, useEffect } from 'react';
import { supportedLanguages, AUTO_DETECTION_CODE, getLanguagesByCountry } from '../constants/languages';
import geoLocationService from '../services/ai/geoLocationService';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  onLanguageChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Auto-detect country and set language on component mount
  useEffect(() => {
    const detectCountryAndSetLanguage = async () => {
      try {
        // Only auto-detect if using the default language
        if (selectedLanguage === 'en-US') {
          const countryCode = await geoLocationService.detectCountry();
          const countryLanguages = getLanguagesByCountry(countryCode);
          
          // If country has supported languages, use the first one
          if (countryLanguages.length > 0) {
            onLanguageChange(countryLanguages[0].code);
            console.log(`Language automatically set to ${countryLanguages[0].code} based on country ${countryCode}`);
          }
        }
      } catch (error) {
        console.error('Error auto-detecting language:', error);
      }
    };
    
    detectCountryAndSetLanguage();
  }, [selectedLanguage, onLanguageChange]);
  
  const handleSelect = (languageCode: string) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        type="button"
        className="flex items-center text-gray-600 text-sm hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        {supportedLanguages.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage}
        <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 max-h-60 overflow-auto" role="menu" aria-orientation="vertical">
            {supportedLanguages.map(lang => (
              <button
                key={lang.code}
                className={`w-full text-left px-4 py-2 text-sm ${selectedLanguage === lang.code ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
                role="menuitem"
                onClick={() => handleSelect(lang.code)}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
