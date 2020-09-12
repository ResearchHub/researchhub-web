import { connect } from "react-redux";
import { StyleSheet } from "aphrodite";
import { useRouter } from "next/router";

import HubPage from "~/components/Hubs/HubPage";

import API from "~/config/api";
import { getInitialScope } from "~/config/utils/dates";
import { slugToFilterQuery } from "~/config/utils/routing";
import { filterOptions } from "~/config/utils/options";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

Index.getInitialProps = async (ctx) => {
  let { query } = ctx;
  let defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
  };
  let page = query.page ? query.page : 1;
  let filter = query.filter && slugToFilterQuery(query.filter);

  try {
    const [initialFeed, leaderboardFeed, initialHubList] = await Promise.all([
      fetch(
        API.GET_HUB_PAPERS({
          // Initial Feed
          hubId: 0,
          ordering: filter,
          timePeriod: getInitialScope(),
          page,
        }),
        API.GET_CONFIG()
      ).then((res) => res.json()),
      fetch(
        API.LEADERBOARD({ limit: 10, page: 1, hubId: 0 }), // Leaderboard
        API.GET_CONFIG()
      ).then((res) => res.json()),
      fetch(API.SORTED_HUB({}), API.GET_CONFIG()).then((res) => res.json()),
    ]);

    let filterObj = filterOptions.filter((el) => el.value === filter)[0];

    return {
      initialFeed,
      leaderboardFeed,
      initialHubList,
      query,
      filter: filterObj,
    };
  } catch {
    return defaultProps;
  }
};

export default Index;
