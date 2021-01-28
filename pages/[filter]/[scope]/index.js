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
  const { filter, scope, page, feed } = query;

  const defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
    feed: 0,
    error: true,
    query: query,
  };

  const PARAMS = {
    ordering: filter && slugToFilterQuery(filter),
    timePeriod: scope ? calculateScopeFromSlug(scope) : getInitialScope(),
    page: page || 1,
    subscribedHubs: true,
  };

  try {
    const initialFeed = await fetchPaperFeed(PARAMS);

    const filterObj = filterOptions.filter((el) => el.value === filter)[0];
    const scopeObj = scopeOptions.filter((el) => el.value === query.scope)[0];

    return {
      initialFeed,
      query,
      feed: 0,
      filter: filterObj,
      scope: scopeObj,
    };
  } catch {
    return defaultProps;
  }
};

export default Index;
