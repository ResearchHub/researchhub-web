import { keys } from "undux/dist/src/utils";
import { filterNull, isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { snakeCaseToNormalCase } from "~/config/utils/string";

const labelMap = {
  creators: "Authors / Creators",
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
  const result = filterNull([
    keySet.has("title") ? "title" : null,
    keySet.has("creators") ? "creators" : null,
  ]);
  keySet.delete("title");
  keySet.delete("creators");
  return [...result, ...Array.from(keySet)];
  // return labels
  //   .sort((a: string, b: string): number => {
  //     if (a === "title") {
  //       return -1;
  //     } else if (a === "creators") {
  //       return 0;
  //     }
  //     return 1;
  //   })
  //   .sort((a: string, _b): number => {
  //     if (a === "title") {
  //       return -1;
  //     }
  //     return 0;
  //   });
};
