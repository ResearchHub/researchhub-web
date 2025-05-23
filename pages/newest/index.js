import HubPage from "~/components/Hubs/HubPage";

import { getInitialScope } from "~/config/utils/dates";
import { fetchPaperFeed } from "~/config/fetch";
import { filterOptions } from "~/config/utils/options";

import nookies from "nookies";
import { ENV_AUTH_TOKEN } from "~/config/utils/auth";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

Index.getInitialProps = async (ctx) => {
  const { query } = ctx;
  const { page } = query;

  const cookies = nookies.get(ctx);
  const authToken = cookies[ENV_AUTH_TOKEN];

  const defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
    feed: 0,
  };

  const PARAMS = {
    ordering: "newest",
    timePeriod: getInitialScope(),
    page: page || 1,
    subscribedHubs: true,
  };

  try {
    const initialFeed = await fetchPaperFeed(PARAMS, authToken);
    const filter = filterOptions[2];

    return {
      initialFeed,
      filter,
      feed: 0,
    };
  } catch {
    return defaultProps;
  }
};

export default Index;
