export const convertToSlug = (value: string): string =>
  value.split("_").join("-");
