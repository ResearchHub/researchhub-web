import { AUTH_TOKEN } from "../config/constants";
import { fetchUnifiedDocFeed } from "../config/fetch";
import { getInitialScope } from "~/config/utils/dates";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import HubPage from "../components/Hubs/HubPage";
import nookies from "nookies";
import { redirect } from "~/config/utils";

const isServer = () => typeof window === "undefined";

const Index = (props) => {
  // NOTE: calvinhlee - being called
  return <HubPage home={true} {...props} />;
};

Index.getInitialProps = async (ctx) => {
  if (!isServer()) {
    return { home: true, page: 1, feed: 0 };
  }
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];
  if (!authToken) {
    let redirectPath = "all";
    redirect(ctx, "", redirectPath);
  }

  const { query, query: urlQuery } = ctx;
  const { page: feedPage = 1 } = urlQuery;
  const defaultProps = {
    home: true,
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
    feed: 0,
  };

  try {
    const urlDocType = urlQuery.type || "all";
    const initialFeed = await fetchUnifiedDocFeed(
      {
        hubId: 0,
        ordering: "hot",
        timePeriod: getInitialScope(),
        subscribedHubs: true,
        page: feedPage,
        type: urlDocType,
      },
      authToken,
      !isNullOrUndefined(authToken) /* withVotes */
    ).then((res) => {
      return res;
    });
    return {
      ...defaultProps,
      initialFeed,
      query,
      page: 1,
      loggedIn: authToken !== undefined,
    };
  } catch (e) {
    console.log(e);
    return defaultProps;
  }
};

export default Index;
