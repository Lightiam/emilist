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
      throw new Error('Failed to process AI request. Please try again.');
    }
  }
  
  protected handleError(error: any) {
    // Standardized error handling
    console.error('AI Service Error:', error);
    return {
      success: false,
      error: 'An error occurred while processing your request'
    };
  }

  protected getRateLimitConfig() {
    return {
      maxRequests: 10,
      perMinute: 1,
      retryAfter: 60000 // 1 minute in milliseconds
    };
  }
}
