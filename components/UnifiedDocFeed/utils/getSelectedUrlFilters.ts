import {
  feedTypeOpts,
  sortOpts,
  tagFilters,
  topLevelFilters,
  scopeOptions,
} from "../constants/UnifiedDocFilters";
import { NullableString } from "~/config/types/root_types";
import { getAvailableSortOptions } from "./getAvailableSortOptions";
import { getSortValue } from "./getSortValue";

export type SelectedUrlFilters = {
  topLevel: NullableString;
  type: NullableString;
  sort: NullableString;
  time: NullableString;
  tags: string[];
};

const defaults = {
  topLevel: Object.values(topLevelFilters)[0].value,
  type: Object.values(feedTypeOpts)[0].value,
  sort: Object.values(sortOpts)[0].value,
  time: Object.values(scopeOptions)[0].value,
  tags: <string[]>[],
};

export const getSelectedUrlFilters = ({
  query,
  pathname,
}): SelectedUrlFilters => {
  if (!(query || pathname)) {
    return defaults;
  }

  const isTagsAString = typeof query.tags === "string";
  const isTagsAnArray = Array.isArray(query.tags);

  const selectedTopLevelFilter = topLevelFilters[pathname]?.value;
  const selectedTypeFilter = feedTypeOpts[query?.type]?.value;
  const selectedTimeScope = scopeOptions[query?.time]?.value;
  const selectedSort = getSortValue({
    query,
    type: selectedTypeFilter || "all",
  });

  const selected = {
    ...defaults,
    ...(selectedTopLevelFilter && { topLevel: selectedTopLevelFilter }),
    ...(selectedTypeFilter && { type: selectedTypeFilter }),
    ...(selectedSort && { sort: selectedSort }),
    ...(selectedTimeScope && { time: selectedTimeScope }),
    ...(query.tags && {
      tags: isTagsAString ? [query.tags] : isTagsAnArray ? [...query.tags] : [],
    }),
  };
  return selected;
};
