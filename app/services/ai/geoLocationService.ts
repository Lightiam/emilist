import axios from 'axios';
import { getLanguagesByCountry, DEFAULT_LANGUAGE_CODE } from '../../constants/languages';

/**
 * Service for detecting user's location and determining appropriate language
 * Supports 189 languages with enhanced detection methods
 */
export class GeoLocationService {
  private readonly ipInfoToken = process.env.IPINFO_TOKEN || 'fallback_token';
  private readonly geoApiKey = process.env.GEO_API_KEY || 'fallback_geo_key';
  private readonly useMockResponses = true; // Set to false in production
  
  // Cache for country detection to avoid repeated API calls
  private countryCache: { code: string; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 3600000; // 1 hour in milliseconds
  
  /**
   * Detect user's country based on multiple methods with fallbacks
   * @returns Promise with country code
   */
  async detectCountry(): Promise<string> {
    try {
      // Check cache first
      if (this.countryCache && (Date.now() - this.countryCache.timestamp < this.CACHE_DURATION)) {
        return this.countryCache.code;
      }
      
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        // Simulate a delay for realistic API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Randomly select from common countries for testing different scenarios
        const testCountries = ['NG', 'US', 'IN', 'GB', 'FR', 'DE', 'JP', 'BR', 'ZA', 'KE'];
        const randomIndex = Math.floor(Math.random() * testCountries.length);
        const countryCode = testCountries[randomIndex];
        
        // Cache the result
        this.countryCache = { code: countryCode, timestamp: Date.now() };
        return countryCode;
      }
      
      // Try multiple methods for country detection with fallbacks
      
      // Method 1: Try HTML5 Geolocation API if available in browser
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 24 * 60 * 60 * 1000 // 24 hours
            });
          });
          
          // Use reverse geocoding to get country from coordinates
          const { latitude, longitude } = position.coords;
          const geoResponse = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${this.geoApiKey}`
          );
          
          if (geoResponse.data?.results?.[0]?.components?.country_code) {
            const countryCode = geoResponse.data.results[0].components.country_code.toUpperCase();
            this.countryCache = { code: countryCode, timestamp: Date.now() };
            return countryCode;
          }
        } catch (geoError) {
          console.warn('Geolocation API failed:', geoError);
          // Continue to next method
        }
      }
      
      // Method 2: Try ipinfo.io
      try {
        const response = await axios.get(`https://ipinfo.io/json?token=${this.ipInfoToken}`);
        
        if (response.data && response.data.country) {
          const countryCode = response.data.country;
          this.countryCache = { code: countryCode, timestamp: Date.now() };
          return countryCode;
        }
      } catch (ipError) {
        console.warn('IP-based geolocation failed:', ipError);
        // Continue to next method
      }
      
      // Method 3: Try alternative IP API (no key required)
      try {
        const response = await axios.get('https://ipapi.co/json/');
        
        if (response.data && response.data.country_code) {
          const countryCode = response.data.country_code;
          this.countryCache = { code: countryCode, timestamp: Date.now() };
          return countryCode;
        }
      } catch (ipError) {
        console.warn('Alternative IP-based geolocation failed:', ipError);
        // Continue to fallback
      }
      
      // All methods failed, use default fallback
      throw new Error('All country detection methods failed');
    } catch (error) {
      console.error('Error detecting country:', error);
      
      // Fallback to browser locale if available
      if (typeof navigator !== 'undefined' && navigator.language) {
        const locale = navigator.language;
        const countryCode = locale.split('-')[1];
        if (countryCode && countryCode.length === 2) {
          return countryCode.toUpperCase();
        }
      }
      
      return 'US'; // Ultimate default fallback
    }
  }
  
  /**
   * Get the best language for a country based on most common usage
   * @param countryCode ISO country code
   * @returns Language code (e.g., 'en-US', 'fr-FR')
   */
  async getBestLanguageForCountry(countryCode: string): Promise<string> {
    try {
      // Get all languages for this country
      const countryLanguages = getLanguagesByCountry(countryCode);
      
      // If no languages found for this country, use default
      if (!countryLanguages || countryLanguages.length === 0) {
        return DEFAULT_LANGUAGE_CODE;
      }
      
      // Expanded country-specific language preferences based on primary languages
      // This provides a more accurate language selection for each country
      const countryLanguagePreferences: Record<string, string[]> = {
        // Africa
        'NG': ['en-NG', 'ha-NG', 'yo-NG', 'ig-NG'],
        'ZA': ['en-ZA', 'zu-ZA', 'xh-ZA', 'af-ZA'],
        'KE': ['sw-KE', 'en-KE'],
        'EG': ['ar-EG', 'en-EG'],
        'GH': ['en-GH', 'ak-GH', 'ee-GH'],
        'TZ': ['sw-TZ', 'en-TZ'],
        'DZ': ['ar-DZ', 'fr-DZ'],
        'MA': ['ar-MA', 'fr-MA'],
        'ET': ['am-ET', 'en-ET'],
        
        // Asia
        'IN': ['hi-IN', 'en-IN', 'bn-IN', 'ta-IN', 'te-IN', 'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN'],
        'CN': ['zh-CN', 'yue-CN'],
        'JP': ['ja-JP'],
        'KR': ['ko-KR'],
        'ID': ['id-ID', 'jv-ID'],
        'PK': ['ur-PK', 'en-PK'],
        'PH': ['fil-PH', 'en-PH'],
        'VN': ['vi-VN'],
        'TH': ['th-TH'],
        'MY': ['ms-MY', 'en-MY', 'zh-MY'],
        'SA': ['ar-SA'],
        'AE': ['ar-AE', 'en-AE'],
        'IL': ['he-IL', 'ar-IL'],
        'SG': ['en-SG', 'zh-SG', 'ms-SG', 'ta-SG'],
        'HK': ['zh-HK', 'en-HK'],
        'TW': ['zh-TW'],
        
        // Europe
        'GB': ['en-GB'],
        'DE': ['de-DE'],
        'FR': ['fr-FR'],
        'IT': ['it-IT'],
        'ES': ['es-ES', 'ca-ES', 'eu-ES', 'gl-ES'],
        'RU': ['ru-RU'],
        'UA': ['uk-UA', 'ru-UA'],
        'PL': ['pl-PL'],
        'RO': ['ro-RO'],
        'NL': ['nl-NL'],
        'BE': ['nl-BE', 'fr-BE', 'de-BE'],
        'SE': ['sv-SE'],
        'GR': ['el-GR'],
        'CZ': ['cs-CZ'],
        'PT': ['pt-PT'],
        'HU': ['hu-HU'],
        'AT': ['de-AT'],
        'CH': ['de-CH', 'fr-CH', 'it-CH'],
        'DK': ['da-DK'],
        'FI': ['fi-FI'],
        'NO': ['no-NO'],
        'IE': ['en-IE', 'ga-IE'],
        
        // Americas
        'US': ['en-US', 'es-US'],
        'CA': ['en-CA', 'fr-CA'],
        'MX': ['es-MX'],
        'BR': ['pt-BR'],
        'AR': ['es-AR'],
        'CO': ['es-CO'],
        'CL': ['es-CL'],
        'PE': ['es-PE'],
        'VE': ['es-VE'],
        'EC': ['es-EC'],
        'GT': ['es-GT'],
        'CU': ['es-CU'],
        'DO': ['es-DO'],
        'HT': ['fr-HT', 'ht-HT'],
        'BO': ['es-BO', 'qu-BO', 'ay-BO'],
        
        // Oceania
        'AU': ['en-AU'],
        'NZ': ['en-NZ', 'mi-NZ'],
        'FJ': ['en-FJ', 'fj-FJ'],
        'PG': ['en-PG', 'ho-PG']
      };
      
      // If we have specific preferences for this country
      if (countryCode in countryLanguagePreferences) {
        // Find the first preferred language that's available
        for (const langCode of countryLanguagePreferences[countryCode]) {
          if (countryLanguages.some(lang => lang.code === langCode)) {
            return langCode;
          }
        }
      }
      
      // Default to first language for the country
      return countryLanguages[0].code;
    } catch (error) {
      console.error('Error getting best language for country:', error);
      return DEFAULT_LANGUAGE_CODE;
    }
  }
  
  /**
   * Detect the best language for the user based on multiple methods
   * @returns Promise with language code
   */
  async detectUserLanguage(): Promise<string> {
    try {
      // Method 1: Try to get from browser settings if available (most accurate)
      if (typeof navigator !== 'undefined') {
        // First check navigator.languages (array of preferred languages)
        if (navigator.languages && navigator.languages.length > 0) {
          for (const lang of navigator.languages) {
            // Check if this exact language code is supported
            const countryCode = lang.split('-')[1];
            if (countryCode) {
              const countryLanguages = getLanguagesByCountry(countryCode);
              const exactMatch = countryLanguages.find(l => l.code === lang);
              if (exactMatch) {
                return lang;
              }
            }
          }
        }
        
        // Then check navigator.language (single preferred language)
        if (navigator.language) {
          const browserLang = navigator.language;
          
          // Check if this exact language code is supported
          const countryCode = browserLang.split('-')[1];
          if (countryCode) {
            const countryLanguages = getLanguagesByCountry(countryCode);
            const exactMatch = countryLanguages.find(lang => lang.code === browserLang);
            if (exactMatch) {
              return browserLang;
            }
            
            // If exact match not found, try to find a language with the same base language
            const baseLanguage = browserLang.split('-')[0];
            const baseMatch = countryLanguages.find(lang => lang.code.startsWith(baseLanguage + '-'));
            if (baseMatch) {
              return baseMatch.code;
            }
          }
        }
      }
      
      // Method 2: Try to get from localStorage if previously set
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedLanguage = localStorage.getItem('emilist_preferred_language');
        if (savedLanguage) {
          return savedLanguage;
        }
      }
      
      // Method 3: Use IP-based detection as fallback
      const countryCode = await this.detectCountry();
      const detectedLanguage = await this.getBestLanguageForCountry(countryCode);
      
      // Save the detected language for future use
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('emilist_preferred_language', detectedLanguage);
      }
      
      return detectedLanguage;
    } catch (error) {
      console.error('Error detecting user language:', error);
      return DEFAULT_LANGUAGE_CODE;
    }
  }
  
  /**
   * Save user's language preference
   * @param languageCode The language code to save
   */
  saveUserLanguagePreference(languageCode: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('emilist_preferred_language', languageCode);
      }
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }
}

export default new GeoLocationService();
