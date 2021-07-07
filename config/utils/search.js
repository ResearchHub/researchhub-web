import { searchTypes } from "./options";
import { has } from "underscore";
import { get } from "lodash";

/*
  Pick allowed search filters from Next's query params object.
*/
export const pickFilters = ({ searchType, query, forApiOrApp }) => {
  const allowedFilters = get(searchTypes, searchType, []);
  const lookupField = `fieldFor${forApiOrApp}`;

  const pickedFilters = {};
  const availableFilters = Object.keys(allowedFilters);
  for (const fname of availableFilters) {
    if (query[fname]) {
      const filterObj = allowedFilters[fname];
      const mappedKey = filterObj[lookupField];

      pickedFilters[mappedKey] = query[fname];
    }
  }

  return pickedFilters;
};

export const pickFiltersForApi = ({ searchType, query }) => {
  return pickFilters({ searchType, query, forApiOrApp: "Api" });
};

export const pickFiltersForApp = ({ searchType, query }) => {
  return pickFilters({ searchType, query, forApiOrApp: "App" });
};
