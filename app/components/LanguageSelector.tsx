"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
  const [isDetecting, setIsDetecting] = useState(false);
  const [recentLanguages, setRecentLanguages] = useState<string[]>([]);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  
  // Load recent languages from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedRecent = localStorage.getItem('emilist_recent_languages');
        if (savedRecent) {
          setRecentLanguages(JSON.parse(savedRecent));
        }
      } catch (error) {
        console.error('Error loading recent languages:', error);
      }
    }
  }, []);
  
  // Save selected language to recent languages
  const saveToRecentLanguages = useCallback((languageCode: string) => {
    if (typeof window !== 'undefined') {
      try {
        // Don't add duplicates
        const updatedRecent = [
          languageCode,
          ...recentLanguages.filter(code => code !== languageCode)
        ].slice(0, 5); // Keep only 5 most recent
        
        setRecentLanguages(updatedRecent);
        localStorage.setItem('emilist_recent_languages', JSON.stringify(updatedRecent));
        
        // Also save as user preference
        geoLocationService.saveUserLanguagePreference(languageCode);
      } catch (error) {
        console.error('Error saving recent languages:', error);
      }
    }
  }, [recentLanguages]);
  
  // Auto-detect language using improved methods
  const detectUserLanguage = useCallback(async () => {
    setIsDetecting(true);
    try {
      // Use the enhanced detection method from geoLocationService
      const detectedLanguage = await geoLocationService.detectUserLanguage();
      
      if (detectedLanguage && detectedLanguage !== selectedLanguage) {
        onLanguageChange(detectedLanguage);
        saveToRecentLanguages(detectedLanguage);
        
        // Get country for display purposes
        const country = await geoLocationService.detectCountry();
        setCountryCode(country);
        
        console.log(`Language automatically set to ${detectedLanguage} based on user location/preferences`);
      }
    } catch (error) {
      console.error('Error detecting user language:', error);
    } finally {
      setIsDetecting(false);
    }
  }, [selectedLanguage, onLanguageChange, saveToRecentLanguages]);
  
  // Auto-detect language on component mount
  useEffect(() => {
    // Only auto-detect if we don't have a language set or it's the default
    if (selectedLanguage === 'en-US' || !selectedLanguage) {
      detectUserLanguage();
    }
  }, [selectedLanguage, detectUserLanguage]);
  
  // Handle language selection
  const handleSelect = useCallback((languageCode: string) => {
    onLanguageChange(languageCode);
    saveToRecentLanguages(languageCode);
    setIsOpen(false);
  }, [onLanguageChange, saveToRecentLanguages]);
  
  // Group languages by region for better organization
  const languagesByRegion = {
    'Recent': recentLanguages.map(code => 
      supportedLanguages.find(lang => lang.code === code)
    ).filter(Boolean),
    'Africa': supportedLanguages.filter(lang => 
      ['NG', 'ZA', 'KE', 'EG', 'GH', 'TZ', 'DZ', 'MA', 'ET'].includes(lang.code.split('-')[1])
    ),
    'Asia': supportedLanguages.filter(lang => 
      ['IN', 'CN', 'JP', 'KR', 'ID', 'PK', 'PH', 'VN', 'TH', 'MY', 'SA', 'AE', 'IL', 'SG', 'HK', 'TW'].includes(lang.code.split('-')[1])
    ),
    'Europe': supportedLanguages.filter(lang => 
      ['GB', 'DE', 'FR', 'IT', 'ES', 'RU', 'UA', 'PL', 'RO', 'NL', 'BE', 'SE', 'GR', 'CZ', 'PT', 'HU', 'AT', 'CH', 'DK', 'FI', 'NO', 'IE'].includes(lang.code.split('-')[1])
    ),
    'Americas': supportedLanguages.filter(lang => 
      ['US', 'CA', 'MX', 'BR', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'DO', 'HT', 'BO'].includes(lang.code.split('-')[1])
    ),
    'Oceania': supportedLanguages.filter(lang => 
      ['AU', 'NZ', 'FJ', 'PG'].includes(lang.code.split('-')[1])
    ),
  };
  
  // Get current language display name
  const currentLanguageName = supportedLanguages.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage;
  
  return (
    <div className="relative">
      <button 
        type="button"
        className="flex items-center text-gray-600 text-sm hover:text-gray-900 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isDetecting ? (
          <span className="flex items-center">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            Detecting...
          </span>
        ) : (
          <>
            {countryCode && (
              <span className="mr-1">{countryCode}</span>
            )}
            {currentLanguageName}
            <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
          {/* Auto-detect option */}
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-gray-100 flex items-center"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                detectUserLanguage();
              }}
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Auto-detect language
            </button>
          </div>
          
          {/* Language groups */}
          <div className="py-1 max-h-60 overflow-auto" role="menu" aria-orientation="vertical">
            {/* Recent languages section */}
            {recentLanguages.length > 0 && (
              <div className="px-2 py-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent</h3>
                {languagesByRegion.Recent.map(lang => lang && (
                  <button
                    key={lang.code}
                    className={`w-full text-left px-2 py-1 text-sm ${selectedLanguage === lang.code ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700'} hover:bg-gray-100 rounded`}
                    role="menuitem"
                    onClick={() => handleSelect(lang.code)}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
            
            {/* Regions */}
            {Object.entries(languagesByRegion).map(([region, langs]) => {
              // Skip Recent and empty regions
              if (region === 'Recent' || langs.length === 0) return null;
              
              return (
                <div key={region} className="px-2 py-1">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{region}</h3>
                  <div className="grid grid-cols-2 gap-1">
                    {langs.map(lang => lang && (
                      <button
                        key={lang.code}
                        className={`text-left px-2 py-1 text-sm ${selectedLanguage === lang.code ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700'} hover:bg-gray-100 rounded`}
                        role="menuitem"
                        onClick={() => handleSelect(lang.code)}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
