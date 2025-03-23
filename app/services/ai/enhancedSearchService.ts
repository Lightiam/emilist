import { BaseAIService } from './baseAIService';

export class EnhancedSearchService extends BaseAIService {
  private readonly apiKey = process.env.GROQ_API_KEY;
  
  async enhanceSearchQuery(query: string, language: string = 'en') {
    try {
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      
      const data = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a search enhancement AI for a platform that connects homeowners with skilled artisans and handymen. Extract key search parameters from user queries."
          },
          {
            role: "user",
            content: `Enhance this search query: "${query}". Extract the service type, location, budget range, specific skills, and project timeline if mentioned. Return a JSON with fields: serviceType, location, budgetMin, budgetMax, skills, timeline.`
          }
        ],
        temperature: 0.2,
        max_tokens: 500
      };
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
      
      const response = await this.makeRequest(endpoint, data, headers);
      
      // Parse JSON from the response
      const enhancedQuery = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        originalQuery: query,
        enhancedQuery
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getSearchSuggestions(partialQuery: string, language: string = 'en') {
    try {
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      
      const data = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a search suggestion AI for a platform that connects homeowners with skilled artisans and handymen. Provide relevant search suggestions based on partial queries."
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
      
      const response = await this.makeRequest(endpoint, data, headers);
      
      // Parse JSON from the response
      const suggestions = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        partialQuery,
        suggestions
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default new EnhancedSearchService();
