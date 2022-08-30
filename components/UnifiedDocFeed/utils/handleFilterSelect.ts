import {
  feedTypeOpts,
  topLevelFilters,
} from "../constants/UnifiedDocFilters";
import { getSortValue } from "./getSortValue";


type Args = {
  router: any;
  topLevel?: string;
  typeFilter?: string;
  tags?: string[];
  sort?: string;
  timeScope?: string;
};


const handleFilterSelect = ({
  router,
  topLevel,
  typeFilter,
  tags,
  sort,
  timeScope,
}: Args) => {
  const query = { ...router.query };

  if (topLevel) {
    const navigateToUrl = topLevelFilters[topLevel]?.value;
    return router.push({ pathname: navigateToUrl });
  }

  const isDefaultTypeFilter = Object.values(feedTypeOpts)[0].value == typeFilter;
  const sortValue = getSortValue({ query: router.query, userSelectedSort: sort, type: query.type || "all" });
  const timeScopeValue = sortValue && (timeScope || router.query.time);
  const typeValue = isDefaultTypeFilter ? null : router.query.type;

  const newQuery = {
    ...(router.query.slug && { slug: router.query.slug }),
    ...(typeValue && { type: typeValue }),
    ...(sortValue && { sort: sortValue }),
    ...(timeScopeValue && { time: timeScopeValue }),
  }

  router.push({
    pathname: router.pathname,
    query: newQuery,
  });
};

export default handleFilterSelect;
