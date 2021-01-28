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
    feed: 1,
  };

  const PARAMS = {
    ordering: "hot",
    timePeriod: getInitialScope(),
    page: page || 1,
    hubId: 0,
  };

  try {
    const initialFeed = await fetchPaperFeed(PARAMS);
    const filterObj = filterOptions.filter((el) => el.value === filter)[0];

    return {
      initialFeed,
      query,
      filter: filterObj,
      feed: 1,
    };
  } catch {
    return defaultProps;
  }
};

export default Index;
