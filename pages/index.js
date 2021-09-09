import { AUTH_TOKEN } from "~/config/constants";
import { fetchUnifiedDocFeed } from "~/config/fetch";
import { filterOptions } from "~/config/utils/options";
import { getInitialScope } from "~/config/utils/dates";
import { getUnifiedDocTypes } from "~/config/utils/getUnifiedDocTypes";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import HubPage from "~/components/Hubs/HubPage";
import nookies from "nookies";

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
    feed: 0,
    loggedIn: authToken !== undefined,
  };

  if (!isServer()) {
    return {
      ...defaultProps,
      home: true,
      page: 1,
      feed: 0,
      filter: filterObj,
      query,
    };
  }

  try {
    const urlDocType = getUnifiedDocTypes(urlQuery.type) || "all";
    const initialFeed = await fetchUnifiedDocFeed(
      {
        hubId: null,
        ordering: "hot",
        page: 1,
        subfilters: filterObj,
        subscribedHubs: false,
        timePeriod: getInitialScope(),
        type: urlDocType,
      },
      authToken,
      !isNullOrUndefined(authToken) /* withVotes */
    );
    return {
      ...defaultProps,
      initialFeed,
      feed: 0,
    };
  } catch (error) {
    return defaultProps;
  }
};

export default Index;
