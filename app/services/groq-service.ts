import axios from 'axios';

/**
 * GroqAIService - Core AI functionality using Groq API
 * Provides integration with Groq's LLM API and handles multilingual support
 */
export class GroqAIService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor() {
    // In production, these would be environment variables
    this.apiKey = process.env.GROQ_API_KEY || 'demo-api-key';
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'llama3-70b-8192'; // Groq's current model, update as needed
  }

  /**
   * Make a request to the Groq API
   * @param messages - Array of message objects
   * @param options - Additional options for the request
   * @returns Groq API response
   */
  async makeGroqRequest(messages: any[], options: any = {}) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages,
          ...options
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Groq API error:', error.response?.data || error.message);
      throw new Error('Failed to process with Groq AI');
    }
  }

  /**
   * Detect language of text input
   * @param text - Input text
   * @returns Detected language code
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      // In production, this would use Google Cloud Translation API
      // For demonstration, we'll use a simple language detection approach
      
      // Common language patterns for basic detection
      const languagePatterns: Record<string, RegExp[]> = {
        'en': [/\b(the|and|is|in|to|it|you|that|was|for|on|are|with|as|have)\b/gi],
        'es': [/\b(el|la|los|las|y|es|en|que|por|con|para|una|un|su|al|del)\b/gi],
        'fr': [/\b(le|la|les|et|est|en|que|pour|dans|ce|qui|sur|au|avec|il|elle)\b/gi],
        'de': [/\b(der|die|das|und|ist|in|zu|den|dem|mit|für|auf|ein|eine|sie)\b/gi],
        'zh': [/[\u4e00-\u9fff]/g], // Chinese characters
        'ja': [/[\u3040-\u309f\u30a0-\u30ff]/g], // Japanese characters
        'ko': [/[\uac00-\ud7af]/g], // Korean characters
        'ru': [/[\u0400-\u04ff]/g], // Cyrillic characters
        'ar': [/[\u0600-\u06ff]/g], // Arabic characters
        'hi': [/[\u0900-\u097f]/g], // Devanagari (Hindi) characters
      };
      
      // Count matches for each language
      const matches: Record<string, number> = {};
      
      for (const [lang, patterns] of Object.entries(languagePatterns)) {
        matches[lang] = 0;
        
        for (const pattern of patterns) {
          const matchCount = (text.match(pattern) || []).length;
          matches[lang] += matchCount;
        }
      }
      
      // Find language with most matches
      let detectedLanguage = 'en'; // Default to English
      let maxMatches = 0;
      
      for (const [lang, count] of Object.entries(matches)) {
        if (count > maxMatches) {
          maxMatches = count;
          detectedLanguage = lang;
        }
      }
      
      return detectedLanguage;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English if detection fails
    }
  }
  
  /**
   * Translate text to English for processing (if not already in English)
   * @param text - Input text
   * @param sourceLanguage - Source language code
   * @returns Translated text
   */
  async translateToEnglish(text: string, sourceLanguage: string): Promise<string> {
    // If already English, no need to translate
    if (sourceLanguage === 'en') return text;
    
    try {
      // In production, this would use Google Cloud Translation API
      // For demonstration, we'll simulate translation
      
      // Make a request to Groq API for translation
      const messages = [
        { role: 'system', content: `You are a translator. Translate the following text from ${sourceLanguage} to English. Only return the translated text, nothing else.` },
        { role: 'user', content: text }
      ];
      
      const response = await this.makeGroqRequest(messages, { temperature: 0.1 });
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }
  
  /**
   * Translate response back to original language
   * @param text - English response
   * @param targetLanguage - Target language code
   * @returns Translated response
   */
  async translateFromEnglish(text: string, targetLanguage: string): Promise<string> {
    // If target is English, no need to translate
    if (targetLanguage === 'en') return text;
    
    try {
      // In production, this would use Google Cloud Translation API
      // For demonstration, we'll simulate translation
      
      // Make a request to Groq API for translation
      const messages = [
        { role: 'system', content: `You are a translator. Translate the following text from English to ${targetLanguage}. Only return the translated text, nothing else.` },
        { role: 'user', content: text }
      ];
      
      const response = await this.makeGroqRequest(messages, { temperature: 0.1 });
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }
  
  /**
   * Process speech to text
   * @param audioBuffer - Audio data buffer
   * @param languageCode - Audio language code (if known)
   * @returns Transcribed text and detected language
   */
  async speechToText(audioBuffer: Buffer, languageCode: string | null = null): Promise<{text: string, languageCode: string}> {
    try {
      // In production, this would use Google Cloud Speech-to-Text API
      // For demonstration, we'll simulate speech recognition
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response based on language code
      let text = 'I need to find a plumber for my kitchen renovation';
      let detectedLanguage = languageCode || 'en-US';
      
      // Return mock transcription and detected language
      return {
        text,
        languageCode: detectedLanguage,
      };
    } catch (error) {
      console.error('Speech-to-text error:', error);
      throw new Error('Failed to process speech input');
    }
  }
  
  /**
   * Generate AI-powered search results
   * @param query - Search query
   * @param languageCode - Language code
   * @returns Search results
   */
  async generateSearchResults(query: string, languageCode: string = 'en'): Promise<any> {
    try {
      // Detect language if not provided
      if (!languageCode || languageCode === 'auto') {
        languageCode = await this.detectLanguage(query);
      }
      
      // Translate query to English if needed
      const translatedQuery = await this.translateToEnglish(query, languageCode);
      
      // Make a request to Groq API for search results
      const messages = [
        { 
          role: 'system', 
          content: `You are an AI assistant for Emilist, a platform connecting homeowners with service providers and materials for home improvement projects. Generate relevant search results for the user's query. Format your response as JSON with the following structure:
          {
            "results": [
              {
                "title": "Result title",
                "description": "Brief description",
                "type": "service_provider|material|job|article",
                "relevanceScore": 0-100
              }
            ],
            "suggestedCategories": ["category1", "category2"]
          }`
        },
        { role: 'user', content: translatedQuery }
      ];
      
      const response = await this.makeGroqRequest(messages, { temperature: 0.5 });
      const content = response.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      const searchResults = JSON.parse(jsonString);
      
      // Translate results back to original language if needed
      if (languageCode !== 'en') {
        for (const result of searchResults.results) {
          result.title = await this.translateFromEnglish(result.title, languageCode);
          result.description = await this.translateFromEnglish(result.description, languageCode);
        }
        
        for (let i = 0; i < searchResults.suggestedCategories.length; i++) {
          searchResults.suggestedCategories[i] = await this.translateFromEnglish(
            searchResults.suggestedCategories[i], 
            languageCode
          );
        }
      }
      
      return searchResults;
    } catch (error) {
      console.error('Search generation error:', error);
      throw new Error('Failed to generate search results');
    }
  }
  
  /**
   * Generate expert recommendations based on project description
   * @param projectDescription - Description of the project
   * @param languageCode - Language code
   * @returns Expert recommendations
   */
  async generateExpertRecommendations(projectDescription: string, languageCode: string = 'en'): Promise<any> {
    try {
      // Detect language if not provided
      if (!languageCode || languageCode === 'auto') {
        languageCode = await this.detectLanguage(projectDescription);
      }
      
      // Translate description to English if needed
      const translatedDescription = await this.translateToEnglish(projectDescription, languageCode);
      
      // Make a request to Groq API for expert recommendations
      const messages = [
        { 
          role: 'system', 
          content: `You are an AI assistant for Emilist, a platform connecting homeowners with service providers for home improvement projects. Based on the project description, recommend expert types and specialties needed. Format your response as JSON with the following structure:
          {
            "projectAnalysis": "Brief analysis of the project",
            "recommendedExperts": [
              {
                "type": "Expert type (e.g., Plumber, Electrician)",
                "specialty": "Specific specialty",
                "reasonNeeded": "Why this expert is needed",
                "estimatedTimeNeeded": "Estimated time needed"
              }
            ],
            "estimatedBudget": {
              "min": 1000,
              "max": 5000,
              "currency": "USD"
            },
            "estimatedDuration": "2-3 weeks"
          }`
        },
        { role: 'user', content: translatedDescription }
      ];
      
      const response = await this.makeGroqRequest(messages, { temperature: 0.5 });
      const content = response.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      const recommendations = JSON.parse(jsonString);
      
      // Translate recommendations back to original language if needed
      if (languageCode !== 'en') {
        recommendations.projectAnalysis = await this.translateFromEnglish(
          recommendations.projectAnalysis, 
          languageCode
        );
        
        for (const expert of recommendations.recommendedExperts) {
          expert.type = await this.translateFromEnglish(expert.type, languageCode);
          expert.specialty = await this.translateFromEnglish(expert.specialty, languageCode);
          expert.reasonNeeded = await this.translateFromEnglish(expert.reasonNeeded, languageCode);
          expert.estimatedTimeNeeded = await this.translateFromEnglish(expert.estimatedTimeNeeded, languageCode);
        }
        
        recommendations.estimatedDuration = await this.translateFromEnglish(
          recommendations.estimatedDuration, 
          languageCode
        );
      }
      
      return recommendations;
    } catch (error) {
      console.error('Expert recommendation error:', error);
      throw new Error('Failed to generate expert recommendations');
    }
  }
  
  /**
   * Generate material recommendations based on project description
   * @param projectDescription - Description of the project
   * @param languageCode - Language code
   * @returns Material recommendations
   */
  async generateMaterialRecommendations(projectDescription: string, languageCode: string = 'en'): Promise<any> {
    try {
      // Detect language if not provided
      if (!languageCode || languageCode === 'auto') {
        languageCode = await this.detectLanguage(projectDescription);
      }
      
      // Translate description to English if needed
      const translatedDescription = await this.translateToEnglish(projectDescription, languageCode);
      
      // Make a request to Groq API for material recommendations
      const messages = [
        { 
          role: 'system', 
          content: `You are an AI assistant for Emilist, a platform for home improvement projects. Based on the project description, recommend materials needed. Format your response as JSON with the following structure:
          {
            "projectType": "Type of project",
            "recommendedMaterials": [
              {
                "name": "Material name",
                "description": "Brief description",
                "estimatedQuantity": "Estimated quantity needed",
                "estimatedCost": {
                  "min": 100,
                  "max": 500,
                  "currency": "USD"
                },
                "alternatives": [
                  {
                    "name": "Alternative material",
                    "pros": "Advantages",
                    "cons": "Disadvantages"
                  }
                ]
              }
            ],
            "totalEstimatedCost": {
              "min": 1000,
              "max": 5000,
              "currency": "USD"
            }
          }`
        },
        { role: 'user', content: translatedDescription }
      ];
      
      const response = await this.makeGroqRequest(messages, { temperature: 0.5 });
      const content = response.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      const recommendations = JSON.parse(jsonString);
      
      // Translate recommendations back to original language if needed
      if (languageCode !== 'en') {
        recommendations.projectType = await this.translateFromEnglish(
          recommendations.projectType, 
          languageCode
        );
        
        for (const material of recommendations.recommendedMaterials) {
          material.name = await this.translateFromEnglish(material.name, languageCode);
          material.description = await this.translateFromEnglish(material.description, languageCode);
          material.estimatedQuantity = await this.translateFromEnglish(material.estimatedQuantity, languageCode);
          
          for (const alt of material.alternatives || []) {
            alt.name = await this.translateFromEnglish(alt.name, languageCode);
            alt.pros = await this.translateFromEnglish(alt.pros, languageCode);
            alt.cons = await this.translateFromEnglish(alt.cons, languageCode);
          }
        }
      }
      
      return recommendations;
    } catch (error) {
      console.error('Material recommendation error:', error);
      throw new Error('Failed to generate material recommendations');
    }
  }
}

// Export as singleton
export default new GroqAIService();
