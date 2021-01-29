import HubPage from "~/components/Hubs/HubPage";

import { getInitialScope } from "~/config/utils/dates";
import { fetchPaperFeed } from "~/config/fetch";
import { filterOptions } from "~/config/utils/options";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

const isServer = () => typeof window === "undefined";

Index.getInitialProps = async (ctx) => {
  const { query } = ctx;
  const { filter, page } = query;
  const filterObj = filterOptions.filter((el) => el.value === filter)[0];
  if (!isServer()) {
    return { home: true, page: 1, feed: 1, filter: filterObj, query };
  }

  const defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
    feed: 1,
  };

  const PARAMS = {
    ordering: "hot",
    timePeriod: getInitialScope(),
    page: page || 1,
    hubId: 0,
  };

  try {
    const initialFeed = await fetchPaperFeed(PARAMS);

    return {
      initialFeed,
      query,
      feed: 1,
    };
  } catch {
    return defaultProps;
  }
};

export default Index;
