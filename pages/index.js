import { AUTH_TOKEN } from "~/config/constants";
import { fetchUnifiedDocFeed } from "~/config/fetch";
import { filterOptions } from "~/config/utils/options";
import { getInitialScope } from "~/config/utils/dates";
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
  const { query } = ctx;
  const { type, filter } = ctx?.query ?? {};
  const filterObj = filterOptions.filter((el) => el.value === filter)[0];
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];
  const defaultProps = {
    feed: 0,
    filter: filterObj,
    home: true,
    initialFeed: null,
    initialHubList: null,
    leaderboardFeed: null,
    loggedIn: authToken !== undefined,
    page: 1,
    query,
  };

  try {
    const urlDocType = type || "all";
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
    };
  } catch (error) {
    return defaultProps;
  }
};

export default Index;
