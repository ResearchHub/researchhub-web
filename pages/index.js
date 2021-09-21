import { AUTH_TOKEN } from "~/config/constants";
import { fetchUnifiedDocFeed, fetchLatestActivity } from "~/config/fetch";
import { filterOptions } from "~/config/utils/options";
import { getInitialScope } from "~/config/utils/dates";
import { getUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import HubPage from "~/components/Hubs/HubPage";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

const fetchLeaderboard = () => {
  return fetch(
    API.LEADERBOARD({
      limit: 10,
      page: 1,
      hubId: null,
      timeframe: "past_week",
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      return res;
    });
};

const fetchTopHubs = () => {
  return fetch(API.SORTED_HUB({}), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      let topHubs = [...resp.results];
      topHubs = topHubs.map((hub) => {
        hub.user_is_subscribed = false;
        return hub;
      });

      return topHubs;
    });
};

export async function getStaticProps(ctx) {
  const defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
    feed: 0,
  };

  const initialActivityPromise = fetchLatestActivity({});
  const initialHubListPromise = fetchTopHubs();
  const leaderboardPromise = fetchLeaderboard();
  const initialFeedPromise = fetchUnifiedDocFeed({
    hubId: null,
    ordering: "hot",
    page: 1,
    subscribedHubs: false,
    timePeriod: getInitialScope(),
    type: "all",
  });
  const [
    leaderboardFeed,
    initialFeed,
    initialHubList,
    initialActivity,
  ] = await Promise.all([
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
}

export default Index;
