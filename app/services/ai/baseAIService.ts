import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export class BaseAIService {
  // Enhanced request method with retries, timeout handling, and better typing
  protected async makeRequest(
    endpoint: string, 
    data: any, 
    headers: Record<string, string> = {}, 
    options: {
      retries?: number;
      timeout?: number;
      language?: string;
    } = {}
  ): Promise<any> {
    const { 
      retries = 3, 
      timeout = 15000,
      language = 'en-US'
    } = options;
    
    try {
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': language, // Add language header for multilingual support
          ...headers
        },
        timeout: timeout
      };
      
      const response: AxiosResponse = await axios.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      // Handle retries for server errors or network issues
      if (retries > 0 && this.shouldRetry(error)) {
        console.log(`Retrying request to ${endpoint}. Attempts remaining: ${retries - 1}`);
        
        // Exponential backoff
        const delay = 1000 * Math.pow(2, 3 - retries);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.makeRequest(endpoint, data, headers, {
          retries: retries - 1,
          timeout,
          language
        });
      }
      
      return this.handleApiError(error);
    }
  }
  
  // Determine if we should retry the request
  private shouldRetry(error: any): boolean {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Retry on network errors or 5xx server errors
      return !axiosError.response || 
             (axiosError.response.status >= 500 && axiosError.response.status < 600) ||
             axiosError.code === 'ECONNABORTED' ||
             axiosError.code === 'ETIMEDOUT';
    }
    
    return false;
  }
  
  // Enhanced error handling with more specific error types
  private handleApiError(error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (!axiosError.response) {
        return this.handleError('Network error. Please check your internet connection.');
      }
      
      const status = axiosError.response.status;
      
      switch (status) {
        case 400:
          return this.handleError('Invalid request. Please check your input parameters.');
        case 401:
          return this.handleError('Authentication failed. Please check your API keys.');
        case 403:
          return this.handleError('Access forbidden. You do not have permission to access this resource.');
        case 404:
          return this.handleError('Resource not found. The requested endpoint does not exist.');
        case 429:
          return this.handleError('Rate limit exceeded. Please try again later.');
        case 500:
        case 502:
        case 503:
        case 504:
          return this.handleError('Server error. The service is currently unavailable. Please try again later.');
        default:
          return this.handleError(`Request failed with status code ${status}.`);
      }
    }
    
    if (error instanceof Error) {
      return this.handleError(`Error: ${error.message}`);
    }
    
    return this.handleError('An unknown error occurred.');
  }
  
  // Standardized error handling with logging
  protected handleError(errorMessage: string) {
    console.error('AI Service Error:', errorMessage);
    return {
      success: false,
      error: errorMessage || 'An error occurred while processing your request'
    };
  }

  // Enhanced rate limiting configuration with language-specific settings
  protected getRateLimitConfig(language: string = 'en-US') {
    // Base configuration
    const baseConfig = {
      maxRequests: 10,
      perMinute: 1,
      retryAfter: 60000 // 1 minute in milliseconds
    };
    
    // Adjust rate limits for certain language regions if needed
    // This could be used to implement different rate limits for different API providers
    const regionConfigs: Record<string, typeof baseConfig> = {
      'zh': { maxRequests: 8, perMinute: 1, retryAfter: 75000 }, // Chinese APIs might have different limits
      'ar': { maxRequests: 8, perMinute: 1, retryAfter: 75000 }, // Arabic APIs might have different limits
    };
    
    // Get the language prefix (e.g., 'en' from 'en-US')
    const langPrefix = language.split('-')[0];
    
    // Return region-specific config if available, otherwise use base config
    return regionConfigs[langPrefix] || baseConfig;
  }
  
  // Enhanced mock response system with multilingual support
  protected getMockResponse(type: string, language: string = 'en-US') {
    // Get language prefix for basic language matching
    const langPrefix = language.split('-')[0];
    
    // Common mock responses
    const commonMocks = {
      'voice-search': {
        'en': {
          success: true,
          transcription: 'Hi Emi find a plumber for kitchen renovation',
          detectedLanguage: 'en-US'
        },
        'fr': {
          success: true,
          transcription: 'Hi Emi trouve un plombier pour rénovation de cuisine',
          detectedLanguage: 'fr-FR'
        },
        'es': {
          success: true,
          transcription: 'Hi Emi encuentra un fontanero para renovación de cocina',
          detectedLanguage: 'es-ES'
        },
        'de': {
          success: true,
          transcription: 'Hi Emi finde einen Klempner für Küchenrenovierung',
          detectedLanguage: 'de-DE'
        },
        'zh': {
          success: true,
          transcription: 'Hi Emi 找一个厨房装修的水管工',
          detectedLanguage: 'zh-CN'
        },
        'ar': {
          success: true,
          transcription: 'Hi Emi ابحث عن سباك لتجديد المطبخ',
          detectedLanguage: 'ar-SA'
        },
        'hi': {
          success: true,
          transcription: 'Hi Emi रसोई नवीनीकरण के लिए एक प्लंबर खोजें',
          detectedLanguage: 'hi-IN'
        },
        'ja': {
          success: true,
          transcription: 'Hi Emi キッチンリフォーム用の配管工を探して',
          detectedLanguage: 'ja-JP'
        },
        'ru': {
          success: true,
          transcription: 'Hi Emi найди сантехника для ремонта кухни',
          detectedLanguage: 'ru-RU'
        },
        'sw': {
          success: true,
          transcription: 'Hi Emi tafuta fundi bomba kwa ukarabati wa jiko',
          detectedLanguage: 'sw-KE'
        },
        'yo': {
          success: true,
          transcription: 'Hi Emi wa onisẹ omi fun atunse ile ijẹun',
          detectedLanguage: 'yo-NG'
        },
        'ha': {
          success: true,
          transcription: 'Hi Emi nemo mai gyaran ruwa don gyaran gidan girki',
          detectedLanguage: 'ha-NG'
        },
        'ig': {
          success: true,
          transcription: 'Hi Emi chọta onye mmiri maka ịkwụwa ụlọ nri',
          detectedLanguage: 'ig-NG'
        }
      },
      'enhanced-search': {
        'en': {
          success: true,
          enhancedQuery: 'plumber kitchen renovation specialist',
          results: [
            { id: 1, name: 'John Adebayo', specialty: 'Kitchen Plumbing', rating: 4.8 },
            { id: 2, name: 'Chioma Okafor', specialty: 'Renovation Plumbing', rating: 4.7 },
            { id: 3, name: 'Mohammed Ibrahim', specialty: 'Kitchen Renovation', rating: 4.9 }
          ]
        },
        'fr': {
          success: true,
          enhancedQuery: 'plombier spécialiste en rénovation de cuisine',
          results: [
            { id: 1, name: 'Jean Adebayo', specialty: 'Plomberie de Cuisine', rating: 4.8 },
            { id: 2, name: 'Chioma Okafor', specialty: 'Plomberie de Rénovation', rating: 4.7 },
            { id: 3, name: 'Mohammed Ibrahim', specialty: 'Rénovation de Cuisine', rating: 4.9 }
          ]
        }
      },
      'expert-matching': {
        'en': {
          success: true,
          experts: [
            { id: 1, name: 'John Adebayo', specialty: 'Kitchen Plumbing', rating: 4.8, price: '$80/hr' },
            { id: 2, name: 'Chioma Okafor', specialty: 'Renovation Plumbing', rating: 4.7, price: '$75/hr' },
            { id: 3, name: 'Mohammed Ibrahim', specialty: 'Kitchen Renovation', rating: 4.9, price: '$90/hr' }
          ]
        },
        'fr': {
          success: true,
          experts: [
            { id: 1, name: 'Jean Adebayo', specialty: 'Plomberie de Cuisine', rating: 4.8, price: '80€/h' },
            { id: 2, name: 'Chioma Okafor', specialty: 'Plomberie de Rénovation', rating: 4.7, price: '75€/h' },
            { id: 3, name: 'Mohammed Ibrahim', specialty: 'Rénovation de Cuisine', rating: 4.9, price: '90€/h' }
          ]
        }
      }
    };
    
    // Get the appropriate mock response for the requested type and language
    const typeMocks = commonMocks[type as keyof typeof commonMocks];
    if (!typeMocks) {
      return {
        success: true,
        message: `Mock response generated for development (${type})`
      };
    }
    
    // Get language-specific mock or fall back to English
    const langMock = typeMocks[langPrefix as keyof typeof typeMocks] || typeMocks['en'];
    return langMock;
  }
  
  // Helper method to translate error messages based on language
  protected getLocalizedErrorMessage(errorKey: string, language: string = 'en-US'): string {
    const errorMessages: Record<string, Record<string, string>> = {
      'network_error': {
        'en': 'Network error. Please check your internet connection.',
        'fr': 'Erreur réseau. Veuillez vérifier votre connexion internet.',
        'es': 'Error de red. Por favor, compruebe su conexión a internet.',
        'de': 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
        'zh': '网络错误。请检查您的互联网连接。',
        'ar': 'خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت.',
        'hi': 'नेटवर्क त्रुटि। कृपया अपने इंटरनेट कनेक्शन की जांच करें।',
        'sw': 'Hitilafu ya mtandao. Tafadhali angalia muunganisho wako wa intaneti.'
      },
      'auth_failed': {
        'en': 'Authentication failed. Please check your API keys.',
        'fr': 'Authentification échouée. Veuillez vérifier vos clés API.',
        'es': 'Autenticación fallida. Por favor, compruebe sus claves API.',
        'de': 'Authentifizierung fehlgeschlagen. Bitte überprüfen Sie Ihre API-Schlüssel.',
        'zh': '认证失败。请检查您的API密钥。',
        'ar': 'فشل المصادقة. يرجى التحقق من مفاتيح API الخاصة بك.',
        'hi': 'प्रमाणीकरण विफल। कृपया अपनी API कुंजी जांचें।',
        'sw': 'Uthibitishaji umeshindwa. Tafadhali angalia funguo zako za API.'
      },
      'rate_limit': {
        'en': 'Rate limit exceeded. Please try again later.',
        'fr': 'Limite de taux dépassée. Veuillez réessayer plus tard.',
        'es': 'Límite de velocidad excedido. Por favor, inténtelo de nuevo más tarde.',
        'de': 'Ratenlimit überschritten. Bitte versuchen Sie es später erneut.',
        'zh': '超出速率限制。请稍后再试。',
        'ar': 'تم تجاوز حد المعدل. الرجاء معاودة المحاولة في وقت لاحق.',
        'hi': 'दर सीमा पार हो गई। कृपया बाद में पुन: प्रयास करें।',
        'sw': 'Kikomo cha kasi kimezidi. Tafadhali jaribu tena baadaye.'
      }
    };
    
    // Get language prefix
    const langPrefix = language.split('-')[0];
    
    // Get error message for the requested language or fall back to English
    const errorMessagesByLang = errorMessages[errorKey];
    if (!errorMessagesByLang) {
      return 'An error occurred while processing your request';
    }
    
    return errorMessagesByLang[langPrefix] || errorMessagesByLang['en'];
  }
}
