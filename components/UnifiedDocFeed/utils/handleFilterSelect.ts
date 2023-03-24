import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const _getTagsValue = ({ incomingTags, query }) => {
  const isTagsAString = typeof query.tags === "string";
  const isTagsAnArray = Array.isArray(query.tags);

  const existingTags = isTagsAString
    ? [query.tags]
    : isTagsAnArray
    ? [...query.tags]
    : [];

  let newTags: string[] = [...existingTags];
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
    const topLevelFilterObj = topLevelFilters[topLevel];
    const isUserOnHubPage = router.pathname.indexOf("/hubs") >= 0;

    let basePath = "";
    if (isUserOnHubPage) {
      const urlParts = router.asPath.split("/");
      basePath = "/" + urlParts[1] + "/" + urlParts[2];
    }

    const navigateToUrl = basePath + topLevelFilterObj?.value;
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
  const tagsValue = _getTagsValue({ incomingTags: tags, query });

  const newQuery = {
    ...(router.query.slug && { slug: router.query.slug }),
    ...(typeValue && { type: typeValue }),
    ...(sortValue && { sort: sortValue }),
    ...(timeScopeValue && { time: timeScopeValue }),
    ...(tagsValue.length > 0 && { tags: tagsValue }),
  };

  router.push({
    pathname: router.pathname,
    query: newQuery,
  });
};

export default handleFilterSelect;
