import { BaseAIService } from './baseAIService';

export class MaterialRecommendationService extends BaseAIService {
  private readonly apiKey = process.env.GROQ_API_KEY;
  private readonly useMockResponses = true; // Set to false in production
  
  /**
   * Recommend materials based on project description and budget
   * @param projectDescription Description of the project
   * @param budget Budget for the project
   * @param language Language code for multilingual support
   * @returns Recommended materials with details
   */
  async recommendMaterials(
    projectDescription: string, 
    budget: number,
    language: string = 'en-US'
  ): Promise<any> {
    try {
      // Process "Hi Emi" prefix if present
      const processedDescription = this.processEmiPrefix(projectDescription);
      
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        // Get language-specific mock response
        const langPrefix = language.split('-')[0];
        
        if (langPrefix === 'fr') {
          return {
            success: true,
            projectDescription: processedDescription,
            budget,
            language,
            recommendations: {
              revêtement_de_sol: [
                {
                  type: "Bois franc",
                  marque: "Bruce",
                  quantité_estimée: "46 m²",
                  prix: "€50-70 par m²",
                  considérations: "Nécessite une installation professionnelle, ne convient pas aux zones à forte humidité"
                },
                {
                  type: "Planches de vinyle de luxe",
                  marque: "LifeProof",
                  quantité_estimée: "46 m²",
                  prix: "€25-40 par m²",
                  considérations: "Facile à installer soi-même, imperméable, idéal pour les cuisines et les salles de bains"
                }
              ],
              peinture: [
                {
                  type: "Peinture murale intérieure",
                  marque: "Behr Premium Plus",
                  quantité_estimée: "11-15 litres",
                  prix: "€30-35 par litre",
                  considérations: "Faible teneur en COV, bonne couverture, auto-apprêtante"
                }
              ],
              accessoires: [
                {
                  type: "Robinet de cuisine",
                  marque: "Moen Arbor",
                  quantité_estimée: "1",
                  prix: "€180-220",
                  considérations: "Finition inoxydable résistante aux taches, douchette extractible"
                }
              ]
            }
          };
        } else if (langPrefix === 'yo') {
          return {
            success: true,
            projectDescription: processedDescription,
            budget,
            language,
            recommendations: {
              ilẹ̀: [
                {
                  type: "Igi lile",
                  brand: "Bruce",
                  estimatedQuantity: "500 sq ft",
                  price: "₦5,000-7,000 fun sq ft",
                  considerations: "Nilo ifibọsipo ọlọ́jọ́gbọ́n, ko dara fun awọn agbegbe tutu"
                },
                {
                  type: "Pẹpẹ Vinyl Olola",
                  brand: "LifeProof",
                  estimatedQuantity: "500 sq ft",
                  price: "₦2,500-4,000 fun sq ft",
                  considerations: "Rọrun fun ara-ẹni, ko gbọdọ omi, dara fun awọn ile ọbẹ ati ile igbọnsẹ"
                }
              ],
              àwọ̀: [
                {
                  type: "Àwọ̀ Odi Inú Ilé",
                  brand: "Behr Premium Plus",
                  estimatedQuantity: "3-4 gallons",
                  price: "₦30,000-35,000 fun gallon",
                  considerations: "VOC kekere, idabobo to dara, ara-ipese"
                }
              ],
              "ohun èlò": [
                {
                  type: "Robineti Ile Ọbẹ",
                  brand: "Moen Arbor",
                  estimatedQuantity: "1",
                  price: "₦180,000-220,000",
                  considerations: "Ipari stainless ti o le kọju abawọn, olufọnmi ti o le fa"
                }
              ]
            }
          };
        }
        
        // Default English response
        return {
          success: true,
          projectDescription: processedDescription,
          budget,
          language,
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
      
      // Get language-specific system prompt
      const systemPrompt = this.getSystemPromptForLanguage(language);
      
      const data = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Based on this project description: "${processedDescription}" and a budget of $${budget}, recommend appropriate building materials. Include specific brands, estimated quantities needed, alternative options for different budget ranges, and any special considerations. Return your recommendations as JSON with categories for different material types.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      };
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
      
      // Use enhanced request with language and retry options
      const response = await this.makeRequest(endpoint, data, headers, {
        language: language,
        retries: 2,
        timeout: 20000
      });
      
      // Parse JSON from the response
      const recommendations = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        projectDescription: processedDescription,
        budget,
        language,
        recommendations
      };
    } catch (error) {
      // Use localized error messages based on language
      const errorKey = 'material_recommendation_failed';
      const errorMessage = this.getLocalizedErrorMessage(errorKey, language) || 
                          'Failed to recommend materials';
      
      return this.handleError(typeof error === 'string' ? error : errorMessage);
    }
  }
  
  /**
   * Find alternative materials based on material name and price point
   * @param materialName Name of the material to find alternatives for
   * @param pricePoint Price point category (budget, standard, premium)
   * @param language Language code for multilingual support
   * @returns Alternative materials with details
   */
  async findAlternativeMaterials(
    materialName: string, 
    pricePoint: 'budget' | 'standard' | 'premium',
    language: string = 'en-US'
  ): Promise<any> {
    try {
      // Process "Hi Emi" prefix if present
      const processedMaterialName = this.processEmiPrefix(materialName);
      
      // Use mock responses for development/testing
      if (this.useMockResponses) {
        // Get language-specific mock response
        const langPrefix = language.split('-')[0];
        
        if (langPrefix === 'fr') {
          return {
            success: true,
            originalMaterial: processedMaterialName,
            pricePoint,
            language,
            alternatives: [
              {
                name: "TrafficMaster Planche en Vinyle",
                cost: "€15-20 par m²",
                pros: ["Résistant à l'eau", "Installation facile", "Abordable"],
                cons: ["Matériau plus mince", "Garantie plus courte", "Apparence moins réaliste"],
                whereToBuy: "Home Depot, Leroy Merlin"
              },
              {
                name: "Armstrong Luxe Plank",
                cost: "€35-45 par m²",
                pros: ["Imperméable", "Aspect bois réaliste", "Couche d'usure durable"],
                cons: ["Coût plus élevé", "Peut nécessiter une sous-couche"],
                whereToBuy: "Magasins spécialisés en revêtement de sol, Amazon"
              },
              {
                name: "Pergo TimberCraft Stratifié",
                cost: "€27-32 par m²",
                pros: ["Résistant aux rayures", "Texture réaliste", "Installation facile à clic"],
                cons: ["Pas totalement imperméable", "Peut sonner creux quand on marche dessus"],
                whereToBuy: "Castorama, Brico Dépôt"
              }
            ]
          };
        } else if (langPrefix === 'yo') {
          return {
            success: true,
            originalMaterial: processedMaterialName,
            pricePoint,
            language,
            alternatives: [
              {
                name: "TrafficMaster Pẹpẹ Vinyl",
                cost: "₦1,500-2,000 fun sq ft",
                pros: ["O le kọju omi", "Fifibọsipo rọrun", "O wọ owo"],
                cons: ["Ohun elo tiwon", "Àṣẹ ti o kuru", "Irisi ti ko dabi otitọ"],
                whereToBuy: "Home Depot, Lowe's"
              },
              {
                name: "Armstrong Luxe Plank",
                cost: "₦3,500-4,500 fun sq ft",
                pros: ["Ko gbọdọ omi", "Irisi igi gidi", "Ipele iṣakoso ti o le gba ipa"],
                cons: ["Iye owo ti o ga", "O le nilo underlayment"],
                whereToBuy: "Awọn ile itaja pataki fun ilẹ, Amazon"
              },
              {
                name: "Pergo TimberCraft Laminate",
                cost: "₦2,750-3,250 fun sq ft",
                pros: ["O le kọju kikọ", "Texture gidi", "Fifibọsipo tite-sọkọ rọrun"],
                cons: ["Ko ni idabobo omi ni kikun", "O le dun gbọrọ nigbati a ba rin lori rẹ"],
                whereToBuy: "Lowe's, Floor & Decor"
              }
            ]
          };
        }
        
        // Default English response
        return {
          success: true,
          originalMaterial: processedMaterialName,
          pricePoint,
          language,
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
      
      // Get language-specific system prompt
      const systemPrompt = this.getSystemPromptForLanguage(language);
      
      const data = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Find alternative materials to "${processedMaterialName}" at a ${pricePoint} price point. Include brand names, approximate costs, pros and cons of each alternative, and where to purchase. Return the information as JSON.`
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      };
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`
      };
      
      // Use enhanced request with language and retry options
      const response = await this.makeRequest(endpoint, data, headers, {
        language: language,
        retries: 2,
        timeout: 15000
      });
      
      // Parse JSON from the response
      const alternatives = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        originalMaterial: processedMaterialName,
        pricePoint,
        language,
        alternatives
      };
    } catch (error) {
      // Use localized error messages based on language
      const errorKey = 'alternative_materials_failed';
      const errorMessage = this.getLocalizedErrorMessage(errorKey, language) || 
                          'Failed to find alternative materials';
      
      return this.handleError(typeof error === 'string' ? error : errorMessage);
    }
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
      'en': "You are a construction and renovation materials expert. You provide recommendations for high-quality, appropriate materials based on project descriptions and budgets.",
      'fr': "Vous êtes un expert en matériaux de construction et de rénovation. Vous fournissez des recommandations pour des matériaux de haute qualité et appropriés en fonction des descriptions de projets et des budgets.",
      'es': "Eres un experto en materiales de construcción y renovación. Proporcionas recomendaciones de materiales de alta calidad y apropiados según las descripciones de proyectos y presupuestos.",
      'de': "Sie sind ein Experte für Bau- und Renovierungsmaterialien. Sie geben Empfehlungen für hochwertige, geeignete Materialien auf der Grundlage von Projektbeschreibungen und Budgets.",
      'zh': "您是建筑和装修材料专家。您根据项目描述和预算提供高质量、适当的材料建议。",
      'ar': "أنت خبير في مواد البناء والتجديد. تقدم توصيات للمواد عالية الجودة والمناسبة بناءً على أوصاف المشاريع والميزانيات.",
      'hi': "आप निर्माण और नवीनीकरण सामग्री विशेषज्ञ हैं। आप परियोजना विवरणों और बजट के आधार पर उच्च गुणवत्ता वाली, उपयुक्त सामग्री के लिए सिफारिशें प्रदान करते हैं।",
      'sw': "Wewe ni mtaalam wa vifaa vya ujenzi na ukarabati. Unatoa mapendekezo ya vifaa vya ubora wa juu, vinavyofaa kulingana na maelezo ya miradi na bajeti.",
      'yo': "Ìwọ jẹ́ akọ́ṣẹ́mọṣẹ́ ohun èlò kíkọ́ àti àtúnṣe. O pèsè àwọn ìdámọ̀ràn fún àwọn ohun èlò tí ó dára jù lọ, tí ó yẹ lórí àpèjúwe iṣẹ́ àti àwọn ìṣúná."
    };
    
    // Return language-specific prompt or default to English
    return systemPrompts[langPrefix] || systemPrompts['en'];
  }
}

export default new MaterialRecommendationService();
