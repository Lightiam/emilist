"use client";

import React, { useState } from 'react';

// Common languages map (you can expand this)
const LANGUAGES = {
  'en-US': 'English (US)',
  'es-ES': 'Spanish',
  'fr-FR': 'French',
  'de-DE': 'German',
  'zh-CN': 'Chinese (Simplified)',
  'ar-SA': 'Arabic',
  'hi-IN': 'Hindi',
  'ja-JP': 'Japanese',
  'ru-RU': 'Russian',
  'pt-BR': 'Portuguese (Brazil)',
  // Add more languages as needed
};

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  onLanguageChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
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
        {LANGUAGES[selectedLanguage as keyof typeof LANGUAGES] || selectedLanguage}
        <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 max-h-60 overflow-auto" role="menu" aria-orientation="vertical">
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <button
                key={code}
                className={`w-full text-left px-4 py-2 text-sm ${selectedLanguage === code ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
                role="menuitem"
                onClick={() => handleSelect(code)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
