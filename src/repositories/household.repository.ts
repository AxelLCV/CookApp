import { PrismaClient, Prisma, Household, HouseholdMember, HouseholdRole } from "../generated/prisma/client.js";
import { IHouseholdRepository } from "../interfaces/household.repository.interface.js";

export const householdMembersInclude = {
  members: { include: { user: { select: { id: true, username: true } } } },
} satisfies Prisma.HouseholdInclude;

export type HouseholdWithMembers = Prisma.HouseholdGetPayload<{ include: typeof householdMembersInclude }>;

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
}
