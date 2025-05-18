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
  healthBenefits?: string[];
  cautions?: string[];
  additionalInfo?: string;
}

/**
 * Database of common fruits with detailed information
 * This ensures we have good data even if the API fails
 */
const fruitDatabase: Record<string, FoodInfo> = {
  apple: {
    name: "Apple",
    description: "Apples are pomaceous fruits produced by the apple tree. They are one of the most widely cultivated tree fruits and are a rich source of fiber and antioxidants.",
    image: "https://spoonacular.com/cdn/ingredients_500x500/apple.jpg",
    nutrition: {
      calories: 52,
      serving: 100,
      nutrients: [
        { name: "Protein", amount: 0.3, unit: "g" },
        { name: "Carbohydrates", amount: 13.8, unit: "g" },
        { name: "Fat", amount: 0.2, unit: "g" },
        { name: "Fiber", amount: 2.4, unit: "g" },
        { name: "Sugar", amount: 10.4, unit: "g" }
      ]
    },
    healthBenefits: [
      "Rich in antioxidants like quercetin and catechin which protect cells from damage",
      "Contains soluble fiber that can help lower cholesterol and improve heart health",
      "May help regulate blood sugar due to the polyphenols that slow carbohydrate digestion",
      "Contains vitamin C which supports immune function",
      "Regular consumption is linked to improved lung function and reduced risk of asthma"
    ],
    cautions: [
      "The seeds contain small amounts of cyanide and should not be consumed in large quantities",
      "May trigger allergic reactions in some individuals",
      "Non-organic apples may contain pesticide residues on the skin"
    ],
    additionalInfo: "Apples are versatile fruits that can be eaten raw, juiced, or used in various culinary applications. The proverb 'an apple a day keeps the doctor away' reflects their reputation as a health food. There are over 7,500 varieties of apples grown worldwide, each with its own flavor profile, from sweet to tart.",
    similarFoods: [
      { name: "Pear", image: "https://spoonacular.com/cdn/ingredients_100x100/pear.jpg" },
      { name: "Peach", image: "https://spoonacular.com/cdn/ingredients_100x100/peach.jpg" },
      { name: "Nectarine", image: "https://spoonacular.com/cdn/ingredients_100x100/nectarine.jpg" },
      { name: "Quince", image: "https://spoonacular.com/cdn/ingredients_100x100/quince.jpg" }
    ]
  },
  orange: {
    name: "Orange",
    description: "Oranges are citrus fruits known for their high vitamin C content and refreshing juice. They are grown in tropical and subtropical regions around the world.",
    image: "https://spoonacular.com/cdn/ingredients_500x500/orange.jpg",
    nutrition: {
      calories: 47,
      serving: 100,
      nutrients: [
        { name: "Protein", amount: 0.9, unit: "g" },
        { name: "Carbohydrates", amount: 11.8, unit: "g" },
        { name: "Fat", amount: 0.1, unit: "g" },
        { name: "Fiber", amount: 2.4, unit: "g" },
        { name: "Sugar", amount: 9.4, unit: "g" }
      ]
    },
    healthBenefits: [
      "Excellent source of vitamin C which boosts immune system function",
      "Contains flavonoids that may have anti-inflammatory and antioxidant effects",
      "Rich in potassium which supports heart health and helps regulate blood pressure",
      "Contains folate which is important for cell division and DNA synthesis",
      "May help reduce the risk of kidney stones due to the citric acid content"
    ],
    cautions: [
      "Can interact with certain medications like statins and calcium channel blockers",
      "May cause heartburn or acid reflux in sensitive individuals",
      "High in natural sugars which should be considered for those monitoring blood glucose"
    ],
    additionalInfo: "Oranges originated in Asia and have been cultivated for thousands of years. They come in many varieties including navel, Valencia, blood, and mandarin types. Beyond being eaten fresh or juiced, orange zest and peel contain aromatic oils used in cooking, baking, and even cleaning products due to their pleasant scent and antibacterial properties.",
    similarFoods: [
      { name: "Grapefruit", image: "https://spoonacular.com/cdn/ingredients_100x100/grapefruit.jpg" },
      { name: "Lemon", image: "https://spoonacular.com/cdn/ingredients_100x100/lemon.jpg" },
      { name: "Tangerine", image: "https://spoonacular.com/cdn/ingredients_100x100/tangerine.jpg" },
      { name: "Lime", image: "https://spoonacular.com/cdn/ingredients_100x100/lime.jpg" }
    ]
  },
  watermelon: {
    name: "Watermelon",
    description: "Watermelon is a large, sweet fruit with a green rind and juicy red flesh filled with small black seeds. It's known for its high water content and refreshing taste.",
    image: "https://spoonacular.com/cdn/ingredients_500x500/watermelon.jpg",
    nutrition: {
      calories: 30,
      serving: 100,
      nutrients: [
        { name: "Protein", amount: 0.6, unit: "g" },
        { name: "Carbohydrates", amount: 7.6, unit: "g" },
        { name: "Fat", amount: 0.2, unit: "g" },
        { name: "Fiber", amount: 0.4, unit: "g" },
        { name: "Sugar", amount: 6.2, unit: "g" }
      ]
    },
    healthBenefits: [
      "Excellent for hydration as it's made up of over 90% water",
      "Contains lycopene, a powerful antioxidant that may reduce cancer risk",
      "Rich in citrulline, an amino acid that may improve exercise performance",
      "Has anti-inflammatory properties that may reduce muscle soreness",
      "Contains vitamins A and C which support eye health and immune function"
    ],
    cautions: [
      "High in natural sugars which should be consumed in moderation by people with diabetes",
      "May cause digestive discomfort in some individuals due to its FODMAP content",
      "Some people may experience allergic reactions, though watermelon allergies are rare"
    ],
    additionalInfo: "Watermelon originated in Africa but is now cultivated around the world. It's botanically a berry from the Cucurbitaceae family, related to cucumbers and pumpkins. The entire watermelon is edible, including the rind which can be pickled or stir-fried. In some cultures, the seeds are roasted and eaten as a snack. Modern cultivation has produced seedless varieties and watermelons with different colored flesh including yellow and orange.",
    similarFoods: [
      { name: "Cantaloupe", image: "https://spoonacular.com/cdn/ingredients_100x100/cantaloupe.jpg" },
      { name: "Honeydew", image: "https://spoonacular.com/cdn/ingredients_100x100/honeydew.png" },
      { name: "Cucumber", image: "https://spoonacular.com/cdn/ingredients_100x100/cucumber.jpg" },
      { name: "Dragon Fruit", image: "https://spoonacular.com/cdn/ingredients_100x100/pitaya-dragon-fruit.jpg" }
    ]
  },
  avocado: {
    name: "Avocado",
    description: "Avocado is a unique fruit with creamy texture and mild, nutty flavor. Unlike most fruits, it's high in healthy fats and low in carbohydrates.",
    image: "https://spoonacular.com/cdn/ingredients_500x500/avocado.jpg",
    nutrition: {
      calories: 160,
      serving: 100,
      nutrients: [
        { name: "Protein", amount: 2, unit: "g" },
        { name: "Carbohydrates", amount: 8.5, unit: "g" },
        { name: "Fat", amount: 14.7, unit: "g" },
        { name: "Fiber", amount: 6.7, unit: "g" },
        { name: "Sugar", amount: 0.7, unit: "g" }
      ]
    },
    healthBenefits: [
      "Rich in monounsaturated fats that support heart health and reduce inflammation",
      "Excellent source of potassium, containing more than bananas",
      "High in fiber which supports digestive health and helps maintain healthy blood sugar levels",
      "Contains lutein and zeaxanthin which support eye health and reduce risk of macular degeneration",
      "Rich in folate which is essential for cell repair and during pregnancy"
    ],
    cautions: [
      "High in calories compared to other fruits due to fat content",
      "May cause allergic reactions in some individuals, especially those with latex allergies",
      "Can interact with blood-thinning medications due to vitamin K content"
    ],
    additionalInfo: "Avocados originated in Mexico and Central America where they've been cultivated for thousands of years. The Hass variety, known for its pebbly dark skin, accounts for about 80% of avocados consumed worldwide. Unlike most fruits, avocados ripen only after they're harvested and will not ripen while still on the tree. They're often called 'nature's butter' due to their creamy texture and are used in both savory and sweet dishes across many cuisines.",
    similarFoods: [
      { name: "Olive", image: "https://spoonacular.com/cdn/ingredients_100x100/olives-mixed.jpg" },
      { name: "Coconut", image: "https://spoonacular.com/cdn/ingredients_100x100/coconut.jpg" },
      { name: "Nut butter", image: "https://spoonacular.com/cdn/ingredients_100x100/almond-butter.jpg" },
      { name: "Eggplant", image: "https://spoonacular.com/cdn/ingredients_100x100/eggplant.jpg" }
    ]
  }
};

/**
 * Fetches food information from the Spoonacular API or local database
 */
export async function fetchFoodInfo(query: string): Promise<FoodInfo | null> {
  try {
    // Check if the query matches our local fruit database (case insensitive)
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check for specific fruits
    for (const [fruitName, fruitData] of Object.entries(fruitDatabase)) {
      if (normalizedQuery.includes(fruitName)) {
        console.log(`Found "${fruitName}" in local database`);
        return fruitData;
      }
    }
    
    // If not in database, continue with API call
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
