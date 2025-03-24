import { BaseAIService } from './baseAIService';

export class ExpertMatchingService extends BaseAIService {
  private readonly apiKey = process.env.GROQ_API_KEY;
  private readonly useMockResponses = true; // Set to false in production
  
  /**
   * Find matching experts based on project description, location, and budget
   * @param projectDescription Description of the project
   * @param location Location where the project will be executed
   * @param budget Budget for the project
   * @param language Language code for multilingual support
   * @returns Matching experts with project analysis
   */
  async findMatchingExperts(
    projectDescription: string, 
    location: string, 
    budget: number,
    language: string = 'en-US'
  ): Promise<any> {
    try {
      // Process "Hi Emi" prefix if present
      const processedDescription = this.processEmiPrefix(projectDescription);
      
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        return this.getMockResponse('expert-matching', language);
      }
      
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      
      // Get language-specific system prompt
      const systemPrompt = this.getSystemPromptForLanguage(language);
      
      // First, analyze the project to identify required skills and expertise
      const projectAnalysisData = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Analyze this project request and extract key requirements: "${processedDescription}". Identify required skills, expertise level, materials needed, estimated duration, and any specific certifications that might be important. Return the analysis as JSON.`
          }
        ],
        temperature: 0.2,
        max_tokens: 750
      };
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
      
      // Use enhanced request with language and retry options
      const analysisResponse = await this.makeRequest(endpoint, projectAnalysisData, headers, {
        language: language,
        retries: 2,
        timeout: 20000
      });
      
      const projectAnalysis = JSON.parse(analysisResponse.choices[0].message.content);
      
      // Now we would use this analysis to query the database and find matching experts
      // This would connect to the existing backend API
      
      return {
        success: true,
        projectAnalysis,
        language,
        matchParameters: {
          skills: projectAnalysis.skills,
          expertiseLevel: projectAnalysis.expertiseLevel,
          location: location,
          budget: budget
        }
      };
    } catch (error) {
      // Use localized error messages based on language
      const errorKey = 'expert_matching_failed';
      const errorMessage = this.getLocalizedErrorMessage(errorKey, language) || 
                          'Failed to find matching experts';
      
      return this.handleError(typeof error === 'string' ? error : errorMessage);
    }
  }
  
  /**
   * Rank experts by fit to project requirements
   * @param experts List of experts to rank
   * @param projectRequirements Project requirements
   * @param language Language code for multilingual support
   * @returns Ranked experts with match scores
   */
  async rankExpertsByFit(
    experts: any[], 
    projectRequirements: any,
    language: string = 'en-US'
  ): Promise<any> {
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
        
        // Calculate language compatibility score
        const languageScore = this.calculateLanguageCompatibility(expert.languages || [], language);
        
        // Calculate overall score with weighted factors
        const overallScore = (skillMatchScore * 0.35) + (locationScore * 0.25) + 
                             (expertiseScore * 0.15) + (budgetScore * 0.15) +
                             (languageScore * 0.1);
        
        return {
          ...expert,
          matchScore: overallScore,
          skillMatchScore,
          locationScore,
          expertiseScore,
          budgetScore,
          languageScore
        };
      });
      
      // Sort by overall score
      scoredExperts.sort((a, b) => b.matchScore - a.matchScore);
      
      return {
        success: true,
        language,
        experts: scoredExperts
      };
    } catch (error) {
      // Use localized error messages based on language
      const errorKey = 'expert_ranking_failed';
      const errorMessage = this.getLocalizedErrorMessage(errorKey, language) || 
                          'Failed to rank experts by fit';
      
      return this.handleError(typeof error === 'string' ? error : errorMessage);
    }
  }
  
  /**
   * Find experts based on voice query
   * @param voiceQuery Voice query from the user (e.g., "Hi Emi find me an expert plumber in Lagos")
   * @param language Language code for multilingual support
   * @returns Matching experts based on voice query
   */
  async findExpertsByVoiceQuery(
    voiceQuery: string,
    language: string = 'en-US'
  ): Promise<any> {
    try {
      // Process "Hi Emi" prefix if present
      const processedQuery = this.processEmiPrefix(voiceQuery);
      
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        // Return language-specific mock data
        const langPrefix = language.split('-')[0];
        
        if (langPrefix === 'fr') {
          return {
            success: true,
            language,
            query: processedQuery,
            experts: [
              {
                id: 1,
                name: "Jean Adebayo",
                profession: "Mécanicien Automobile",
                specialization: "Voitures Allemandes",
                location: "Ikoyi, Lagos",
                rating: 4.9,
                reviews: 127,
                languages: ["fr-FR", "en-NG"],
                availability: "Disponible maintenant",
                distance: "1.2 km",
                matchScore: 0.95
              },
              {
                id: 2,
                name: "Chioma Okafor",
                profession: "Mécanicien Automobile",
                specialization: "Voitures Japonaises",
                location: "Victoria Island, Lagos",
                rating: 4.8,
                reviews: 93,
                languages: ["en-NG", "fr-FR"],
                availability: "Disponible demain",
                distance: "3.5 km",
                matchScore: 0.87
              }
            ]
          };
        } else if (langPrefix === 'yo') {
          return {
            success: true,
            language,
            query: processedQuery,
            experts: [
              {
                id: 1,
                name: "John Adebayo",
                profession: "Onímèkaníìkì Mọ̀tò",
                specialization: "Ọkọ̀ Jámánì",
                location: "Ikoyi, Lagos",
                rating: 4.9,
                reviews: 127,
                languages: ["yo-NG", "en-NG"],
                availability: "Ṣiṣẹ́ báyìí",
                distance: "1.2 km",
                matchScore: 0.95
              },
              {
                id: 2,
                name: "Chioma Okafor",
                profession: "Onímèkaníìkì Mọ̀tò",
                specialization: "Ọkọ̀ Jápáànù",
                location: "Victoria Island, Lagos",
                rating: 4.8,
                reviews: 93,
                languages: ["yo-NG", "ig-NG", "en-NG"],
                availability: "Ṣiṣẹ́ ọ̀la",
                distance: "3.5 km",
                matchScore: 0.87
              }
            ]
          };
        }
        
        // Default English response
        return {
          success: true,
          language,
          query: processedQuery,
          experts: [
            {
              id: 1,
              name: "John Adebayo",
              profession: "Auto Mechanic",
              specialization: "German Cars",
              location: "Ikoyi, Lagos",
              rating: 4.9,
              reviews: 127,
              languages: ["en-NG", "yo-NG"],
              availability: "Available now",
              distance: "1.2 km away",
              matchScore: 0.95
            },
            {
              id: 2,
              name: "Chioma Okafor",
              profession: "Auto Mechanic",
              specialization: "Japanese Cars",
              location: "Victoria Island, Lagos",
              rating: 4.8,
              reviews: 93,
              languages: ["en-NG", "ig-NG"],
              availability: "Available tomorrow",
              distance: "3.5 km away",
              matchScore: 0.87
            },
            {
              id: 3,
              name: "Mohammed Ibrahim",
              profession: "Auto Mechanic",
              specialization: "Diagnostics Expert",
              location: "Lekki, Lagos",
              rating: 4.7,
              reviews: 78,
              languages: ["en-NG", "ha-NG"],
              availability: "Available in 3 hours",
              distance: "5.8 km away",
              matchScore: 0.82
            }
          ]
        };
      }
      
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      
      // Get language-specific system prompt
      const systemPrompt = this.getSystemPromptForLanguage(language);
      
      // Extract search parameters from voice query
      const extractionData = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Extract search parameters from this voice query: "${processedQuery}". Identify profession/service type, location, any specific skills or specializations mentioned, and any other relevant criteria. Return the extraction as JSON.`
          }
        ],
        temperature: 0.2,
        max_tokens: 500
      };
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
      
      // Use enhanced request with language and retry options
      const extractionResponse = await this.makeRequest(endpoint, extractionData, headers, {
        language: language,
        retries: 2,
        timeout: 15000
      });
      
      const extractedParams = JSON.parse(extractionResponse.choices[0].message.content);
      
      // Now we would use these parameters to query the database and find matching experts
      // This would connect to the existing backend API
      
      return {
        success: true,
        language,
        query: processedQuery,
        extractedParams,
        // Mock experts for now - in production this would come from the database
        experts: [
          {
            id: 1,
            name: "John Adebayo",
            profession: extractedParams.profession || "Expert",
            specialization: extractedParams.specialization || "General",
            location: extractedParams.location || "Lagos",
            rating: 4.9,
            reviews: 127,
            languages: ["en-NG", "yo-NG"],
            availability: "Available now",
            distance: "1.2 km away",
            matchScore: 0.95
          },
          {
            id: 2,
            name: "Chioma Okafor",
            profession: extractedParams.profession || "Expert",
            specialization: extractedParams.specialization || "General",
            location: extractedParams.location || "Lagos",
            rating: 4.8,
            reviews: 93,
            languages: ["en-NG", "ig-NG"],
            availability: "Available tomorrow",
            distance: "3.5 km away",
            matchScore: 0.87
          }
        ]
      };
    } catch (error) {
      // Use localized error messages based on language
      const errorKey = 'voice_query_failed';
      const errorMessage = this.getLocalizedErrorMessage(errorKey, language) || 
                          'Failed to process voice query';
      
      return this.handleError(typeof error === 'string' ? error : errorMessage);
    }
  }
  
  // Helper methods for scoring
  private calculateSkillMatch(expertSkills: string[], requiredSkills: string[]): number {
    if (!expertSkills || !requiredSkills || expertSkills.length === 0 || requiredSkills.length === 0) {
      return 0.5; // Neutral score if no skills data
    }
    
    // Enhanced implementation with weighted skill matching
    let exactMatchCount = 0;
    let partialMatchCount = 0;
    let totalWeight = 0;
    
    // Assign weights to required skills (could be based on importance)
    const skillWeights = requiredSkills.map((_, index) => {
      // Skills mentioned earlier are often more important
      const weight = 1 - (index * 0.1 > 0.5 ? 0.5 : index * 0.1);
      totalWeight += weight;
      return weight;
    });
    
    // Calculate weighted matches
    let weightedMatchScore = 0;
    
    for (let i = 0; i < requiredSkills.length; i++) {
      const requiredSkill = requiredSkills[i].toLowerCase();
      const weight = skillWeights[i];
      
      // Check for exact match
      if (expertSkills.some(s => s.toLowerCase() === requiredSkill)) {
        exactMatchCount++;
        weightedMatchScore += weight;
      } 
      // Check for partial match
      else if (expertSkills.some(s => s.toLowerCase().includes(requiredSkill) || 
                                     requiredSkill.includes(s.toLowerCase()))) {
        partialMatchCount++;
        weightedMatchScore += weight * 0.5;
      }
    }
    
    // Calculate final score with bonus for having exact matches
    const baseScore = totalWeight > 0 ? weightedMatchScore / totalWeight : 0;
    const exactMatchBonus = exactMatchCount > 0 ? 0.1 : 0;
    
    return Math.min(1.0, baseScore + exactMatchBonus);
  }
  
  private calculateLocationProximity(expertLocation: string, projectLocation: string): number {
    if (!expertLocation || !projectLocation) {
      return 0.5; // Neutral score if location data is missing
    }
    
    // Enhanced implementation with more granular location matching
    const expertLocationLower = expertLocation.toLowerCase();
    const projectLocationLower = projectLocation.toLowerCase();
    
    // Split locations into components (e.g., "Ikoyi, Lagos" -> ["ikoyi", "lagos"])
    const expertLocationParts = expertLocationLower.split(/[,\s]+/).filter(Boolean);
    const projectLocationParts = projectLocationLower.split(/[,\s]+/).filter(Boolean);
    
    // Exact full string match
    if (expertLocationLower === projectLocationLower) {
      return 1.0;
    }
    
    // Count matching location parts
    let matchingParts = 0;
    let totalParts = projectLocationParts.length;
    
    for (const part of projectLocationParts) {
      if (expertLocationParts.includes(part)) {
        matchingParts++;
      }
    }
    
    // Calculate match percentage with higher weight for more specific matches
    if (matchingParts === 0) {
      // Check for partial text matches if no exact part matches
      if (expertLocationLower.includes(projectLocationLower) || 
          projectLocationLower.includes(expertLocationLower)) {
        return 0.6;
      }
      
      // Check if any parts partially match
      for (const projectPart of projectLocationParts) {
        if (expertLocationParts.some(expertPart => 
            expertPart.includes(projectPart) || projectPart.includes(expertPart))) {
          return 0.4;
        }
      }
      
      return 0.1; // Very low match
    }
    
    // Calculate score based on matching parts ratio with a bonus for matching all parts
    const matchRatio = matchingParts / totalParts;
    const allPartsBonus = matchingParts === totalParts ? 0.2 : 0;
    
    return Math.min(1.0, matchRatio * 0.8 + allPartsBonus);
  }
  
  private calculateExpertiseMatch(expertLevel: string, requiredLevel: string): number {
    if (!expertLevel || !requiredLevel) {
      return 0.5; // Neutral score if expertise data is missing
    }
    
    // Enhanced implementation with more granular level mapping
    const levels = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
    
    // Normalize levels to handle variations in terminology
    const normalizedExpertLevel = this.normalizeExpertiseLevel(expertLevel);
    const normalizedRequiredLevel = this.normalizeExpertiseLevel(requiredLevel);
    
    const expertIdx = levels.findIndex(l => l === normalizedExpertLevel.toLowerCase());
    const requiredIdx = levels.findIndex(l => l === normalizedRequiredLevel.toLowerCase());
    
    // Handle unknown levels
    if (expertIdx === -1 || requiredIdx === -1) {
      // If we can't determine the level, give a neutral score
      return 0.5;
    }
    
    // Expert exactly matches required level
    if (expertIdx === requiredIdx) {
      return 1.0;
    }
    
    // Expert exceeds required level
    if (expertIdx > requiredIdx) {
      // Higher score for being just one level above (e.g., advanced when intermediate is required)
      // Lower score for being much higher (might be overqualified/expensive)
      const levelDifference = expertIdx - requiredIdx;
      return Math.max(0.7, 1.0 - (levelDifference - 1) * 0.1);
    }
    
    // Expert is below required level
    const levelDeficit = requiredIdx - expertIdx;
    
    // One level below might still be acceptable
    if (levelDeficit === 1) {
      return 0.6;
    }
    
    // Two levels below is less desirable
    if (levelDeficit === 2) {
      return 0.3;
    }
    
    // More than two levels below is not a good match
    return 0.1;
  }
  
  /**
   * Normalize expertise level terms to standard categories
   * @param level Original expertise level term
   * @returns Normalized level term
   */
  private normalizeExpertiseLevel(level: string): string {
    const lowerLevel = level.toLowerCase();
    
    // Map various terms to standard levels
    if (lowerLevel.includes('begin') || lowerLevel.includes('junior') || lowerLevel.includes('entry')) {
      return 'beginner';
    } else if (lowerLevel.includes('inter') || lowerLevel.includes('mid')) {
      return 'intermediate';
    } else if (lowerLevel.includes('advanc') || lowerLevel.includes('senior') || lowerLevel.includes('high')) {
      return 'advanced';
    } else if (lowerLevel.includes('expert') || lowerLevel.includes('special')) {
      return 'expert';
    } else if (lowerLevel.includes('master') || lowerLevel.includes('elite') || lowerLevel.includes('premium')) {
      return 'master';
    }
    
    // Default to intermediate if we can't determine
    return 'intermediate';
  }
  
  private calculateBudgetAlignment(expertRateRange: any, projectBudget: number): number {
    if (!expertRateRange || !projectBudget) {
      return 0.5; // Neutral score if budget data is missing
    }
    
    // Handle different rate range formats
    let min = 0;
    let max = 0;
    
    if (typeof expertRateRange === 'object' && expertRateRange !== null) {
      // Object with min/max properties
      min = expertRateRange.min || 0;
      max = expertRateRange.max || 0;
    } else if (typeof expertRateRange === 'number') {
      // Single number (fixed rate)
      min = max = expertRateRange;
    } else if (typeof expertRateRange === 'string') {
      // String format (e.g., "1000-2000")
      const parts = expertRateRange.split('-').map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
      if (parts.length >= 2) {
        min = parts[0] || 0;
        max = parts[1] || 0;
      } else if (parts.length === 1) {
        min = max = parts[0] || 0;
      }
    }
    
    // Ensure min and max are valid
    if (min > max) {
      [min, max] = [max, min];
    }
    
    // Expert's rate is within budget
    if (min <= projectBudget && max >= projectBudget) {
      return 1.0;
    }
    
    // Expert's minimum rate is slightly above budget (within 20%)
    if (min > projectBudget && min <= projectBudget * 1.2) {
      return 0.7;
    }
    
    // Expert's maximum rate is slightly below budget (within 20%)
    if (max < projectBudget && max >= projectBudget * 0.8) {
      return 0.8;
    }
    
    // Expert's rate is significantly above budget
    if (min > projectBudget * 1.2) {
      // Calculate how far above budget
      const ratio = min / projectBudget;
      // Score decreases as ratio increases
      return Math.max(0.1, 0.5 - (ratio - 1.2) * 0.2);
    }
    
    // Expert's rate is significantly below budget
    if (max < projectBudget * 0.8) {
      // Calculate how far below budget
      const ratio = max / projectBudget;
      // Score decreases as ratio decreases
      return Math.max(0.3, ratio);
    }
    
    // Fallback
    return 0.5;
  }
  
  /**
   * Calculate language compatibility score
   * @param expertLanguages Languages spoken by the expert
   * @param userLanguage User's preferred language
   * @returns Language compatibility score between 0 and 1
   */
  private calculateLanguageCompatibility(expertLanguages: string[], userLanguage: string): number {
    if (!expertLanguages || expertLanguages.length === 0 || !userLanguage) {
      return 0.5; // Neutral score if language data is missing
    }
    
    // Get language prefix (e.g., 'en' from 'en-US')
    const userLangPrefix = userLanguage.split('-')[0].toLowerCase();
    
    // Language families for better matching across related languages
    const languageFamilies: Record<string, string[]> = {
      'germanic': ['en', 'de', 'nl', 'af', 'sv', 'no', 'da', 'is'],
      'romance': ['fr', 'es', 'it', 'pt', 'ro', 'ca'],
      'slavic': ['ru', 'uk', 'pl', 'cs', 'sk', 'bg', 'hr', 'sr', 'sl'],
      'indic': ['hi', 'bn', 'pa', 'gu', 'mr', 'ne', 'si', 'ur'],
      'african': ['sw', 'yo', 'ha', 'ig', 'zu', 'xh', 'st', 'sn'],
      'semitic': ['ar', 'he', 'am', 'ti'],
      'turkic': ['tr', 'az', 'kk', 'ky', 'uz', 'ug'],
      'sinitic': ['zh', 'yue', 'wuu', 'hak', 'nan']
    };
    
    // Find user language family
    let userLangFamily = '';
    for (const [family, languages] of Object.entries(languageFamilies)) {
      if (languages.includes(userLangPrefix)) {
        userLangFamily = family;
        break;
      }
    }
    
    // Normalize expert languages for comparison
    const normalizedExpertLangs = expertLanguages.map(lang => {
      const parts = lang.split('-');
      return parts[0].toLowerCase();
    });
    
    // Check for exact match (e.g., 'en-US' and 'en-US')
    if (expertLanguages.some(lang => lang.toLowerCase() === userLanguage.toLowerCase())) {
      return 1.0;
    }
    
    // Check for language prefix match (e.g., 'en-US' and 'en-GB')
    if (normalizedExpertLangs.includes(userLangPrefix)) {
      return 0.9;
    }
    
    // Check for language family match (e.g., 'fr' and 'es' are both Romance languages)
    if (userLangFamily) {
      const expertLangFamilies = new Set<string>();
      
      for (const expertLang of normalizedExpertLangs) {
        for (const [family, languages] of Object.entries(languageFamilies)) {
          if (languages.includes(expertLang)) {
            expertLangFamilies.add(family);
            break;
          }
        }
      }
      
      if (expertLangFamilies.has(userLangFamily)) {
        return 0.7;
      }
    }
    
    // Check if expert speaks English (as a common fallback)
    if (userLangPrefix !== 'en' && normalizedExpertLangs.includes('en')) {
      return 0.6;
    }
    
    // Check if expert speaks any widely spoken language
    const widelySpokenLanguages = ['en', 'zh', 'es', 'ar', 'fr', 'ru'];
    for (const lang of widelySpokenLanguages) {
      if (userLangPrefix !== lang && normalizedExpertLangs.includes(lang)) {
        return 0.4;
      }
    }
    
    return 0.2; // Very low compatibility if no matches
  }
  
  /**
   * Process "Hi Emi" prefix in queries
   * @param query Original query
   * @returns Processed query with prefix removed if present
   */
  private processEmiPrefix(query: string): string {
    // Check if query starts with "Hi Emi" (case insensitive)
    if (query.toLowerCase().startsWith('hi emi')) {
      // Remove the prefix and trim any extra spaces
      return query.substring(6).trim();
    }
    return query;
  }
  
  /**
   * Get language-specific system prompt
   * @param language Language code
   * @returns System prompt in the appropriate language
   */
  private getSystemPromptForLanguage(language: string): string {
    const langPrefix = language.split('-')[0];
    
    const systemPrompts: Record<string, string> = {
      'en': "You are an expert construction and renovation project analyzer. Extract key requirements from project descriptions to match with skilled professionals.",
      'fr': "Vous êtes un expert en analyse de projets de construction et de rénovation. Extrayez les exigences clés des descriptions de projets pour les associer à des professionnels qualifiés.",
      'es': "Eres un experto analizador de proyectos de construcción y renovación. Extrae requisitos clave de las descripciones de proyectos para emparejarlos con profesionales cualificados.",
      'de': "Sie sind ein Experte für die Analyse von Bau- und Renovierungsprojekten. Extrahieren Sie wichtige Anforderungen aus Projektbeschreibungen, um sie mit qualifizierten Fachleuten abzugleichen.",
      'zh': "您是建筑和装修项目分析专家。从项目描述中提取关键要求，以匹配熟练的专业人员。",
      'ar': "أنت محلل خبير في مشاريع البناء والتجديد. استخرج المتطلبات الرئيسية من أوصاف المشروع لمطابقتها مع المهنيين المهرة.",
      'hi': "आप एक विशेषज्ञ निर्माण और नवीनीकरण परियोजना विश्लेषक हैं। कुशल पेशेवरों के साथ मिलान करने के लिए परियोजना विवरणों से महत्वपूर्ण आवश्यकताओं को निकालें।",
      'sw': "Wewe ni mtaalam wa uchambuzi wa miradi ya ujenzi na ukarabati. Toa mahitaji muhimu kutoka kwa maelezo ya mradi ili kulingana na wataalamu wenye ujuzi.",
      'yo': "Ìwọ jẹ́ akọ́ṣẹ́mọṣẹ́ onítumọ̀ iṣẹ́ kíkọ́ àti àtúnṣe. Yọ àwọn àìní pàtàkì kúrò nínú àpèjúwe iṣẹ́ láti bá àwọn òṣìṣẹ́ tí ó ní ìmọ̀ mu."
    };
    
    // Return language-specific prompt or default to English
    return systemPrompts[langPrefix] || systemPrompts['en'];
  }
}

export default new ExpertMatchingService();
