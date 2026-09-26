import { IGenericRepository } from "../interfaces/generic.repository.interface.js";

interface PrismaCrudDelegate<TModel, TCreateArgs, TUpdateArgs, TFindManyArgs, TWhereUniqueInput> {
  create(args: TCreateArgs): Promise<TModel>;
  update(args: TUpdateArgs): Promise<TModel>;
  findMany(args: TFindManyArgs): Promise<TModel[]>;
  delete(args: { where: TWhereUniqueInput }): Promise<TModel>;
}

export class GenericRepository<TModel, TCreateInput, TUpdateInput, TWhereUniqueInput, TFindManyArgs>
  implements IGenericRepository<TModel, TCreateInput, TUpdateInput, TWhereUniqueInput, TFindManyArgs>
{
  constructor(
    private delegate: PrismaCrudDelegate<
      TModel,
      { data: TCreateInput; include?: any },
      { where: TWhereUniqueInput; data: TUpdateInput; include?: any },
      TFindManyArgs,
      TWhereUniqueInput
    >,
    private includeOnCreate: any = { translations: true }
  ) {}

  create(data: TCreateInput): Promise<TModel> {
    return this.delegate.create({ data, include: this.includeOnCreate });
  }

  update(where: TWhereUniqueInput, data: TUpdateInput): Promise<TModel> {
    return this.delegate.update({ where, data, include: this.includeOnCreate });
  }

  findMany(args: TFindManyArgs): Promise<TModel[]> {
    return this.delegate.findMany(args);
  }

  delete(where: TWhereUniqueInput): Promise<TModel> {
    return this.delegate.delete({ where });
  }
}
