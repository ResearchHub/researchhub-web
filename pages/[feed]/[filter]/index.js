import HubPage from "~/components/Hubs/HubPage";

import API from "~/config/api";
import { getInitialScope } from "~/config/utils/dates";
import {
  slugToFilterQuery,
  calculateScopeFromSlug,
} from "~/config/utils/routing";
import { fetchPaperFeed, fetchLeaderboard, fetchTopHubs } from "~/config/fetch";
import { filterOptions } from "~/config/utils/options";

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
    feed: null,
  };

  const PARAMS = {
    ordering: filter && slugToFilterQuery(filter),
    timePeriod: scope ? calculateScopeFromSlug(scope) : getInitialScope(),
    page: page || 1,
  };

  const isCustomFeed = feed && feed === "custom";

  if (isCustomFeed) {
    PARAMS.subscribedHubs = true;
  } else {
    PARAMS.hubId = 0;
  }

  try {
    const [initialFeed, leaderboardFeed, initialHubList] = await Promise.all([
      fetchPaperFeed(PARAMS),
      fetchLeaderboard({ limit: 10, page: 1, hubId: 0 }),
      fetchTopHubs(),
    ]);

    const filterObj = filterOptions.filter((el) => el.value === filter)[0];

    return {
      initialFeed,
      leaderboardFeed,
      initialHubList,
      query,
      filter: filterObj,
      feed: isCustomFeed ? 0 : 1,
    };
  } catch {
    return defaultProps;
  }
};

export default Index;
