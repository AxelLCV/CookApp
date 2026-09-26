import { Household, HouseholdMember, HouseholdRole } from "../generated/prisma/client.js";
import {
  HouseholdWithMembers,
  HouseholdIngredientWithDetails,
  HouseholdUstensilWithDetails,
  ShoppingListItemWithDetails,
} from "../repositories/household.repository.js";

export interface IHouseholdRepository {
  create(name: string, ownerId: string): Promise<HouseholdWithMembers>;
  findById(id: string): Promise<HouseholdWithMembers | null>;
  findManyForUser(userId: string): Promise<HouseholdWithMembers[]>;
  update(id: string, name: string): Promise<Household>;
  delete(id: string): Promise<Household>;
  findMember(householdId: string, userId: string): Promise<HouseholdMember | null>;
  addMember(householdId: string, userId: string, role: HouseholdRole): Promise<HouseholdMember>;
  removeMember(householdId: string, userId: string): Promise<void>;
  countOwners(householdId: string): Promise<number>;

  findIngredients(householdId: string): Promise<HouseholdIngredientWithDetails[]>;
  findIngredient(householdId: string, ingredientId: number): Promise<HouseholdIngredientWithDetails | null>;
  upsertIngredient(householdId: string, ingredientId: number, unitId: number, quantity: number): Promise<HouseholdIngredientWithDetails>;
  removeIngredient(householdId: string, ingredientId: number): Promise<void>;

  findUstensils(householdId: string): Promise<HouseholdUstensilWithDetails[]>;
  findUstensil(householdId: string, ustensilId: number): Promise<HouseholdUstensilWithDetails | null>;
  addUstensil(householdId: string, ustensilId: number): Promise<HouseholdUstensilWithDetails>;
  removeUstensil(householdId: string, ustensilId: number): Promise<void>;

  findShoppingListItems(householdId: string): Promise<ShoppingListItemWithDetails[]>;
  findShoppingListItem(householdId: string, itemId: number): Promise<ShoppingListItemWithDetails | null>;
  createShoppingListItem(
    householdId: string,
    addedById: string,
    data: { ingredientId?: number; customLabel?: string; quantity?: number; unitId?: number }
  ): Promise<ShoppingListItemWithDetails>;
  updateShoppingListItem(
    itemId: number,
    data: { quantity?: number; unitId?: number; isChecked?: boolean }
  ): Promise<ShoppingListItemWithDetails>;
  deleteShoppingListItem(itemId: number): Promise<void>;
}
