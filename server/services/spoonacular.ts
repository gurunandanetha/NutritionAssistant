import axios from 'axios';

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || '';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

interface SpoonacularNutrient {
  name: string;
  amount: number;
  unit: string;
}

interface SpoonacularFoodInfo {
  id: number;
  title: string;
  image: string;
  nutrition?: {
    nutrients: SpoonacularNutrient[];
    caloricBreakdown: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };
  };
}

interface SimilarFood {
  name: string;
  image: string;
}

export interface FoodInfo {
  name: string;
  description: string;
  image: string;
  nutrition: {
    calories: number;
    serving: number;
    nutrients: {
      name: string;
      amount: number;
      unit: string;
    }[];
  };
  similarFoods: SimilarFood[];
}

/**
 * Fetches food information from the Spoonacular API
 */
export async function fetchFoodInfo(query: string): Promise<FoodInfo | null> {
  try {
    if (!SPOONACULAR_API_KEY) {
      throw new Error('Spoonacular API key is not configured');
    }

    // Try recipes search first since it's more reliable
    const recipeResponse = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/complexSearch`, {
      params: {
        query,
        number: 1,
        apiKey: SPOONACULAR_API_KEY
      }
    });

    if (recipeResponse.data.results && recipeResponse.data.results.length > 0) {
      const recipeId = recipeResponse.data.results[0].id;
      
      try {
        const recipeInfo = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/${recipeId}/information`, {
          params: {
            includeNutrition: true,
            apiKey: SPOONACULAR_API_KEY
          }
        });

        // Try to get similar recipes, but don't fail if this errors
        let similarFoods = [];
        try {
          const similarRecipes = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/${recipeId}/similar`, {
            params: {
              number: 4,
              apiKey: SPOONACULAR_API_KEY
            }
          });

          similarFoods = similarRecipes.data.map((recipe: any) => ({
            name: recipe.title,
            image: `https://spoonacular.com/recipeImages/${recipe.id}-90x90.jpg`
          }));
        } catch (similarError) {
          console.log('Non-critical error fetching similar recipes:', similarError);
          // Continue without similar foods
        }

        // Process the recipe data
        return {
          name: recipeInfo.data.title,
          description: recipeInfo.data.summary ? stripHtml(recipeInfo.data.summary).slice(0, 120) + '...' : '',
          image: recipeInfo.data.image || 'https://spoonacular.com/cdn/ingredients_100x100/apple.jpg', // Default image
          nutrition: processNutrition(recipeInfo.data.nutrition),
          similarFoods
        };
      } catch (recipeInfoError) {
        console.error('Error fetching recipe information:', recipeInfoError);
        // Fall through to food product search
      }
    }

    // If recipe search fails, try food products as fallback
    try {
      const searchResponse = await axios.get(`${SPOONACULAR_BASE_URL}/food/products/search`, {
        params: {
          query,
          number: 1,
          apiKey: SPOONACULAR_API_KEY
        }
      });

      if (searchResponse.data.products && searchResponse.data.products.length > 0) {
        const productId = searchResponse.data.products[0].id;
        
        try {
          const productInfo = await axios.get(`${SPOONACULAR_BASE_URL}/food/products/${productId}`, {
            params: {
              apiKey: SPOONACULAR_API_KEY
            }
          });

          // Try to get similar products, but don't fail if this errors
          let similarFoods = [];
          try {
            const similarProducts = await axios.get(`${SPOONACULAR_BASE_URL}/food/products/${productId}/similar`, {
              params: {
                number: 4,
                apiKey: SPOONACULAR_API_KEY
              }
            });

            similarFoods = similarProducts.data.map((product: any) => ({
              name: product.title,
              image: product.image
            }));
          } catch (similarError) {
            console.log('Non-critical error fetching similar products:', similarError);
            // Continue without similar foods
          }

          // Process the product data
          return {
            name: productInfo.data.title,
            description: productInfo.data.description ? stripHtml(productInfo.data.description).slice(0, 120) + '...' : '',
            image: productInfo.data.image || 'https://spoonacular.com/cdn/ingredients_100x100/apple.jpg', // Default image
            nutrition: {
              calories: findNutrient(productInfo.data.nutrition.nutrients, 'Calories')?.amount || 0,
              serving: 100, // Default serving size
              nutrients: processNutrients(productInfo.data.nutrition.nutrients)
            },
            similarFoods
          };
        } catch (productInfoError) {
          console.error('Error fetching product information:', productInfoError);
          throw productInfoError;
        }
      }
    } catch (searchError) {
      console.error('Error searching food products:', searchError);
      // Fall through to generic response
    }

    // If we're here, neither product nor recipe search returned results
    console.warn(`No food information found for "${query}"`);
    return null;

  } catch (error) {
    console.error('Error fetching food information from Spoonacular:', error);
    throw new Error('Failed to fetch food information');
  }
}

/**
 * Finds a specific nutrient in the nutrients array
 */
function findNutrient(nutrients: SpoonacularNutrient[], name: string): SpoonacularNutrient | undefined {
  return nutrients.find(nutrient => 
    nutrient.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Processes the nutrition data from Spoonacular
 */
function processNutrition(nutritionData: any) {
  const nutrients = nutritionData.nutrients || [];
  
  return {
    calories: findNutrient(nutrients, 'Calories')?.amount || 0,
    serving: 100, // Default serving size
    nutrients: processNutrients(nutrients)
  };
}

/**
 * Processes the nutrients array from Spoonacular
 */
function processNutrients(nutrients: SpoonacularNutrient[]) {
  const mainNutrients = [
    'Protein',
    'Carbohydrates',
    'Fat',
    'Fiber',
    'Sugar'
  ];

  return mainNutrients
    .map(name => findNutrient(nutrients, name))
    .filter(nutrient => nutrient !== undefined) as SpoonacularNutrient[];
}

/**
 * Strips HTML tags from a string
 */
function stripHtml(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}
