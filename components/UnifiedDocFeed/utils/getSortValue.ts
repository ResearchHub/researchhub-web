import { NullableString } from "~/config/types/root_types";
import { getAvailableSortOptions } from "./getAvailableSortOptions";

type Args = {
  query: any;
  type: string;
  userSelectedSort?: NullableString;
};

export const getSortValue = ({ query, type, userSelectedSort }: Args) => {
  const availSorts = getAvailableSortOptions({ type, valuesOnly: true });
  const defaultSort = availSorts[0];
  const sortValue = userSelectedSort || query.sort || defaultSort;

  if (availSorts.includes(sortValue)) {
    if (sortValue === defaultSort) {
      return undefined;
    } else {
      return sortValue;
    }
  }

  return undefined;
};
