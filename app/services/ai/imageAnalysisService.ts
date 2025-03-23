import { BaseAIService } from './baseAIService';

export class ImageAnalysisService extends BaseAIService {
  private readonly apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  private readonly groqApiKey = process.env.GROQ_API_KEY;
  
  async analyzeProjectImage(imageBase64: string) {
    try {
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
      return this.handleError(error);
    }
  }
  
  async identifyMaterialFromImage(imageBase64: string) {
    try {
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
      return this.handleError(error);
    }
  }
  
  async suggestProjectImprovements(imageBase64: string, projectDescription: string) {
    try {
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
      return this.handleError(error);
    }
  }
}

export default new ImageAnalysisService();
