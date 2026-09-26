export interface IGenericRepository<TModel, TCreateInput, TUpdateInput, TWhereUniqueInput, TFindManyArgs> {
  create(data: TCreateInput): Promise<TModel>;
  update(where: TWhereUniqueInput, data: TUpdateInput): Promise<TModel>;
  findMany(args: TFindManyArgs): Promise<TModel[]>;
  delete(where: TWhereUniqueInput): Promise<TModel>;
}
