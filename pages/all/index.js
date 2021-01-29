import HubPage from "~/components/Hubs/HubPage";

import { getInitialScope } from "~/config/utils/dates";
import { fetchPaperFeed } from "~/config/fetch";
import { filterOptions } from "~/config/utils/options";
import nookies from "nookies";
import { AUTH_TOKEN } from "~/config/constants";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

const isServer = () => typeof window === "undefined";

Index.getInitialProps = async (ctx) => {
  const { query } = ctx;
  const { filter, page } = query;
  const filterObj = filterOptions.filter((el) => el.value === filter)[0];
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];
  const defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
    feed: 1,
    loggedIn: authToken !== undefined,
  };

  if (!isServer()) {
    return {
      ...defaultProps,
      home: true,
      page: 1,
      feed: 1,
      filter: filterObj,
      query,
    };
  }
  const PARAMS = {
    ordering: "hot",
    timePeriod: getInitialScope(),
    page: page || 1,
    hubId: 0,
  };

  try {
    const initialFeed = await fetchPaperFeed(PARAMS);

    return {
      ...defaultProps,
      initialFeed,
      feed: 1,
    };
  } catch {
    return defaultProps;
  }
};

export default Index;
