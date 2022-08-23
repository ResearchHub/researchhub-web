import {
  feedTypeOpts,
  sortOpts,
  subFilters,
  topLevelFilters,
} from "../constants/UnifiedDocFilters";
import { scopeOptions } from "~/config/utils/options";

type SelectedUrlFilters = {
  topLevel: string | undefined;
  type: string | undefined;
  sort: string | undefined;
  time: string | undefined;
  subFilters: any;
}

export const getSelectedUrlFilters = ({ router }):SelectedUrlFilters => {
  const defaults = {
    topLevel: topLevelFilters[0].value,
    // @ts-ignore
    type: Object.values(feedTypeOpts)[0].value,
    sort: sortOpts[0].value,
    time: scopeOptions[0].value,
    subFilters: {},
  };
  const selected = { ...defaults };

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

  for (let i = 0; i < subFilters.length; i++) {
    const f = subFilters[i];

    if (router?.query?.[f.value] && f.availableFor.includes(String(selected.type))) {
      selected.subFilters[f.value] = true;
    }
  }
console.log('selected', selected)
  return selected;
};