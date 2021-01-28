import HubPage from "../components/Hubs/HubPage";

import API from "~/config/api";
import { getInitialScope } from "~/config/utils/dates";
import { Helpers } from "@quantfive/js-web-config";
import nookies from "nookies";
import { AUTH_TOKEN } from "../config/constants";

const isServer = () => typeof window === "undefined";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

const getHubPapers = (page, authToken) => {
  return fetch(
    API.GET_HUB_PAPERS({
      hubId: 0,
      ordering: "hot",
      timePeriod: getInitialScope(),
      page,
    }),
    API.GET_CONFIG(authToken)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      return res;
    });
};

Index.getInitialProps = async (ctx) => {
  if (!isServer()) {
    return { home: true, page: 1, feed: 0 };
  }
  let { query } = ctx;
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];
  const { page } = query;
  let defaultProps = {
    home: true,
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
    feed: 0,
  };

<<<<<<< HEAD
  try {
    let initialFeed = await getHubPapers(page, authToken);
    let props = { initialFeed, query, page: page + 1 };
    return props;
=======
  const PARAMS = {
    ordering: "hot",
    timePeriod: getInitialScope(),
    page: page || 1,
    subscribedHubs: true,
  };

  try {
    const initialFeed = await fetchPaperFeed(PARAMS);

    return {
      home: true,
      initialFeed,
      query,
      feed: 0,
    };
>>>>>>> restructure slugs pending cookies
  } catch (e) {
    console.log(e);
    return defaultProps;
  }
};

export default Index;
