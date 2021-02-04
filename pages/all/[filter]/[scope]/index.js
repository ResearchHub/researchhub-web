import HubPage from "~/components/Hubs/HubPage";

import { getInitialScope } from "~/config/utils/dates";
import {
  slugToFilterQuery,
  calculateScopeFromSlug,
} from "~/config/utils/routing";
import { fetchPaperFeed } from "~/config/fetch";
import { filterOptions, scopeOptions } from "~/config/utils/options";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

Index.getInitialProps = async (ctx) => {
  const { query } = ctx;
  const { filter, scope, page } = query;

  const defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
    feed: 1,
    error: true,
  };

  const PARAMS = {
    ordering: filter && slugToFilterQuery(filter),
    timePeriod: scope ? calculateScopeFromSlug(scope) : getInitialScope(),
    page: page || 1,
    hubId: 0,
  };

  if (filter === "pulled-papers") {
    PARAMS.ordering = "hot";
    PARAMS.externalSource = "True";
  }

  try {
    const initialFeed = await fetchPaperFeed(PARAMS);

    const scopeObj = scopeOptions.filter((el) => el.value === scope)[0];

    let filterObj = filterOptions.filter(
      (el) => el.value === slugToFilterQuery(filter)
    )[0];

    if (filter === "pulled-papers") {
      filterObj = {
        value: "pulled-papers",
        href: "pulled-papers",
        label: "Pulled Papers",
      };
    } else if (filter === "removed") {
      filterObj = {
        value: "removed",
        label: "Removed",
        href: "removed",
      };
    }

    return {
      initialFeed,
      feed: 1,
      filter: filterObj,
      scope: scopeObj,
    };
  } catch {
    return defaultProps;
  }
};

export default Index;
