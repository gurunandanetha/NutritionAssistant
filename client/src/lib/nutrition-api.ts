// Define the data structures to represent food data

export interface NutrientItem {
  name: string;
  amount: number;
  unit: string;
}

export interface Nutrition {
  calories: number;
  serving: number;
  nutrients: NutrientItem[];
}

export interface SimilarFood {
  name: string;
  image: string;
}

export interface FoodData {
  name: string;
  description: string;
  image: string;
  nutrition: Nutrition;
  healthBenefits: string[];
  cautions: string[];
  additionalInfo?: string;
  similarFoods?: SimilarFood[];
}

// API functions to fetch food data
export async function searchFoodByText(query: string): Promise<FoodData> {
  try {
    const response = await fetch(`/api/food?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error searching food:", error);
    throw error;
  }
}

export async function searchFoodByImage(imageFile: File, query?: string): Promise<FoodData> {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    
    if (query) {
      formData.append("query", query);
    }
    
    const response = await fetch("/api/food/image", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error searching food by image:", error);
    throw error;
  }
}
