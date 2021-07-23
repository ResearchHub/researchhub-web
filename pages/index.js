import HubPage from "../components/Hubs/HubPage";

import API from "~/config/api";
import { getInitialScope } from "~/config/utils/dates";
import { Helpers } from "@quantfive/js-web-config";
import nookies from "nookies";
import { AUTH_TOKEN } from "../config/constants";
import { fetchUnifiedDocFeed } from "../config/fetch";

const isServer = () => typeof window === "undefined";

const Index = (props) => {
  // NOTE: calvinhlee - being called
  return <HubPage home={true} {...props} />;
};

Index.getInitialProps = async (ctx) => {
  if (!isServer()) {
    return { home: true, page: 1, feed: 0 };
  }
  const { query, query: urlQuery } = ctx;
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  let page = query.page || 1;
  let defaultProps = {
    home: true,
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
    feed: 0,
  };

  try {
    const urlDocType = urlQuery.type || "all";
    let initialFeed = await fetchUnifiedDocFeed({
      hubId: 0,
      ordering: "hot",
      timePeriod: getInitialScope(),
      subscribedHubs: true,
      page,
      type: urlDocType,
    }).then((res) => {
      return res;
    });
    if (initialFeed.results.feed_type === "all") {
      defaultProps.feed = 1;
      const { res } = ctx;
      res.statusCode = 302;
      res.setHeader("location", "/all");
      res.end();
    }
    let props = {
      ...defaultProps,
      initialFeed,
      query,
      page: page + 1,
      loggedIn: authToken !== undefined,
    };
    return props;
  } catch (e) {
    console.log(e);
    return defaultProps;
  }
};

export default Index;
