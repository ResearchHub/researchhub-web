import { AUTH_TOKEN } from "~/config/constants";
import {
  fetchUnifiedDocFeed,
  fetchLatestActivity,
  fetchLeaderboard,
  fetchTopHubs,
} from "~/config/fetch";
import { filterOptions } from "~/config/utils/options";
import { getInitialScope } from "~/config/utils/dates";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

export function buildStaticPropsForFeed({ docType = "all" }) {
  return async function getStaticProps(ctx) {
    const defaultProps = {
      initialFeed: null,
      leaderboardFeed: null,
      initialHubList: null,
      feed: 0,
    };

    const initialActivityPromise = fetchLatestActivity({});
    const initialHubListPromise = fetchTopHubs();
    const leaderboardPromise = fetchLeaderboard({
      limit: 10,
      page: 1,
      hubId: null,
      timeframe: "past_week",
    });

    const initialFeedPromise = fetchUnifiedDocFeed({
      hubId: null,
      ordering: "hot",
      page: 1,
      subscribedHubs: false,
      timePeriod: getInitialScope(),
      type: docType,
    });
    const [leaderboardFeed, initialFeed, initialHubList, initialActivity] =
      await Promise.all([
        leaderboardPromise,
        initialFeedPromise,
        initialHubListPromise,
        initialActivityPromise,
      ]);
    return {
      revalidate: 10,
      props: {
        ...defaultProps,
        initialFeed,
        leaderboardFeed,
        initialHubList,
        initialActivity,
        feed: 0,
      },
    };
  };
}
