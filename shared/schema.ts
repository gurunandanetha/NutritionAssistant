import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Define the food search history table
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  query: text("query").notNull(),
  resultId: text("result_id"),
  searchType: text("search_type").notNull(), // text, voice, or image
  createdAt: text("created_at").notNull(), // ISO timestamp
  imageUrl: text("image_url"), // Optional: URL to uploaded image if used
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).pick({
  userId: true,
  query: true,
  resultId: true,
  searchType: true,
  createdAt: true,
  imageUrl: true,
});

// Define the stored food results table
export const foodResults = pgTable("food_results", {
  id: serial("id").primaryKey(),
  externalId: text("external_id").notNull().unique(), // ID from external API
  foodName: text("food_name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  nutritionData: jsonb("nutrition_data").notNull(),
  healthBenefits: jsonb("health_benefits").notNull(),
  cautions: jsonb("cautions").notNull(),
  additionalInfo: text("additional_info"),
  similarFoods: jsonb("similar_foods"),
  createdAt: text("created_at").notNull(), // ISO timestamp
});

export const insertFoodResultSchema = createInsertSchema(foodResults).pick({
  externalId: true,
  foodName: true,
  description: true,
  imageUrl: true,
  nutritionData: true,
  healthBenefits: true,
  cautions: true,
  additionalInfo: true,
  similarFoods: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;

export type InsertFoodResult = z.infer<typeof insertFoodResultSchema>;
export type FoodResult = typeof foodResults.$inferSelect;
