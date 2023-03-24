import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { isEmpty } from "~/config/utils/nullchecks";

export type SelectedUrlFilters = {
  topLevel: NullableString;
  type: NullableString;
  sort: NullableString;
  time: NullableString;
  tags: string[];
  isReady: boolean;
};


const _getDefaults = ({ typeFilter }) => {
  const availSorts = Object.values(sortOpts).filter(s => s.availableFor.includes(typeFilter));
  const defaults = {
    topLevel: Object.values(topLevelFilters)[0].value,
    type: Object.values(feedTypeOpts)[0].value,
    sort: Object.values(availSorts)[0].value,
    time: Object.values(scopeOptions)[0].value,
    tags: <string[]>[],
  };
  
  return defaults;
}

export const getSelectedUrlFilters = ({
  query,
  pathname,
  router,
}: {
  query: any,
  pathname: string,
  router?: any
}): SelectedUrlFilters => {
  const lastPathPart = "/" + pathname.split("/").slice(-1)[0];
  const selectedTopLevelFilter = topLevelFilters[lastPathPart]?.value;
  const selectedTypeFilter = feedTypeOpts[query?.type]?.value || "all";
  const selectedSort = getSortValue({
    query,
    type: selectedTypeFilter || "all",
  });
  const selectedTimeScope = selectedSort === "new" ? "all-time" : scopeOptions[query?.time]?.value;
  const isTagsAString = typeof query.tags === "string";
  const isTagsAnArray = Array.isArray(query.tags);
  const defaults = _getDefaults({ typeFilter: selectedTypeFilter })  

  const selected = {
    ...defaults,
    ...(selectedTopLevelFilter && { topLevel: selectedTopLevelFilter }),
    ...(selectedTypeFilter && { type: selectedTypeFilter }),
    ...(selectedSort && { sort: selectedSort }),
    ...(selectedTimeScope && { time: selectedTimeScope }),
    ...(query.tags && {
      tags: isTagsAString ? [query.tags] : isTagsAnArray ? [...query.tags] : [],
    }),
    ...(router && {isReady: router.isReady}),
  };

  return selected;
};
