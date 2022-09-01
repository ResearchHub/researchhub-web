import { feedTypeOpts, topLevelFilters } from "../constants/UnifiedDocFilters";
import { getSortValue } from "./getSortValue";

type Args = {
  router: any;
  topLevel?: string;
  typeFilter?: string;
  tags?: string[];
  sort?: string;
  timeScope?: string;
};

const _getTags = ({ incomingTags, query }) => {
  const isTagsAString = typeof query.tags === "string";
  const isTagsAnArray = Array.isArray(query.tags);

  const existingTags = isTagsAString ? [query.tags] : isTagsAnArray ? [...query.tags] : [];
  
  let newTags:string[] = [...existingTags]
  if (incomingTags && incomingTags.length > 0) {
    for (let i = 0; i < incomingTags.length; i++) {
      const tagAlreadyInList = existingTags.includes(incomingTags[i]);
      if (tagAlreadyInList) {
        newTags = newTags.filter((t) => t !== incomingTags[i]);
      } else {
        newTags.push(incomingTags[i]);
      }
    }
  }

  return newTags;
}

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


  const isDefaultTypeFilter =
    Object.values(feedTypeOpts)[0].value == typeFilter;
  const sortValue = getSortValue({
    query: router.query,
    userSelectedSort: sort,
    type: query.type || "all",
  });
  const timeScopeValue = sortValue && (timeScope || router.query.time);
  const typeValue = isDefaultTypeFilter ? null : router.query.type;
  const tagsValue = _getTags({ incomingTags: tags, query })

  const newQuery = {
    ...(router.query.slug && { slug: router.query.slug }),
    ...(typeValue && { type: typeValue }),
    ...(sortValue && { sort: sortValue }),
    ...(timeScopeValue && { time: timeScopeValue }),
    ...(tagsValue.length > 0 && { tags: tagsValue })
  };

  router.push({
    pathname: router.pathname,
    query: newQuery,
  });
};

export default handleFilterSelect;
