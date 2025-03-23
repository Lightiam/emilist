import { BaseAIService } from './baseAIService';

export class ImageAnalysisService extends BaseAIService {
  private readonly apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  private readonly groqApiKey = process.env.GROQ_API_KEY;
  private readonly useMockResponses = true; // Set to false in production
  
  async analyzeProjectImage(imageBase64: string) {
    try {
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        return {
          success: true,
          analysis: {
            objects: [
              { name: "Wall", confidence: 0.95, boundingBox: { vertices: [] } },
              { name: "Floor", confidence: 0.92, boundingBox: { vertices: [] } },
              { name: "Window", confidence: 0.88, boundingBox: { vertices: [] } },
              { name: "Door", confidence: 0.85, boundingBox: { vertices: [] } },
              { name: "Ceiling", confidence: 0.82, boundingBox: { vertices: [] } }
            ],
            labels: [
              { description: "Room", confidence: 0.96 },
              { description: "Interior design", confidence: 0.94 },
              { description: "Building", confidence: 0.92 },
              { description: "Wood", confidence: 0.89 },
              { description: "Flooring", confidence: 0.87 },
              { description: "Furniture", confidence: 0.85 },
              { description: "Architecture", confidence: 0.83 }
            ],
            colors: [
              { red: 245, green: 245, blue: 240, pixelFraction: 0.35, score: 0.9 },
              { red: 210, green: 180, blue: 140, pixelFraction: 0.25, score: 0.8 },
              { red: 120, green: 100, blue: 80, pixelFraction: 0.15, score: 0.7 },
              { red: 50, green: 50, blue: 50, pixelFraction: 0.1, score: 0.6 },
              { red: 255, green: 255, blue: 255, pixelFraction: 0.15, score: 0.5 }
            ]
          }
        };
      }
      
      const endpoint = 'https://vision.googleapis.com/v1/images:annotate';
      
      const data = {
        requests: [
          {
            image: {
              content: imageBase64
            },
            features: [
              {
                type: 'OBJECT_LOCALIZATION',
                maxResults: 10
              },
              {
                type: 'LABEL_DETECTION',
                maxResults: 15
              },
              {
                type: 'IMAGE_PROPERTIES',
                maxResults: 5
              }
            ]
          }
        ]
      };
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
      
      const response = await this.makeRequest(endpoint, data, headers);
      
      // Process and organize the response into a more useful format
      const results = response.responses[0];
      
      const processedResults = {
        objects: results.localizedObjectAnnotations?.map((obj: any) => ({
          name: obj.name,
          confidence: obj.score,
          boundingBox: obj.boundingPoly
        })) || [],
        
        labels: results.labelAnnotations?.map((label: any) => ({
          description: label.description,
          confidence: label.score
        })) || [],
        
        colors: results.imagePropertiesAnnotation?.dominantColors?.colors?.map((color: any) => ({
          red: color.color.red,
          green: color.color.green,
          blue: color.color.blue,
          pixelFraction: color.pixelFraction,
          score: color.score
        })) || []
      };
      
      return {
        success: true,
        analysis: processedResults
      };
    } catch (error) {
      return this.handleError(typeof error === 'string' ? error : 'Failed to analyze project image');
    }
  }
  
  async identifyMaterialFromImage(imageBase64: string) {
    try {
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        return {
          success: true,
          visionAnalysis: {
            objects: [
              { name: "Wall", confidence: 0.95 },
              { name: "Floor", confidence: 0.92 }
            ],
            labels: [
              { description: "Wood", confidence: 0.89 },
              { description: "Flooring", confidence: 0.87 }
            ],
            colors: [
              { red: 210, green: 180, blue: 140, pixelFraction: 0.25, score: 0.8 }
            ]
          },
          materialAnalysis: {
            materials: [
              {
                name: "Engineered Hardwood",
                confidence: 0.85,
                applications: ["Flooring", "Wall accents", "Furniture"],
                alternatives: ["Laminate", "Luxury Vinyl Plank", "Solid Hardwood"]
              },
              {
                name: "Drywall",
                confidence: 0.92,
                applications: ["Interior walls", "Ceilings"],
                alternatives: ["Plaster", "Wood paneling", "Brick veneer"]
              },
              {
                name: "Ceramic Tile",
                confidence: 0.78,
                applications: ["Flooring", "Backsplashes", "Shower walls"],
                alternatives: ["Porcelain tile", "Natural stone", "Vinyl tile"]
              }
            ]
          }
        };
      }
      
      // First, analyze the image with Google Vision API
      const visionResults = await this.analyzeProjectImage(imageBase64);
      
      if (!visionResults.success) {
        return this.handleError('Vision API analysis failed');
      }
      
      // Then, use Groq to interpret the vision results and identify materials
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      
      // Check if vision results were successful
      if (!visionResults.success || !('analysis' in visionResults)) {
        return this.handleError('Vision API analysis failed or returned invalid data');
      }
      
      const data = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are an expert in identifying building materials from image analysis data. Given the objects, labels, and colors detected in an image, identify the most likely building materials present."
          },
          {
            role: "user",
            content: `Based on this image analysis data: ${JSON.stringify(visionResults.analysis)}, identify the building materials that are likely present in the image. For each material, provide a confidence score, typical applications, and alternative materials that could be used. Return your analysis as JSON.`
          }
        ],
        temperature: 0.2,
        max_tokens: 800
      };
      
      const headers = {
        'Authorization': `Bearer ${this.groqApiKey}`
      };
      
      const response = await this.makeRequest(endpoint, data, headers);
      
      // Parse JSON from the response
      const materialAnalysis = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        visionAnalysis: visionResults.analysis,
        materialAnalysis
      };
    } catch (error) {
      return this.handleError(typeof error === 'string' ? error : 'Failed to identify material from image');
    }
  }
  
  async suggestProjectImprovements(imageBase64: string, projectDescription: string) {
    try {
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        return {
          success: true,
          visionAnalysis: {
            objects: [
              { name: "Wall", confidence: 0.95 },
              { name: "Floor", confidence: 0.92 }
            ],
            labels: [
              { description: "Room", confidence: 0.96 },
              { description: "Interior design", confidence: 0.94 }
            ],
            colors: [
              { red: 245, green: 245, blue: 240, pixelFraction: 0.35, score: 0.9 }
            ]
          },
          projectDescription,
          suggestions: {
            aesthetics: [
              {
                suggestion: "Update wall color to a warmer tone",
                reasoning: "Current white walls appear stark and clinical",
                options: ["Benjamin Moore 'Revere Pewter'", "Sherwin Williams 'Agreeable Gray'"],
                estimatedCost: "$200-300 for paint and supplies"
              },
              {
                suggestion: "Add accent lighting",
                reasoning: "Room appears to have only overhead lighting",
                options: ["Wall sconces", "Table lamps", "Floor lamps"],
                estimatedCost: "$150-500 depending on selection"
              }
            ],
            functionality: [
              {
                suggestion: "Install floating shelves",
                reasoning: "Provides additional storage without taking floor space",
                options: ["Wood shelves", "Metal and wood combination"],
                estimatedCost: "$100-300 depending on materials and size"
              }
            ],
            durability: [
              {
                suggestion: "Upgrade flooring to engineered hardwood",
                reasoning: "More durable than current material, better for high-traffic areas",
                options: ["Oak", "Maple", "Hickory"],
                estimatedCost: "$8-12 per square foot installed"
              }
            ]
          }
        };
      }
      
      // First, analyze the image with Google Vision API
      const visionResults = await this.analyzeProjectImage(imageBase64);
      
      // Type guard to ensure visionResults has the analysis property
      if (!visionResults.success || !('analysis' in visionResults)) {
        return this.handleError('Vision API analysis failed or returned invalid data');
      }
      
      // Now TypeScript knows visionResults has the analysis property
      const analysisData = visionResults.analysis;
      
      // Then, use Groq to suggest improvements based on the image and description
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      
      const data = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are an expert construction and renovation consultant. You provide suggestions for improvements based on project images and descriptions."
          },
          {
            role: "user",
            content: `Based on this image analysis data: ${JSON.stringify(analysisData)} and project description: "${projectDescription}", suggest improvements or alternatives for the project. Consider aesthetics, functionality, durability, and cost-effectiveness. Return your suggestions as JSON with categories for different aspects of the project.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      };
      
      const headers = {
        'Authorization': `Bearer ${this.groqApiKey}`
      };
      
      const response = await this.makeRequest(endpoint, data, headers);
      
      // Parse JSON from the response
      const suggestions = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        visionAnalysis: analysisData,
        projectDescription,
        suggestions
      };
    } catch (error) {
      return this.handleError(typeof error === 'string' ? error : 'Failed to suggest project improvements');
    }
  }
}

export default new ImageAnalysisService();
