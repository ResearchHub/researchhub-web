import HubPage from "~/components/Hubs/HubPage";

import { getInitialScope, calculateScopeFromSlug } from "~/config/utils/dates";
import { fetchPaperFeed } from "~/config/fetch";
import { scopeOptions } from "~/config/utils/options";

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
    loggedIn: authToken !== undefined,
    feed: 0,
    error: true,
  };

  const PARAMS = {
    ordering: "removed",
    timePeriod: scope ? calculateScopeFromSlug(scope) : getInitialScope(),
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
