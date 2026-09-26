import { PrismaClient, Prisma, Household, HouseholdMember, HouseholdRole } from "../generated/prisma/client.js";
import { IHouseholdRepository } from "../interfaces/household.repository.interface.js";

export const householdMembersInclude = {
  members: { include: { user: { select: { id: true, username: true } } } },
} satisfies Prisma.HouseholdInclude;

export type HouseholdWithMembers = Prisma.HouseholdGetPayload<{ include: typeof householdMembersInclude }>;

export const householdIngredientInclude = {
  ingredient: { include: { translations: true, department: true } },
  unit: { include: { translations: true } },
} satisfies Prisma.HouseholdIngredientInclude;

export type HouseholdIngredientWithDetails = Prisma.HouseholdIngredientGetPayload<{
  include: typeof householdIngredientInclude;
}>;

export const householdUstensilInclude = {
  ustensil: { include: { translations: true } },
} satisfies Prisma.HouseholdUstensilInclude;

export type HouseholdUstensilWithDetails = Prisma.HouseholdUstensilGetPayload<{
  include: typeof householdUstensilInclude;
}>;

export const shoppingListItemInclude = {
  ingredient: { include: { translations: true } },
  unit: { include: { translations: true } },
  addedBy: { select: { id: true, username: true } },
} satisfies Prisma.ShoppingListItemInclude;

export type ShoppingListItemWithDetails = Prisma.ShoppingListItemGetPayload<{
  include: typeof shoppingListItemInclude;
}>;

export class HouseholdRepository implements IHouseholdRepository {
  constructor(private prisma: PrismaClient) {}

  create(name: string, ownerId: string): Promise<HouseholdWithMembers> {
    return this.prisma.household.create({
      data: {
        name,
        members: { create: { userId: ownerId, role: "OWNER" } },
      },
      include: householdMembersInclude,
    });
  }

  findById(id: string): Promise<HouseholdWithMembers | null> {
    return this.prisma.household.findUnique({
      where: { id },
      include: householdMembersInclude,
    });
  }

  findManyForUser(userId: string): Promise<HouseholdWithMembers[]> {
    return this.prisma.household.findMany({
      where: { members: { some: { userId } } },
      include: householdMembersInclude,
    });
  }

  update(id: string, name: string): Promise<Household> {
    return this.prisma.household.update({ where: { id }, data: { name } });
  }

  delete(id: string): Promise<Household> {
    return this.prisma.household.delete({ where: { id } });
  }

  findMember(householdId: string, userId: string): Promise<HouseholdMember | null> {
    return this.prisma.householdMember.findUnique({
      where: { householdId_userId: { householdId, userId } },
    });
  }

  addMember(householdId: string, userId: string, role: HouseholdRole): Promise<HouseholdMember> {
    return this.prisma.householdMember.create({ data: { householdId, userId, role } });
  }

  async removeMember(householdId: string, userId: string): Promise<void> {
    await this.prisma.householdMember.delete({
      where: { householdId_userId: { householdId, userId } },
    });
  }

  countOwners(householdId: string): Promise<number> {
    return this.prisma.householdMember.count({ where: { householdId, role: "OWNER" } });
  }

  findIngredients(householdId: string): Promise<HouseholdIngredientWithDetails[]> {
    return this.prisma.householdIngredient.findMany({
      where: { householdId },
      include: householdIngredientInclude,
    });
  }

  findIngredient(householdId: string, ingredientId: number): Promise<HouseholdIngredientWithDetails | null> {
    return this.prisma.householdIngredient.findUnique({
      where: { householdId_ingredientId: { householdId, ingredientId } },
      include: householdIngredientInclude,
    });
  }

  upsertIngredient(
    householdId: string,
    ingredientId: number,
    unitId: number,
    quantity: number
  ): Promise<HouseholdIngredientWithDetails> {
    return this.prisma.householdIngredient.upsert({
      where: { householdId_ingredientId: { householdId, ingredientId } },
      create: { householdId, ingredientId, unitId, quantity },
      update: { unitId, quantity },
      include: householdIngredientInclude,
    });
  }

  async removeIngredient(householdId: string, ingredientId: number): Promise<void> {
    await this.prisma.householdIngredient.delete({
      where: { householdId_ingredientId: { householdId, ingredientId } },
    });
  }

  findUstensils(householdId: string): Promise<HouseholdUstensilWithDetails[]> {
    return this.prisma.householdUstensil.findMany({
      where: { householdId },
      include: householdUstensilInclude,
    });
  }

  findUstensil(householdId: string, ustensilId: number): Promise<HouseholdUstensilWithDetails | null> {
    return this.prisma.householdUstensil.findUnique({
      where: { householdId_ustensilId: { householdId, ustensilId } },
      include: householdUstensilInclude,
    });
  }

  addUstensil(householdId: string, ustensilId: number): Promise<HouseholdUstensilWithDetails> {
    return this.prisma.householdUstensil.upsert({
      where: { householdId_ustensilId: { householdId, ustensilId } },
      create: { householdId, ustensilId },
      update: {},
      include: householdUstensilInclude,
    });
  }

  async removeUstensil(householdId: string, ustensilId: number): Promise<void> {
    await this.prisma.householdUstensil.delete({
      where: { householdId_ustensilId: { householdId, ustensilId } },
    });
  }

  findShoppingListItems(householdId: string): Promise<ShoppingListItemWithDetails[]> {
    return this.prisma.shoppingListItem.findMany({
      where: { householdId },
      include: shoppingListItemInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  findShoppingListItem(householdId: string, itemId: number): Promise<ShoppingListItemWithDetails | null> {
    return this.prisma.shoppingListItem.findFirst({
      where: { id: itemId, householdId },
      include: shoppingListItemInclude,
    });
  }

  createShoppingListItem(
    householdId: string,
    addedById: string,
    data: { ingredientId?: number; customLabel?: string; quantity?: number; unitId?: number }
  ): Promise<ShoppingListItemWithDetails> {
    return this.prisma.shoppingListItem.create({
      data: { householdId, addedById, ...data },
      include: shoppingListItemInclude,
    });
  }

  updateShoppingListItem(
    itemId: number,
    data: { quantity?: number; unitId?: number; isChecked?: boolean }
  ): Promise<ShoppingListItemWithDetails> {
    return this.prisma.shoppingListItem.update({
      where: { id: itemId },
      data,
      include: shoppingListItemInclude,
    });
  }

  async deleteShoppingListItem(itemId: number): Promise<void> {
    await this.prisma.shoppingListItem.delete({ where: { id: itemId } });
  }
}
