import { PrismaClient, Prisma, Tag } from "../generated/prisma/client.js";
import { ITagRepository } from "../interfaces/tag.repository.interface.js";

export class TagRepository implements ITagRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: Prisma.TagCreateInput | Prisma.TagUncheckedCreateInput): Promise<Tag> {
    return this.prisma.tag.create({
      data,
      include: { translations: true },
    });
  }

  findMany(args: Prisma.TagFindManyArgs): Promise<Tag[]> {
    return this.prisma.tag.findMany(args);
  }

  delete(where: Prisma.TagWhereUniqueInput): Promise<Tag> {
    return this.prisma.tag.delete({ where });
  }
}
