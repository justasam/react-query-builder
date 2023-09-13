export const appendOrCreate = <I>(array: Array<I> | undefined, item: I) => {
  if (!array) return [item];

  return [...array, item];
};
