import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { snakeCaseToNormalCase } from "~/config/utils/string";

const labelMap = {
  creators: "Authors / Creators (comma separated)",
  date: "Date (MM-DD-YYYY)",
  doi: "DOI",
  url: "URL",
};

export const resolveFieldKeyLabels = (str: string): string => {
  const label = labelMap[str];
  return !isEmpty(label)
    ? nullthrows(label)
    : nullthrows(snakeCaseToNormalCase(str));
};
