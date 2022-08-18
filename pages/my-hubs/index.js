import { AUTH_TOKEN } from "~/config/constants";
import { fetchUnifiedDocFeed } from "~/config/fetch";
import { filterOptions } from "~/config/utils/options";
import { getBEUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { isServer } from "~/config/server/isServer";
import HubPage from "~/components/Hubs/HubPage";
import nookies from "nookies";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

Index.getInitialProps = async (ctx) => {
  // TODO: calvinhlee - refactor this
  const { query, query: urlQuery } = ctx;
  const { filter, page } = query;
  const filterObj = filterOptions.filter((el) => el.value === filter)[0];
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];
  const defaultProps = {
    feed: 1,
    filter: filterObj,
    initialFeed: null,
    hubId: null,
    initialHubList: null,
    leaderboardFeed: null,
    loggedIn: authToken !== undefined,
    subfilters: filterObj,
    page: 1,
    query,
  };

  if (!isServer()) {
    return defaultProps;
  }

  try {
    const beDocType = getBEUnifiedDocType(urlQuery.type);
    const initialFeed = await fetchUnifiedDocFeed(
      {
        ...defaultProps,
        ordering: "hot",
        page: 1,
        subfilters: filterObj,
        subscribedHubs: true,
        timePeriod: "today",
        type: beDocType,
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
