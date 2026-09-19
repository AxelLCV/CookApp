export interface IGenericRepository<TModel, TCreateInput, TWhereUniqueInput, TFindManyArgs> {
  create(data: TCreateInput): Promise<TModel>;
  findMany(args: TFindManyArgs): Promise<TModel[]>;
  delete(where: TWhereUniqueInput): Promise<TModel>;
}
