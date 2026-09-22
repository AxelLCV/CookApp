import { Household, HouseholdMember, HouseholdRole } from "../generated/prisma/client.js";
import { HouseholdWithMembers } from "../repositories/household.repository.js";

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
}
