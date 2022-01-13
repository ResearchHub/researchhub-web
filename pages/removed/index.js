import HubPage from "~/components/Hubs/HubPage";

import { getInitialScope } from "~/config/utils/dates";
import { fetchPaperFeed } from "~/config/fetch";

import nookies from "nookies";
import { AUTH_TOKEN } from "~/config/constants";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

Index.getInitialProps = async (ctx) => {
  const { query } = ctx;
  const { page } = query;

  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  const defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
    loggedIn: authToken !== undefined,
    feed: 0,
  };

  const PARAMS = {
    ordering: "removed",
    timePeriod: getInitialScope(),
    page: page || 1,
    subscribedHubs: true,
  };

  try {
    const initialFeed = await fetchPaperFeed(PARAMS, authToken);
    const filter = {
      value: "removed",
      label: "Removed",
      href: "removed",
    };

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
