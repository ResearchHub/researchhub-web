import { searchTypes } from "./options";
import get from "lodash/get";

export const QUERY_PARAM = "q";

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

export const hasNoSearchResults = ({ searchType, apiResponse }) => {
  if (searchType === "all") {
    const allResults = Object.values(apiResponse);

    for (let i = 0; i < allResults.length; i++) {
      const entityResultSet = allResults[i];

      if (!Array.isArray(entityResultSet)) {
        continue;
      } else if (entityResultSet.length > 0) {
        return false;
      }
    }

    return true;
  } else {
    return apiResponse.count === 0 ? true : false;
  }
};
