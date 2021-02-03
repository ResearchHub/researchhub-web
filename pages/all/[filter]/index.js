import HubPage from "~/components/Hubs/HubPage";

import { getInitialScope } from "~/config/utils/dates";
import { slugToFilterQuery } from "~/config/utils/routing";
import { fetchPaperFeed } from "~/config/fetch";
import { filterOptions } from "~/config/utils/options";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

Index.getInitialProps = async (ctx) => {
  const { query } = ctx;
  const { filter, page } = query;

  const defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
    feed: 1,
    query,
  };

  const PARAMS = {
    ordering: filter && slugToFilterQuery(filter),
    timePeriod: getInitialScope(),
    page: page || 1,
    hubId: 0,
  };

  if (filter === "pulled-papers") {
    PARAMS.ordering = "hot";
    PARAMS.externalSource = "True";
  }

  try {
    const initialFeed = await fetchPaperFeed(PARAMS);
    let filterObj = filterOptions.filter(
      (el) => el.value === slugToFilterQuery(filter)
    )[0];

    if (filter === "pulled-papers") {
      filterObj = {
        value: "pulled-papers",
        href: "pulled-papers",
        label: "Pulled Papers",
        disableScope: true,
      };
    } else if (filter === "removed") {
      filterObj = {
        value: "removed",
        label: "Removed",
        href: "removed",
      };
    }

    return {
      initialFeed,
      filter: filterObj,
      feed: 1,
      query,
    };
  } catch {
    return defaultProps;
  }
};

export default Index;
