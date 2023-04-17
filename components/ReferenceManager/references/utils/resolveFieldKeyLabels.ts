import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { snakeCaseToNormalCase } from "~/config/utils/string";

const labelMap = {
  creators: "Authors / Creators (comma separated)",
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

export const sortSchemaFieldKeys = (labels: string[]): string[] => {
  return labels
    .sort((a: string, b: string): number => {
      if (a === "title") {
        return -1;
      } else if (a === "creators") {
        return 0;
      }
      return 1;
    })
    .sort((a: string, _b): number => {
      if (a === "title") {
        return -1;
      }
      return 0;
    });
};
