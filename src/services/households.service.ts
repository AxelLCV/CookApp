import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";
import { IHouseholdRepository } from "../interfaces/household.repository.interface.js";
import { IUserRepository } from "../interfaces/user.repository.interface.js";
import { CreateInput, UpdateInput, AddMemberInput } from "../validators/households.schema.js";

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
