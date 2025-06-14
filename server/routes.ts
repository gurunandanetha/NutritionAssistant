import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";
import { fetchFoodInfo } from "./services/spoonacular";
import { getHealthInfo } from "./services/gemini";
import { detectFoodInImage } from "./services/vision";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Query parameter validation
const searchQuerySchema = z.object({
  query: z.string().min(1).max(100)
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Text search endpoint
  app.get("/api/food", async (req: Request, res: Response) => {
    try {
      const { query } = searchQuerySchema.parse(req.query);
      
      // Get food information from Spoonacular
      const foodInfo = await fetchFoodInfo(query);
      
      if (!foodInfo) {
        return res.status(404).json({ message: `No information found for "${query}"` });
      }
      
      // Get health benefits and cautions from Gemini
      const healthInfo = await getHealthInfo(foodInfo.name);
      
      // Combine all data
      const result = {
        ...foodInfo,
        ...healthInfo
      };
      
      try {
        // Store the search history and result in database
        // Create a unique external ID for this food
        const externalId = `spoonacular-${Date.now()}`;
        
        // Add food result to database if needed
        await storage.addFoodResult({
          externalId,
          foodName: result.name,
          description: result.description || "",
          imageUrl: result.image,
          nutritionData: result.nutrition,
          healthBenefits: result.healthBenefits,
          cautions: result.cautions,
          additionalInfo: result.additionalInfo || null,
          similarFoods: result.similarFoods || null,
          createdAt: new Date().toISOString()
        });
        
        // We can add search history here if user authentication is implemented
        // For now, we'll skip that part
      } catch (dbError) {
        // Just log database errors, don't fail the request
        console.error("Error storing food result in database:", dbError);
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error in food search:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid search query" });
      }
      
      res.status(500).json({ message: "Failed to get food information" });
    }
  });
  
  // Image search endpoint
  app.post("/api/food/image", upload.single("image"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
      }
      
      // Get the image buffer
      const imageBuffer = req.file.buffer;
      
      // Get the image filename
      const filename = req.file.originalname;
      
      // Optional text query for additional context
      const query = req.body.query;
      
      // Detect food in the image
      const detectedFood = await detectFoodInImage(imageBuffer);
      
      if (!detectedFood) {
        return res.status(404).json({ message: "No food detected in the image" });
      }
      
      // Combine detected food with query if both exist
      const searchTerm = query ? `${detectedFood} ${query}` : detectedFood;
      
      // Get food information from Spoonacular
      const foodInfo = await fetchFoodInfo(searchTerm);
      
      if (!foodInfo) {
        return res.status(404).json({ message: `No information found for detected food "${detectedFood}"` });
      }
      
      // Get health benefits and cautions from Gemini
      const healthInfo = await getHealthInfo(foodInfo.name);
      
      // Combine all data
      const result = {
        ...foodInfo,
        ...healthInfo
      };
      
      try {
        // Store the search history and result in database
        // Create a unique external ID for this food
        const externalId = `spoonacular-${Date.now()}`;
        
        // Add food result to database if needed
        await storage.addFoodResult({
          externalId,
          foodName: result.name,
          description: result.description || "",
          imageUrl: result.image,
          nutritionData: result.nutrition,
          healthBenefits: result.healthBenefits,
          cautions: result.cautions,
          additionalInfo: result.additionalInfo || null,
          similarFoods: result.similarFoods || null,
          createdAt: new Date().toISOString()
        });
        
        // We can add search history with image info here if user authentication is implemented
        // For now, we'll skip that part
      } catch (dbError) {
        // Just log database errors, don't fail the request
        console.error("Error storing food result in database:", dbError);
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error in image search:", error);
      res.status(500).json({ message: "Failed to process food image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
