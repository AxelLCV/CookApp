import { Prisma, Tag } from "../generated/prisma/client.js";

export interface ITagRepository {
  create(data: Prisma.TagCreateInput | Prisma.TagUncheckedCreateInput): Promise<Tag>;
  findMany(args: Prisma.TagFindManyArgs): Promise<Tag[]>;
  delete(where: Prisma.TagWhereUniqueInput): Promise<Tag>;
}
