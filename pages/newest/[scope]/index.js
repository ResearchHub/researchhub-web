import HubPage from "~/components/Hubs/HubPage";

import { getInitialScope } from "~/config/utils/dates";
import { calculateScopeFromSlug } from "~/config/utils/routing";
import { fetchPaperFeed } from "~/config/fetch";
import { filterOptions, scopeOptions } from "~/config/utils/options";

import nookies from "nookies";
import { AUTH_TOKEN } from "~/config/constants";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

Index.getInitialProps = async (ctx) => {
  const { query } = ctx;
  const { scope, page } = query;

  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  const defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
    feed: 0,
    error: true,
  };

  const PARAMS = {
    ordering: "newest",
    timePeriod: scope ? calculateScopeFromSlug(scope) : getInitialScope(),
    page: page || 1,
    subscribedHubs: true,
  };

  try {
    const initialFeed = await fetchPaperFeed(PARAMS, authToken);
    const filter = filterOptions[2];
    const scopeObj = scopeOptions.filter((el) => el.value === scope)[0];

    return {
      initialFeed,
      feed: 0,
      filter,
      scope: scopeObj,
    };
  } catch {
    return defaultProps;
  }
};

export default Index;
