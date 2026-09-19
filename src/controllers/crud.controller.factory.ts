import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

interface CrudService<TCreateInput, TGetManyInput, TDeleteInput> {
  create(data: TCreateInput, languageId: number): Promise<unknown>;
  getMany(query: TGetManyInput, languageId: number): Promise<unknown>;
  delete(data: TDeleteInput): Promise<unknown>;
}

export function createCrudController<TCreateInput, TGetManyInput, TDeleteInput>(
  service: CrudService<TCreateInput, TGetManyInput, TDeleteInput>
) {
  return {
    create: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
      const input = req.validated!.body as TCreateInput;
      const languageId = req.user?.languageId as number;
      const result = await service.create(input, languageId);
      return res.status(201).json(result);
    }),

    getMany: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
      const input = req.validated!.query as TGetManyInput;
      const languageId = req.user?.languageId as number;
      const result = await service.getMany(input, languageId);
      return res.status(200).json(result);
    }),

    delete: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
      const input = req.validated!.params as TDeleteInput;
      await service.delete(input);
      return res.status(204).send();
    }),
  };
}
