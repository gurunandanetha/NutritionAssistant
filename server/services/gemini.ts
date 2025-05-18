import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface HealthInfo {
  healthBenefits: string[];
  cautions: string[];
  additionalInfo: string;
}

/**
 * Gets health information about a food item using Gemini API
 */
export async function getHealthInfo(foodName: string): Promise<HealthInfo> {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const prompt = `
      I need detailed health information about ${foodName}. Please provide:
      
      1. A list of health benefits (at least 4 points)
      2. A list of possible cautions or side effects (at least 3 points)
      3. Additional general information about this food (1 paragraph)
      
      Format your response exactly like this:
      
      BENEFITS:
      - Benefit 1
      - Benefit 2
      - etc.
      
      CAUTIONS:
      - Caution 1
      - Caution 2
      - etc.
      
      ADDITIONAL:
      Additional information paragraph goes here.
    `;

    const response = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800
        }
      }
    );

    // Extract text from the response
    const text = response.data.candidates[0]?.content.parts[0].text || '';

    return parseHealthInfo(text);
  } catch (error) {
    console.error('Error getting health information from Gemini:', error);
    
    // Provide default information if the API call fails
    return {
      healthBenefits: [
        'May provide essential nutrients',
        'Could be part of a balanced diet',
        'Potentially contains vitamins and minerals',
        'May support overall health when consumed appropriately'
      ],
      cautions: [
        'Individual allergies or sensitivities may occur',
        'Consume in moderation as part of a balanced diet',
        'Consult with a healthcare professional for specific dietary advice'
      ],
      additionalInfo: `${foodName} is a food item that can be included in various diets. For accurate and personalized nutritional advice, please consult with a registered dietitian or healthcare professional.`
    };
  }
}

/**
 * Parses the health information from the Gemini response
 */
function parseHealthInfo(text: string): HealthInfo {
  const benefitsMatch = text.match(/BENEFITS:(.+?)CAUTIONS:/s);
  const cautionsMatch = text.match(/CAUTIONS:(.+?)ADDITIONAL:/s);
  const additionalMatch = text.match(/ADDITIONAL:(.+?)$/s);

  const benefits = benefitsMatch 
    ? benefitsMatch[1]
        .split('-')
        .map(item => item.trim())
        .filter(item => item.length > 0)
    : [];

  const cautions = cautionsMatch
    ? cautionsMatch[1]
        .split('-')
        .map(item => item.trim())
        .filter(item => item.length > 0)
    : [];

  const additional = additionalMatch 
    ? additionalMatch[1].trim()
    : '';

  return {
    healthBenefits: benefits,
    cautions: cautions,
    additionalInfo: additional
  };
}
