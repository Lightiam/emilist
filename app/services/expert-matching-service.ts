import groqService from './groq-service';

/**
 * ExpertMatchingService - AI-powered expert matching functionality
 * Provides intelligent matching between projects and service providers
 */
export class ExpertMatchingService {
  /**
   * Match experts to a project based on project description
   * @param projectDescription - Description of the project
   * @param location - Project location
   * @param budget - Project budget
   * @param timeline - Project timeline
   * @param languageCode - Language code
   * @returns Matched experts with scores
   */
  async matchExpertsToProject(
    projectDescription: string,
    location: string = '',
    budget: string = '',
    timeline: string = '',
    languageCode: string = 'en'
  ): Promise<any> {
    try {
      // Detect language if not provided
      if (!languageCode || languageCode === 'auto') {
        languageCode = await groqService.detectLanguage(projectDescription);
      }
      
      // Translate description to English if needed
      const translatedDescription = await groqService.translateToEnglish(projectDescription, languageCode);
      
      // Create a combined project context
      const projectContext = `
        Project Description: ${translatedDescription}
        ${location ? `Location: ${location}` : ''}
        ${budget ? `Budget: ${budget}` : ''}
        ${timeline ? `Timeline: ${timeline}` : ''}
      `;
      
      // Make a request to Groq API for expert matching
      const messages = [
        { 
          role: 'system', 
          content: `You are an AI assistant for Emilist, a platform connecting homeowners with service providers for home improvement projects. Based on the project description, analyze the project requirements and recommend the types of experts needed. Format your response as JSON with the following structure:
          {
            "projectAnalysis": {
              "summary": "Brief analysis of the project",
              "complexity": "low|medium|high",
              "estimatedDuration": "Estimated time to complete",
              "keyRequirements": ["requirement1", "requirement2"]
            },
            "recommendedExperts": [
              {
                "type": "Expert type (e.g., Plumber, Electrician)",
                "specialty": "Specific specialty",
                "reasonNeeded": "Why this expert is needed",
                "priority": "primary|secondary|optional",
                "estimatedHours": "Estimated hours needed"
              }
            ],
            "skillsRequired": ["skill1", "skill2"],
            "certifications": ["certification1", "certification2"],
            "toolsAndEquipment": ["tool1", "tool2"]
          }`
        },
        { role: 'user', content: projectContext }
      ];
      
      const response = await groqService.makeGroqRequest(messages, { temperature: 0.5 });
      const content = response.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      const projectRequirements = JSON.parse(jsonString);
      
      // Translate results back to original language if needed
      if (languageCode !== 'en') {
        projectRequirements.projectAnalysis.summary = await groqService.translateFromEnglish(
          projectRequirements.projectAnalysis.summary, 
          languageCode
        );
        
        for (let i = 0; i < projectRequirements.projectAnalysis.keyRequirements.length; i++) {
          projectRequirements.projectAnalysis.keyRequirements[i] = await groqService.translateFromEnglish(
            projectRequirements.projectAnalysis.keyRequirements[i], 
            languageCode
          );
        }
        
        for (const expert of projectRequirements.recommendedExperts) {
          expert.type = await groqService.translateFromEnglish(expert.type, languageCode);
          expert.specialty = await groqService.translateFromEnglish(expert.specialty, languageCode);
          expert.reasonNeeded = await groqService.translateFromEnglish(expert.reasonNeeded, languageCode);
        }
        
        for (let i = 0; i < projectRequirements.skillsRequired.length; i++) {
          projectRequirements.skillsRequired[i] = await groqService.translateFromEnglish(
            projectRequirements.skillsRequired[i], 
            languageCode
          );
        }
        
        for (let i = 0; i < projectRequirements.certifications.length; i++) {
          projectRequirements.certifications[i] = await groqService.translateFromEnglish(
            projectRequirements.certifications[i], 
            languageCode
          );
        }
        
        for (let i = 0; i < projectRequirements.toolsAndEquipment.length; i++) {
          projectRequirements.toolsAndEquipment[i] = await groqService.translateFromEnglish(
            projectRequirements.toolsAndEquipment[i], 
            languageCode
          );
        }
      }
      
      // In a real implementation, this would query a database of experts
      // For demonstration, we'll return mock experts with match scores
      
      // Define expert interface
      interface Expert {
        id: string;
        name: string;
        specialty: string;
        skills: string[];
        certifications: string[];
        rating: number;
        reviews: number;
        completedProjects: number;
        location: string;
        hourlyRate: number;
        availability: string;
        matchScore: number;
        matchReasons: string[];
      }
      
      // Generate mock experts based on project requirements
      const mockExperts: Expert[] = [];
      
      // Add experts for each recommended expert type
      for (const recommendedExpert of projectRequirements.recommendedExperts) {
        const expertType = recommendedExpert.type;
        const specialty = recommendedExpert.specialty;
        
        // Generate 1-3 experts for each recommended type
        const numExperts = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numExperts; i++) {
          // Calculate a match score (higher for primary experts, lower for optional)
          let baseScore = 0;
          if (recommendedExpert.priority === 'primary') {
            baseScore = 85;
          } else if (recommendedExpert.priority === 'secondary') {
            baseScore = 75;
          } else {
            baseScore = 65;
          }
          
          // Add some randomness to the score
          const matchScore = Math.min(100, baseScore + Math.floor(Math.random() * 15));
          
          // Generate match reasons
          const matchReasons = [
            `Specializes in ${specialty}`,
            `Has completed similar ${expertType.toLowerCase()} projects`,
            `Has the required skills: ${projectRequirements.skillsRequired.slice(0, 2).join(', ')}`
          ];
          
          // Add the expert
          mockExperts.push({
            id: `exp-${expertType.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
            name: this.generateExpertName(),
            specialty: specialty,
            skills: [...projectRequirements.skillsRequired.slice(0, 3), ...this.generateRandomSkills(2)],
            certifications: projectRequirements.certifications.slice(0, 2),
            rating: 4 + (Math.random() * 0.9),
            reviews: Math.floor(Math.random() * 100) + 20,
            completedProjects: Math.floor(Math.random() * 50) + 10,
            location: location || 'New York, NY',
            hourlyRate: Math.floor(Math.random() * 50) + 50,
            availability: this.generateRandomAvailability(),
            matchScore: matchScore,
            matchReasons: matchReasons
          });
        }
      }
      
      // Sort experts by match score (descending)
      mockExperts.sort((a, b) => b.matchScore - a.matchScore);
      
      // Return project requirements and matched experts
      return {
        projectRequirements,
        matchedExperts: mockExperts
      };
    } catch (error) {
      console.error('Error matching experts to project:', error);
      throw new Error('Failed to match experts to project');
    }
  }
  
  /**
   * Analyze a project description to extract key requirements
   * @param projectDescription - Description of the project
   * @param languageCode - Language code
   * @returns Project analysis
   */
  async analyzeProject(projectDescription: string, languageCode: string = 'en'): Promise<any> {
    try {
      // Detect language if not provided
      if (!languageCode || languageCode === 'auto') {
        languageCode = await groqService.detectLanguage(projectDescription);
      }
      
      // Translate description to English if needed
      const translatedDescription = await groqService.translateToEnglish(projectDescription, languageCode);
      
      // Make a request to Groq API for project analysis
      const messages = [
        { 
          role: 'system', 
          content: `You are an AI assistant for Emilist, a platform for home improvement projects. Analyze the project description to extract key requirements, estimate complexity, timeline, and budget. Format your response as JSON with the following structure:
          {
            "projectType": "Type of project",
            "complexity": "low|medium|high",
            "keyRequirements": ["requirement1", "requirement2"],
            "estimatedTimeline": {
              "min": "Minimum time (e.g., 2 weeks)",
              "max": "Maximum time (e.g., 4 weeks)"
            },
            "estimatedBudget": {
              "min": 1000,
              "max": 5000,
              "currency": "USD"
            },
            "potentialChallenges": ["challenge1", "challenge2"],
            "recommendedApproach": "Brief recommendation"
          }`
        },
        { role: 'user', content: translatedDescription }
      ];
      
      const response = await groqService.makeGroqRequest(messages, { temperature: 0.5 });
      const content = response.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      const analysis = JSON.parse(jsonString);
      
      // Translate analysis back to original language if needed
      if (languageCode !== 'en') {
        analysis.projectType = await groqService.translateFromEnglish(analysis.projectType, languageCode);
        
        for (let i = 0; i < analysis.keyRequirements.length; i++) {
          analysis.keyRequirements[i] = await groqService.translateFromEnglish(
            analysis.keyRequirements[i], 
            languageCode
          );
        }
        
        analysis.estimatedTimeline.min = await groqService.translateFromEnglish(
          analysis.estimatedTimeline.min, 
          languageCode
        );
        
        analysis.estimatedTimeline.max = await groqService.translateFromEnglish(
          analysis.estimatedTimeline.max, 
          languageCode
        );
        
        for (let i = 0; i < analysis.potentialChallenges.length; i++) {
          analysis.potentialChallenges[i] = await groqService.translateFromEnglish(
            analysis.potentialChallenges[i], 
            languageCode
          );
        }
        
        analysis.recommendedApproach = await groqService.translateFromEnglish(
          analysis.recommendedApproach, 
          languageCode
        );
      }
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing project:', error);
      throw new Error('Failed to analyze project');
    }
  }
  
  /**
   * Generate a compatibility score between an expert and a project
   * @param expertId - Expert ID
   * @param projectDescription - Description of the project
   * @param languageCode - Language code
   * @returns Compatibility analysis
   */
  async generateCompatibilityScore(expertId: string, projectDescription: string, languageCode: string = 'en'): Promise<any> {
    try {
      // In a real implementation, this would fetch the expert from a database
      // For demonstration, we'll use mock expert data
      
      // Generate a mock expert based on the expert ID
      const mockExpert = {
        id: expertId,
        name: this.generateExpertName(),
        specialty: 'General Contractor',
        skills: ['Carpentry', 'Plumbing', 'Electrical', 'Tiling'],
        certifications: ['Licensed Contractor', 'Safety Certified'],
        experience: '10+ years',
        completedProjects: 87,
        rating: 4.8,
        reviews: 124,
        projectTypes: ['Renovation', 'Remodeling', 'New Construction']
      };
      
      // Detect language if not provided
      if (!languageCode || languageCode === 'auto') {
        languageCode = await groqService.detectLanguage(projectDescription);
      }
      
      // Translate description to English if needed
      const translatedDescription = await groqService.translateToEnglish(projectDescription, languageCode);
      
      // Create a context with both expert and project information
      const context = `
        Expert Information:
        Name: ${mockExpert.name}
        Specialty: ${mockExpert.specialty}
        Skills: ${mockExpert.skills.join(', ')}
        Certifications: ${mockExpert.certifications.join(', ')}
        Experience: ${mockExpert.experience}
        Completed Projects: ${mockExpert.completedProjects}
        Project Types: ${mockExpert.projectTypes.join(', ')}
        
        Project Description:
        ${translatedDescription}
      `;
      
      // Make a request to Groq API for compatibility analysis
      const messages = [
        { 
          role: 'system', 
          content: `You are an AI assistant for Emilist, a platform connecting homeowners with service providers for home improvement projects. Analyze the compatibility between the expert and the project. Format your response as JSON with the following structure:
          {
            "compatibilityScore": 0-100,
            "strengths": ["strength1", "strength2"],
            "weaknesses": ["weakness1", "weakness2"],
            "recommendation": "Hire|Consider|Not Recommended",
            "explanation": "Brief explanation of the compatibility score",
            "additionalExperts": [
              {
                "type": "Expert type needed to complement",
                "reason": "Why this additional expert is needed"
              }
            ]
          }`
        },
        { role: 'user', content: context }
      ];
      
      const response = await groqService.makeGroqRequest(messages, { temperature: 0.5 });
      const content = response.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      const compatibility = JSON.parse(jsonString);
      
      // Translate compatibility analysis back to original language if needed
      if (languageCode !== 'en') {
        for (let i = 0; i < compatibility.strengths.length; i++) {
          compatibility.strengths[i] = await groqService.translateFromEnglish(
            compatibility.strengths[i], 
            languageCode
          );
        }
        
        for (let i = 0; i < compatibility.weaknesses.length; i++) {
          compatibility.weaknesses[i] = await groqService.translateFromEnglish(
            compatibility.weaknesses[i], 
            languageCode
          );
        }
        
        compatibility.recommendation = await groqService.translateFromEnglish(
          compatibility.recommendation, 
          languageCode
        );
        
        compatibility.explanation = await groqService.translateFromEnglish(
          compatibility.explanation, 
          languageCode
        );
        
        for (const additionalExpert of compatibility.additionalExperts) {
          additionalExpert.type = await groqService.translateFromEnglish(
            additionalExpert.type, 
            languageCode
          );
          
          additionalExpert.reason = await groqService.translateFromEnglish(
            additionalExpert.reason, 
            languageCode
          );
        }
      }
      
      // Return the expert and compatibility analysis
      return {
        expert: mockExpert,
        compatibility
      };
    } catch (error) {
      console.error('Error generating compatibility score:', error);
      throw new Error('Failed to generate compatibility score');
    }
  }
  
  /**
   * Generate a team of experts for a complex project
   * @param projectDescription - Description of the project
   * @param budget - Project budget
   * @param timeline - Project timeline
   * @param languageCode - Language code
   * @returns Team of experts
   */
  async generateExpertTeam(
    projectDescription: string,
    budget: string = '',
    timeline: string = '',
    languageCode: string = 'en'
  ): Promise<any> {
    try {
      // First, analyze the project to understand requirements
      const projectAnalysis = await this.analyzeProject(projectDescription, languageCode);
      
      // Then, match experts to the project
      const { matchedExperts } = await this.matchExpertsToProject(
        projectDescription,
        '',
        budget,
        timeline,
        languageCode
      );
      
      // Organize experts into a team structure
      const teamLead = matchedExperts.find((expert: any) => 
        expert.specialty.toLowerCase().includes('general') || 
        expert.specialty.toLowerCase().includes('project')
      ) || matchedExperts[0];
      
      // Remove team lead from the pool
      const remainingExperts = matchedExperts.filter((expert: any) => expert.id !== teamLead.id);
      
      // Select specialists based on project requirements
      const specialists = remainingExperts.slice(0, 3);
      
      // Calculate team cost estimates
      const hourlyRates = [teamLead.hourlyRate, ...specialists.map((expert: any) => expert.hourlyRate)];
      const avgHourlyRate = hourlyRates.reduce((sum, rate) => sum + rate, 0) / hourlyRates.length;
      
      // Parse project complexity to estimate hours
      let estimatedHours = 0;
      switch (projectAnalysis.complexity) {
        case 'low':
          estimatedHours = 40;
          break;
        case 'medium':
          estimatedHours = 80;
          break;
        case 'high':
          estimatedHours = 160;
          break;
        default:
          estimatedHours = 80;
      }
      
      // Calculate cost estimate
      const costEstimate = {
        min: Math.round(estimatedHours * avgHourlyRate * 0.8),
        max: Math.round(estimatedHours * avgHourlyRate * 1.2),
        currency: 'USD'
      };
      
      // Return the team structure
      return {
        projectAnalysis,
        team: {
          teamLead,
          specialists,
          totalExperts: specialists.length + 1
        },
        costEstimate,
        estimatedHours: {
          min: Math.round(estimatedHours * 0.8),
          max: Math.round(estimatedHours * 1.2)
        },
        timeline: projectAnalysis.estimatedTimeline
      };
    } catch (error) {
      console.error('Error generating expert team:', error);
      throw new Error('Failed to generate expert team');
    }
  }
  
  // Helper methods
  
  /**
   * Generate a random expert name
   * @returns Random expert name
   */
  private generateExpertName(): string {
    const firstNames = [
      'Michael', 'Jennifer', 'David', 'Sarah', 'Robert', 'Lisa', 'William', 'Elizabeth',
      'James', 'Jessica', 'John', 'Ashley', 'Richard', 'Amanda', 'Thomas', 'Stephanie'
    ];
    
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia',
      'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore'
    ];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  }
  
  /**
   * Generate random skills
   * @param count - Number of skills to generate
   * @returns Array of random skills
   */
  private generateRandomSkills(count: number): string[] {
    const skills = [
      'Framing', 'Drywall', 'Painting', 'Flooring', 'Cabinetry',
      'Countertops', 'Roofing', 'Siding', 'Insulation', 'HVAC',
      'Plumbing', 'Electrical', 'Masonry', 'Concrete', 'Landscaping',
      'Fencing', 'Decking', 'Windows', 'Doors', 'Trim Work'
    ];
    
    const selectedSkills: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomSkill = skills[Math.floor(Math.random() * skills.length)];
      
      if (!selectedSkills.includes(randomSkill)) {
        selectedSkills.push(randomSkill);
      } else {
        // Try again if we selected a duplicate
        i--;
      }
    }
    
    return selectedSkills;
  }
  
  /**
   * Generate random availability
   * @returns Random availability string
   */
  private generateRandomAvailability(): string {
    const availabilityOptions = [
      'Available immediately',
      'Available next week',
      'Available in 2 weeks',
      'Available from next month',
      'Limited availability',
      'Weekends only',
      'Evenings and weekends'
    ];
    
    return availabilityOptions[Math.floor(Math.random() * availabilityOptions.length)];
  }
}

// Export as singleton
export default new ExpertMatchingService();
