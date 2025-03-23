import axios from 'axios';

export class BaseAIService {
  protected async makeRequest(endpoint: string, data: any, headers: any = {}) {
    try {
      const response = await axios.post(endpoint, data, { 
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        timeout: 15000 // 15 second timeout
      });
      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Handle specific error types
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return this.handleError('Authentication failed. Please check your API keys.');
        } else if (error.response?.status === 429) {
          return this.handleError('Rate limit exceeded. Please try again later.');
        } else if (error.code === 'ECONNABORTED') {
          return this.handleError('Request timed out. Please try again.');
        }
      }
      
      // Fallback for other errors
      return this.handleError('Failed to process AI request. Please try again.');
    }
  }
  
  protected handleError(errorMessage: string) {
    // Standardized error handling
    console.error('AI Service Error:', errorMessage);
    return {
      success: false,
      error: errorMessage || 'An error occurred while processing your request'
    };
  }

  protected getRateLimitConfig() {
    return {
      maxRequests: 10,
      perMinute: 1,
      retryAfter: 60000 // 1 minute in milliseconds
    };
  }
  
  // Add mock response capability for development/testing
  protected getMockResponse(type: string) {
    switch (type) {
      case 'voice-search':
        return {
          success: true,
          transcription: 'Find a plumber for kitchen renovation',
          detectedLanguage: 'en-US'
        };
      case 'enhanced-search':
        return {
          success: true,
          enhancedQuery: 'plumber kitchen renovation specialist',
          results: [
            { id: 1, name: 'John Doe', specialty: 'Kitchen Plumbing', rating: 4.8 },
            { id: 2, name: 'Jane Smith', specialty: 'Renovation Plumbing', rating: 4.7 },
            { id: 3, name: 'Mike Johnson', specialty: 'Kitchen Renovation', rating: 4.9 }
          ]
        };
      case 'expert-matching':
        return {
          success: true,
          experts: [
            { id: 1, name: 'John Doe', specialty: 'Kitchen Plumbing', rating: 4.8, price: '$80/hr' },
            { id: 2, name: 'Jane Smith', specialty: 'Renovation Plumbing', rating: 4.7, price: '$75/hr' },
            { id: 3, name: 'Mike Johnson', specialty: 'Kitchen Renovation', rating: 4.9, price: '$90/hr' }
          ]
        };
      default:
        return {
          success: true,
          message: 'Mock response generated for development'
        };
    }
  }
}
