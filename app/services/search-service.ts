import groqService from './groq-service';

/**
 * SearchService - AI-powered search functionality
 * Provides natural language search processing with multilingual support
 */
export class SearchService {
  /**
   * Process natural language search query
   * @param query - Search query
   * @param languageCode - Query language code
   * @returns Structured search parameters
   */
  async processSearchQuery(query: string, languageCode: string = 'en'): Promise<any> {
    try {
      // Detect language if not provided
      if (!languageCode || languageCode === 'auto') {
        languageCode = await groqService.detectLanguage(query);
      }
      
      // Translate query to English if needed
      const englishQuery = await groqService.translateToEnglish(query, languageCode);
      
      // Process with Groq
      const messages = [
        {
          role: "system",
          content: `You are a search assistant for Emilist, a platform that connects homeowners, 
          contractors, businesses, and customers with skilled artisans, handymen, and project experts.
          Extract search parameters from natural language queries.
          Return a JSON object with the following possible keys:
          - serviceType: type of service requested (e.g., plumbing, carpentry, electrical)
          - location: geographic area
          - skills: specific skills required
          - materialType: type of materials needed
          - projectType: type of project (e.g., renovation, repair, new construction)
          - budget: price range
          - timeframe: when the service is needed
          Only include keys that are relevant to the query.`
        },
        {
          role: "user",
          content: englishQuery
        }
      ];
      
      const response = await groqService.makeGroqRequest(messages, {
        temperature: 0.2
      });
      
      // Parse and return the structured parameters
      const content = response.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error processing search query:', error);
      throw new Error('Failed to process search query');
    }
  }
  
  /**
   * Generate a natural language response to the search query
   * @param searchParams - Structured search parameters
   * @param results - Search results
   * @param languageCode - Target language code
   * @returns Natural language response
   */
  async generateSearchResponse(searchParams: any, results: any[], languageCode: string = 'en'): Promise<string> {
    try {
      // Create a summary of the search parameters
      const paramSummary = Object.entries(searchParams)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      
      // Create a summary of the results
      const resultSummary = results.map((result, index) => 
        `${index + 1}. ${result.title || result.name}: ${result.description || ''}`
      ).join('\n');
      
      // Generate response with Groq
      const messages = [
        {
          role: "system",
          content: `You are a helpful search assistant for Emilist, a platform that connects homeowners with service providers and materials for home improvement projects. Generate a natural language response to the user's search query based on the search parameters and results provided. Be concise but informative.`
        },
        {
          role: "user",
          content: `Search parameters: ${paramSummary}\n\nResults:\n${resultSummary}\n\nGenerate a natural language response summarizing these search results.`
        }
      ];
      
      const response = await groqService.makeGroqRequest(messages, {
        temperature: 0.7
      });
      
      const englishResponse = response.choices[0].message.content.trim();
      
      // Translate response if needed
      if (languageCode !== 'en') {
        return await groqService.translateFromEnglish(englishResponse, languageCode);
      }
      
      return englishResponse;
    } catch (error) {
      console.error('Error generating search response:', error);
      return 'We found some results that might help with your search.';
    }
  }
  
  /**
   * Search for service providers based on query
   * @param query - Search query
   * @param languageCode - Query language code
   * @returns Service provider search results
   */
  async searchServiceProviders(query: string, languageCode: string = 'en'): Promise<any[]> {
    try {
      // Process the query to extract search parameters
      const searchParams = await this.processSearchQuery(query, languageCode);
      
      // In a real implementation, this would query a database
      // For demonstration, we'll return mock results
      
      // Define provider interface
      interface Provider {
        id: string;
        name: string;
        serviceType: string;
        rating: number;
        reviews: number;
        location: string;
        description: string;
        availability: string;
        contactInfo: {
          phone: string;
          email: string;
        };
        skills?: string[];
      }
      
      // Generate mock results based on search parameters
      const mockResults: Provider[] = [];
      
      if (searchParams.serviceType) {
        // Add service providers matching the service type
        mockResults.push({
          id: 'sp1',
          name: 'Elite Home Solutions',
          serviceType: searchParams.serviceType,
          rating: 4.8,
          reviews: 124,
          location: searchParams.location || 'New York, NY',
          description: `Specialized ${searchParams.serviceType} services with over 10 years of experience.`,
          availability: 'Available next week',
          contactInfo: {
            phone: '+1 (555) 123-4567',
            email: 'info@elitehomesolutions.example.com'
          }
        });
        
        mockResults.push({
          id: 'sp2',
          name: 'Professional Craftsmen',
          serviceType: searchParams.serviceType,
          rating: 4.6,
          reviews: 98,
          location: searchParams.location || 'Chicago, IL',
          description: `Quality ${searchParams.serviceType} work at competitive prices.`,
          availability: 'Available in 3 days',
          contactInfo: {
            phone: '+1 (555) 987-6543',
            email: 'contact@procraftsmen.example.com'
          }
        });
      }
      
      // Add more mock results based on other search parameters
      if (searchParams.skills) {
        mockResults.push({
          id: 'sp3',
          name: 'Skilled Experts Team',
          serviceType: 'Various',
          skills: [searchParams.skills],
          rating: 4.9,
          reviews: 156,
          location: searchParams.location || 'Los Angeles, CA',
          description: `Specialized in ${searchParams.skills} with certified professionals.`,
          availability: 'Available immediately',
          contactInfo: {
            phone: '+1 (555) 456-7890',
            email: 'team@skilledexperts.example.com'
          }
        });
      }
      
      return mockResults;
    } catch (error) {
      console.error('Error searching service providers:', error);
      return [];
    }
  }
  
  /**
   * Search for materials based on query
   * @param query - Search query
   * @param languageCode - Query language code
   * @returns Material search results
   */
  async searchMaterials(query: string, languageCode: string = 'en'): Promise<any[]> {
    try {
      // Process the query to extract search parameters
      const searchParams = await this.processSearchQuery(query, languageCode);
      
      // In a real implementation, this would query a database
      // For demonstration, we'll return mock results
      
      // Define material interface
      interface Material {
        id: string;
        name: string;
        category: string;
        price: number;
        unit: string;
        rating: number;
        reviews: number;
        description: string;
        inStock: boolean;
        deliveryTime: string;
      }
      
      // Generate mock results based on search parameters
      const mockResults: Material[] = [];
      
      if (searchParams.materialType) {
        // Add materials matching the material type
        mockResults.push({
          id: 'm1',
          name: `Premium ${searchParams.materialType}`,
          category: searchParams.materialType,
          price: 89.99,
          unit: 'per sq ft',
          rating: 4.7,
          reviews: 85,
          description: `High-quality ${searchParams.materialType} for professional results.`,
          inStock: true,
          deliveryTime: '2-3 business days'
        });
        
        mockResults.push({
          id: 'm2',
          name: `Standard ${searchParams.materialType}`,
          category: searchParams.materialType,
          price: 49.99,
          unit: 'per sq ft',
          rating: 4.3,
          reviews: 62,
          description: `Reliable ${searchParams.materialType} for everyday projects.`,
          inStock: true,
          deliveryTime: '1-2 business days'
        });
        
        mockResults.push({
          id: 'm3',
          name: `Economy ${searchParams.materialType}`,
          category: searchParams.materialType,
          price: 29.99,
          unit: 'per sq ft',
          rating: 3.9,
          reviews: 47,
          description: `Budget-friendly ${searchParams.materialType} for cost-effective projects.`,
          inStock: true,
          deliveryTime: 'Same day delivery available'
        });
      }
      
      // Add more mock results based on project type
      if (searchParams.projectType) {
        mockResults.push({
          id: 'm4',
          name: `${searchParams.projectType} Kit`,
          category: 'Project Kits',
          price: 199.99,
          unit: 'per kit',
          rating: 4.8,
          reviews: 124,
          description: `Complete kit for ${searchParams.projectType} projects with all necessary materials.`,
          inStock: true,
          deliveryTime: '3-5 business days'
        });
      }
      
      return mockResults;
    } catch (error) {
      console.error('Error searching materials:', error);
      return [];
    }
  }
  
  /**
   * Search for jobs based on query
   * @param query - Search query
   * @param languageCode - Query language code
   * @returns Job search results
   */
  async searchJobs(query: string, languageCode: string = 'en'): Promise<any[]> {
    try {
      // Process the query to extract search parameters
      const searchParams = await this.processSearchQuery(query, languageCode);
      
      // In a real implementation, this would query a database
      // For demonstration, we'll return mock results
      
      // Define job interface
      interface Job {
        id: string;
        title: string;
        projectType: string;
        location: string;
        budget: string;
        timeframe: string;
        description: string;
        postedDate: string;
        clientRating: number;
        clientReviews: number;
      }
      
      // Generate mock results based on search parameters
      const mockResults: Job[] = [];
      
      if (searchParams.serviceType) {
        // Add jobs matching the service type
        mockResults.push({
          id: 'j1',
          title: `${searchParams.serviceType} Expert Needed`,
          projectType: searchParams.projectType || 'Renovation',
          location: searchParams.location || 'New York, NY',
          budget: searchParams.budget || '$1,000 - $5,000',
          timeframe: searchParams.timeframe || 'Within 2 weeks',
          description: `Looking for a skilled ${searchParams.serviceType} professional for a ${searchParams.projectType || 'home'} project.`,
          postedDate: '2 days ago',
          clientRating: 4.6,
          clientReviews: 8
        });
        
        mockResults.push({
          id: 'j2',
          title: `Urgent ${searchParams.serviceType} Project`,
          projectType: searchParams.projectType || 'Repair',
          location: searchParams.location || 'Chicago, IL',
          budget: searchParams.budget || '$500 - $1,500',
          timeframe: searchParams.timeframe || 'ASAP',
          description: `Need immediate assistance with a ${searchParams.serviceType} project. Experienced professionals only.`,
          postedDate: '1 day ago',
          clientRating: 4.9,
          clientReviews: 15
        });
      }
      
      // Add more mock results based on skills
      if (searchParams.skills) {
        mockResults.push({
          id: 'j3',
          title: `${searchParams.skills} Specialist Required`,
          projectType: searchParams.projectType || 'Custom Project',
          location: searchParams.location || 'Los Angeles, CA',
          budget: searchParams.budget || '$2,000 - $8,000',
          timeframe: searchParams.timeframe || 'Flexible',
          description: `Seeking a specialist with expertise in ${searchParams.skills} for a detailed project.`,
          postedDate: '3 days ago',
          clientRating: 4.7,
          clientReviews: 12
        });
      }
      
      return mockResults;
    } catch (error) {
      console.error('Error searching jobs:', error);
      return [];
    }
  }
  
  /**
   * Perform a universal search across all categories
   * @param query - Search query
   * @param languageCode - Query language code
   * @returns Combined search results
   */
  async universalSearch(query: string, languageCode: string = 'en'): Promise<any> {
    try {
      // Perform searches in parallel
      const [serviceProviders, materials, jobs] = await Promise.all([
        this.searchServiceProviders(query, languageCode),
        this.searchMaterials(query, languageCode),
        this.searchJobs(query, languageCode)
      ]);
      
      // Process the query to extract search parameters
      const searchParams = await this.processSearchQuery(query, languageCode);
      
      // Generate a natural language response
      const allResults = [...serviceProviders, ...materials, ...jobs];
      const response = await this.generateSearchResponse(searchParams, allResults, languageCode);
      
      // Return combined results
      return {
        query,
        searchParams,
        response,
        results: {
          serviceProviders,
          materials,
          jobs
        },
        totalResults: serviceProviders.length + materials.length + jobs.length
      };
    } catch (error) {
      console.error('Error performing universal search:', error);
      throw new Error('Failed to perform search');
    }
  }
  
  /**
   * Process voice search input
   * @param audioData - Audio data from voice input
   * @param languageCode - Audio language code (if known)
   * @returns Search results
   */
  async processVoiceSearch(audioData: Buffer, languageCode: string | null = null): Promise<any> {
    try {
      // Convert speech to text
      const { text, languageCode: detectedLanguage } = await groqService.speechToText(audioData, languageCode);
      
      // Perform search with the transcribed text
      const results = await this.universalSearch(text, detectedLanguage);
      
      // Return results with the transcribed text
      return {
        transcribedQuery: text,
        detectedLanguage,
        ...results
      };
    } catch (error) {
      console.error('Error processing voice search:', error);
      throw new Error('Failed to process voice search');
    }
  }
}

// Export as singleton
export default new SearchService();
