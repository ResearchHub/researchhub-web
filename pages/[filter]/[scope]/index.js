import { connect } from "react-redux";
import { StyleSheet } from "aphrodite";
import { useRouter } from "next/router";

import HubPage from "~/components/Hubs/HubPage";

import API from "~/config/api";
import { getInitialScope } from "~/config/utils/dates";
import {
  slugToFilterQuery,
  calculateScopeFromSlug,
} from "~/config/utils/routing";
import { filterOptions, scopeOptions } from "~/config/utils/options";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

Index.getInitialProps = async (ctx) => {
  let { query } = ctx;

  let page = query.page ? query.page : 1;
  let filter = query.filter ? slugToFilterQuery(query.filter) : "hot";
  let scope = query.scope
    ? calculateScopeFromSlug(query.scope)
    : getInitialScope();

  try {
    const [initialFeed, leaderboardFeed, initialHubList] = await Promise.all([
      fetch(
        API.GET_HUB_PAPERS({
          // Initial Feed
          hubId: 0,
          ordering: filter,
          timePeriod: scope,
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
    let scopeObj = scopeOptions.filter((el) => el.value === query.scope)[0];

    return {
      initialFeed,
      leaderboardFeed,
      initialHubList,
      query,
      filter: filterObj,
      scope: scopeObj,
      page,
    };
  } catch {
    let defaultProps = {
      initialFeed: null,
      leaderboardFeed: null,
      initialHubList: null,
      error: true,
      query: query,
    };
    return defaultProps;
  }
};
export default Index;
