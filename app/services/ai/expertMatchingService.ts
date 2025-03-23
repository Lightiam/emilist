import { BaseAIService } from './baseAIService';

export class ExpertMatchingService extends BaseAIService {
  private readonly apiKey = process.env.GROQ_API_KEY;
  private readonly useMockResponses = true; // Set to false in production
  
  async findMatchingExperts(projectDescription: string, location: string, budget: number) {
    try {
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        return this.getMockResponse('expert-matching');
      }
      
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      
      // First, analyze the project to identify required skills and expertise
      const projectAnalysisData = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are an expert construction and renovation project analyzer."
          },
          {
            role: "user",
            content: `Analyze this project request and extract key requirements: "${projectDescription}". Identify required skills, expertise level, materials needed, estimated duration, and any specific certifications that might be important. Return the analysis as JSON.`
          }
        ],
        temperature: 0.2,
        max_tokens: 750
      };
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
      
      const analysisResponse = await this.makeRequest(endpoint, projectAnalysisData, headers);
      const projectAnalysis = JSON.parse(analysisResponse.choices[0].message.content);
      
      // Now we would use this analysis to query the database and find matching experts
      // This would connect to the existing backend API
      
      return {
        success: true,
        projectAnalysis,
        matchParameters: {
          skills: projectAnalysis.skills,
          expertiseLevel: projectAnalysis.expertiseLevel,
          location: location,
          budget: budget
        }
      };
    } catch (error) {
      return this.handleError(typeof error === 'string' ? error : 'Failed to find matching experts');
    }
  }
  
  async rankExpertsByFit(experts: any[], projectRequirements: any) {
    try {
      // Implement a scoring and ranking algorithm for experts based on project fit
      // This would incorporate ratings, reviews, past projects, and specific expertise
      
      const scoredExperts = experts.map(expert => {
        // Calculate skill match score
        const skillMatchScore = this.calculateSkillMatch(expert.skills, projectRequirements.skills);
        
        // Calculate location proximity score
        const locationScore = this.calculateLocationProximity(expert.location, projectRequirements.location);
        
        // Calculate expertise level match
        const expertiseScore = this.calculateExpertiseMatch(expert.level, projectRequirements.expertiseLevel);
        
        // Calculate budget alignment
        const budgetScore = this.calculateBudgetAlignment(expert.rateRange, projectRequirements.budget);
        
        // Calculate overall score with weighted factors
        const overallScore = (skillMatchScore * 0.4) + (locationScore * 0.25) + 
                             (expertiseScore * 0.2) + (budgetScore * 0.15);
        
        return {
          ...expert,
          matchScore: overallScore,
          skillMatchScore,
          locationScore,
          expertiseScore,
          budgetScore
        };
      });
      
      // Sort by overall score
      scoredExperts.sort((a, b) => b.matchScore - a.matchScore);
      
      return {
        success: true,
        experts: scoredExperts
      };
    } catch (error) {
      return this.handleError(typeof error === 'string' ? error : 'Failed to rank experts by fit');
    }
  }
  
  // Helper methods for scoring
  private calculateSkillMatch(expertSkills: string[], requiredSkills: string[]) {
    // Implementation of skill matching algorithm
    let matchCount = 0;
    for (const skill of requiredSkills) {
      if (expertSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        matchCount++;
      }
    }
    return requiredSkills.length > 0 ? matchCount / requiredSkills.length : 0;
  }
  
  private calculateLocationProximity(expertLocation: string, projectLocation: string) {
    // In a real implementation, this would use geocoding and distance calculation
    // For now, exact match gets 1.0, partial match 0.5, no match 0
    if (expertLocation.toLowerCase() === projectLocation.toLowerCase()) {
      return 1.0;
    } else if (expertLocation.toLowerCase().includes(projectLocation.toLowerCase()) || 
               projectLocation.toLowerCase().includes(expertLocation.toLowerCase())) {
      return 0.5;
    }
    return 0;
  }
  
  private calculateExpertiseMatch(expertLevel: string, requiredLevel: string) {
    // Simple implementation - could be more sophisticated with level mapping
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const expertIdx = levels.findIndex(l => l === expertLevel.toLowerCase());
    const requiredIdx = levels.findIndex(l => l === requiredLevel.toLowerCase());
    
    if (expertIdx >= requiredIdx) {
      return 1.0;
    }
    return 0.5;
  }
  
  private calculateBudgetAlignment(expertRateRange: any, projectBudget: number) {
    const { min, max } = expertRateRange;
    
    // Expert's rate is within budget
    if (min <= projectBudget && max >= projectBudget) {
      return 1.0;
    }
    
    // Expert's minimum rate is slightly above budget (within 20%)
    if (min > projectBudget && min <= projectBudget * 1.2) {
      return 0.7;
    }
    
    // Expert's rate is significantly above budget
    return 0.3;
  }
}

export default new ExpertMatchingService();
