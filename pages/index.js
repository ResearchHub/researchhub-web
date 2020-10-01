import { connect } from "react-redux";
import { StyleSheet } from "aphrodite";
import { useRouter } from "next/router";

import HubPage from "../components/Hubs/HubPage";

import API from "~/config/api";
import { getInitialScope } from "~/config/utils/dates";
import { Helpers } from "@quantfive/js-web-config";
const isServer = () => typeof window === "undefined";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

const getHubPapers = (page) => {
  return fetch(
    API.GET_HUB_PAPERS({
      hubId: 0,
      ordering: "hot",
      timePeriod: getInitialScope(),
      page,
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      return res;
    });
};

Index.getInitialProps = async (ctx) => {
  if (!isServer()) {
    return { page: 1 };
  }
  let { query } = ctx;
  let defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
  };
  let page = query.page ? query.page : 1;
  try {
    let initialFeed = await getHubPapers(page);
    let props = { initialFeed, query, page: page + 1 };
    return props;
  } catch (e) {
    console.log(e);
    return defaultProps;
  }
};

export default Index;
