import { prisma } from "../config/prisma.js";
import { Tag, Prisma } from "../generated/prisma/client.js";
import { GenericRepository } from "../repositories/generic.repository.js";
import { TagsService } from "../services/tags.service.js";
import { createCrudController } from "./crud.controller.factory.js";

const tagsService = new TagsService(
  new GenericRepository<
    Tag,
    Prisma.TagCreateInput | Prisma.TagUncheckedCreateInput,
    Prisma.TagUpdateInput | Prisma.TagUncheckedUpdateInput,
    Prisma.TagWhereUniqueInput,
    Prisma.TagFindManyArgs
  >(prisma.tag)
);

export const tagsController = createCrudController(tagsService);
