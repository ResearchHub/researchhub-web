import HubPage from "~/components/Hubs/HubPage";

import { getInitialScope } from "~/config/utils/dates";
import { filterOptions } from "~/config/utils/options";
import nookies from "nookies";
import { AUTH_TOKEN } from "~/config/constants";
import { fetchUnifiedDocFeed } from "~/config/fetch";

const Index = (props) => {
  // NOTE: calvinhlee - being called
  return <HubPage home={true} {...props} />;
};

const isServer = () => typeof window === "undefined";

Index.getInitialProps = async (ctx) => {
  // TODO: calvinhlee - refactor this
  const { query, query: urlQuery } = ctx;
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
  console.warn("isServer ", isServer());

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

  try {
    const urlDocType = urlQuery.type;
    const initialFeed = await fetchUnifiedDocFeed({
      hubId: null,
      ordering: "hot",
      page: 1,
      subfilters: filterObj,
      subscribedHubs: false,
      timePeriod: getInitialScope(),
      type: urlDocType,
    });
    return {
      ...defaultProps,
      initialFeed,
      feed: 1,
    };
  } catch (error) {
    return defaultProps;
  }
};

export default Index;
