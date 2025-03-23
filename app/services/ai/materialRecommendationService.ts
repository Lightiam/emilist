import { BaseAIService } from './baseAIService';

export class MaterialRecommendationService extends BaseAIService {
  private readonly apiKey = process.env.GROQ_API_KEY;
  
  async recommendMaterials(projectDescription: string, budget: number) {
    try {
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      
      const data = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a construction and renovation materials expert. You provide recommendations for high-quality, appropriate materials based on project descriptions and budgets."
          },
          {
            role: "user",
            content: `Based on this project description: "${projectDescription}" and a budget of $${budget}, recommend appropriate building materials. Include specific brands, estimated quantities needed, alternative options for different budget ranges, and any special considerations. Return your recommendations as JSON with categories for different material types.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      };
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
      
      const response = await this.makeRequest(endpoint, data, headers);
      
      // Parse JSON from the response
      const recommendations = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        projectDescription,
        budget,
        recommendations
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async findAlternativeMaterials(materialName: string, pricePoint: 'budget' | 'standard' | 'premium') {
    try {
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      
      const data = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a building materials expert specializing in finding alternatives at different price points."
          },
          {
            role: "user",
            content: `Find alternative materials to "${materialName}" at a ${pricePoint} price point. Include brand names, approximate costs, pros and cons of each alternative, and where to purchase. Return the information as JSON.`
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      };
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
      
      const response = await this.makeRequest(endpoint, data, headers);
      
      // Parse JSON from the response
      const alternatives = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        originalMaterial: materialName,
        pricePoint,
        alternatives
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default new MaterialRecommendationService();
