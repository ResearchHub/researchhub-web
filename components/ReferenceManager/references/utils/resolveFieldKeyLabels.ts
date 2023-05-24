import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { snakeCaseToNormalCase } from "~/config/utils/string";

const labelMap = {
  creators: "Authors",
  date: "Date (MM-DD-YYYY)",
  doi: "DOI",
  DOI: "DOI",
  url: "URL",
};

export const resolveFieldKeyLabels = (str: string): string => {
  const label = labelMap[str];
  return !isEmpty(label)
    ? nullthrows(label)
    : nullthrows(snakeCaseToNormalCase(str));
};

export const sortSchemaFieldKeys = (fieldKeys: string[]): string[] => {
  const keySet = new Set(fieldKeys);
  const subResult: string[] = [];
  // logical ordering
  keySet.has("title") && subResult.push("title");
  keySet.has("DOI") && subResult.push("DOI");
  keySet.has("creators") && subResult.push("creators");
  keySet.has("publication_title") && subResult.push("publication_title");
  keySet.delete("creators");
  keySet.delete("title");
  keySet.delete("publication_title");
  keySet.delete("DOI");
  keySet.delete("doi");

  return [...subResult, ...Array.from(keySet)];
};
