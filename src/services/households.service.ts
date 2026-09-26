import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";
import { IHouseholdRepository } from "../interfaces/household.repository.interface.js";
import { IUserRepository } from "../interfaces/user.repository.interface.js";
import {
  CreateInput,
  UpdateInput,
  AddMemberInput,
  AddIngredientInput,
  UpdateIngredientInput,
  AddShoppingListItemInput,
  UpdateShoppingListItemInput,
} from "../validators/households.schema.js";

export class HouseholdsService {
  constructor(
    private repo: IHouseholdRepository,
    private userRepo: IUserRepository
  ) {}

  async create(data: CreateInput, userId: string) {
    const result = await this.repo.create(data.name, userId);
    return { result };
  }

  async getMine(userId: string) {
    const result = await this.repo.findManyForUser(userId);
    return { data: result };
  }

  async get(id: string, userId: string) {
    await this.assertMember(id, userId);
    const result = await this.repo.findById(id);
    if (!result) {
      throw new AppError(ErrorCodes.HOUSEHOLD_NOT_FOUND);
    }
    return { result };
  }

  async update(id: string, data: UpdateInput, userId: string) {
    await this.assertOwner(id, userId);
    const result = await this.repo.update(id, data.name);
    return { result };
  }

  async delete(id: string, userId: string) {
    await this.assertOwner(id, userId);
    await this.repo.delete(id);
  }

  async addMember(id: string, data: AddMemberInput, userId: string) {
    await this.assertMember(id, userId);

    const user = await this.userRepo.findByUsername(data.username);
    if (!user) {
      throw new AppError(ErrorCodes.USER_NOT_FOUND);
    }

    const existing = await this.repo.findMember(id, user.id);
    if (existing) {
      throw new AppError(ErrorCodes.ALREADY_MEMBER);
    }

    const result = await this.repo.addMember(id, user.id, "MEMBER");
    return { result };
  }

  async removeMember(id: string, targetUserId: string, requesterId: string) {
    const requesterMembership = await this.assertMember(id, requesterId);
    const isSelf = targetUserId === requesterId;
    if (!isSelf && requesterMembership.role !== "OWNER") {
      throw new AppError(ErrorCodes.FORBIDDEN);
    }

    const target = await this.repo.findMember(id, targetUserId);
    if (!target) {
      throw new AppError(ErrorCodes.NOT_MEMBER);
    }

    if (target.role === "OWNER") {
      const ownerCount = await this.repo.countOwners(id);
      if (ownerCount <= 1) {
        throw new AppError(ErrorCodes.HOUSEHOLD_LAST_OWNER);
      }
    }

    await this.repo.removeMember(id, targetUserId);
  }

  async listIngredients(id: string, userId: string) {
    await this.assertMember(id, userId);
    const data = await this.repo.findIngredients(id);
    return { data };
  }

  async addIngredient(id: string, data: AddIngredientInput, userId: string) {
    await this.assertMember(id, userId);
    const result = await this.repo.upsertIngredient(id, data.ingredientId, data.unitId, data.quantity);
    return { result };
  }

  async updateIngredient(id: string, ingredientId: number, data: UpdateIngredientInput, userId: string) {
    await this.assertMember(id, userId);
    const existing = await this.repo.findIngredient(id, ingredientId);
    if (!existing) {
      throw new AppError(ErrorCodes.RESOURCE_NOT_FOUND);
    }
    const result = await this.repo.upsertIngredient(
      id,
      ingredientId,
      data.unitId ?? existing.unitId,
      data.quantity ?? existing.quantity
    );
    return { result };
  }

  async removeIngredient(id: string, ingredientId: number, userId: string) {
    await this.assertMember(id, userId);
    const existing = await this.repo.findIngredient(id, ingredientId);
    if (!existing) {
      throw new AppError(ErrorCodes.RESOURCE_NOT_FOUND);
    }
    await this.repo.removeIngredient(id, ingredientId);
  }

  async listUstensils(id: string, userId: string) {
    await this.assertMember(id, userId);
    const data = await this.repo.findUstensils(id);
    return { data };
  }

  async addUstensil(id: string, ustensilId: number, userId: string) {
    await this.assertMember(id, userId);
    const result = await this.repo.addUstensil(id, ustensilId);
    return { result };
  }

  async removeUstensil(id: string, ustensilId: number, userId: string) {
    await this.assertMember(id, userId);
    const existing = await this.repo.findUstensil(id, ustensilId);
    if (!existing) {
      throw new AppError(ErrorCodes.RESOURCE_NOT_FOUND);
    }
    await this.repo.removeUstensil(id, ustensilId);
  }

  async listShoppingListItems(id: string, userId: string) {
    await this.assertMember(id, userId);
    const data = await this.repo.findShoppingListItems(id);
    return { data };
  }

  async addShoppingListItem(id: string, data: AddShoppingListItemInput, userId: string) {
    await this.assertMember(id, userId);
    const result = await this.repo.createShoppingListItem(id, userId, data);
    return { result };
  }

  async updateShoppingListItem(id: string, itemId: number, data: UpdateShoppingListItemInput, userId: string) {
    await this.assertMember(id, userId);
    const existing = await this.repo.findShoppingListItem(id, itemId);
    if (!existing) {
      throw new AppError(ErrorCodes.RESOURCE_NOT_FOUND);
    }
    const result = await this.repo.updateShoppingListItem(itemId, data);
    return { result };
  }

  async removeShoppingListItem(id: string, itemId: number, userId: string) {
    await this.assertMember(id, userId);
    const existing = await this.repo.findShoppingListItem(id, itemId);
    if (!existing) {
      throw new AppError(ErrorCodes.RESOURCE_NOT_FOUND);
    }
    await this.repo.deleteShoppingListItem(itemId);
  }

  private async assertMember(householdId: string, userId: string) {
    const membership = await this.repo.findMember(householdId, userId);
    if (!membership) {
      throw new AppError(ErrorCodes.FORBIDDEN);
    }
    return membership;
  }

  private async assertOwner(householdId: string, userId: string) {
    const membership = await this.assertMember(householdId, userId);
    if (membership.role !== "OWNER") {
      throw new AppError(ErrorCodes.FORBIDDEN);
    }
    return membership;
  }
}
