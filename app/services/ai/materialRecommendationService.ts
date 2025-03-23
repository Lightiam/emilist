import { BaseAIService } from './baseAIService';

export class MaterialRecommendationService extends BaseAIService {
  private readonly apiKey = process.env.GROQ_API_KEY;
  private readonly useMockResponses = true; // Set to false in production
  
  async recommendMaterials(projectDescription: string, budget: number) {
    try {
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        return {
          success: true,
          projectDescription,
          budget,
          recommendations: {
            flooring: [
              {
                type: "Hardwood",
                brand: "Bruce",
                estimatedQuantity: "500 sq ft",
                price: "$5-7 per sq ft",
                considerations: "Requires professional installation, not suitable for high moisture areas"
              },
              {
                type: "Luxury Vinyl Plank",
                brand: "LifeProof",
                estimatedQuantity: "500 sq ft",
                price: "$2.50-4 per sq ft",
                considerations: "DIY-friendly, waterproof, good for kitchens and bathrooms"
              }
            ],
            paint: [
              {
                type: "Interior Wall Paint",
                brand: "Behr Premium Plus",
                estimatedQuantity: "3-4 gallons",
                price: "$30-35 per gallon",
                considerations: "Low VOC, good coverage, self-priming"
              }
            ],
            fixtures: [
              {
                type: "Kitchen Faucet",
                brand: "Moen Arbor",
                estimatedQuantity: "1",
                price: "$180-220",
                considerations: "Spot resistant stainless finish, pull-down sprayer"
              }
            ]
          }
        };
      }
      
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
      return this.handleError(typeof error === 'string' ? error : 'Failed to recommend materials');
    }
  }
  
  async findAlternativeMaterials(materialName: string, pricePoint: 'budget' | 'standard' | 'premium') {
    try {
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        return {
          success: true,
          originalMaterial: materialName,
          pricePoint,
          alternatives: [
            {
              name: "TrafficMaster Vinyl Plank",
              cost: "$1.50-2.00 per sq ft",
              pros: ["Water resistant", "Easy installation", "Affordable"],
              cons: ["Thinner material", "Shorter warranty", "Less realistic appearance"],
              whereToBuy: "Home Depot, Lowe's"
            },
            {
              name: "Armstrong Luxe Plank",
              cost: "$3.50-4.50 per sq ft",
              pros: ["Waterproof", "Realistic wood look", "Durable wear layer"],
              cons: ["Higher cost", "May require underlayment"],
              whereToBuy: "Flooring specialty stores, Amazon"
            },
            {
              name: "Pergo TimberCraft Laminate",
              cost: "$2.75-3.25 per sq ft",
              pros: ["Scratch resistant", "Realistic texture", "Easy click-lock installation"],
              cons: ["Not fully waterproof", "Can sound hollow when walked on"],
              whereToBuy: "Lowe's, Floor & Decor"
            }
          ]
        };
      }
      
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
      return this.handleError(typeof error === 'string' ? error : 'Failed to find alternative materials');
    }
  }
}

export default new MaterialRecommendationService();
