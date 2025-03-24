import axios from 'axios';
import { BaseAIService } from './baseAIService';

export class VoiceSearchService extends BaseAIService {
  private readonly apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  private readonly projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  private readonly useMockResponses = true; // Set to false in production
  
  /**
   * Transcribe audio data to text with language detection
   * @param audioData Base64 encoded audio data
   * @param languageCode Language code or 'auto' for automatic detection
   * @returns Transcription result with detected language
   */
  async transcribeAudio(audioData: string, languageCode: string = 'auto') {
    try {
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        // Simulate different language responses based on the provided language code
        const mockResponses: Record<string, { transcription: string, detectedLanguage: string }> = {
          'en-US': {
            transcription: "Hi Emi give me the list of expert auto mechanics in Ikoyi Lagos",
            detectedLanguage: 'en-US'
          },
          'fr-FR': {
            transcription: "Hi Emi donne-moi la liste des mécaniciens automobiles experts à Ikoyi Lagos",
            detectedLanguage: 'fr-FR'
          },
          'es-ES': {
            transcription: "Hi Emi dame la lista de mecánicos de automóviles expertos en Ikoyi Lagos",
            detectedLanguage: 'es-ES'
          },
          'de-DE': {
            transcription: "Hi Emi gib mir die Liste der Kfz-Experten in Ikoyi Lagos",
            detectedLanguage: 'de-DE'
          },
          'zh-CN': {
            transcription: "Hi Emi 给我伊科伊拉各斯的专业汽车机械师名单",
            detectedLanguage: 'zh-CN'
          },
          'ar-SA': {
            transcription: "Hi Emi أعطني قائمة بميكانيكي السيارات الخبراء في إيكوي لاغوس",
            detectedLanguage: 'ar-SA'
          },
          'hi-IN': {
            transcription: "Hi Emi मुझे इकोयी लागोस में विशेषज्ञ ऑटो मैकेनिक की सूची दें",
            detectedLanguage: 'hi-IN'
          },
          'ja-JP': {
            transcription: "Hi Emi イコイラゴスの専門自動車整備士のリストを教えてください",
            detectedLanguage: 'ja-JP'
          },
          'ru-RU': {
            transcription: "Hi Emi дай мне список экспертов-автомехаников в Икойи Лагос",
            detectedLanguage: 'ru-RU'
          },
          'sw-KE': {
            transcription: "Hi Emi nipe orodha ya mafundi wa magari wataalam katika Ikoyi Lagos",
            detectedLanguage: 'sw-KE'
          },
          'yo-NG': {
            transcription: "Hi Emi fun mi ni akojọ awọn ọjọgbọn mekaniki ọkọ ni Ikoyi Lagos",
            detectedLanguage: 'yo-NG'
          },
          'ha-NG': {
            transcription: "Hi Emi ba ni jerin masana na mota a Ikoyi Lagos",
            detectedLanguage: 'ha-NG'
          },
          'ig-NG': {
            transcription: "Hi Emi nye m ndepụta ndị ọkachamara na mmezi ụgbọala na Ikoyi Lagos",
            detectedLanguage: 'ig-NG'
          }
        };
        
        // If language is auto or not in our mock responses, return English
        const mockResponse = mockResponses[languageCode] || mockResponses['en-US'];
        
        return {
          success: true,
          transcription: mockResponse.transcription,
          detectedLanguage: mockResponse.detectedLanguage
        };
      }
      
      const endpoint = `https://speech.googleapis.com/v1p1beta1/speech:recognize`;
      
      // Enhanced configuration for better multilingual support
      const data = {
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: languageCode === 'auto' ? 'en-US' : languageCode,
          enableAutomaticPunctuation: true,
          model: 'latest_long', // Use the most advanced model for better accuracy
          useEnhanced: true,
          enableWordTimeOffsets: false,
          enableWordConfidence: true,
          profanityFilter: false,
          speechContexts: [
            {
              phrases: ["Hi Emi", "Emi", "expert", "mechanic", "Lagos", "Ikoyi"],
              boost: 20 // Boost recognition of these phrases
            }
          ],
          // Expanded language alternatives for better auto-detection
          alternativeLanguageCodes: languageCode === 'auto' ? 
            [
              'en-US', 'en-NG', 'en-GH', 'en-KE', 'en-ZA', 
              'fr-FR', 'fr-CA', 
              'es-ES', 'es-MX', 
              'de-DE', 
              'zh-CN', 'zh-TW', 
              'ru-RU', 
              'ar-SA', 'ar-EG', 
              'hi-IN', 
              'ja-JP',
              'sw-KE', 'sw-TZ',
              'yo-NG',
              'ha-NG',
              'ig-NG'
            ] : [],
        },
        audio: {
          content: audioData
        }
      };
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
      
      const response = await this.makeRequest(endpoint, data, headers);
      
      // Get the transcription from the response
      let transcription = response.results?.[0]?.alternatives?.[0]?.transcript || '';
      
      // Format the transcription to match the "Hi Emi..." format if it doesn't already
      if (transcription && !transcription.toLowerCase().startsWith('hi emi')) {
        transcription = `Hi Emi ${transcription}`;
      }
      
      return {
        success: true,
        transcription: transcription,
        confidence: response.results?.[0]?.alternatives?.[0]?.confidence || 0,
        detectedLanguage: response.results?.[0]?.languageCode || languageCode
      };
    } catch (error) {
      return this.handleError(typeof error === 'string' ? error : 'Failed to transcribe audio');
    }
  }
  
  // Get list of supported languages
  async getSupportedLanguages() {
    try {
      // In a production environment, this would make an actual API call
      // For now, we'll return a subset of the 189 supported languages
      return {
        success: true,
        languages: this.getLanguagesList()
      };
    } catch (error) {
      return this.handleError(typeof error === 'string' ? error : 'Failed to get supported languages');
    }
  }

  // Helper method to get the list of supported languages
  private getLanguagesList() {
    // This is a subset of the 189 languages supported by Google Cloud Speech-to-Text
    // In production, you would fetch this from the API
    return [
      { code: 'af-ZA', name: 'Afrikaans' },
      { code: 'am-ET', name: 'Amharic' },
      { code: 'ar-DZ', name: 'Arabic (Algeria)' },
      { code: 'ar-BH', name: 'Arabic (Bahrain)' },
      { code: 'ar-EG', name: 'Arabic (Egypt)' },
      { code: 'ar-IQ', name: 'Arabic (Iraq)' },
      { code: 'ar-JO', name: 'Arabic (Jordan)' },
      { code: 'ar-KW', name: 'Arabic (Kuwait)' },
      { code: 'ar-LB', name: 'Arabic (Lebanon)' },
      { code: 'ar-MA', name: 'Arabic (Morocco)' },
      { code: 'ar-OM', name: 'Arabic (Oman)' },
      { code: 'ar-QA', name: 'Arabic (Qatar)' },
      { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
      { code: 'ar-PS', name: 'Arabic (State of Palestine)' },
      { code: 'ar-TN', name: 'Arabic (Tunisia)' },
      { code: 'ar-AE', name: 'Arabic (United Arab Emirates)' },
      { code: 'ar-YE', name: 'Arabic (Yemen)' },
      { code: 'hy-AM', name: 'Armenian' },
      { code: 'az-AZ', name: 'Azerbaijani' },
      { code: 'eu-ES', name: 'Basque' },
      { code: 'bn-BD', name: 'Bengali (Bangladesh)' },
      { code: 'bn-IN', name: 'Bengali (India)' },
      { code: 'bs-BA', name: 'Bosnian' },
      { code: 'bg-BG', name: 'Bulgarian' },
      { code: 'my-MM', name: 'Burmese' },
      { code: 'ca-ES', name: 'Catalan' },
      { code: 'yue-Hant-HK', name: 'Chinese, Cantonese (Traditional Hong Kong)' },
      { code: 'zh-Hans-CN', name: 'Chinese, Mandarin (Simplified, China)' },
      { code: 'zh-Hant-TW', name: 'Chinese, Mandarin (Traditional, Taiwan)' },
      { code: 'zh-Hant-HK', name: 'Chinese (Traditional, Hong Kong)' },
      { code: 'hr-HR', name: 'Croatian' },
      { code: 'cs-CZ', name: 'Czech' },
      { code: 'da-DK', name: 'Danish' },
      { code: 'nl-BE', name: 'Dutch (Belgium)' },
      { code: 'nl-NL', name: 'Dutch (Netherlands)' },
      { code: 'en-AU', name: 'English (Australia)' },
      { code: 'en-CA', name: 'English (Canada)' },
      { code: 'en-GH', name: 'English (Ghana)' },
      { code: 'en-HK', name: 'English (Hong Kong)' },
      { code: 'en-IN', name: 'English (India)' },
      { code: 'en-IE', name: 'English (Ireland)' },
      { code: 'en-KE', name: 'English (Kenya)' },
      { code: 'en-NZ', name: 'English (New Zealand)' },
      { code: 'en-NG', name: 'English (Nigeria)' },
      { code: 'en-PK', name: 'English (Pakistan)' },
      { code: 'en-PH', name: 'English (Philippines)' },
      { code: 'en-SG', name: 'English (Singapore)' },
      { code: 'en-ZA', name: 'English (South Africa)' },
      { code: 'en-TZ', name: 'English (Tanzania)' },
      { code: 'en-GB', name: 'English (United Kingdom)' },
      { code: 'en-US', name: 'English (United States)' },
      // This is a subset of the 189 languages - in production, include all languages
      { code: 'es-AR', name: 'Spanish (Argentina)' },
      { code: 'es-BO', name: 'Spanish (Bolivia)' },
      { code: 'es-CL', name: 'Spanish (Chile)' },
      { code: 'es-CO', name: 'Spanish (Colombia)' },
      { code: 'es-CR', name: 'Spanish (Costa Rica)' },
      { code: 'es-DO', name: 'Spanish (Dominican Republic)' },
      { code: 'es-EC', name: 'Spanish (Ecuador)' },
      { code: 'es-SV', name: 'Spanish (El Salvador)' },
      { code: 'es-GT', name: 'Spanish (Guatemala)' },
      { code: 'es-HN', name: 'Spanish (Honduras)' },
      { code: 'es-MX', name: 'Spanish (Mexico)' },
      { code: 'es-NI', name: 'Spanish (Nicaragua)' },
      { code: 'es-PA', name: 'Spanish (Panama)' },
      { code: 'es-PY', name: 'Spanish (Paraguay)' },
      { code: 'es-PE', name: 'Spanish (Peru)' },
      { code: 'es-PR', name: 'Spanish (Puerto Rico)' },
      { code: 'es-ES', name: 'Spanish (Spain)' },
      { code: 'es-US', name: 'Spanish (United States)' },
      { code: 'es-UY', name: 'Spanish (Uruguay)' },
      { code: 'es-VE', name: 'Spanish (Venezuela)' },
      { code: 'fr-BE', name: 'French (Belgium)' },
      { code: 'fr-CA', name: 'French (Canada)' },
      { code: 'fr-FR', name: 'French (France)' },
      { code: 'fr-CH', name: 'French (Switzerland)' },
      { code: 'de-AT', name: 'German (Austria)' },
      { code: 'de-DE', name: 'German (Germany)' },
      { code: 'de-CH', name: 'German (Switzerland)' },
      { code: 'el-GR', name: 'Greek' },
      { code: 'gu-IN', name: 'Gujarati' },
      { code: 'iw-IL', name: 'Hebrew' },
      { code: 'hi-IN', name: 'Hindi' },
      { code: 'hu-HU', name: 'Hungarian' },
      { code: 'is-IS', name: 'Icelandic' },
      { code: 'id-ID', name: 'Indonesian' },
      { code: 'it-IT', name: 'Italian (Italy)' },
      { code: 'it-CH', name: 'Italian (Switzerland)' },
      { code: 'ja-JP', name: 'Japanese' },
      { code: 'kn-IN', name: 'Kannada' },
      { code: 'km-KH', name: 'Khmer' },
      { code: 'ko-KR', name: 'Korean' },
      { code: 'lo-LA', name: 'Lao' },
      { code: 'lv-LV', name: 'Latvian' },
      { code: 'lt-LT', name: 'Lithuanian' },
      { code: 'ms-MY', name: 'Malay' },
      { code: 'ml-IN', name: 'Malayalam' },
      { code: 'mr-IN', name: 'Marathi' },
      { code: 'mn-MN', name: 'Mongolian' },
      { code: 'ne-NP', name: 'Nepali' },
      { code: 'no-NO', name: 'Norwegian' },
      { code: 'fa-IR', name: 'Persian' },
      { code: 'pl-PL', name: 'Polish' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)' },
      { code: 'pt-PT', name: 'Portuguese (Portugal)' },
      { code: 'pa-Guru-IN', name: 'Punjabi' },
      { code: 'ro-RO', name: 'Romanian' },
      { code: 'ru-RU', name: 'Russian' },
      { code: 'sr-RS', name: 'Serbian' },
      { code: 'si-LK', name: 'Sinhala' },
      { code: 'sk-SK', name: 'Slovak' },
      { code: 'sl-SI', name: 'Slovenian' },
      { code: 'sw-KE', name: 'Swahili (Kenya)' },
      { code: 'sw-TZ', name: 'Swahili (Tanzania)' },
      { code: 'sv-SE', name: 'Swedish' },
      { code: 'ta-IN', name: 'Tamil (India)' },
      { code: 'ta-SG', name: 'Tamil (Singapore)' },
      { code: 'ta-LK', name: 'Tamil (Sri Lanka)' },
      { code: 'te-IN', name: 'Telugu' },
      { code: 'th-TH', name: 'Thai' },
      { code: 'tr-TR', name: 'Turkish' },
      { code: 'uk-UA', name: 'Ukrainian' },
      { code: 'ur-IN', name: 'Urdu (India)' },
      { code: 'ur-PK', name: 'Urdu (Pakistan)' },
      { code: 'vi-VN', name: 'Vietnamese' },
      { code: 'zu-ZA', name: 'Zulu' }
    ];
  }
}

export default new VoiceSearchService();
