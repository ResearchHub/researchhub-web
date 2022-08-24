import {
  feedTypeOpts,
  sortOpts,
  tagFilters,
  topLevelFilters,
} from "../constants/UnifiedDocFilters";
import { scopeOptions } from "~/config/utils/options";

export type SelectedUrlFilters = {
  topLevel: string | undefined;
  type: string | undefined;
  sort: string | undefined;
  time: string | undefined;
  tags: string[];
}

export const getSelectedUrlFilters = ({ router }):SelectedUrlFilters => {
  const defaults = {
    topLevel: topLevelFilters[0].value,
    type: Object.values(feedTypeOpts)[0].value,
    sort: sortOpts[0].value,
    time: scopeOptions[0].value,
    tags: <string[]>[],
  };
  const selected = { ...defaults };

  if (Array.isArray(router.query.tags)) {
    selected.tags = [...router.query.tags];
  }
  else if (router.query.tags) {
    selected.tags.push(router.query.tags);
  }

  const foundSort = sortOpts.find((opt) => opt.value === router?.query?.sort)?.value;
  const foundTopLevelFilter = topLevelFilters.find(
    (f) => f.url === router.pathname
  )?.value;
  const foundTypeFilter = Object.values(feedTypeOpts).find(
    (opt) => opt.value === router?.query?.type
  )?.value;
  const foundTimeScope = scopeOptions.find(
    (opt) => opt.value === router?.query?.time
  )?.value;

  if (foundTypeFilter) {
    selected.type = foundTypeFilter;

    // Update default sort
    selected.sort = sortOpts.filter(sort => sort.availableFor.includes(selected.type))[0].value;
  }
  if (foundTopLevelFilter) {
    selected.topLevel = foundTopLevelFilter;
  }
  if (foundSort) {
    selected.sort = foundSort;
  }
  if (foundTimeScope) {
    selected.time = foundTimeScope;
  }  

  for (let i = 0; i < selected.tags.length; i++) {
    const t = selected.tags[i];
    const tagIsAnOptionForThisType = tagFilters.find((tf) => tf.value === t)?.availableFor?.includes(selected.type);
    if (!tagIsAnOptionForThisType) {
      delete selected.tags[t];
    }
  }

  return selected;
};
