import { db } from "./db";
import { users, searchHistory, foodResults } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { 
  User, 
  InsertUser, 
  InsertSearchHistory, 
  InsertFoodResult, 
  SearchHistory, 
  FoodResult 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Search history methods
  addSearchHistory(search: InsertSearchHistory): Promise<SearchHistory>;
  getUserSearchHistory(userId: number): Promise<SearchHistory[]>;
  
  // Food results methods
  getFoodResult(id: number): Promise<FoodResult | undefined>;
  getFoodResultByExternalId(externalId: string): Promise<FoodResult | undefined>;
  addFoodResult(foodResult: InsertFoodResult): Promise<FoodResult>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Search history methods
  async addSearchHistory(search: InsertSearchHistory): Promise<SearchHistory> {
    const [record] = await db
      .insert(searchHistory)
      .values(search)
      .returning();
    return record;
  }
  
  async getUserSearchHistory(userId: number): Promise<SearchHistory[]> {
    return await db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .orderBy(searchHistory.createdAt);
  }
  
  // Food results methods
  async getFoodResult(id: number): Promise<FoodResult | undefined> {
    const [result] = await db
      .select()
      .from(foodResults)
      .where(eq(foodResults.id, id));
    return result || undefined;
  }
  
  async getFoodResultByExternalId(externalId: string): Promise<FoodResult | undefined> {
    const [result] = await db
      .select()
      .from(foodResults)
      .where(eq(foodResults.externalId, externalId));
    return result || undefined;
  }
  
  async addFoodResult(foodResult: InsertFoodResult): Promise<FoodResult> {
    const [result] = await db
      .insert(foodResults)
      .values(foodResult)
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
