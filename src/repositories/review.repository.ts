import { PrismaClient, Prisma } from "../generated/prisma/client.js";
import { IReviewRepository } from "../interfaces/review.repository.interface.js";

export const reviewWithUserInclude = {
  user: { select: { id: true, username: true } },
} satisfies Prisma.ReviewInclude;

export type ReviewWithUser = Prisma.ReviewGetPayload<{ include: typeof reviewWithUserInclude }>;

export class ReviewRepository implements IReviewRepository {
  constructor(private prisma: PrismaClient) {}

  findMany(recipeId: number, skip: number, take: number): Promise<ReviewWithUser[]> {
    return this.prisma.review.findMany({
      where: { recipeId },
      include: reviewWithUserInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  count(recipeId: number): Promise<number> {
    return this.prisma.review.count({ where: { recipeId } });
  }

  async average(recipeId: number): Promise<number | null> {
    const result = await this.prisma.review.aggregate({
      where: { recipeId },
      _avg: { note: true },
    });
    return result._avg.note;
  }

  findOne(userId: string, recipeId: number): Promise<ReviewWithUser | null> {
    return this.prisma.review.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
      include: reviewWithUserInclude,
    });
  }

  upsert(userId: string, recipeId: number, languageId: number, note: number, description: string): Promise<ReviewWithUser> {
    return this.prisma.review.upsert({
      where: { userId_recipeId: { userId, recipeId } },
      create: { userId, recipeId, languageId, note, description },
      update: { note, description, modifiedAt: new Date() },
      include: reviewWithUserInclude,
    });
  }

  async delete(userId: string, recipeId: number): Promise<void> {
    await this.prisma.review.delete({
      where: { userId_recipeId: { userId, recipeId } },
    });
  }
}
