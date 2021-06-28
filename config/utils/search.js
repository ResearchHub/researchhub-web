import { searchTypes } from "./options";
import { pick } from "underscore";
import { get } from "lodash";

export const pickAllowedSearchFiltersFor = ({ searchType, query }) => {
  const allowedFilters = get(searchTypes, `${searchType}`, []);
  return pick(query, ...allowedFilters);
};
