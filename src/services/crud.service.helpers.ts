export function buildSearchWhere(search: string | undefined, languageId: number) {
  return search
    ? {
        translations: {
          some: {
            name: { contains: search, mode: "insensitive" as const },
            languageId,
          },
        },
      }
    : undefined;
}

export function translationSelect<T extends Record<string, true>>(fields: T, languageId: number) {
  return {
    select: fields,
    where: { languageId },
  };
}
