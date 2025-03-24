import { BaseAIService } from './baseAIService';

export class EnhancedSearchService extends BaseAIService {
  private readonly apiKey = process.env.GROQ_API_KEY;
  private readonly useMockResponses = true; // Set to false in production
  
  /**
   * Enhances a search query with structured data extraction and language-specific processing
   * @param query The original search query from the user
   * @param language The language code (e.g., 'en-US', 'fr-FR')
   * @returns Enhanced query with structured data
   */
  async enhanceSearchQuery(query: string, language: string = 'en-US'): Promise<any> {
    try {
      // Process "Hi Emi" prefix if present
      const processedQuery = this.processEmiPrefix(query);
      
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        // Get language-specific mock response
        return this.getMockResponse('enhanced-search', language);
      }
      
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      
      // Get language-specific system prompt
      const systemPrompt = this.getSystemPromptForLanguage(language);
      
      const data = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Enhance this search query: "${processedQuery}". Extract the service type, location, budget range, specific skills, and project timeline if mentioned. Return a JSON with fields: serviceType, location, budgetMin, budgetMax, skills, timeline.`
          }
        ],
        temperature: 0.2,
        max_tokens: 500
      };
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
      
      // Use enhanced request with language and retry options
      const response = await this.makeRequest(endpoint, data, headers, {
        language: language,
        retries: 2,
        timeout: 20000
      });
      
      // Parse JSON from the response
      const enhancedQuery = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        originalQuery: query,
        processedQuery: processedQuery,
        language: language,
        enhancedQuery
      };
    } catch (error) {
      // Use localized error messages based on language
      const errorKey = 'search_enhancement_failed';
      const errorMessage = this.getLocalizedErrorMessage(errorKey, language) || 
                          'Failed to enhance search query';
      
      return this.handleError(typeof error === 'string' ? error : errorMessage);
    }
  }

  /**
   * Gets search suggestions based on partial query with language support
   * @param partialQuery The partial search query
   * @param language The language code
   * @returns List of search suggestions
   */
  async getSearchSuggestions(partialQuery: string, language: string = 'en-US'): Promise<any> {
    try {
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        // Language-specific suggestions
        const langPrefix = language.split('-')[0];
        
        if (langPrefix === 'fr') {
          return {
            success: true,
            partialQuery,
            language,
            suggestions: [
              "plombier pour rénovation de cuisine",
              "spécialiste en rénovation de cuisine",
              "réparation de plomberie de salle de bain",
              "installation de plomberie pour cuisine",
              "plombier d'urgence pour fuite de cuisine"
            ]
          };
        } else if (langPrefix === 'es') {
          return {
            success: true,
            partialQuery,
            language,
            suggestions: [
              "fontanero para renovación de cocina",
              "especialista en renovación de cocina",
              "reparación de fontanería de baño",
              "instalación de fontanería para cocina",
              "fontanero de emergencia para fuga de cocina"
            ]
          };
        } else if (langPrefix === 'yo') {
          return {
            success: true,
            partialQuery,
            language,
            suggestions: [
              "onísẹ́ omi fún àtúnṣe ilé ìdáná",
              "akọ́ṣẹ́mọṣẹ́ àtúnṣe ilé ìdáná",
              "àtúnṣe ìṣẹ́ omi ilé ìgbọ̀nsẹ̀",
              "ìfibọ̀sí ìṣẹ́ omi fún ilé ìdáná",
              "onísẹ́ omi pàjáwìrì fún àlékún ilé ìdáná"
            ]
          };
        }
        
        // Default English suggestions
        return {
          success: true,
          partialQuery,
          language,
          suggestions: [
            "plumber for kitchen renovation",
            "kitchen renovation specialist",
            "bathroom plumbing repair",
            "plumbing installation for kitchen",
            "emergency plumber for kitchen leak"
          ]
        };
      }
      
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      
      // Get language-specific system prompt
      const systemPrompt = this.getSystemPromptForLanguage(language);
      
      const data = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Generate 5 search suggestions for the partial query: "${partialQuery}". Focus on home renovation, repair, and construction services. Return a JSON array of suggestion strings.`
          }
        ],
        temperature: 0.3,
        max_tokens: 250
      };
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
      
      // Use enhanced request with language and retry options
      const response = await this.makeRequest(endpoint, data, headers, {
        language: language,
        retries: 2
      });
      
      // Parse JSON from the response
      const suggestions = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        partialQuery,
        language,
        suggestions
      };
    } catch (error) {
      // Use localized error messages based on language
      const errorKey = 'search_suggestions_failed';
      const errorMessage = this.getLocalizedErrorMessage(errorKey, language) || 
                          'Failed to get search suggestions';
      
      return this.handleError(typeof error === 'string' ? error : errorMessage);
    }
  }
  
  /**
   * Process "Hi Emi" prefix in queries
   * @param query Original query
   * @returns Processed query with prefix removed if present
   */
  private processEmiPrefix(query: string): string {
    // Check if query starts with "Hi Emi" (case insensitive)
    if (query.toLowerCase().startsWith('hi emi')) {
      // Remove the prefix and trim any extra spaces
      return query.substring(6).trim();
    }
    return query;
  }
  
  /**
   * Get language-specific system prompt
   * @param language Language code
   * @returns System prompt in the appropriate language
   */
  private getSystemPromptForLanguage(language: string): string {
    const langPrefix = language.split('-')[0];
    
    const systemPrompts: Record<string, string> = {
      'en': "You are a search enhancement AI for a platform that connects homeowners with skilled artisans and handymen. Extract key search parameters from user queries.",
      'fr': "Vous êtes une IA d'amélioration de recherche pour une plateforme qui met en relation les propriétaires avec des artisans et des bricoleurs qualifiés. Extrayez les paramètres de recherche clés des requêtes des utilisateurs.",
      'es': "Eres una IA de mejora de búsqueda para una plataforma que conecta a propietarios con artesanos y técnicos cualificados. Extrae parámetros clave de búsqueda de las consultas de los usuarios.",
      'de': "Sie sind eine KI zur Suchverbesserung für eine Plattform, die Hausbesitzer mit qualifizierten Handwerkern und Heimwerkern verbindet. Extrahieren Sie wichtige Suchparameter aus Benutzeranfragen.",
      'zh': "您是一个搜索增强AI，用于连接房主与技术熟练的工匠和技工的平台。从用户查询中提取关键搜索参数。",
      'ar': "أنت ذكاء اصطناعي لتحسين البحث لمنصة تربط أصحاب المنازل بالحرفيين والعمال المهرة. استخرج معلمات البحث الرئيسية من استعلامات المستخدم.",
      'hi': "आप एक खोज वृद्धि AI हैं जो घर के मालिकों को कुशल कारीगरों और हैंडीमैन से जोड़ने वाले प्लेटफॉर्म के लिए है। उपयोगकर्ता क्वेरी से महत्वपूर्ण खोज पैरामीटर निकालें।",
      'sw': "Wewe ni AI ya uboreshaji wa utafutaji kwa jukwaa linalounganisha wamiliki wa nyumba na mafundi stadi na wafanyakazi wa mikono. Toa vigezo muhimu vya utafutaji kutoka kwa maswali ya watumiaji.",
      'yo': "Ìwọ jẹ́ AI ìmúdára àwárí fún pẹpẹ tí ó so àwọn onílé pọ̀ mọ́ àwọn oníṣẹ́ ọwọ́ àti àwọn ọkùnrin ọwọ́ tí ó ní ìmọ̀. Yọ àwọn pàrámítà àwárí pàtàkì kúrò nínú àwọn ìbéèrè àwọn olùṣàmúlò."
    };
    
    // Return language-specific prompt or default to English
    return systemPrompts[langPrefix] || systemPrompts['en'];
  }
}

export default new EnhancedSearchService();
