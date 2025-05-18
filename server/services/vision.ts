import axios from 'axios';

const VISION_API_KEY = process.env.VISION_API_KEY || '';
const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

interface VisionRequest {
  requests: {
    image: {
      content: string;
    };
    features: {
      type: string;
      maxResults: number;
    }[];
  }[];
}

interface VisionResponse {
  responses: {
    labelAnnotations?: {
      description: string;
      score: number;
    }[];
    error?: {
      message: string;
    };
  }[];
}

/**
 * Detects food items in an image using Google Vision API
 */
export async function detectFoodInImage(imageBuffer: Buffer): Promise<string | null> {
  try {
    if (!VISION_API_KEY) {
      throw new Error('Vision API key is not configured');
    }

    // Convert image buffer to base64
    const base64Image = imageBuffer.toString('base64');

    // Prepare the request payload
    const requestData: VisionRequest = {
      requests: [
        {
          image: {
            content: base64Image
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10
            }
          ]
        }
      ]
    };

    // Make the API request
    const response = await axios.post<VisionResponse>(
      `${VISION_API_URL}?key=${VISION_API_KEY}`,
      requestData
    );

    // Check for errors
    if (response.data.responses[0].error) {
      throw new Error(response.data.responses[0].error.message);
    }

    // Get the label annotations
    const labels = response.data.responses[0].labelAnnotations || [];

    // Check specifically for our target fruits first (apple, orange, watermelon, avocado)
    const targetFruits = ['apple', 'orange', 'watermelon', 'avocado'];
    
    for (const label of labels) {
      const description = label.description.toLowerCase();
      for (const fruit of targetFruits) {
        if (description.includes(fruit)) {
          console.log(`Detected target fruit: ${fruit}`);
          return fruit;
        }
      }
    }
    
    // Then filter food-related labels if no target fruit was found
    const foodLabels = labels.filter(label => {
      const description = label.description.toLowerCase();
      const foodRelatedTerms = [
        'food', 'fruit', 'vegetable', 'meat', 'dish', 'cuisine', 'ingredient',
        'meal', 'snack', 'breakfast', 'lunch', 'dinner', 'dessert', 'beverage',
        'drink', 'recipe', 'nutrition', 'dietary', 'cooking', 'baking', 'produce',
        'snack', 'sweet', 'edible', 'salad', 'juice', 'organic'
      ];
      
      return foodRelatedTerms.some(term => description.includes(term)) || label.score > 0.7;
    });

    // Return the highest confidence food label
    if (foodLabels.length > 0) {
      console.log(`Detected food: ${foodLabels[0].description} (score: ${foodLabels[0].score})`);
      return foodLabels[0].description;
    }

    // If no food-specific labels are found, try the highest confidence general label
    if (labels.length > 0) {
      console.log(`Falling back to general label: ${labels[0].description}`);
      return labels[0].description;
    }

    return null;
  } catch (error) {
    console.error('Error detecting food in image:', error);
    throw new Error('Failed to analyze image');
  }
}
