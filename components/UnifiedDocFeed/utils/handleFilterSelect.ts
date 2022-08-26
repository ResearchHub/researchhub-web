import { feedTypeOpts, sortOpts, topLevelFilters } from "../constants/UnifiedDocFilters";

type Args = {
  router: any,
  topLevel?: string,
  typeFilter?: string,
  tags?: string[],
  sort?: string,
  timeScope?: string,
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
    const navigateToUrl = topLevelFilters.find(
      (f) => f.value === topLevel
    )?.url;
    return router.push({ pathname: navigateToUrl });
  }

  if (Array.isArray(tags)) {
    let newTags:string[] = [];
    if (Array.isArray(query.tags)) {
      newTags = [...query.tags];
    } else if (query.tags) {
      newTags.push(query.tags);
    }

    for (let i = 0; i < tags.length; i++) {
      const tagAlreadyInList = newTags.includes(tags[i]);
      if (tagAlreadyInList) {
        newTags = newTags.filter((t) => t !== tags[i]);
      } else {
        newTags.push(tags[i]);
      }
    }

    query.tags = newTags;
  }

  if (typeFilter) {
    const isDefault = Object.values(feedTypeOpts)[0].value == typeFilter;
    if (isDefault) {
      delete query.type;
    } else {
      query.type = typeFilter;
    }

    // Reset tags when switching type filters
    if (!tags || tags.length === 0) {
      delete query.tags;
    }
  }

  if (sort) {
    const isDefault = sortOpts[0].value == sort;
    if (isDefault) {
      delete query.sort;
      delete query.time;
    } else {
      query.sort = sort;
    }
  }

  if (timeScope) {
    query.time = timeScope;
  }

  router.push({
    pathname: router.pathname,
    query,
  });
};

export default handleFilterSelect;