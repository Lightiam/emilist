import axios from 'axios';
import { getLanguagesByCountry, DEFAULT_LANGUAGE_CODE } from '../../constants/languages';

/**
 * Service for detecting user's location and determining appropriate language
 */
export class GeoLocationService {
  private readonly ipInfoToken = process.env.IPINFO_TOKEN || 'fallback_token';
  private readonly useMockResponses = true; // Set to false in production
  
  /**
   * Detect user's country based on IP address
   * @returns Promise with country code
   */
  async detectCountry(): Promise<string> {
    try {
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        // Simulate a delay for realistic API call
        await new Promise(resolve => setTimeout(resolve, 300));
        return 'NG'; // Default to Nigeria for testing
      }
      
      // Real implementation using ipinfo.io
      const response = await axios.get(`https://ipinfo.io/json?token=${this.ipInfoToken}`);
      
      if (response.data && response.data.country) {
        return response.data.country;
      }
      
      throw new Error('Country not found in response');
    } catch (error) {
      console.error('Error detecting country:', error);
      return 'US'; // Default fallback
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
      
      // Country-specific language preferences
      // This could be expanded with more detailed language prevalence data
      const countryLanguagePreferences: Record<string, string[]> = {
        'NG': ['en-NG', 'ha-NG', 'yo-NG', 'ig-NG'],
        'IN': ['hi-IN', 'en-IN', 'bn-IN', 'ta-IN'],
        'ZA': ['en-ZA', 'zu-ZA', 'xh-ZA', 'af-ZA'],
        'CA': ['en-CA', 'fr-CA'],
        'CH': ['de-CH', 'fr-CH', 'it-CH'],
        'BE': ['nl-BE', 'fr-BE'],
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
   * Detect the best language for the user based on their location
   * @returns Promise with language code
   */
  async detectUserLanguage(): Promise<string> {
    try {
      // First try to get from browser settings if available
      if (typeof navigator !== 'undefined' && navigator.language) {
        const browserLang = navigator.language;
        
        // Check if this exact language code is supported
        const countryCode = browserLang.split('-')[1];
        if (countryCode) {
          const countryLanguages = getLanguagesByCountry(countryCode);
          const exactMatch = countryLanguages.find(lang => lang.code === browserLang);
          if (exactMatch) {
            return browserLang;
          }
        }
      }
      
      // If browser language not available or not supported, use IP-based detection
      const countryCode = await this.detectCountry();
      return await this.getBestLanguageForCountry(countryCode);
    } catch (error) {
      console.error('Error detecting user language:', error);
      return DEFAULT_LANGUAGE_CODE;
    }
  }
}

export default new GeoLocationService();
