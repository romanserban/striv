export const createPlaceholderItems = (count: number) =>
  Array.from({ length: count }, (_, index) => `placeholder-${index + 1}`);
